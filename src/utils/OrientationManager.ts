/**
 * OrientationManager.ts
 * Manages mobile device orientation, fullscreen requests, screen orientation locking,
 * and responsive orientation prompt overlays for mobile / tablet devices.
 */

export class OrientationManager {
  private overlay: HTMLElement | null = null;
  private isDismissed: boolean = false;
  private onOrientationChangeCallbacks: Array<(isPortrait: boolean) => void> = [];

  constructor() {
    this.createOverlay();
    this.bindEvents();
    this.checkOrientation();
  }

  public isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  public isPortrait(): boolean {
    if (window.screen && window.screen.orientation && window.screen.orientation.type) {
      return window.screen.orientation.type.startsWith('portrait');
    }
    return window.innerHeight > window.innerWidth;
  }

  public isFullscreen(): boolean {
    const doc = document as any;
    return !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
  }

  public async requestLandscapeFullscreen(): Promise<boolean> {
    let fullscreenOk = false;
    const docEl = document.documentElement as any;

    try {
      if (!this.isFullscreen()) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
          fullscreenOk = true;
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
          fullscreenOk = true;
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
          fullscreenOk = true;
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
          fullscreenOk = true;
        }
      } else {
        fullscreenOk = true;
      }
    } catch (err) {
      // Fullscreen might be rejected if not direct user gesture or unsupported
    }

    try {
      const screenAny = screen as any;
      if (screenAny.orientation && typeof screenAny.orientation.lock === 'function') {
        await screenAny.orientation.lock('landscape');
        return true;
      }
    } catch (err) {
      // Screen orientation lock is not supported on iOS Safari or denied without fullscreen
    }

    return fullscreenOk;
  }

  public async exitFullscreen(): Promise<void> {
    const doc = document as any;
    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (err) {
      // Silently handle
    }

    try {
      const screenAny = screen as any;
      if (screenAny.orientation && typeof screenAny.orientation.unlock === 'function') {
        screenAny.orientation.unlock();
      }
    } catch (err) {
      // Silently handle
    }
  }

  public async toggleFullscreen(): Promise<boolean> {
    if (this.isFullscreen()) {
      await this.exitFullscreen();
      return false;
    } else {
      return await this.requestLandscapeFullscreen();
    }
  }

  private createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'orientation-prompt-overlay';
    this.overlay.className = 'orientation-prompt-overlay hidden';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-label', 'Screen Orientation Recommendation');

    this.overlay.innerHTML = `
      <div class="orientation-backdrop"></div>
      <div class="orientation-dialog">
        <div class="device-rotate-animation">
          <div class="phone-frame">
            <span class="phone-screen-icon">🚀</span>
          </div>
          <div class="rotate-arrow-indicator">🔄</div>
        </div>

        <div class="orientation-badge">OPTIMAL MISSION VIEW</div>
        <h2 class="orientation-title">ROTATE TO LANDSCAPE</h2>
        <p class="orientation-desc">
          The Skeld spaceship dashboard is engineered for <strong>Landscape mode</strong>. 
          Rotate your device horizontally for maximum vision and comfortable dual-thumb joystick controls!
        </p>

        <div class="orientation-actions">
          <button id="btn-orientation-fullscreen" class="btn-orientation-primary">
            ⛶ ROTATE & ENTER FULLSCREEN
          </button>
          <button id="btn-orientation-dismiss" class="btn-orientation-secondary">
            Continue in Portrait
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Button actions
    const fullscreenBtn = this.overlay.querySelector('#btn-orientation-fullscreen');
    fullscreenBtn?.addEventListener('click', async () => {
      await this.requestLandscapeFullscreen();
      this.hideOverlay();
    });

    const dismissBtn = this.overlay.querySelector('#btn-orientation-dismiss');
    dismissBtn?.addEventListener('click', () => {
      this.isDismissed = true;
      this.hideOverlay();
    });
  }

  private bindEvents() {
    const handleOrientationChange = () => {
      const portrait = this.isPortrait();
      this.checkOrientation();
      this.onOrientationChangeCallbacks.forEach(cb => cb(portrait));
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    }

    document.addEventListener('fullscreenchange', () => {
      handleOrientationChange();
    });
    document.addEventListener('webkitfullscreenchange', () => {
      handleOrientationChange();
    });
  }

  public checkOrientation() {
    const isSmallOrTouch = this.isTouchDevice() || window.innerWidth <= 900;
    const isPort = this.isPortrait();

    if (isSmallOrTouch && isPort && !this.isDismissed) {
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }

  public showOverlay() {
    if (this.overlay && this.overlay.classList.contains('hidden')) {
      this.overlay.classList.remove('hidden');
    }
  }

  public hideOverlay() {
    if (this.overlay && !this.overlay.classList.contains('hidden')) {
      this.overlay.classList.add('hidden');
    }
  }

  public onOrientationChange(callback: (isPortrait: boolean) => void) {
    this.onOrientationChangeCallbacks.push(callback);
  }
}

export const orientationManager = new OrientationManager();
