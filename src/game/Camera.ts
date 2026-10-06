export class Camera {
  public x: number = 0;
  public y: number = 0;
  public viewportWidth: number = 1280;
  public viewportHeight: number = 720;
  public mapWidth: number = 5792;
  public mapHeight: number = 3168;

  constructor(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  public resize(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  public follow(targetX: number, targetY: number, smoothFactor: number = 1.0) {
    // Ideal camera position centers target
    const targetCamX = targetX - this.viewportWidth / 2;
    const targetCamY = targetY - this.viewportHeight / 2;

    if (smoothFactor >= 1.0) {
      this.x = targetCamX;
      this.y = targetCamY;
    } else {
      this.x += (targetCamX - this.x) * smoothFactor;
      this.y += (targetCamY - this.y) * smoothFactor;
    }

    // Clamp to map boundaries
    this.x = Math.max(0, Math.min(this.mapWidth - this.viewportWidth, this.x));
    this.y = Math.max(0, Math.min(this.mapHeight - this.viewportHeight, this.y));
  }

  public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.x,
      y: worldY - this.y
    };
  }

  public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.x,
      y: screenY + this.y
    };
  }

  public isVisible(worldX: number, worldY: number, width: number, height: number, buffer: number = 64): boolean {
    return (
      worldX + width + buffer >= this.x &&
      worldX - buffer <= this.x + this.viewportWidth &&
      worldY + height + buffer >= this.y &&
      worldY - buffer <= this.y + this.viewportHeight
    );
  }
}
