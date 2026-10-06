export interface VentLocation {
  id: number;
  room: string;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  exitX: number;
  exitY: number;
  connectedIds: number[];
}

export const SKELD_VENTS: VentLocation[] = [
  // 1: Cafeteria / Admin Hallway
  { id: 1, room: 'Cafeteria Corridor', x: 3897, y: 839, centerX: 3929, centerY: 863, exitX: 3929, exitY: 838, connectedIds: [5, 4] },
  // 2: Weapons
  { id: 2, room: 'Weapons Room', x: 4443, y: 411, centerX: 4475, centerY: 435, exitX: 4475, exitY: 410, connectedIds: [13, 14, 3] },
  // 3: Shields
  { id: 3, room: 'Shields', x: 4510, y: 1578, centerX: 4542, centerY: 1602, exitX: 4542, exitY: 1577, connectedIds: [2, 14] },
  // 4: Storage Hallway
  { id: 4, room: 'Storage Hallway', x: 4525, y: 2511, centerX: 4557, centerY: 2535, exitX: 4557, exitY: 2510, connectedIds: [1, 5] },
  // 5: Admin
  { id: 5, room: 'Admin Room', x: 3693, y: 1992, centerX: 3725, centerY: 2016, exitX: 3725, exitY: 1991, connectedIds: [1, 4] },
  // 6: Medbay
  { id: 6, room: 'Medbay', x: 2120, y: 1303, centerX: 2152, centerY: 1327, exitX: 2152, exitY: 1302, connectedIds: [9, 12] },
  // 7: Upper Engine
  { id: 7, room: 'Upper Engine', x: 1586, y: 503, centerX: 1618, centerY: 527, exitX: 1618, exitY: 502, connectedIds: [11, 10] },
  // 8: Lower Engine
  { id: 8, room: 'Lower Engine', x: 1584, y: 2451, centerX: 1616, centerY: 2475, exitX: 1616, exitY: 2450, connectedIds: [10, 11] },
  // 9: Electrical
  { id: 9, room: 'Electrical Room', x: 2220, y: 1762, centerX: 2252, centerY: 1786, exitX: 2252, exitY: 1761, connectedIds: [6, 12] },
  // 10: Reactor Bottom
  { id: 10, room: 'Reactor (Lower)', x: 930, y: 1671, centerX: 962, centerY: 1695, exitX: 962, exitY: 1670, connectedIds: [11, 7, 8] },
  // 11: Reactor Top
  { id: 11, room: 'Reactor (Upper)', x: 800, y: 1206, centerX: 832, centerY: 1230, exitX: 832, exitY: 1205, connectedIds: [10, 7, 8] },
  // 12: Security
  { id: 12, room: 'Security Room', x: 1891, y: 1630, centerX: 1923, centerY: 1654, exitX: 1923, exitY: 1629, connectedIds: [6, 9] },
  // 13: Navigation Top
  { id: 13, room: 'Navigation (Upper)', x: 5302, y: 1189, centerX: 5334, centerY: 1213, exitX: 5334, exitY: 1188, connectedIds: [14, 2] },
  // 14: Navigation Bottom
  { id: 14, room: 'Navigation (Lower)', x: 5303, y: 1571, centerX: 5335, centerY: 1595, exitX: 5335, exitY: 1570, connectedIds: [13, 2, 3] }
];

// The 4 interconnected vent loop clusters on The Skeld
export const VENT_CLUSTERS: number[][] = [
  // Cluster 0: Cafeteria Corridor <-> Admin <-> Storage Hallway
  [1, 5, 4],
  // Cluster 1: Weapons <-> Nav Upper <-> Nav Lower <-> Shields
  [2, 13, 14, 3],
  // Cluster 2: Electrical <-> Medbay <-> Security
  [9, 6, 12],
  // Cluster 3: Reactor Upper <-> Upper Engine <-> Reactor Lower <-> Lower Engine
  [11, 7, 10, 8]
];

export class VentManager {
  public vents: VentLocation[] = SKELD_VENTS;
  public nearbyVent: VentLocation | null = null;
  public isInsideVent: boolean = false;
  public currentVent: VentLocation | null = null;

  private ventAudio: HTMLAudioElement;

  constructor() {
    this.ventAudio = new Audio('Assets/Sounds/General/vent.wav');
    this.ventAudio.volume = 0.55;
  }

  public checkProximity(playerX: number, playerY: number, radius: number = 90): VentLocation | null {
    if (this.isInsideVent) {
      this.nearbyVent = this.currentVent;
      return this.currentVent;
    }

    let closest: VentLocation | null = null;
    let minDist = radius;

    for (const v of this.vents) {
      const d = Math.hypot(playerX - v.centerX, playerY - v.centerY);
      if (d <= minDist) {
        minDist = d;
        closest = v;
      }
    }

    this.nearbyVent = closest;
    return closest;
  }

  public enterVent(vent: VentLocation) {
    this.isInsideVent = true;
    this.currentVent = vent;
    this.playVentSound();
  }

  public exitVent(): VentLocation | null {
    const exitedAt = this.currentVent;
    this.isInsideVent = false;
    this.currentVent = null;
    this.playVentSound();
    return exitedAt;
  }

  public nextVent(): VentLocation | null {
    if (!this.isInsideVent || !this.currentVent) return null;
    const cluster = VENT_CLUSTERS.find(c => c.includes(this.currentVent!.id));
    if (!cluster) return this.currentVent;

    const idx = cluster.indexOf(this.currentVent.id);
    const nextId = cluster[(idx + 1) % cluster.length];
    const target = this.vents.find(v => v.id === nextId) || this.currentVent;
    this.currentVent = target;
    this.playVentSound();
    return target;
  }

  public prevVent(): VentLocation | null {
    if (!this.isInsideVent || !this.currentVent) return null;
    const cluster = VENT_CLUSTERS.find(c => c.includes(this.currentVent!.id));
    if (!cluster) return this.currentVent;

    const idx = cluster.indexOf(this.currentVent.id);
    const prevId = cluster[(idx - 1 + cluster.length) % cluster.length];
    const target = this.vents.find(v => v.id === prevId) || this.currentVent;
    this.currentVent = target;
    this.playVentSound();
    return target;
  }

  public playVentSound() {
    try {
      this.ventAudio.currentTime = 0;
      this.ventAudio.play().catch(() => {});
    } catch (e) {}
  }
}
