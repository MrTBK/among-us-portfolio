import { PlayerColor, HatType } from '../game/Player';
import { GameWorld } from '../game/World';
import { orientationManager } from '../utils/OrientationManager';
import { triggerHaptic } from '../utils/Haptics';

export class TitleScreen {
  private container: HTMLElement;
  private world: GameWorld;
  private onGameStart: () => void;
  private selectedColor: PlayerColor = 'Red';

  constructor(world: GameWorld, onGameStart: () => void) {
    this.world = world;
    this.onGameStart = onGameStart;

    // Developer / testing shortcut: ?skip=1 starts game directly
    if (new URLSearchParams(window.location.search).has('skip')) {
      this.container = document.createElement('div');
      this.onGameStart();
      return;
    }

    this.container = document.createElement('div');
    this.container.id = 'title-screen-container';
    this.container.className = 'title-screen-overlay';

    this.render();
    document.body.appendChild(this.container);

    this.initLoadingSequence();
    this.bindEvents();
  }

  private render() {
    this.container.innerHTML = `
      <!-- 1. LOADING SCREEN (FIRST THING USER SEES) -->
      <div class="loading-screen-overlay" id="loading-screen">
        <div class="loading-content">
          <div class="loading-crewmate-box">
            <img src="Assets/Images/Player/Red/red_right_walk/step1.png" alt="Loading Crewmate" id="loading-crewmate-img" class="loading-crewmate-sprite" />
          </div>
          <div class="loading-title">THE SKELD : PORTFOLIO EDITION</div>
          <div class="loading-author">MOHAMED AZIZ TABAKH — DATA DEVELOPER</div>
          <div class="loading-bar-wrapper">
            <div class="loading-bar-fill" id="loading-bar-fill"></div>
          </div>
          <div class="loading-status-text" id="loading-status">INITIALIZING SHIP PROTOCOLS... 0%</div>
        </div>
      </div>

      <!-- 2. TITLE SCREEN (BEHIND LOADING SCREEN) -->
      <div class="title-backdrop">
        <div class="stars-layer"></div>
        <div class="floating-crewmate" id="floating-astronaut">
          <img src="Assets/Images/Player/Red/red_right_walk/step1.png" alt="Astronaut" id="title-preview-crewmate" />
        </div>

        <div class="title-content">
          <div class="title-logo-wrapper">
            <img src="Assets/Images/menu/title.png" alt="Among Us" class="title-logo-img" />
            <div class="title-edition-badge">PORTFOLIO EDITION : MOHAMED AZIZ TABAKH</div>
          </div>

          <div class="title-menu-box">
            <button class="title-menu-btn start-btn" id="btn-start-game">
              <span class="btn-text">START MISSION</span>
            </button>

            <button class="title-menu-btn recruiter-btn" id="btn-direct-portfolio" title="Open 1-Page Recruiter Dossier">
              <span class="btn-text">📄 RECRUITER FAST VIEW (1-PAGE CV)</span>
            </button>

            <div class="color-picker-row">
              <span class="color-picker-label">SUIT COLOR:</span>
              <div class="color-options" id="color-options">
                <button class="color-opt-btn active" data-color="Red" style="background:#ef4444;" title="Red"></button>
                <button class="color-opt-btn" data-color="Blue" style="background:#3b82f6;" title="Blue"></button>
                <button class="color-opt-btn" data-color="Green" style="background:#22c55e;" title="Green"></button>
                <button class="color-opt-btn" data-color="Yellow" style="background:#eab308;" title="Yellow"></button>
                <button class="color-opt-btn" data-color="Orange" style="background:#f97316;" title="Orange"></button>
                <button class="color-opt-btn" data-color="Pink" style="background:#ec4899;" title="Pink"></button>
                <button class="color-opt-btn" data-color="Purple" style="background:#a855f7;" title="Purple"></button>
                <button class="color-opt-btn" data-color="White" style="background:#f8fafc;" title="White"></button>
                <button class="color-opt-btn" data-color="Black" style="background:#1e293b;" title="Black"></button>
                <button class="color-opt-btn" data-color="Brown" style="background:#78350f;" title="Brown"></button>
              </div>
            </div>

            <div class="hat-picker-row">
              <span class="color-picker-label">HAT / ACCESSORY:</span>
              <div class="hat-options" id="hat-options">
                <button class="hat-opt-btn active" data-hat="grad_cap" title="Graduation Cap (ESEN Business Intelligence)">🎓 Grad Cap</button>
                <button class="hat-opt-btn" data-hat="antenna" title="Robot Antenna (Robotics Mentor)">🤖 Antenna</button>
                <button class="hat-opt-btn" data-hat="tech_visor" title="Cyber Visor (Data Developer & CP)">💻 Cyber Visor</button>
                <button class="hat-opt-btn" data-hat="crown" title="Gold Crown (TCPC Finalist)">👑 Crown</button>
                <button class="hat-opt-btn" data-hat="none" title="No Hat">🚫 None</button>
              </div>
            </div>

            <div class="secondary-btns-row">
              <button class="title-secondary-btn" id="btn-how-to-play">HOW TO PLAY</button>
              <button class="title-secondary-btn" id="btn-quick-credits">CREDENTIALS</button>
            </div>
          </div>

          <div class="title-footer-author">
            Business Intelligence Student (ESEN) & Data Developer | Robotics Trainer | TCPC Finalist
          </div>
        </div>
      </div>

      <!-- HOW TO PLAY MODAL -->
      <div class="intro-info-modal hidden" id="modal-how-to-play">
        <div class="intro-info-card">
          <div class="intro-info-header">
            <h3>HOW TO PLAY & EXPLORE</h3>
            <button class="intro-info-close" id="close-how-to-play">✕</button>
          </div>
          <div class="intro-info-body">
            <div class="guide-item">
              <span class="guide-key">W A S D / Arrows</span>
              <span class="guide-desc">Walk through The Skeld spaceship corridors and sectors.</span>
            </div>
            <div class="guide-item">
              <span class="guide-key">E / Space / Enter</span>
              <span class="guide-desc">Interact with highlighted station terminals and talk to crewmates.</span>
            </div>
            <div class="guide-item">
              <span class="guide-key">V (Vent)</span>
              <span class="guide-desc">Stand on a floor vent to jump inside and fast-travel between sectors!</span>
            </div>
            <div class="guide-item">
              <span class="guide-key">M (Map)</span>
              <span class="guide-desc">Open the ship radar map to view player location and warp to any room.</span>
            </div>
            <div class="guide-item">
              <span class="guide-key">Touch Joystick</span>
              <span class="guide-desc">Mobile & tablet devices feature on-screen analog joystick and action buttons.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CREDENTIALS MODAL -->
      <div class="intro-info-modal hidden" id="modal-credits">
        <div class="intro-info-card">
          <div class="intro-info-header">
            <h3>CANDIDATE CREDENTIALS</h3>
            <button class="intro-info-close" id="close-credits">✕</button>
          </div>
          <div class="intro-info-body">
            <div class="guide-item">
              <span class="guide-key">🎓 Education</span>
              <span class="guide-desc">ESEN — École Supérieure d'Économie Numérique (Licence Business Intelligence, 2024–présent)</span>
            </div>
            <div class="guide-item">
              <span class="guide-key">🏆 Contests</span>
              <span class="guide-desc">TCPC 2026: 32nd / 100 National Rank in Tunisia Collegiate Programming Contest · 1st Place TBS Monopoly Hackathon</span>
            </div>
            <div class="guide-item">
              <span class="guide-key">💼 Industry</span>
              <span class="guide-desc">COFICAB Group: Business Intelligence & Data Warehouse Intern (SSIS, SQL Server, Power BI)</span>
            </div>
            <div class="guide-item">
              <span class="guide-key">🤖 Mentorship</span>
              <span class="guide-desc">Robotics Trainer at Youth Yes We Care & Active Member of ESEN HiVE club</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CUTSCENE: SHHHHHHH & CREWMATE REVEAL -->
      <div class="cutscene-overlay hidden" id="cutscene-layer">
        <div class="shh-screen" id="shh-screen">
          <img src="Assets/Images/menu/shhhhhhh.png" alt="Shhhhhhh" class="shh-img" />
        </div>
        <div class="role-reveal-screen hidden" id="role-reveal-screen">
          <div class="role-banner">
            <h1 class="role-title">CREWMATE</h1>
            <p class="role-subtitle">There is 1 Data Developer Among Us</p>
          </div>
          <div class="revealed-crewmate-box">
            <img src="Assets/Images/Player/Red/red_down_walk/step1.png" alt="Crewmate" id="reveal-crewmate-img" class="reveal-crewmate-img" />
            <div class="revealed-candidate-name">MOHAMED AZIZ TABAKH</div>
            <div class="revealed-candidate-role">Business Intelligence Student & Problem Solver</div>
            <div class="revealed-candidate-school">ESEN — École Supérieure d'Économie Numérique</div>
          </div>
        </div>
      </div>
    `;
  }

  private initLoadingSequence() {
    const loadingScreen = this.container.querySelector('#loading-screen') as HTMLElement;
    const barFill = this.container.querySelector('#loading-bar-fill') as HTMLElement;
    const statusText = this.container.querySelector('#loading-status') as HTMLElement;
    const crewmateImg = this.container.querySelector('#loading-crewmate-img') as HTMLImageElement;

    // 1. Walking animation cycle
    let step = 1;
    const walkInterval = window.setInterval(() => {
      step = (step % 12) + 1;
      if (crewmateImg) {
        crewmateImg.src = `Assets/Images/Player/Red/red_right_walk/step${step}.png`;
      }
    }, 110);

    // 2. Preload assets in parallel while advancing progress
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;
    const mapSrc = isMobile ? 'Assets/Maps/map2_mobile.webp' : 'Assets/Maps/map2.webp';

    const criticalAssets = [
      mapSrc,
      'Assets/Images/menu/title.png',
      'Assets/Images/menu/shhhhhhh.png',
      'Assets/Images/Items/emergency_button.PNG',
      'Assets/Sounds/General/roundstart.wav',
      'Assets/Sounds/General/vent.wav'
    ];

    let loadedCount = 0;
    const totalAssets = criticalAssets.length;
    const onAssetLoaded = () => {
      loadedCount++;
    };

    criticalAssets.forEach(src => {
      if (src.endsWith('.png') || src.endsWith('.PNG') || src.endsWith('.jpg') || src.endsWith('.webp')) {
        const img = new Image();
        img.onload = onAssetLoaded;
        img.onerror = onAssetLoaded;
        img.src = src;
      } else {
        const aud = new Audio();
        aud.oncanplaythrough = onAssetLoaded;
        aud.onerror = onAssetLoaded;
        aud.src = src;
      }
    });

    // 3. Smooth progress interpolation over ~1.3 seconds
    let progress = 0;
    const progressInterval = window.setInterval(() => {
      const assetRatio = totalAssets > 0 ? loadedCount / totalAssets : 1;
      const targetProgress = Math.max(progress + 4, Math.round(assetRatio * 100));
      progress = Math.min(progress + 3, targetProgress, 100);

      if (barFill) barFill.style.width = `${progress}%`;

      if (statusText) {
        if (progress < 30) {
          statusText.textContent = `CONNECTING TO THE SKELD... ${progress}%`;
        } else if (progress < 65) {
          statusText.textContent = `LOADING SENSORS & NAVIGATION MAP... ${progress}%`;
        } else if (progress < 95) {
          statusText.textContent = `CALIBRATING CREWMATE SYSTEMS... ${progress}%`;
        } else {
          statusText.textContent = `SYSTEMS 100% OPERATIONAL — READY TO LAUNCH`;
        }
      }

      if (progress >= 100) {
        clearInterval(progressInterval);
        clearInterval(walkInterval);

        // Fade out loading screen smoothly
        if (loadingScreen) {
          loadingScreen.classList.add('fade-out');
          setTimeout(() => {
            loadingScreen.remove();
          }, 350);
        }
      }
    }, 40);
  }

  private bindEvents() {
    // Play Menu Music on first user interaction
    const startAudio = () => {
      this.world.audio.playMenuMusic();
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);

    // Color options click
    this.container.querySelectorAll('.color-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = (e.currentTarget as HTMLElement).getAttribute('data-color') as PlayerColor;
        this.selectedColor = color;
        this.world.setPlayerColor(color);
        this.world.audio.playSfx('click');

        triggerHaptic('selection');

        // Update active class
        this.container.querySelectorAll('.color-opt-btn').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');

        // Update preview image
        const preview = this.container.querySelector('#title-preview-crewmate') as HTMLImageElement;
        if (preview) {
          preview.src = `Assets/Images/Player/${color}/${color.toLowerCase()}_right_walk/step1.png`;
        }
      });
    });

    // Hat options click
    this.container.querySelectorAll('.hat-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hat = (e.currentTarget as HTMLElement).getAttribute('data-hat') as HatType;
        this.world.setPlayerHat(hat);
        this.world.audio.playSfx('click');
        triggerHaptic('selection');

        this.container.querySelectorAll('.hat-opt-btn').forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
      });
    });

    // How to Play Modal
    const howToModal = this.container.querySelector('#modal-how-to-play') as HTMLElement;
    this.container.querySelector('#btn-how-to-play')?.addEventListener('click', () => {
      this.world.audio.playSfx('click');
      howToModal.classList.remove('hidden');
    });
    this.container.querySelector('#close-how-to-play')?.addEventListener('click', () => {
      this.world.audio.playSfx('close');
      howToModal.classList.add('hidden');
    });

    // Credentials Modal
    const creditsModal = this.container.querySelector('#modal-credits') as HTMLElement;
    this.container.querySelector('#btn-quick-credits')?.addEventListener('click', () => {
      this.world.audio.playSfx('click');
      creditsModal.classList.remove('hidden');
    });
    this.container.querySelector('#close-credits')?.addEventListener('click', () => {
      this.world.audio.playSfx('close');
      creditsModal.classList.add('hidden');
    });

    // Direct Recruiter Fast View shortcut
    this.container.querySelector('#btn-direct-portfolio')?.addEventListener('click', () => {
      this.world.audio.playSfx('click');
      triggerHaptic('medium');
      window.location.hash = '#recruiter';
      if (orientationManager.isTouchDevice()) {
        orientationManager.requestLandscapeFullscreen();
      }
      this.launchCutscene(true);
    });

    // START GAME CLICK
    this.container.querySelector('#btn-start-game')?.addEventListener('click', () => {
      triggerHaptic('medium');
      if (orientationManager.isTouchDevice()) {
        orientationManager.requestLandscapeFullscreen();
      }
      this.launchCutscene();
    });
  }

  private launchCutscene(skipImmediate: boolean = false) {
    this.world.audio.stopMenuMusic();
    if (skipImmediate) {
      this.container.remove();
      this.onGameStart();
      return;
    }

    this.world.audio.playSfx('roundstart');

    // Immediately remove the play menu and modals from DOM so they can NEVER flash again
    this.container.querySelector('.title-backdrop')?.remove();
    this.container.querySelector('#modal-how-to-play')?.remove();
    this.container.querySelector('#modal-credits')?.remove();
    this.container.querySelector('#loading-screen')?.remove();

    const cutsceneLayer = this.container.querySelector('#cutscene-layer') as HTMLElement;
    const shhScreen = this.container.querySelector('#shh-screen') as HTMLElement;
    const roleRevealScreen = this.container.querySelector('#role-reveal-screen') as HTMLElement;
    const revealImg = this.container.querySelector('#reveal-crewmate-img') as HTMLImageElement;

    if (revealImg) {
      revealImg.src = `Assets/Images/Player/${this.selectedColor}/${this.selectedColor.toLowerCase()}_down_walk/step1.png`;
    }

    cutsceneLayer.classList.remove('hidden');

    let isFinished = false;
    let shhTimer: number | null = null;
    let roleTimer: number | null = null;

    const keySkip = (e: KeyboardEvent) => {
      if (['Space', 'Enter', 'Escape'].includes(e.code)) {
        finishCutscene();
      }
    };

    const finishCutscene = () => {
      if (isFinished) return;
      isFinished = true;
      if (shhTimer) clearTimeout(shhTimer);
      if (roleTimer) clearTimeout(roleTimer);
      window.removeEventListener('keydown', keySkip);
      cutsceneLayer.removeEventListener('click', finishCutscene);

      // Start the game world so the map & player are actively rendering underneath
      this.onGameStart();

      // Smoothly fade out the cutscene overlay directly into the game
      this.container.classList.add('fade-out');
      setTimeout(() => {
        this.container.remove();
      }, 400);
    };

    // User can click or press key to skip cutscene
    cutsceneLayer.addEventListener('click', finishCutscene);
    window.addEventListener('keydown', keySkip);

    // 1. Show SHHHHHHH for 1.3 seconds
    shhTimer = window.setTimeout(() => {
      if (isFinished) return;
      shhScreen.classList.add('hidden');
      roleRevealScreen.classList.remove('hidden');

      // 2. Show Role Reveal for 2.2 seconds
      roleTimer = window.setTimeout(() => {
        finishCutscene();
      }, 2200);
    }, 1300);
  }
}

