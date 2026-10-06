import { MAP_OBSTACLES, RectObstacle } from '../data/mapObstacles';

export type PlayerColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Orange' | 'Pink' | 'Purple' | 'White' | 'Black' | 'Brown';
export type Direction = 'down' | 'up' | 'left' | 'right';

export class Player {
  public x: number = 3288;
  public y: number = 800;
  public speed: number = 360; // pixels per second
  public vx: number = 0;
  public vy: number = 0;
  public width: number = 64;
  public height: number = 86;
  public hitboxWidth: number = 36;
  public hitboxHeight: number = 32;
  public hitboxOffsetY: number = 48; // collision near feet
  public direction: Direction = 'down';
  public isMoving: boolean = false;
  public color: PlayerColor = 'Red';
  public isVenting: boolean = false;

  // Animation state
  private frameTimer: number = 0;
  private currentFrame: number = 1;
  private readonly frameRate: number = 18; // frames per second

  // Image cache: [color][direction][frameNumber] -> HTMLImageElement
  private static imageCache: Map<string, HTMLImageElement> = new Map();

  constructor(initialX: number = 3288, initialY: number = 800, color: PlayerColor = 'Red') {
    this.x = initialX;
    this.y = initialY;
    this.color = color;
    this.preloadCurrentColor();
  }

  public setColor(newColor: PlayerColor) {
    this.color = newColor;
    this.preloadCurrentColor();
  }

  private getSpritePath(color: PlayerColor, dir: Direction, step: number): string {
    const cLower = color.toLowerCase();
    return `Assets/Images/Player/${color}/${cLower}_${dir}_walk/step${step}.png`;
  }

  public preloadCurrentColor() {
    const dirs: Direction[] = ['down', 'up', 'left', 'right'];
    for (const d of dirs) {
      const maxSteps = d === 'down' ? 18 : 17;
      for (let s = 1; s <= maxSteps; s++) {
        const path = this.getSpritePath(this.color, d, s);
        if (!Player.imageCache.has(path)) {
          const img = new Image();
          img.src = path;
          Player.imageCache.set(path, img);
        }
      }
    }
  }

  public update(dt: number, moveX: number, moveY: number) {
    if (this.isVenting) {
      this.isMoving = false;
      this.vx = 0;
      this.vy = 0;
      return;
    }

    // Normalize diagonal movement
    let len = Math.hypot(moveX, moveY);
    if (len > 0) {
      this.vx = (moveX / len) * this.speed;
      this.vy = (moveY / len) * this.speed;
      this.isMoving = true;

      // Update facing direction
      const prevDir = this.direction;
      if (Math.abs(moveX) > Math.abs(moveY)) {
        this.direction = moveX > 0 ? 'right' : 'left';
      } else {
        this.direction = moveY > 0 ? 'down' : 'up';
      }

      const maxSteps = this.direction === 'down' ? 18 : 17;
      if (this.direction !== prevDir && this.currentFrame > maxSteps) {
        this.currentFrame = 1;
      }

      // Update animation frame
      this.frameTimer += dt;
      const frameDuration = 1 / this.frameRate;
      if (this.frameTimer >= frameDuration) {
        this.frameTimer %= frameDuration;
        this.currentFrame = (this.currentFrame % maxSteps) + 1;
      }
    } else {
      this.vx = 0;
      this.vy = 0;
      this.isMoving = false;
      this.currentFrame = 1;
      this.frameTimer = 0;
    }

    // Defensive unstuck: if player is ever overlapping an obstacle, nudge to free space
    if (this.checkCollision(this.x, this.y)) {
      const step = 8;
      const directions = [
        { dx: 0, dy: step }, { dx: 0, dy: -step },
        { dx: step, dy: 0 }, { dx: -step, dy: 0 },
        { dx: step, dy: step }, { dx: -step, dy: step }
      ];
      for (const d of directions) {
        if (!this.checkCollision(this.x + d.dx * 4, this.y + d.dy * 4)) {
          this.x += d.dx * 4;
          this.y += d.dy * 4;
          break;
        }
      }
    }

    // Move on X axis with collision checking
    const nextX = this.x + this.vx * dt;
    if (!this.checkCollision(nextX, this.y)) {
      this.x = nextX;
    }

    // Move on Y axis with collision checking
    const nextY = this.y + this.vy * dt;
    if (!this.checkCollision(this.x, nextY)) {
      this.y = nextY;
    }

    // Clamp inside world bounds
    this.x = Math.max(50, Math.min(5740, this.x));
    this.y = Math.max(50, Math.min(3110, this.y));
  }

  public checkCollision(testCenterCenterX: number, testCenterCenterY: number): boolean {
    const hitLeft = testCenterCenterX - this.hitboxWidth / 2;
    const hitTop = testCenterCenterY - this.height / 2 + this.hitboxOffsetY;
    const hitRight = hitLeft + this.hitboxWidth;
    const hitBottom = hitTop + this.hitboxHeight;

    for (let i = 0; i < MAP_OBSTACLES.length; i++) {
      const obs = MAP_OBSTACLES[i];
      if (
        hitRight > obs.x &&
        hitLeft < obs.x + obs.w &&
        hitBottom > obs.y &&
        hitTop < obs.y + obs.h
      ) {
        return true;
      }
    }
    return false;
  }

  public draw(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    if (this.isVenting) return;

    const maxSteps = this.direction === 'down' ? 18 : 17;
    const step = Math.min(this.isMoving ? this.currentFrame : 1, maxSteps);
    const spriteKey = this.getSpritePath(this.color, this.direction, step);
    const img = Player.imageCache.get(spriteKey);

    // Center the sprite at screenX, screenY
    const drawX = Math.round(screenX - this.width / 2);
    const drawY = Math.round(screenY - this.height / 2);

    // Draw shadow underneath
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 34, 22, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();
    ctx.restore();

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, drawX, drawY, this.width, this.height);
    } else {
      // Clean fallback if image still loading
      ctx.save();
      ctx.fillStyle = this.color.toLowerCase();
      ctx.beginPath();
      ctx.arc(screenX, screenY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#80d4ff';
      ctx.beginPath();
      ctx.arc(screenX + (this.direction === 'right' ? 8 : this.direction === 'left' ? -8 : 0), screenY - 4, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Name tag above head
    ctx.save();
    ctx.font = 'bold 13px Rubik, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Mohamed Aziz Tabakh', screenX, drawY - 10);
    ctx.restore();
  }
}
