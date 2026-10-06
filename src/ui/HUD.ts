import { GameWorld } from '../game/World';
import { PlayerColor } from '../game/Player';
import { MinimapOverlay } from './Minimap';
import { ModalManager } from './Modals';
import { VentLocation } from '../game/Vents';
import { orientationManager } from '../utils/OrientationManager';

export class HUD {
  private container: HTMLElement;
  private world: GameWorld;
  private minimap: MinimapOverlay;
  private modals: ModalManager;

  private sectorEl!: HTMLElement;
  private progressFillEl!: HTMLElement;
  private progressTextEl!: HTMLElement;
  private actionBtnEl!: HTMLElement;
  private ventBtnEl!: HTMLElement;
  private ventNavWrapperEl!: HTMLElement;
  private ventRoomEl!: HTMLElement;
  private soundBtnEl!: HTMLElement;

  constructor(
    world: GameWorld,
    minimap: MinimapOverlay,
    modals: ModalManager
  ) {
    this.world = world;
    this.minimap = minimap;
    this.modals = modals;

    this.container = document.createElement('div');
    this.container.id = 'hud-container';
    this.container.className = 'hud-wrapper';

    this.render();
    document.body.appendChild(this.container);

    this.initElements();
    this.bindEvents();
  }

  private render() {
    this.container.innerHTML = `
      <!-- TOP HUD -->
      <header class="hud-topbar" role="banner">
        <div class="topbar-left">
          <div class="task-progress-box">
            <span class="task-progress-label">TOTAL TASKS COMPLETED</span>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" id="hud-progress-fill" style="width: 14%;"></div>
            </div>
            <span class="progress-text" id="hud-progress-text">1 / 7 TASKS</span>
          </div>

          <div class="sector-indicator-box">
            <span class="blinking-dot"></span>
            <span class="sector-name" id="hud-sector">CAFETERIA (SPAWN)</span>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Emergency Meeting Quick Trigger -->
          <button id="hud-meeting-btn" class="emergency-quick-btn" title="Call Emergency Meeting">
            🚨 <span class="meeting-btn-text">EMERGENCY MEETING</span>
          </button>

          <!-- Sound Toggle -->
          <button id="hud-sound-btn" class="hud-tool-btn" title="Toggle Sound / Ambience" aria-label="Toggle Sound">
            🔊 <span class="tool-btn-label">Sound</span>
          </button>

          <!-- Map Toggle -->
          <button id="hud-map-btn" class="hud-tool-btn map-tool-btn" title="Open Ship Radar (Press M)" aria-label="Open Map">
            🗺️ <span class="tool-btn-label">Map [M]</span>
          </button>

          <!-- Fullscreen / Landscape Toggle -->
          <button id="hud-fullscreen-btn" class="hud-tool-btn fullscreen-tool-btn" title="Toggle Fullscreen Landscape" aria-label="Toggle Fullscreen Landscape">
            ⛶ <span class="tool-btn-label">Landscape</span>
          </button>
        </div>
      </header>

      <!-- FIRST-TIME / ONGOING MISSION BANNER -->
      <div class="hud-objective-banner" id="hud-objective-banner">
        <span class="banner-icon">🚀</span>
        <span class="banner-text">Explore the world to discover my work. Walk with <strong>WASD / Arrows</strong>, interact with <strong>[E] / USE</strong>, or press <strong>[V]</strong> to vent!</span>
        <button class="banner-dismiss" id="hud-banner-dismiss" aria-label="Dismiss banner">✕</button>
      </div>

      <!-- AUTHENTIC TASK OBJECTIVES LIST (TOP-LEFT) -->
      <div class="task-list-panel" id="task-list-panel">
        <div class="task-list-header">
          <span class="task-list-title">MISSION OBJECTIVES</span>
          <button class="task-toggle-btn" id="task-toggle-btn" aria-label="Collapse tasks">−</button>
        </div>
        <ul class="task-items-list" id="task-items-list">
          <li class="task-item done" data-station="cafeteria_spawn">
            <span class="task-check">✓</span>
            <span class="task-desc">Cafeteria: Spawn & Emergency Meeting</span>
          </li>
          <li class="task-item" data-station="security_about">
            <span class="task-check">○</span>
            <span class="task-desc">Security: About Aziz Tabakh</span>
          </li>
          <li class="task-item" data-station="weapons_cp">
            <span class="task-check">○</span>
            <span class="task-desc">Weapons: Asteroid & CP Challenge</span>
          </li>
          <li class="task-item" data-station="comms_projects">
            <span class="task-check">○</span>
            <span class="task-desc">Comms: Review Data Projects</span>
          </li>
          <li class="task-item" data-station="admin_career">
            <span class="task-check">○</span>
            <span class="task-desc">Admin: Verify Career & CV</span>
          </li>
          <li class="task-item" data-station="electrical_skills">
            <span class="task-check">○</span>
            <span class="task-desc">Electrical: Skills Switchboard</span>
          </li>
          <li class="task-item" data-station="reactor_mission">
            <span class="task-check">○</span>
            <span class="task-desc">Reactor: Final Contact Mission</span>
          </li>
        </ul>
      </div>

      <!-- BOTTOM ACTION PROMPTS (BOTTOM-RIGHT) -->
      <div class="hud-bottom-action" id="hud-action-wrapper">
        <!-- USE BUTTON -->
        <button id="hud-use-btn" class="hud-action-btn use-action-btn hidden" aria-label="Use Station">
          <span class="action-btn-key">[E]</span>
          <span class="action-btn-text" id="hud-use-text">USE</span>
        </button>

        <!-- VENT BUTTON -->
        <button id="hud-vent-btn" class="hud-action-btn vent-action-btn hidden" aria-label="Vent Action">
          <span class="action-btn-key">[V]</span>
          <span class="action-btn-text">VENT</span>
        </button>
      </div>

      <!-- IN-VENT NAVIGATION OVERLAY -->
      <div class="in-vent-hud hidden" id="in-vent-hud">
        <div class="vent-hud-card">
          <div class="vent-hud-title">VENTILATION SYSTEM ACTIVE</div>
          <div class="vent-hud-location" id="vent-current-room">ROOM: Electrical Room</div>
          <div class="vent-nav-controls">
            <button class="vent-nav-btn" id="vent-prev-btn" title="Previous Vent (A / Left)">
              ◀ PREV VENT
            </button>
            <button class="vent-exit-btn" id="vent-exit-btn" title="Exit Vent (V)">
              EXIT VENT [V]
            </button>
            <button class="vent-nav-btn" id="vent-next-btn" title="Next Vent (D / Right)">
              NEXT VENT ▶
            </button>
          </div>
        </div>
      </div>

      <!-- TOUCH VIRTUAL JOYSTICK OVERLAY (FOR MOBILE / TABLETS) -->
      <div class="touch-controls-wrapper" id="touch-controls">
        <div class="virtual-joystick-base" id="joystick-base">
          <div class="virtual-joystick-thumb" id="joystick-thumb"></div>
        </div>
      </div>
    `;
  }

  private initElements() {
    this.sectorEl = this.container.querySelector('#hud-sector') as HTMLElement;
    this.progressFillEl = this.container.querySelector('#hud-progress-fill') as HTMLElement;
    this.progressTextEl = this.container.querySelector('#hud-progress-text') as HTMLElement;
    this.actionBtnEl = this.container.querySelector('#hud-use-btn') as HTMLElement;
    this.ventBtnEl = this.container.querySelector('#hud-vent-btn') as HTMLElement;
    this.ventNavWrapperEl = this.container.querySelector('#in-vent-hud') as HTMLElement;
    this.ventRoomEl = this.container.querySelector('#vent-current-room') as HTMLElement;
    this.soundBtnEl = this.container.querySelector('#hud-sound-btn') as HTMLElement;
  }

  private bindEvents() {
    // Sector indicator
    this.world.onSectorChange = (sec) => {
      if (sec) {
        this.sectorEl.textContent = sec.name.toUpperCase();
      } else {
        this.sectorEl.textContent = `CORRIDOR / HALLWAY`;
      }
    };

    // Progress update
    this.world.onProgressChange = (visited, total) => {
      const pct = Math.round((visited / total) * 100);
      this.progressFillEl.style.width = `${pct}%`;
      this.progressTextEl.textContent = `${visited} / ${total} TASKS (${pct}%)`;

      // Update task list item checks
      this.container.querySelectorAll('.task-item').forEach(item => {
        const sId = (item as HTMLElement).getAttribute('data-station');
        if (sId && this.world.visitedStationIds.has(sId)) {
          item.classList.add('done');
          const check = item.querySelector('.task-check');
          if (check) check.textContent = '✓';
        }
      });
    };

    // Active station prompt
    this.world.onActiveStationChange = (station) => {
      if (station && !this.world.ventManager.isInsideVent) {
        this.actionBtnEl.classList.remove('hidden');
        const textEl = this.container.querySelector('#hud-use-text');
        if (textEl) textEl.textContent = `USE: ${station.name}`;
      } else {
        this.actionBtnEl.classList.add('hidden');
      }
    };

    // Venting state change
    this.world.onVentStateChange = (isInside, nearbyVent, currentVent) => {
      if (isInside) {
        // Player is inside vent network
        this.actionBtnEl.classList.add('hidden');
        this.ventBtnEl.classList.add('hidden');
        this.ventNavWrapperEl.classList.remove('hidden');
        if (currentVent) {
          this.ventRoomEl.textContent = `SECTOR: ${currentVent.room.toUpperCase()}`;
        }
      } else {
        this.ventNavWrapperEl.classList.add('hidden');
        if (nearbyVent) {
          this.ventBtnEl.classList.remove('hidden');
        } else {
          this.ventBtnEl.classList.add('hidden');
        }
      }
    };

    // Fast and reliable tap listener for both mobile touch and desktop click
    const addTapListener = (el: HTMLElement | null, handler: (e: Event) => void) => {
      if (!el) return;
      let lastTouch = 0;
      el.addEventListener('touchstart', (e) => {
        lastTouch = Date.now();
        e.preventDefault();
        e.stopPropagation();
        handler(e);
      }, { passive: false });

      el.addEventListener('click', (e) => {
        if (Date.now() - lastTouch < 450) return;
        handler(e);
      });
    };

    // Vent Button Tap (Bottom Right)
    addTapListener(this.ventBtnEl, () => {
      const nearby = this.world.ventManager.nearbyVent;
      if (nearby && !this.world.ventManager.isInsideVent) {
        this.world.enterVent(nearby);
      }
    });

    // In-Vent Controls
    addTapListener(this.container.querySelector('#vent-prev-btn') as HTMLElement, () => {
      this.world.hopPrevVent();
    });
    addTapListener(this.container.querySelector('#vent-next-btn') as HTMLElement, () => {
      this.world.hopNextVent();
    });
    addTapListener(this.container.querySelector('#vent-exit-btn') as HTMLElement, () => {
      this.world.exitVent();
    });

    // Use Button Tap
    addTapListener(this.actionBtnEl, () => {
      if (this.world.activeStation) {
        this.world.triggerStation(this.world.activeStation);
      }
    });

    // Emergency Meeting Button
    addTapListener(this.container.querySelector('#hud-meeting-btn') as HTMLElement, () => {
      this.modals.showHubModal();
    });

    // Objective banner dismiss
    const banner = this.container.querySelector('#hud-objective-banner') as HTMLElement;
    this.container.querySelector('#hud-banner-dismiss')?.addEventListener('click', () => {
      if (banner) banner.style.display = 'none';
    });

    // Sound toggle
    addTapListener(this.soundBtnEl, () => {
      const isMuted = this.world.audio.toggleMute();
      this.soundBtnEl.innerHTML = isMuted ? `🔇 <span class="tool-btn-label">Muted</span>` : `🔊 <span class="tool-btn-label">Sound</span>`;
      this.soundBtnEl.classList.toggle('active', !isMuted);
    });

    // Map toggle
    addTapListener(this.container.querySelector('#hud-map-btn') as HTMLElement, () => {
      this.minimap.toggle();
    });

    // Fullscreen / Landscape toggle
    const fullscreenBtn = this.container.querySelector('#hud-fullscreen-btn') as HTMLElement;
    const updateFsBtnState = () => {
      if (!fullscreenBtn) return;
      const isFs = orientationManager.isFullscreen();
      fullscreenBtn.innerHTML = isFs 
        ? `🗗 <span class="tool-btn-label">Exit</span>`
        : `⛶ <span class="tool-btn-label">Landscape</span>`;
      fullscreenBtn.classList.toggle('active', isFs);
    };

    addTapListener(fullscreenBtn, async () => {
      await orientationManager.toggleFullscreen();
      updateFsBtnState();
    });

    document.addEventListener('fullscreenchange', updateFsBtnState);
    document.addEventListener('webkitfullscreenchange', updateFsBtnState);
    updateFsBtnState();

    // Task list collapse toggle
    const taskList = this.container.querySelector('#task-items-list') as HTMLElement;
    const taskToggleBtn = this.container.querySelector('#task-toggle-btn') as HTMLElement;
    taskToggleBtn?.addEventListener('click', () => {
      const isHidden = taskList.classList.toggle('hidden');
      taskToggleBtn.textContent = isHidden ? '+' : '−';
    });

    // Auto-collapse task panel on narrow screens or portrait mobile so view isn't obstructed
    if (window.innerWidth <= 640 || (orientationManager.isTouchDevice() && orientationManager.isPortrait())) {
      taskList.classList.add('hidden');
      if (taskToggleBtn) taskToggleBtn.textContent = '+';
    }

    // Auto-update task list collapse state when orientation changes
    orientationManager.onOrientationChange((isPortrait) => {
      if (isPortrait && window.innerWidth <= 640) {
        taskList.classList.add('hidden');
        if (taskToggleBtn) taskToggleBtn.textContent = '+';
      }
    });

    // Task list item click warps directly to station
    this.container.querySelectorAll('.task-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const sId = (e.currentTarget as HTMLElement).getAttribute('data-station');
        if (sId) {
          this.world.teleportToStation(sId);
          const st = this.world.stations.find(s => s.id === sId);
          if (st) {
            this.world.triggerStation(st);
          }
        }
      });
    });

    // Touch joystick setup
    this.setupTouchControls();
  }

  private setupTouchControls() {
    const joystickBase = this.container.querySelector('#joystick-base') as HTMLElement;
    const joystickThumb = this.container.querySelector('#joystick-thumb') as HTMLElement;

    if (!joystickBase || !joystickThumb) return;

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.container.querySelector('#touch-controls')?.classList.add('touch-visible');
    }

    joystickBase.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.world.input.handleTouchStart(touch, 'joystick');
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        this.world.input.handleTouchMove(touch);

        const data = this.world.input.getJoystickRenderData();
        if (data.active) {
          const dx = data.curX - data.startX;
          const dy = data.curY - data.startY;
          const dist = Math.hypot(dx, dy);
          const maxR = 36;
          const clampedDist = Math.min(dist, maxR);
          const angle = Math.atan2(dy, dx);

          const thumbX = Math.cos(angle) * clampedDist;
          const thumbY = Math.sin(angle) * clampedDist;
          joystickThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;
        }
      }
    }, { passive: false });

    const resetJoystick = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        this.world.input.handleTouchEnd(touch);
      }
      joystickThumb.style.transform = 'translate(0px, 0px)';
    };

    window.addEventListener('touchend', resetJoystick);
    window.addEventListener('touchcancel', resetJoystick);
  }
}
