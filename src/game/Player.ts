import { MAP_OBSTACLES, RectObstacle } from '../data/mapObstacles';

export type PlayerColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Orange' | 'Pink' | 'Purple' | 'White' | 'Black' | 'Brown';
export type Direction = 'down' | 'up' | 'left' | 'right';
export type HatType = 'none' | 'grad_cap' | 'antenna' | 'tech_visor' | 'crown';

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
  public currentHat: HatType = 'grad_cap';
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

    // Draw Hat on head
    this.drawHat(ctx, screenX, drawY + 8);

    // Name tag above head
    ctx.save();
    ctx.font = 'bold 13px Rubik, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Mohamed Aziz Tabakh', screenX, drawY - (this.currentHat === 'none' ? 10 : 20));
    ctx.restore();
  }

  public setHat(newHat: HatType) {
    this.currentHat = newHat;
  }

  public drawHat(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    if (this.currentHat === 'none') return;

    ctx.save();
    const facingOffset = this.direction === 'right' ? 4 : this.direction === 'left' ? -4 : 0;
    const x = cx + facingOffset;
    const y = cy;

    switch (this.currentHat) {
      case 'grad_cap': {
        // Skull cap base
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(x, y + 2, 13, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Diamond mortarboard
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(x, y - 9);
        ctx.lineTo(x + 20, y - 3);
        ctx.lineTo(x, y + 3);
        ctx.lineTo(x - 20, y - 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Center button
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(x, y - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Golden Tassel
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 3);
        ctx.quadraticCurveTo(x + 10, y + 2, x + 14, y + 14);
        ctx.stroke();

        // Tassel tip
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.arc(x + 14, y + 14, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'antenna': {
        // Metallic base
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y + 3, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rod
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y + 3);
        ctx.lineTo(x, y - 16);
        ctx.stroke();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pulsing cyan beacon bulb on top
        const now = performance.now();
        const pulse = Math.sin(now * 0.008) > 0;
        ctx.fillStyle = pulse ? '#22d3ee' : '#0891b2';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = pulse ? 12 : 4;
        ctx.beginPath();
        ctx.arc(x, y - 18, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        break;
      }

      case 'tech_visor': {
        // Futuristic cyber visor scanner
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - 16, y - 5, 32, 9, 3);
        ctx.fill();
        ctx.stroke();

        // Glowing visor scanner line
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fillRect(x - 12, y - 3, 24, 4);

        // Tech side nodes
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x - 13, y, 2.5, 0, Math.PI * 2);
        ctx.arc(x + 13, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'crown': {
        // Gold Crown with jewels
        ctx.fillStyle = '#eab308';
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x - 15, y + 3);
        ctx.lineTo(x - 16, y - 9);
        ctx.lineTo(x - 8, y - 4);
        ctx.lineTo(x, y - 13);
        ctx.lineTo(x + 8, y - 4);
        ctx.lineTo(x + 16, y - 9);
        ctx.lineTo(x + 15, y + 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Jewel accents
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x - 9, y - 1, 2, 0, Math.PI * 2);
        ctx.arc(x + 9, y - 1, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }
}
