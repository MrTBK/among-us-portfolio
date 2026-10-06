import { GameWorld } from '../game/World';

export class MinimapOverlay {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mapImg: HTMLImageElement;
  private isOpen: boolean = false;
  private world: GameWorld;

  // Real dimensions of the Skeld map image
  private readonly worldWidth = 5792;
  private readonly worldHeight = 3168;

  constructor(world: GameWorld) {
    this.world = world;

    // Container
    this.container = document.createElement('div');
    this.container.id = 'minimap-overlay';
    this.container.className = 'minimap-modal hidden';

    this.container.innerHTML = `
      <div class="minimap-backdrop"></div>
      <div class="minimap-dialog">
        <div class="minimap-header">
          <span class="minimap-title">THE SKELD — SHIP NAVIGATION RADAR</span>
          <button class="minimap-close-btn" aria-label="Close Map">✕</button>
        </div>
        <div class="minimap-canvas-wrapper">
          <canvas id="minimap-canvas"></canvas>
          <div class="minimap-instructions">Click any station icon to warp directly to that sector</div>
        </div>
        <div class="minimap-footer">
          <div class="minimap-legend">
            <span class="legend-item"><span class="dot player-dot"></span> Current Position</span>
            <span class="legend-item"><span class="dot task-dot"></span> Portfolio Terminal</span>
            <span class="legend-item"><span class="dot done-dot"></span> Explored Station</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    this.canvas = this.container.querySelector('#minimap-canvas') as HTMLCanvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Could not get minimap context');
    this.ctx = context;

    // Load mini map image
    this.mapImg = new Image();
    this.mapImg.onload = () => {
      if (this.isOpen) this.render();
    };
    this.mapImg.src = 'Assets/Maps/mini_map.PNG';

    // Events
    this.container.querySelector('.minimap-close-btn')?.addEventListener('click', () => this.toggle(false));
    this.container.querySelector('.minimap-backdrop')?.addEventListener('click', () => this.toggle(false));

    // Click to warp
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

    // Keyboard shortcuts (M to toggle, Escape to close)
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'KeyM') {
        this.toggle();
      } else if (e.code === 'Escape' && this.isOpen) {
        this.toggle(false);
      }
    });
  }

  private animFrameId: number | null = null;

  private startAnimLoop() {
    this.stopAnimLoop();
    const loop = () => {
      if (!this.isOpen) return;
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  private stopAnimLoop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public toggle(force?: boolean) {
    this.isOpen = force !== undefined ? force : !this.isOpen;
    if (this.isOpen) {
      this.container.classList.remove('hidden');
      this.world.audio.playSfx('map');
      this.startAnimLoop();
    } else {
      this.container.classList.add('hidden');
      this.world.audio.playSfx('close');
      this.stopAnimLoop();
    }
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  private handleCanvasClick(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    const scaleX = this.worldWidth / this.canvas.width;
    const scaleY = this.worldHeight / this.canvas.height;

    const worldClickX = clickX * scaleX;
    const worldClickY = clickY * scaleY;

    // Find nearest station
    let nearestStation = null;
    let minDist = 350;

    for (const station of this.world.stations) {
      const d = Math.hypot(worldClickX - station.centerX, worldClickY - station.centerY);
      if (d < minDist) {
        minDist = d;
        nearestStation = station;
      }
    }

    if (nearestStation) {
      this.world.teleportToStation(nearestStation.id);
      this.toggle(false);
      this.world.triggerStation(nearestStation);
    } else {
      // Validate collision before arbitrary warp so player never gets trapped inside a wall
      if (!this.world.player.checkCollision(worldClickX, worldClickY)) {
        this.world.teleportTo(worldClickX, worldClickY);
        this.toggle(false);
      } else {
        // Find nearest safe station rather than getting trapped
        let safeStation = this.world.stations[0];
        let minD = Infinity;
        for (const s of this.world.stations) {
          const d = Math.hypot(worldClickX - s.centerX, worldClickY - s.centerY);
          if (d < minD) {
            minD = d;
            safeStation = s;
          }
        }
        this.world.teleportToStation(safeStation.id);
        this.toggle(false);
      }
    }
  }

  public render() {
    if (!this.isOpen) return;

    const renderW = Math.min(840, window.innerWidth - 48);
    const renderH = Math.round(renderW * (this.worldHeight / this.worldWidth));

    // Only update canvas dimensions when actually changed to prevent resetting canvas 60 FPS
    if (this.canvas.width !== renderW || this.canvas.height !== renderH) {
      this.canvas.width = renderW;
      this.canvas.height = renderH;
    }

    // Clear
    this.ctx.fillStyle = '#080d1a';
    this.ctx.fillRect(0, 0, renderW, renderH);

    // Draw background minimap
    if (this.mapImg.complete && this.mapImg.naturalWidth > 0) {
      this.ctx.drawImage(this.mapImg, 0, 0, renderW, renderH);
    }

    const scaleX = renderW / this.worldWidth;
    const scaleY = renderH / this.worldHeight;

    // Draw Stations Blips
    const now = performance.now();
    const pulse = Math.sin(now * 0.006) * 2;

    for (const station of this.world.stations) {
      const sx = station.centerX * scaleX;
      const sy = station.centerY * scaleY;
      const isDone = this.world.visitedStationIds.has(station.id);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, 7 + (isDone ? 0 : pulse), 0, Math.PI * 2);
      this.ctx.fillStyle = isDone ? '#22c55e' : '#eab308';
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      // Station short label
      this.ctx.font = 'bold 9px "Segoe UI", Arial, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = 'black';
      this.ctx.shadowBlur = 4;
      this.ctx.fillText(station.tag, sx, sy - 11);
      this.ctx.restore();
    }

    // Draw Player Blip
    const px = this.world.player.x * scaleX;
    const py = this.world.player.y * scaleY;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(px, py, 8, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ef4444';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Player arrow
    this.ctx.font = 'bold 11px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('YOU', px, py + 18);
    this.ctx.restore();
  }
}
