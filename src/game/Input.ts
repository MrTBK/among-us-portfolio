export interface InputState {
  moveX: number;
  moveY: number;
  interactPressed: boolean;
  ventPressed: boolean;
  mapTogglePressed: boolean;
  escapePressed: boolean;
}

export class InputManager {
  private keys: { [key: string]: boolean } = {};
  private interactRequested: boolean = false;
  private ventRequested: boolean = false;
  private mapToggleRequested: boolean = false;
  private escapeRequested: boolean = false;

  // Touch joystick state
  public isTouchDevice: boolean = false;
  public joystickActive: boolean = false;
  private joystickStartX: number = 0;
  private joystickStartY: number = 0;
  private joystickCurX: number = 0;
  private joystickCurY: number = 0;
  private joystickTouchId: number | null = null;
  private readonly joystickMaxRadius: number = 50;

  // Touch action button
  public touchActionPressed: boolean = false;

  constructor() {
    this.initKeyboard();
    this.initTouch();
  }

  private initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Don't capture inputs if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      this.keys[e.code] = true;

      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        this.interactRequested = true;
      }
      if (e.code === 'KeyV') {
        this.ventRequested = true;
      }
      if (e.code === 'KeyM') {
        this.mapToggleRequested = true;
      }
      if (e.code === 'Escape') {
        this.escapeRequested = true;
      }

      // Allow natural scrolling when a modal or dialog is open
      const hasActiveModal = document.querySelector('.modal-backdrop:not(.hidden), .lightbox-backdrop:not(.hidden), .intro-info-modal:not(.hidden)');
      if (!hasActiveModal && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Reset keys on window blur so astronaut never gets stuck walking when switching tabs/windows
    window.addEventListener('blur', () => {
      this.reset();
    });
  }

  private initTouch() {
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  public handleTouchStart(touch: Touch, area: 'joystick' | 'action') {
    if (area === 'joystick' && this.joystickTouchId === null) {
      this.joystickTouchId = touch.identifier;
      this.joystickActive = true;
      this.joystickStartX = touch.clientX;
      this.joystickStartY = touch.clientY;
      this.joystickCurX = touch.clientX;
      this.joystickCurY = touch.clientY;
    } else if (area === 'action') {
      this.interactRequested = true;
      this.touchActionPressed = true;
    }
  }

  public handleTouchMove(touch: Touch) {
    if (this.joystickActive && touch.identifier === this.joystickTouchId) {
      this.joystickCurX = touch.clientX;
      this.joystickCurY = touch.clientY;
    }
  }

  public handleTouchEnd(touch: Touch) {
    if (this.joystickActive && touch.identifier === this.joystickTouchId) {
      this.joystickActive = false;
      this.joystickTouchId = null;
    }
    this.touchActionPressed = false;
  }

  public triggerInteract() {
    this.interactRequested = true;
  }

  public triggerVent() {
    this.ventRequested = true;
  }

  public triggerMapToggle() {
    this.mapToggleRequested = true;
  }

  public reset() {
    this.keys = {};
    this.interactRequested = false;
    this.ventRequested = false;
    this.mapToggleRequested = false;
    this.escapeRequested = false;
    this.joystickActive = false;
    this.joystickTouchId = null;
    this.touchActionPressed = false;
  }

  public poll(): InputState {
    let moveX = 0;
    let moveY = 0;

    // Keyboard movement
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

    // Touch joystick movement
    if (this.joystickActive) {
      const deltaX = this.joystickCurX - this.joystickStartX;
      const deltaY = this.joystickCurY - this.joystickStartY;
      const dist = Math.hypot(deltaX, deltaY);
      if (dist > 5) {
        const clampedDist = Math.min(dist, this.joystickMaxRadius);
        const norm = clampedDist / this.joystickMaxRadius;
        moveX = (deltaX / dist) * norm;
        moveY = (deltaY / dist) * norm;
      }
    }

    const state: InputState = {
      moveX,
      moveY,
      interactPressed: this.interactRequested,
      ventPressed: this.ventRequested,
      mapTogglePressed: this.mapToggleRequested,
      escapePressed: this.escapeRequested
    };

    // Reset single-frame action flags
    this.interactRequested = false;
    this.ventRequested = false;
    this.mapToggleRequested = false;
    this.escapeRequested = false;

    return state;
  }

  public getJoystickRenderData(): { active: boolean; startX: number; startY: number; curX: number; curY: number } {
    return {
      active: this.joystickActive,
      startX: this.joystickStartX,
      startY: this.joystickStartY,
      curX: this.joystickCurX,
      curY: this.joystickCurY
    };
  }
}
