import './styles/main.css';
import './styles/modals.css';

import { GameWorld } from './game/World';
import { MinimapOverlay } from './ui/Minimap';
import { ModalManager } from './ui/Modals';
import { HUD } from './ui/HUD';
import { TitleScreen } from './ui/TitleScreen';
import { AppRouter } from './ui/Router';

class App {
  private world!: GameWorld;
  private minimap!: MinimapOverlay;
  private modals!: ModalManager;
  private hud!: HUD;
  private router!: AppRouter;
  private titleScreen!: TitleScreen;

  constructor() {
    this.init();
  }

  private init() {
    const appEl = document.getElementById('app');
    if (!appEl) throw new Error('Missing #app container');

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    appEl.appendChild(canvas);

    // Initialize Game World
    this.world = new GameWorld(canvas);

    // Initialize Minimap
    this.minimap = new MinimapOverlay(this.world);

    // Initialize Modals
    this.modals = new ModalManager(this.world);

    // Block game movement/actions when modal or minimap radar is open
    this.world.isInputBlocked = () => this.modals.isOpen() || this.minimap.getIsOpen();

    // Map toggle shortcut
    this.world.onMapToggle = () => this.minimap.toggle();

    // Initialize HUD
    this.hud = new HUD(this.world, this.minimap, this.modals);

    // Connect Station Triggers to Modals
    this.world.onStationTrigger = (station) => {
      this.modals.showStationModal(station);
      window.location.hash = station.modalType;
    };

    // Initialize Router
    this.router = new AppRouter(this.world, this.modals, this.minimap);

    // Initialize Title Screen (Real game start sequence)
    this.titleScreen = new TitleScreen(this.world, () => {
      // Clear initial spawn hash if left over from previous session
      if (window.location.hash === '#hub' || window.location.hash === '#cafeteria' || window.location.hash === '#spawn') {
        window.history.replaceState(null, '', window.location.pathname);
      }
      // Game started after cutscene!
      this.world.start();
      // If there's an explicit deep-link hash route, trigger it
      if (window.location.hash && window.location.hash !== '#game' && window.location.hash !== '#') {
        this.router.handleRoute();
      }
    });
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
