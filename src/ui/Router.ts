import { GameWorld } from '../game/World';
import { ModalManager } from './Modals';
import { MinimapOverlay } from './Minimap';

export class AppRouter {
  private world: GameWorld;
  private modals: ModalManager;
  private minimap?: MinimapOverlay;

  constructor(world: GameWorld, modals: ModalManager, minimap?: MinimapOverlay) {
    this.world = world;
    this.modals = modals;
    this.minimap = minimap;

    this.init();
  }

  private init() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  public navigate(hash: string) {
    window.location.hash = hash;
  }

  public handleRoute() {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash || rawHash === 'game') return;

    const parts = rawHash.split('/');
    const section = parts[0].toLowerCase();
    const param = parts[1];

    switch (section) {
      case 'map':
      case 'radar':
        this.minimap?.toggle(true);
        break;

      case 'hub':
      case 'cafeteria':
      case 'spawn':
      case 'meeting':
        if (this.modals.isOpen() && this.modals.getCurrentModal() === 'hub') return;
        this.world.teleportToStation('cafeteria_spawn');
        this.modals.showHubModal();
        break;

      case 'about':
      case 'security':
        if (this.modals.isOpen() && this.modals.getCurrentModal() === 'about') return;
        this.world.teleportToStation('security_about');
        this.modals.showSecurityAboutModal();
        break;

      case 'weapons':
      case 'cp':
      case 'asteroids':
      case 'asteroids_cp':
      case 'competitions':
      case 'contests':
        if (this.modals.isOpen() && this.modals.getCurrentModal() === 'asteroids_cp') return;
        this.world.teleportToStation('weapons_cp');
        this.modals.showWeaponsAsteroidsModal();
        break;

      case 'comms':
      case 'projects':
        this.world.teleportToStation('comms_projects');
        this.modals.showCommsProjectsModal(param || 'dataforge');
        break;

      case 'recruiter':
      case 'dossier':
      case 'executive':
      case 'fasttrack':
        if (this.modals.isOpen() && this.modals.getCurrentModal() === 'executive_dossier') return;
        this.modals.showExecutiveDossierModal(param || 'summary');
        break;

      case 'admin':
      case 'career':
      case 'cv':
      case 'experience':
      case 'education':
      case 'experience_cv':
      case 'resume':
        if (this.modals.isOpen() && this.modals.getCurrentModal() === 'experience_cv') return;
        this.world.teleportToStation('admin_career');
        this.modals.showAdminCareerModal();
        break;

      case 'electrical':
      case 'skills':
      case 'skills_task':
        if (this.modals.isOpen() && this.modals.getCurrentModal() === 'skills_task') return;
        this.world.teleportToStation('electrical_skills');
        this.modals.showElectricalSkillsModal();
        break;

      case 'reactor':
      case 'contact':
      case 'final':
      case 'final_mission':
        if (this.modals.isOpen() && this.modals.getCurrentModal() === 'final_mission') return;
        this.world.teleportToStation('reactor_mission');
        this.modals.showReactorFinalMissionModal();
        break;

      default:
        break;
    }
  }
}
