export interface StationConfig {
  id: string;
  name: string;
  roomName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  standX: number;
  standY: number;
  activationRadius: number;
  baseImgPath: string;
  highlightImgPath: string;
  modalType: 'hub' | 'about' | 'asteroids_cp' | 'projects' | 'experience_cv' | 'skills_task' | 'final_mission';
  tag: string;
}

export class Station {
  public id: string;
  public name: string;
  public roomName: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public standX: number;
  public standY: number;
  public activationRadius: number;
  public modalType: StationConfig['modalType'];
  public tag: string;
  public isHighlighted: boolean = false;
  public isVisited: boolean = false;

  private baseImg: HTMLImageElement | null = null;
  private highlightImg: HTMLImageElement | null = null;

  constructor(config: StationConfig) {
    this.id = config.id;
    this.name = config.name;
    this.roomName = config.roomName;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.standX = config.standX;
    this.standY = config.standY;
    this.activationRadius = config.activationRadius;
    this.modalType = config.modalType;
    this.tag = config.tag;

    // Load sprites
    this.baseImg = new Image();
    this.baseImg.src = config.baseImgPath;

    this.highlightImg = new Image();
    this.highlightImg.src = config.highlightImgPath;
  }

  public get centerX(): number {
    return this.x + this.width / 2;
  }

  public get centerY(): number {
    return this.y + this.height / 2;
  }

  public checkProximity(playerX: number, playerY: number): boolean {
    const dist = Math.hypot(playerX - this.centerX, playerY - this.centerY);
    this.isHighlighted = dist <= this.activationRadius;
    return this.isHighlighted;
  }

  public draw(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    // The background map (map2.png) already has all unhighlighted base buttons baked in.
    // When highlighted, we render the glowing yellow highlight sprite at (screenX, screenY)
    // with 100% pixel-perfect accuracy directly over the map art.
    if (this.isHighlighted && this.highlightImg && this.highlightImg.complete && this.highlightImg.naturalWidth > 0) {
      ctx.drawImage(this.highlightImg, screenX, screenY, this.width, this.height);
      this.drawFloatingIndicator(ctx, screenX, screenY);
    }
  }

  private drawFloatingIndicator(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    const time = performance.now() * 0.004;
    const bounceY = Math.sin(time) * 5;
    const indicatorCenterX = screenX + this.width / 2;
    const badgeY = screenY - 18 + bounceY;

    ctx.save();
    ctx.font = 'bold 12px "Rubik", "Segoe UI", sans-serif';
    const text = `[E] ${this.name}`;
    const textWidth = ctx.measureText(text).width;
    const padX = 14;
    const boxW = textWidth + padX * 2;
    const boxH = 26;
    const boxX = indicatorCenterX - boxW / 2;

    // Background pill
    ctx.fillStyle = 'rgba(10, 25, 45, 0.92)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boxX, badgeY - boxH / 2, boxW, boxH, 13);
    ctx.fill();
    ctx.stroke();

    // Pulse glow
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, indicatorCenterX, badgeY);

    ctx.restore();
  }
}

// Exactly matching user layout:
// 1. CAFETERIA: Spawn & Emergency Meeting
// 2. SECURITY: About Mohamed Aziz Tabakh
// 3. WEAPONS: Asteroid / CP Task
// 4. COMMS: Projects (DataForge, Customer360, ChurnLab, etc.)
// 5. ADMIN: CV / Career / Experience / Credentials
// 6. ELECTRICAL: Skills Task (Python, SQL, Power BI, ETL)
// 7. REACTOR: Final Mission / Contact Challenge
export const STATIONS_CONFIG: StationConfig[] = [
  {
    id: 'cafeteria_spawn',
    name: 'Emergency Meeting / Portfolio Hub',
    roomName: 'Cafeteria',
    x: 3284,
    y: 669,
    width: 66,
    height: 55,
    standX: 3320,
    standY: 860,
    activationRadius: 180,
    baseImgPath: 'Assets/Images/Items/emergency_button.PNG',
    highlightImgPath: 'Assets/Images/Items/emergency_button_highlight.PNG',
    modalType: 'hub',
    tag: 'SPAWN HUB'
  },
  {
    id: 'security_about',
    name: 'Security Monitors — About Aziz Tabakh',
    roomName: 'Security',
    x: 1756,
    y: 1062,
    width: 206,
    height: 110,
    standX: 1800,
    standY: 1200,
    activationRadius: 200,
    baseImgPath: 'Assets/Images/Items/security_monitor.png',
    highlightImgPath: 'Assets/Images/Items/security_monitor_highlight.png',
    modalType: 'about',
    tag: 'ABOUT'
  },
  {
    id: 'weapons_cp',
    name: 'Weapons Control — Asteroid & CP Task',
    roomName: 'Weapons',
    x: 4451,
    y: 570,
    width: 102,
    height: 96,
    standX: 4430,
    standY: 640,
    activationRadius: 200,
    baseImgPath: 'Assets/Images/Items/destroy_asteroids.PNG',
    highlightImgPath: 'Assets/Images/Items/destroy_asteroids1.PNG',
    modalType: 'asteroids_cp',
    tag: 'CP TASK'
  },
  {
    id: 'comms_projects',
    name: 'Communications — Major Projects Terminal',
    roomName: 'Comms',
    x: 3863,
    y: 2465,
    width: 44,
    height: 38,
    standX: 3885,
    standY: 2560,
    activationRadius: 180,
    baseImgPath: 'Assets/Images/Items/wifi.png',
    highlightImgPath: 'Assets/Images/Items/wifi_highlight.png',
    modalType: 'projects',
    tag: 'PROJECTS'
  },
  {
    id: 'admin_career',
    name: 'Admin Console — Career, CV & Experience',
    roomName: 'Admin',
    x: 3815,
    y: 1802,
    width: 42,
    height: 103,
    standX: 3740,
    standY: 1854,
    activationRadius: 180,
    baseImgPath: 'Assets/Images/Items/admin_control1.PNG',
    highlightImgPath: 'Assets/Images/Items/admin_control1_highlight.png',
    modalType: 'experience_cv',
    tag: 'CAREER / CV'
  },
  {
    id: 'electrical_skills',
    name: 'Electrical Switchboard — Skills Calibration',
    roomName: 'Electrical',
    x: 2472,
    y: 1721,
    width: 48,
    height: 29,
    standX: 2496,
    standY: 1780,
    activationRadius: 180,
    baseImgPath: 'Assets/Images/Items/electricity_wires.png',
    highlightImgPath: 'Assets/Images/Items/electricity_wires_highlight.png',
    modalType: 'skills_task',
    tag: 'SKILLS TASK'
  },
  {
    id: 'reactor_mission',
    name: 'Reactor Core — Final Mission & Contact',
    roomName: 'Reactor',
    x: 889,
    y: 996,
    width: 40,
    height: 49,
    standX: 908,
    standY: 1070,
    activationRadius: 180,
    baseImgPath: 'Assets/Images/Items/reactor_btn.PNG',
    highlightImgPath: 'Assets/Images/Items/reactor_btn_highlight.PNG',
    modalType: 'final_mission',
    tag: 'FINAL MISSION'
  }
];
