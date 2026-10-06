import { Camera } from './Camera';
import { Player, PlayerColor, HatType } from './Player';
import { Station, STATIONS_CONFIG } from './Station';
import { Bot, BOTS_CONFIG } from './Bot';
import { VentManager, VentLocation } from './Vents';
import { InputManager } from './Input';
import { AudioManager } from './AudioManager';

// Cross-browser safety polyfill for CanvasRenderingContext2D.roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x: number, y: number, w: number, h: number) {
    if (typeof this.rect === 'function') {
      this.rect(x, y, w, h);
    }
    return this;
  };
}

export interface SectorDefinition {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  radius: number;
  audioKey: string;
}

export const SECTORS: SectorDefinition[] = [
  { id: 'cafeteria', name: 'Cafeteria (Spawn)', centerX: 3277, centerY: 658, radius: 750, audioKey: 'cafeteria' },
  { id: 'security', name: 'Security Room (About)', centerX: 1806, centerY: 1279, radius: 380, audioKey: 'security' },
  { id: 'weapons', name: 'Weapons (CP & Asteroids)', centerX: 4500, centerY: 600, radius: 440, audioKey: 'weapons' },
  { id: 'comms', name: 'Communications (Projects)', centerX: 3865, centerY: 2650, radius: 450, audioKey: 'comms' },
  { id: 'admin', name: 'Admin Room (Career & CV)', centerX: 3920, centerY: 1775, radius: 450, audioKey: 'admin' },
  { id: 'electrical', name: 'Electrical Room (Skills)', centerX: 2425, centerY: 1950, radius: 570, audioKey: 'electrical' },
  { id: 'reactor', name: 'Reactor Room (Final Mission)', centerX: 880, centerY: 1474, radius: 460, audioKey: 'reactor' },
  { id: 'upper_engine', name: 'Upper Engine', centerX: 1360, centerY: 699, radius: 440, audioKey: 'engine' },
  { id: 'lower_engine', name: 'Lower Engine', centerX: 1360, centerY: 2180, radius: 440, audioKey: 'engine' },
  { id: 'storage', name: 'Storage Room', centerX: 3175, centerY: 2308, radius: 580, audioKey: 'storage' },
  { id: 'medbay', name: 'Medbay', centerX: 2338, centerY: 1147, radius: 450, audioKey: 'medbay' },
  { id: 'cockpit', name: 'Navigation & Cockpit', centerX: 5405, centerY: 1340, radius: 450, audioKey: 'cockpit' }
];

export class GameWorld {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public camera: Camera;
  public player: Player;
  public stations: Station[] = [];
  public bots: Bot[] = [];
  public ventManager: VentManager;
  public input: InputManager;
  public audio: AudioManager;

  private mapImage: HTMLImageElement | null = null;
  private ventImage: HTMLImageElement;
  public isMapLoaded: boolean = false;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  public activeStation: Station | null = null;
  public currentSector: SectorDefinition | null = null;
  public visitedStationIds: Set<string> = new Set(['cafeteria_spawn']);

  // Callbacks for UI
  public onActiveStationChange?: (station: Station | null) => void;
  public onStationTrigger?: (station: Station) => void;
  public onProgressChange?: (visited: number, total: number) => void;
  public onSectorChange?: (sector: SectorDefinition | null) => void;
  public onVentStateChange?: (isInside: boolean, nearbyVent: VentLocation | null, currentVent: VentLocation | null) => void;
  public onMapToggle?: () => void;
  public isInputBlocked?: () => boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;

    this.camera = new Camera(canvas.width, canvas.height);
    // Spawn in Cafeteria at open floor clearance below the emergency meeting table
    this.player = new Player(3320, 860, 'Red');
    this.ventManager = new VentManager();
    this.input = new InputManager();
    this.audio = new AudioManager();

    this.ventImage = new Image();
    this.ventImage.src = 'Assets/Images/Items/ventilation.png';

    // Initialize Stations
    for (const cfg of STATIONS_CONFIG) {
      const station = new Station(cfg);
      if (cfg.id === 'cafeteria_spawn') {
        station.isVisited = true;
      }
      this.stations.push(station);
    }

    // Initialize Bots
    for (const bCfg of BOTS_CONFIG) {
      this.bots.push(new Bot(bCfg));
    }

    // Load Map Image
    this.loadMap();

    // Resize and orientation handlers
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 60);
    });
    if (screen.orientation) {
      screen.orientation.addEventListener('change', () => {
        setTimeout(() => this.handleResize(), 60);
      });
    }

    // Immediately snap camera to player spawn position
    this.camera.follow(this.player.x, this.player.y, 1.0);
  }

  private loadMap() {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;
    const candidates = isMobile
      ? [
          'Assets/Maps/map2_mobile.webp',
          'Assets/Maps/map2_mobile.jpg',
          'Assets/Maps/map2.webp',
          'Assets/Maps/map2.jpg',
          'Assets/Maps/map2.png'
        ]
      : [
          'Assets/Maps/map2.webp',
          'Assets/Maps/map2_mobile.webp',
          'Assets/Maps/map2.jpg',
          'Assets/Maps/map2_mobile.jpg',
          'Assets/Maps/map2.png'
        ];

    let candidateIdx = 0;

    const tryNext = () => {
      if (candidateIdx >= candidates.length) {
        console.error('All map image candidates failed to load.');
        return;
      }
      const src = candidates[candidateIdx++];
      const img = new Image();
      img.onload = () => {
        this.mapImage = img;
        this.isMapLoaded = true;
      };
      img.onerror = () => {
        console.warn(`Map image candidate failed (${src}), trying fallback...`);
        tryNext();
      };
      img.src = src;

      if (img.complete && img.naturalWidth > 0) {
        this.mapImage = img;
        this.isMapLoaded = true;
      }
    };

    tryNext();
  }

  public handleResize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);

    this.camera.resize(width, height);
    if (this.player) {
      this.camera.follow(this.player.x, this.player.y, 1.0);
    }
  }

  private interactCooldown: number = 0.8;

  public start() {
    if (this.isRunning) return;
    this.input.reset();
    this.interactCooldown = 0.8;
    this.camera.follow(this.player.x, this.player.y, 1.0);
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  public stop() {
    this.isRunning = false;
  }

  public teleportTo(worldX: number, worldY: number) {
    if (this.ventManager.isInsideVent) {
      this.exitVent();
    }
    this.player.x = worldX;
    this.player.y = worldY;
    this.camera.follow(worldX, worldY, 1.0);
  }

  public teleportToStation(stationId: string) {
    const station = this.stations.find(s => s.id === stationId);
    if (station) {
      this.teleportTo(station.standX, station.standY);
    }
  }

  public setPlayerColor(color: PlayerColor) {
    this.player.setColor(color);
  }

  public setPlayerHat(hat: HatType) {
    this.player.setHat(hat);
  }

  private ventHopCooldown: number = 0;

  public enterVent(vent: VentLocation) {
    this.ventManager.enterVent(vent);
    this.player.isVenting = true;
    this.player.x = vent.centerX;
    this.player.y = vent.centerY;
    this.camera.follow(vent.centerX, vent.centerY, 1.0);
    this.onVentStateChange?.(true, null, vent);
  }

  public exitVent() {
    const exitedAt = this.ventManager.exitVent();
    this.player.isVenting = false;
    if (exitedAt) {
      this.player.x = exitedAt.exitX;
      this.player.y = exitedAt.exitY;
      this.camera.follow(exitedAt.exitX, exitedAt.exitY, 1.0);
    }
    const nearby = this.ventManager.checkProximity(this.player.x, this.player.y);
    this.onVentStateChange?.(false, nearby, null);
  }

  public hopNextVent() {
    if (!this.ventManager.isInsideVent) return;
    const next = this.ventManager.nextVent();
    if (next) {
      this.player.x = next.centerX;
      this.player.y = next.centerY;
      this.camera.follow(next.centerX, next.centerY, 1.0);
      this.onVentStateChange?.(true, null, next);
    }
  }

  public hopPrevVent() {
    if (!this.ventManager.isInsideVent) return;
    const prev = this.ventManager.prevVent();
    if (prev) {
      this.player.x = prev.centerX;
      this.player.y = prev.centerY;
      this.camera.follow(prev.centerX, prev.centerY, 1.0);
      this.onVentStateChange?.(true, null, prev);
    }
  }

  private loop(currentTime: number) {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  private update(dt: number) {
    if (this.isInputBlocked?.()) {
      this.input.reset();
      this.player.isMoving = false;
      return;
    }

    const inputState = this.input.poll();

    // Check Map Toggle shortcut
    if (inputState.mapTogglePressed) {
      this.onMapToggle?.();
    }

    // Check Venting state & input
    const nearbyVent = this.ventManager.checkProximity(this.player.x, this.player.y);

    if (inputState.ventPressed || (this.ventManager.isInsideVent && inputState.interactPressed)) {
      if (this.ventManager.isInsideVent) {
        this.exitVent();
      } else if (nearbyVent) {
        this.enterVent(nearbyVent);
      }
    }

    if (this.ventManager.isInsideVent) {
      if (this.ventHopCooldown > 0) {
        this.ventHopCooldown -= dt;
      }
      if (this.ventHopCooldown <= 0) {
        // In-vent arrow/key navigation
        if (inputState.moveX > 0.4) {
          this.hopNextVent();
          this.ventHopCooldown = 0.32;
        } else if (inputState.moveX < -0.4) {
          this.hopPrevVent();
          this.ventHopCooldown = 0.32;
        }
      }
    } else {
      // Normal walking
      this.player.update(dt, inputState.moveX, inputState.moveY);

      if (this.player.isMoving) {
        this.audio.playFootstep();
      }
    }

    this.onVentStateChange?.(
      this.ventManager.isInsideVent,
      nearbyVent,
      this.ventManager.currentVent
    );

    // Camera smoothly follows player
    this.camera.follow(this.player.x, this.player.y, 0.14);

    // Detect Sector
    let detectedSector: SectorDefinition | null = null;
    let minSectorDist = Infinity;
    for (const sec of SECTORS) {
      const dist = Math.hypot(this.player.x - sec.centerX, this.player.y - sec.centerY);
      if (dist <= sec.radius && dist < minSectorDist) {
        minSectorDist = dist;
        detectedSector = sec;
      }
    }

    if (detectedSector !== this.currentSector) {
      this.currentSector = detectedSector;
      this.onSectorChange?.(detectedSector);
      this.audio.updateSectorAmbience(detectedSector ? detectedSector.audioKey : null);
    }

    // Check Proximity to Stations
    let nearestStation: Station | null = null;
    let minStationDist = Infinity;

    for (const station of this.stations) {
      const isNear = station.checkProximity(this.player.x, this.player.y);
      if (isNear) {
        const dist = Math.hypot(this.player.x - station.centerX, this.player.y - station.centerY);
        if (dist < minStationDist) {
          minStationDist = dist;
          nearestStation = station;
        }
      }
    }

    // Ensure ONLY the nearest active station is highlighted
    for (const station of this.stations) {
      station.isHighlighted = (station === nearestStation);
    }

    if (nearestStation !== this.activeStation) {
      this.activeStation = nearestStation;
      this.onActiveStationChange?.(nearestStation);
    }

    // Decrement interact cooldown
    if (this.interactCooldown > 0) {
      this.interactCooldown -= dt;
    }

    // Interaction key pressed
    if (inputState.interactPressed && this.activeStation && !this.ventManager.isInsideVent && this.interactCooldown <= 0) {
      this.triggerStation(this.activeStation);
    }

    // Update Bots Proximity
    for (const bot of this.bots) {
      bot.checkProximity(this.player.x, this.player.y);
    }
  }

  public triggerStation(station: Station) {
    this.interactCooldown = 0.5;
    if (!this.visitedStationIds.has(station.id)) {
      this.visitedStationIds.add(station.id);
      station.isVisited = true;
      this.audio.playSfx('complete');
      this.onProgressChange?.(this.visitedStationIds.size, this.stations.length);
    } else {
      this.audio.playSfx('open');
    }
    this.onStationTrigger?.(station);
  }

  private render() {
    const width = this.camera.viewportWidth;
    const height = this.camera.viewportHeight;

    // Clear background
    this.ctx.fillStyle = '#070b14';
    this.ctx.fillRect(0, 0, width, height);

    // 1. Draw Visible Slice of Map
    if (this.isMapLoaded && this.mapImage && this.mapImage.naturalWidth > 0) {
      const imgW = this.mapImage.naturalWidth;
      const imgH = this.mapImage.naturalHeight;
      const scaleX = imgW / 5792;
      const scaleY = imgH / 3168;

      const camX = Math.round(this.camera.x);
      const camY = Math.round(this.camera.y);

      const srcX = Math.max(0, Math.min(imgW - width * scaleX, camX * scaleX));
      const srcY = Math.max(0, Math.min(imgH - height * scaleY, camY * scaleY));
      const srcW = Math.min(width * scaleX, imgW - srcX);
      const srcH = Math.min(height * scaleY, imgH - srcY);

      this.ctx.drawImage(
        this.mapImage,
        srcX, srcY, srcW, srcH,
        0, 0, width, height
      );
    } else {
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.font = 'bold 20px "Rubik", Arial, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('CONNECTING TO SKELD NAVIGATION...', width / 2, height / 2);
    }

    // 2. Draw Vents on Floor
    for (const v of this.ventManager.vents) {
      if (this.camera.isVisible(v.x, v.y, 64, 48)) {
        const screenPos = this.camera.worldToScreen(v.x, v.y);
        if (this.ventImage.complete && this.ventImage.naturalWidth > 0) {
          this.ctx.drawImage(this.ventImage, screenPos.x, screenPos.y, 63, 48);
        } else {
          this.ctx.save();
          this.ctx.fillStyle = '#475569';
          this.ctx.fillRect(screenPos.x, screenPos.y, 63, 48);
          this.ctx.restore();
        }

        // Highlight vent if player is near
        if (this.ventManager.nearbyVent?.id === v.id && !this.ventManager.isInsideVent) {
          this.ctx.save();
          this.ctx.strokeStyle = '#38bdf8';
          this.ctx.lineWidth = 2.5;
          this.ctx.shadowColor = '#38bdf8';
          this.ctx.shadowBlur = 8;
          this.ctx.strokeRect(screenPos.x - 2, screenPos.y - 2, 67, 52);
          this.ctx.restore();
        }
      }
    }

    // 3. Draw Stations
    for (const station of this.stations) {
      if (this.camera.isVisible(station.x - 100, station.y - 60, station.width + 200, station.height + 80)) {
        const screenPos = this.camera.worldToScreen(station.x, station.y);
        station.draw(this.ctx, screenPos.x, screenPos.y);
      }
    }

    // 4. Draw Bots
    for (const bot of this.bots) {
      if (this.camera.isVisible(bot.x - 50, bot.y - 50, 100, 100)) {
        const screenPos = this.camera.worldToScreen(bot.x, bot.y);
        bot.draw(this.ctx, screenPos.x, screenPos.y);
      }
    }

    // 5. Draw Player (hidden if venting)
    const playerScreenPos = this.camera.worldToScreen(this.player.x, this.player.y);
    this.player.draw(this.ctx, playerScreenPos.x, playerScreenPos.y);

    // 6. Ambient Vignette / Lighting Effect
    this.drawLightingMask(playerScreenPos.x, playerScreenPos.y, width, height);
  }

  private drawLightingMask(px: number, py: number, width: number, height: number) {
    this.ctx.save();
    const radGrad = this.ctx.createRadialGradient(px, py, 220, px, py, 600);
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    radGrad.addColorStop(0.65, 'rgba(5, 10, 20, 0.25)');
    radGrad.addColorStop(1, 'rgba(2, 6, 15, 0.7)');

    this.ctx.fillStyle = radGrad;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }
}
