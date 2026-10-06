import { PlayerColor, Direction } from './Player';

export interface BotConfig {
  id: string;
  name: string;
  role: string;
  color: PlayerColor;
  direction: Direction;
  x: number;
  y: number;
  dialogue: string;
}

export class Bot {
  public id: string;
  public name: string;
  public role: string;
  public color: PlayerColor;
  public direction: Direction;
  public x: number;
  public y: number;
  public dialogue: string;
  public isNear: boolean = false;

  private spriteImg: HTMLImageElement | null = null;
  private width: number = 64;
  private height: number = 86;

  constructor(config: BotConfig) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role;
    this.color = config.color;
    this.direction = config.direction;
    this.x = config.x;
    this.y = config.y;
    this.dialogue = config.dialogue;

    // Load idle sprite (step1)
    const cLower = this.color.toLowerCase();
    this.spriteImg = new Image();
    this.spriteImg.src = `Assets/Images/Player/${this.color}/${cLower}_${this.direction}_walk/step1.png`;
  }

  public checkProximity(playerX: number, playerY: number, radius: number = 180): boolean {
    const dist = Math.hypot(playerX - this.x, playerY - this.y);
    this.isNear = dist <= radius;
    return this.isNear;
  }

  public draw(ctx: CanvasRenderingContext2D, screenX: number, screenY: number) {
    const drawX = Math.round(screenX - this.width / 2);
    const drawY = Math.round(screenY - this.height / 2);

    // Shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 34, 20, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();
    ctx.restore();

    if (this.spriteImg && this.spriteImg.complete && this.spriteImg.naturalWidth > 0) {
      ctx.drawImage(this.spriteImg, drawX, drawY, this.width, this.height);
    } else {
      ctx.save();
      ctx.fillStyle = this.color.toLowerCase();
      ctx.beginPath();
      ctx.arc(screenX, screenY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Role badge
    ctx.save();
    ctx.font = 'bold 11px Rubik, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#67e8f9';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.fillText(this.role, screenX, drawY - 8);
    ctx.restore();

    // Speech bubble if player is near
    if (this.isNear) {
      this.drawSpeechBubble(ctx, screenX, drawY - 26);
    }
  }

  private drawSpeechBubble(ctx: CanvasRenderingContext2D, anchorX: number, anchorY: number) {
    const maxW = 240;
    ctx.save();
    ctx.font = '12px "Segoe UI", Arial, sans-serif';

    // Simple wrap text
    const words = this.dialogue.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const w of words) {
      const testLine = currentLine ? `${currentLine} ${w}` : w;
      if (ctx.measureText(testLine).width > maxW - 20) {
        lines.push(currentLine);
        currentLine = w;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineH = 16;
    const bubbleH = lines.length * lineH + 18;
    const bubbleW = maxW;
    const bubbleX = anchorX - bubbleW / 2;
    const bubbleY = anchorY - bubbleH;

    // Bubble box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
    ctx.fill();
    ctx.stroke();

    // Bubble pointer
    ctx.beginPath();
    ctx.moveTo(anchorX - 6, bubbleY + bubbleH);
    ctx.lineTo(anchorX, bubbleY + bubbleH + 6);
    ctx.lineTo(anchorX + 6, bubbleY + bubbleH);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.fill();
    ctx.stroke();

    // Text lines
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], bubbleX + 10, bubbleY + 9 + i * lineH);
    }

    ctx.restore();
  }
}

export const BOTS_CONFIG: BotConfig[] = [
  {
    id: 'bot_comms',
    name: 'Blue',
    role: 'Comms Officer',
    color: 'Blue',
    direction: 'left',
    x: 3733,
    y: 2626,
    dialogue: "Comms link active! Use the nearby terminal to contact Aziz or grab his resume."
  },
  {
    id: 'bot_admin',
    name: 'Green',
    role: 'Data Architect',
    color: 'Green',
    direction: 'right',
    x: 3686,
    y: 1857,
    dialogue: "Welcome to Admin! Here you'll find Aziz's core stack: Python, SQL, Power BI & DWH."
  },
  {
    id: 'bot_reactor',
    name: 'Purple',
    role: 'MLOps Specialist',
    color: 'Purple',
    direction: 'down',
    x: 850,
    y: 1846,
    dialogue: "Reactor power steady! Check out ChurnLab inside the Reactor room for MLOps workflows."
  },
  {
    id: 'bot_medbay',
    name: 'Yellow',
    role: 'Mobile Dev',
    color: 'Yellow',
    direction: 'down',
    x: 2513,
    y: 1286,
    dialogue: "Medbay houses Masroufi (مصروفي), an offline-first private budget app for Tunisia!"
  },
  {
    id: 'bot_cockpit',
    name: 'Orange',
    role: 'Algorithms Pilot',
    color: 'Orange',
    direction: 'right',
    x: 5401,
    y: 1530,
    dialogue: "Aziz placed 32nd in Tunisia in TCPC 2026! Check Navigation for contest details."
  },
  {
    id: 'bot_electrical',
    name: 'White',
    role: 'Data Quality Inspector',
    color: 'White',
    direction: 'right',
    x: 2361,
    y: 1799,
    dialogue: "Electrical station powers DataForge: automated quarantine zones for data quality!"
  },
  {
    id: 'bot_robotics',
    name: 'Pink',
    role: 'Robotics Mentor',
    color: 'Pink',
    direction: 'up',
    x: 1321,
    y: 2423,
    dialogue: "Youth Yes We Care mentor! Down here you can inspect his Arduino & Mecanum robots."
  },
  {
    id: 'bot_upper_engine',
    name: 'Brown',
    role: 'Supply Chain Analyst',
    color: 'Brown',
    direction: 'down',
    x: 1256,
    y: 489,
    dialogue: "Upper Engine powers SupplyChainIQ: multi-source ETL and inventory forecasting."
  },
  {
    id: 'bot_storage',
    name: 'Black',
    role: 'COFICAB Engineer',
    color: 'Black',
    direction: 'right',
    x: 3394,
    y: 2795,
    dialogue: "Storage showcases Aziz's BI internship at COFICAB with SSIS and SQL Server DWH."
  }
];
