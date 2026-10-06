export class AudioManager {
  private isMuted: boolean = false;
  private footstepAudio: HTMLAudioElement[] = [];
  private currentFootstepIndex: number = 0;
  private lastFootstepTime: number = 0;
  private footstepInterval: number = 260; // ms

  // Ambience audio elements by sector
  private ambientTracks: { [key: string]: HTMLAudioElement } = {};
  private activeSector: string | null = null;
  private fadeIntervals: Map<string, number> = new Map();
  private sfxAudio: { [key: string]: HTMLAudioElement } = {};
  private menuMusic: HTMLAudioElement | null = null;

  constructor() {
    this.init();
  }

  public init() {
    if (this.footstepAudio.length === 0) {
      try {
        // Load footsteps
        for (let i = 1; i <= 4; i++) {
          const audio = new Audio(`Assets/Sounds/Footsteps/Footstep0${i}.wav`);
          audio.volume = 0.22;
          this.footstepAudio.push(audio);
        }

        // Ambient room tracks
        const ambFiles: { [key: string]: string } = {
          cafeteria: 'Assets/Sounds/Ambience/AMB_Cafeteria.wav',
          admin: 'Assets/Sounds/Ambience/AMB_Admin.wav',
          electrical: 'Assets/Sounds/Ambience/AMB_Electrical.wav',
          reactor: 'Assets/Sounds/Ambience/AMB_ReactorRoom.wav',
          engine: 'Assets/Sounds/Ambience/AMB_EngineRoom.wav',
          storage: 'Assets/Sounds/Ambience/AMB_Storage.wav',
          cockpit: 'Assets/Sounds/Ambience/AMB_Cockpit.wav',
          weapons: 'Assets/Sounds/Ambience/AMB_Weapons.wav',
          security: 'Assets/Sounds/Ambience/AMB_SecurityRoom.wav',
          comms: 'Assets/Sounds/Ambience/AMB_CommsRoom.wav',
          medbay: 'Assets/Sounds/Ambience/AMB_MedbayRoom.wav'
        };

        for (const [key, path] of Object.entries(ambFiles)) {
          const audio = new Audio(path);
          audio.loop = true;
          audio.volume = 0;
          this.ambientTracks[key] = audio;
        }

        // Sound effects
        this.sfxAudio['click'] = new Audio('Assets/Sounds/UI/select.wav');
        this.sfxAudio['map'] = new Audio('Assets/Sounds/UI/map_btn_click.wav');
        this.sfxAudio['complete'] = new Audio('Assets/Sounds/General/task_complete.wav');
        this.sfxAudio['alarm'] = new Audio('Assets/Sounds/General/alarm_emergencymeeting.wav');
        this.sfxAudio['open'] = new Audio('Assets/Sounds/UI/pause.wav');
        this.sfxAudio['close'] = new Audio('Assets/Sounds/UI/back2.wav');
        this.sfxAudio['vent'] = new Audio('Assets/Sounds/General/vent.wav');
        this.sfxAudio['roundstart'] = new Audio('Assets/Sounds/General/roundstart.wav');
        this.sfxAudio['laser'] = new Audio('Assets/Sounds/Clear Asteroids/laser.wav');
        this.sfxAudio['explosion'] = new Audio('Assets/Sounds/Clear Asteroids/explosion.wav');

        for (const sfx of Object.values(this.sfxAudio)) {
          sfx.volume = 0.45;
        }

        // Menu Music
        this.menuMusic = new Audio('Assets/Sounds/Background/main_menu_music.mp3');
        this.menuMusic.loop = true;
        this.menuMusic.volume = 0.35;
      } catch (e) {
        console.warn('Audio initialization deferred:', e);
      }
    }
  }

  public playMenuMusic() {
    if (this.isMuted || !this.menuMusic) return;
    this.menuMusic.currentTime = 0;
    this.menuMusic.play().catch(() => {});
  }

  public stopMenuMusic() {
    if (this.menuMusic) {
      this.menuMusic.pause();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.init();

    if (this.isMuted) {
      this.stopAllAmbience();
      this.stopMenuMusic();
    } else {
      this.playSfx('click');
      if (this.activeSector && this.ambientTracks[this.activeSector]) {
        this.ambientTracks[this.activeSector].volume = 0.28;
        this.ambientTracks[this.activeSector].play().catch(() => {});
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playFootstep() {
    if (this.isMuted || this.footstepAudio.length === 0) return;
    const now = performance.now();
    if (now - this.lastFootstepTime >= this.footstepInterval) {
      this.lastFootstepTime = now;
      const audio = this.footstepAudio[this.currentFootstepIndex];
      this.currentFootstepIndex = (this.currentFootstepIndex + 1) % this.footstepAudio.length;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  public playSfx(name: 'click' | 'map' | 'complete' | 'alarm' | 'open' | 'close' | 'vent' | 'roundstart' | 'laser' | 'explosion') {
    if (this.isMuted) return;
    const sound = this.sfxAudio[name];
    if (sound) {
      try {
        const clone = sound.cloneNode() as HTMLAudioElement;
        clone.volume = sound.volume;
        clone.play().catch(() => {});
      } catch (e) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    }
  }

  public updateSectorAmbience(sector: string | null) {
    if (this.isMuted) return;
    if (sector === this.activeSector) return;

    const prevSector = this.activeSector;
    this.activeSector = sector;

    // Fade out previous track
    if (prevSector && this.ambientTracks[prevSector]) {
      const oldTrack = this.ambientTracks[prevSector];
      const oldInterval = this.fadeIntervals.get(prevSector);
      if (oldInterval) clearInterval(oldInterval);

      const fadeOut = window.setInterval(() => {
        const nextVol = Math.max(0, oldTrack.volume - 0.04);
        oldTrack.volume = nextVol;
        if (nextVol <= 0) {
          oldTrack.pause();
          clearInterval(fadeOut);
          this.fadeIntervals.delete(prevSector);
        }
      }, 50);
      this.fadeIntervals.set(prevSector, fadeOut);
    }

    // Fade in new track
    if (sector && this.ambientTracks[sector]) {
      const newTrack = this.ambientTracks[sector];
      const runningInterval = this.fadeIntervals.get(sector);
      if (runningInterval) clearInterval(runningInterval);

      newTrack.volume = Math.max(0.02, newTrack.volume);
      newTrack.play().then(() => {
        const targetVol = 0.25;
        const fadeIn = window.setInterval(() => {
          const nextVol = Math.min(targetVol, newTrack.volume + 0.04);
          newTrack.volume = nextVol;
          if (nextVol >= targetVol) {
            clearInterval(fadeIn);
            this.fadeIntervals.delete(sector);
          }
        }, 50);
        this.fadeIntervals.set(sector, fadeIn);
      }).catch(() => {});
    }
  }

  private stopAllAmbience() {
    this.fadeIntervals.forEach((intervalId) => clearInterval(intervalId));
    this.fadeIntervals.clear();
    for (const track of Object.values(this.ambientTracks)) {
      track.pause();
      track.volume = 0;
    }
  }
}
