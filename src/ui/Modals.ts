import { PORTFOLIO_DATA, Project } from '../data/portfolioData';
import { GameWorld } from '../game/World';
import { Station } from '../game/Station';
import { triggerHaptic } from '../utils/Haptics';

export class ModalManager {
  private container: HTMLElement;
  private lightboxContainer: HTMLElement;
  private currentModal: string | null = null;
  private world: GameWorld;
  private asteroidScore: number = 0;
  private asteroidLoopId: number | null = null;

  constructor(world: GameWorld) {
    this.world = world;

    // Main Modal Backdrop
    this.container = document.createElement('div');
    this.container.id = 'modal-container';
    this.container.className = 'modal-backdrop hidden';
    document.body.appendChild(this.container);

    // High-Resolution Lightbox Container
    this.lightboxContainer = document.createElement('div');
    this.lightboxContainer.id = 'image-lightbox';
    this.lightboxContainer.className = 'lightbox-backdrop hidden';
    document.body.appendChild(this.lightboxContainer);

    // Close modal on backdrop click
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    // Close lightbox on backdrop click
    this.lightboxContainer.addEventListener('click', (e) => {
      if (e.target === this.lightboxContainer) {
        this.closeLightbox();
      }
    });

    // Close on Escape key (handles lightbox first if open)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isLightboxOpen()) {
          this.closeLightbox();
          e.stopPropagation();
          return;
        }
        if (this.isOpen()) {
          this.close();
        }
      }
    });
  }

  public isOpen(): boolean {
    return this.currentModal !== null && !this.container.classList.contains('hidden');
  }

  public getCurrentModal(): string | null {
    return this.currentModal;
  }

  public isLightboxOpen(): boolean {
    return !this.lightboxContainer.classList.contains('hidden');
  }

  public close(silent: boolean = false) {
    if (this.isLightboxOpen()) {
      this.closeLightbox(silent);
    }
    if (this.asteroidLoopId !== null) {
      clearInterval(this.asteroidLoopId);
      this.asteroidLoopId = null;
    }
    this.currentModal = null;
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
    if (!silent) {
      this.world.audio.playSfx('close');
    }
    this.world.input.reset();
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }

  public openLightbox(src: string, caption?: string) {
    this.world.audio.playSfx('click');
    this.lightboxContainer.innerHTML = `
      <div class="space-dialog lightbox-dialog">
        <div class="dialog-header lightbox-header">
          <div class="header-tag-box">
            <span class="station-badge">🛰️ TELEMETRY ARCHIVE // HIGH-RESOLUTION INSPECTION</span>
            <span class="dialog-title">${caption || 'TELEMETRY VISUAL RECORD'}</span>
          </div>
          <button class="dialog-close-btn lightbox-close-btn" aria-label="Close Lightbox">✕</button>
        </div>
        <div class="lightbox-body">
          <div class="lightbox-image-box">
            <img src="${src}" alt="${caption || 'Expanded telemetry preview'}" class="lightbox-full-img" />
            <div class="lightbox-scanline"></div>
          </div>
          ${caption ? `<div class="lightbox-caption-bar"><span>📌 <strong>LOG:</strong> ${caption}</span></div>` : ''}
        </div>
      </div>
    `;
    this.lightboxContainer.classList.remove('hidden');

    const closeBtn = this.lightboxContainer.querySelector('.lightbox-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }
  }

  public closeLightbox(silent: boolean = false) {
    this.lightboxContainer.classList.add('hidden');
    this.lightboxContainer.innerHTML = '';
    if (!silent) {
      this.world.audio.playSfx('close');
    }
  }

  public showStationModal(station: Station) {
    switch (station.modalType) {
      case 'hub':
        this.showHubModal();
        break;
      case 'about':
        this.showSecurityAboutModal();
        break;
      case 'asteroids_cp':
        this.showWeaponsAsteroidsModal();
        break;
      case 'projects':
        this.showCommsProjectsModal();
        break;
      case 'experience_cv':
        this.showAdminCareerModal();
        break;
      case 'skills_task':
        this.showElectricalSkillsModal();
        break;
      case 'final_mission':
        this.showReactorFinalMissionModal();
        break;
    }
  }

  // 1. CAFETERIA: EMERGENCY MEETING HUB
  public showHubModal() {
    this.currentModal = 'hub';
    const { personal } = PORTFOLIO_DATA;

    this.container.innerHTML = `
      <div class="space-dialog meeting-dialog">
        <div class="dialog-header emergency-header">
          <div class="emergency-icon-box">
            <span class="alarm-flasher">🚨</span>
            <span class="dialog-title">EMERGENCY MEETING : PORTFOLIO DOSSIER</span>
          </div>
          <button class="dialog-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="dialog-body">
          <div class="hub-hero">
            <div class="hub-avatar-col">
              <div class="crewmate-id-card">
                <div class="id-photo-frame img-zoomable" data-full="${personal.avatarUrl}" data-caption="${personal.name} — Business Intelligence Student & Data Developer" title="Click to enlarge ID Photo">
                  <img src="${personal.avatarUrl}" alt="${personal.name}" class="real-profile-photo" />
                  <div class="id-scanline"></div>
                  <div class="id-corner tl"></div>
                  <div class="id-corner tr"></div>
                  <div class="id-corner bl"></div>
                  <div class="id-corner br"></div>
                  <span class="id-badge-tag">CREW ID #112</span>
                </div>
                <div class="id-crewmate-pair">
                  <img src="Assets/Images/Player/Red/red_down_walk/step1.png" alt="Crewmate Sprite" class="mini-sprite" />
                  <span class="crew-role-label">RED CREWMATE</span>
                </div>
                <span class="badge-status">CREWMATE: VERIFIED</span>
              </div>
            </div>
            <div class="hub-bio-col">
              <h2 class="candidate-name">${personal.name}</h2>
              <div class="candidate-title">${personal.title}</div>
              <div class="candidate-subtitle">${personal.subtitle}</div>
              <p class="candidate-bio">${personal.bio}</p>
              
              <div class="hub-quick-meta">
                <span class="meta-tag">🎓 ESEN — Licence BI (2024–présent)</span>
                <span class="meta-tag">🏆 TCPC Finalist (32 / 100 National)</span>
                <span class="meta-tag">🥇 TBS Monopoly Hackathon Champion</span>
                <span class="meta-tag">💼 COFICAB BI & Data Intern</span>
              </div>
            </div>
          </div>

          <div class="hub-sectors-grid">
            <h3 class="section-subheading">QUICK WARP TO SHIP SECTORS</h3>
            <div class="sector-buttons">
              <button class="sector-btn" data-warp="security_about">
                <span class="btn-icon">📹</span>
                <span class="btn-label">SECURITY : About Dossier</span>
              </button>
              <button class="sector-btn" data-warp="weapons_cp">
                <span class="btn-icon">🎯</span>
                <span class="btn-label">WEAPONS : Asteroid / CP Task</span>
              </button>
              <button class="sector-btn" data-warp="comms_projects">
                <span class="btn-icon">📡</span>
                <span class="btn-label">COMMS : Major Projects</span>
              </button>
              <button class="sector-btn" data-warp="admin_career">
                <span class="btn-icon">📋</span>
                <span class="btn-label">ADMIN : Career, CV & Credentials</span>
              </button>
              <button class="sector-btn" data-warp="electrical_skills">
                <span class="btn-icon">⚡</span>
                <span class="btn-label">ELECTRICAL : Skills Calibration</span>
              </button>
              <button class="sector-btn" data-warp="reactor_mission">
                <span class="btn-icon">☢️</span>
                <span class="btn-label">REACTOR : Final Mission / Contact</span>
              </button>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <a href="${personal.resumeUrl}" download="Mohamed_Aziz_Tabakh_CV.pdf" class="btn-primary" target="_blank">
            📄 Download Official CV (PDF)
          </a>
          <button class="btn-secondary close-dialog-btn">Resume Exploration</button>
        </div>
      </div>
    `;

    this.bindDialogEvents();
    this.container.classList.remove('hidden');
    this.world.audio.playSfx('alarm');
  }

  // 2. SECURITY: ABOUT MOHAMED AZIZ TABAKH
  public showSecurityAboutModal() {
    this.currentModal = 'about';
    const { personal, education } = PORTFOLIO_DATA;

    this.container.innerHTML = `
      <div class="space-dialog">
        <div class="dialog-header">
          <div class="header-tag-box">
            <span class="station-badge">SECURITY MONITORING CONSOLE</span>
            <span class="dialog-title">IDENTITY & ACADEMIC DOSSIER</span>
          </div>
          <button class="dialog-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="dialog-body">
          <div class="dossier-grid">
            <div class="dossier-card">
              <div class="cctv-surveillance-box">
                <div class="cctv-header-bar">
                  <span class="cctv-blinking-rec">● REC</span>
                  <span class="cctv-cam-title">SECURITY CAM 01 // PERSONNEL DOSSIER</span>
                  <span class="cctv-live-tag">LIVE FEED</span>
                </div>
                <div class="cctv-photo-wrapper img-zoomable" data-full="${personal.avatarUrl}" data-caption="Personnel ID Dossier — ${personal.name}" title="Click to enlarge">
                  <img src="${personal.avatarUrl}" alt="${personal.name}" class="cctv-photo" />
                  <div class="cctv-scanline"></div>
                  <div class="cctv-reticle"></div>
                  <span class="cctv-zoom-hint">🔍 INSPECT</span>
                </div>
                <div class="cctv-meta-status">
                  IDENTIFICATION: <strong>${personal.name.toUpperCase()}</strong> // BI & DATA SPECIALIST // THREAT LEVEL: NONE
                </div>
              </div>

              <h3 class="card-title-accent">👤 Candidate Profile</h3>
              <p class="body-p">${personal.bio}</p>
              
              <div class="info-list">
                <div class="info-item"><strong>Full Name:</strong> ${personal.name}</div>
                <div class="info-item"><strong>Current Track:</strong> Business Intelligence (BI) & Data Development</div>
                <div class="info-item"><strong>Base Location:</strong> ${personal.location}</div>
                <div class="info-item"><strong>Mentorship:</strong> Robotics Trainer at Youth Yes We Care</div>
                <div class="info-item"><strong>Algorithms:</strong> Head of Problem Solving at ESEN HiVE Club</div>
              </div>
            </div>

            <div class="dossier-card">
              <h3 class="card-title-accent">🎓 Academic Institutions</h3>
              ${education.map(edu => `
                <div class="edu-block">
                  <div class="edu-title">${edu.institution}</div>
                  <div class="edu-degree">${edu.degree} — <strong>${edu.specialization}</strong></div>
                  <div class="edu-period">📅 ${edu.period} | 📍 ${edu.location}</div>
                  ${edu.details ? `
                    <ul class="edu-bullets">
                      ${edu.details.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <a href="${personal.resumeUrl}" download="Mohamed_Aziz_Tabakh_CV.pdf" class="btn-primary" target="_blank">
            📄 Download Official Resume (PDF)
          </a>
          <button class="btn-secondary close-dialog-btn">Return to Security Room</button>
        </div>
      </div>
    `;

    this.bindDialogEvents();
    this.container.classList.remove('hidden');
  }

  // 3. WEAPONS: ASTEROID & CP TASK (COMPETITIVE PROGRAMMING)
  public showWeaponsAsteroidsModal() {
    this.currentModal = 'asteroids_cp';
    const { competitions } = PORTFOLIO_DATA;
    this.asteroidScore = 0;

    this.container.innerHTML = `
      <div class="space-dialog cp-asteroids-dialog">
        <div class="dialog-header">
          <div class="header-tag-box">
            <span class="station-badge">WEAPONS CONSOLE : CP TASK</span>
            <span class="dialog-title">COMPETITIVE PROGRAMMING & ASTEROID CHALLENGE</span>
          </div>
          <button class="dialog-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="dialog-body">
          <div class="cp-showcase-grid">
            <div class="cp-card-highlight">
              <div class="cp-rank-badge">🏆 RANKED 32 / 100 NATIONAL TEAMS</div>
              <h3 class="cp-main-title">TCPC — Tunisian Collegiate Programming Contest (Mars 2026)</h3>
              <p class="cp-text">Tunisia's premier collegiate programming championship and qualifying tier for the Arab & Africa Championship (ACPC) and ICPC — considered the <strong>Olympics of Programming</strong>.</p>
              <ul class="cp-bullets">
                <li>Solved advanced algorithmic problems in C++ under strict real-time contest conditions.</li>
                <li>Ranked 32nd among 100 top university teams nationwide in Tunisia.</li>
                <li>Applied advanced graph traversal, dynamic programming, and high-performance algorithms.</li>
              </ul>
            </div>

            <div class="cp-card-highlight">
              <div class="cp-rank-badge" style="background:#15803d; border-color:#22c55e; color:#bbf7d0;">🥇 1ST PLACE WINNER</div>
              <h3 class="cp-main-title">TBS Monopoly Hackathon (Mai 2026)</h3>
              <p class="cp-text">Ranked <strong>1st place</strong> among all participating collegiate teams. Engineered a strategic technological innovation uniting data architecture and technical execution.</p>
            </div>
          </div>

          <!-- COMPETITIONS PHOTO ARCHIVES & HALL OF FAME -->
          <div class="competitions-gallery-section">
            <div class="gallery-header">
              <span class="section-subheading">📸 COMPETITION PHOTO ARCHIVES & HALL OF FAME</span>
              <span class="gallery-subtext">Click any competition archive to inspect high-resolution team photo</span>
            </div>
            <div class="competitions-cards-grid">
              ${competitions.filter(c => c.imageUrl).map(c => `
                <div class="competition-photo-card img-zoomable" data-full="${c.imageUrl}" data-caption="${c.imageCaption || c.title}">
                  <div class="comp-img-wrapper">
                    <img src="${c.imageUrl}" alt="${c.title}" class="comp-thumb-img" />
                    <div class="comp-img-scanline"></div>
                    <span class="comp-zoom-badge">🔍 ZOOM</span>
                    <span class="comp-tag-badge">${c.roleOrRank}</span>
                  </div>
                  <div class="comp-info-box">
                    <h4 class="comp-title">${c.title}</h4>
                    <span class="comp-date">📅 ${c.date}</span>
                    <p class="comp-desc">${c.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- INTERACTIVE ASTEROID MINI-TASK -->
          <div class="asteroid-task-wrapper">
            <div class="task-topbar">
              <span class="task-name-label">TARGET DEFENSE : CLEAR THE ASTEROIDS</span>
              <span class="score-display">ASTEROIDS DESTROYED: <strong id="asteroid-count">0</strong></span>
            </div>
            <div class="asteroid-shooting-area" id="asteroid-field">
              <div class="cannon-crosshair"></div>
              <div class="click-instructions">Click asteroids to shoot lasers and clear space!</div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn-secondary close-dialog-btn">Return to Weapons Station</button>
        </div>
      </div>
    `;

    this.bindDialogEvents();
    this.initAsteroidField();
    this.container.classList.remove('hidden');
  }

  private initAsteroidField() {
    const field = this.container.querySelector('#asteroid-field') as HTMLElement;
    const countEl = this.container.querySelector('#asteroid-count') as HTMLElement;
    if (!field || !countEl) return;

    const asteroidImages = [
      'Assets/Images/Tasks/Clear Asteroids/asteroid1.png',
      'Assets/Images/Tasks/Clear Asteroids/asteroid2.png',
      'Assets/Images/Tasks/Clear Asteroids/asteroid3.png',
      'Assets/Images/Tasks/Clear Asteroids/asteroid4.png'
    ];

    const spawnAsteroid = () => {
      if (!this.isOpen() || this.currentModal !== 'asteroids_cp') return;

      const asteroid = document.createElement('div');
      asteroid.className = 'drifting-asteroid';
      const randomImg = asteroidImages[Math.floor(Math.random() * asteroidImages.length)];
      asteroid.style.backgroundImage = `url("${randomImg}")`;

      const startX = Math.random() * (field.clientWidth - 60);
      const startY = Math.random() * (field.clientHeight - 60);
      asteroid.style.left = `${startX}px`;
      asteroid.style.top = `${startY}px`;

      asteroid.addEventListener('click', (e) => {
        e.stopPropagation();
        this.world.audio.playSfx('laser');
        this.world.audio.playSfx('explosion');

        this.asteroidScore++;
        countEl.textContent = `${this.asteroidScore}`;

        asteroid.classList.add('exploded');
        setTimeout(() => asteroid.remove(), 250);
      });

      field.appendChild(asteroid);

      setTimeout(() => {
        if (asteroid.parentNode) asteroid.remove();
      }, 4500);
    };

    // Clear any existing asteroid loop before starting a new one
    if (this.asteroidLoopId !== null) {
      clearInterval(this.asteroidLoopId);
      this.asteroidLoopId = null;
    }

    // Spawn every 750ms
    this.asteroidLoopId = window.setInterval(spawnAsteroid, 750);
    spawnAsteroid();
    spawnAsteroid();
  }

  // 4. COMMS: PROJECTS TERMINAL
  public showCommsProjectsModal(selectedProjectId: string = 'dataforge') {
    this.currentModal = 'projects';
    const { projects } = PORTFOLIO_DATA;
    const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

    this.container.innerHTML = `
      <div class="space-dialog projects-terminal-dialog">
        <div class="dialog-header">
          <div class="header-tag-box">
            <span class="station-badge">COMMUNICATIONS DATABASE</span>
            <span class="dialog-title">TECHNICAL PROJECTS REPOSITORY</span>
          </div>
          <button class="dialog-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="dialog-body projects-body-split">
          <!-- Left: Project Selector List -->
          <div class="projects-sidebar">
            <span class="sidebar-title">SELECT PROJECT</span>
            <div class="project-nav-list">
              ${projects.map(p => `
                <button class="project-nav-item ${p.id === currentProject.id ? 'active' : ''}" data-project-id="${p.id}">
                  <span class="proj-nav-name">${p.name}</span>
                  <span class="proj-nav-cat">${p.category}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Right: Detailed Spec View -->
          <div class="project-detail-panel">
            <div class="detail-header-row">
              <div>
                <span class="category-pill">${currentProject.category}</span>
                <h2 class="project-big-title">${currentProject.name}</h2>
              </div>
              ${currentProject.githubUrl ? `
                <a href="${currentProject.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                  💻 View GitHub
                </a>
              ` : ''}
            </div>

            <p class="project-tagline">${currentProject.shortDescription}</p>

            <!-- Project Live Screenshot / Architecture Visual -->
            ${currentProject.imageUrl ? `
              <div class="project-telemetry-container ${currentProject.id === 'masroufi' ? 'is-mobile-project' : ''}">
                <div class="telemetry-screen-header">
                  <span class="telemetry-label">🖥️ SYSTEM SCREENSHOT // TELEMETRY PREVIEW</span>
                  <span class="telemetry-zoom-prompt">🔍 Click image to enlarge full resolution</span>
                </div>
                <div class="project-screenshot-frame img-zoomable" data-full="${currentProject.imageUrl}" data-caption="${currentProject.imageCaption || currentProject.name}">
                  <img src="${currentProject.imageUrl}" alt="${currentProject.name}" class="project-preview-image ${currentProject.id === 'masroufi' ? 'mobile-ratio-image' : ''}" />
                  <div class="screen-scanline"></div>
                  <div class="screen-corners">
                    <span class="sc-c sc-tl"></span>
                    <span class="sc-c sc-tr"></span>
                    <span class="sc-c sc-bl"></span>
                    <span class="sc-c sc-br"></span>
                  </div>
                </div>
                ${currentProject.imageCaption ? `
                  <div class="telemetry-caption-note">
                    <strong>ARCHIVE LOG:</strong> ${currentProject.imageCaption}
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <div class="detail-grid">
              <div class="detail-box">
                <h4>🚨 The Problem</h4>
                <p>${currentProject.problem}</p>
              </div>

              <div class="detail-box">
                <h4>💡 The Engineering Solution</h4>
                <p>${currentProject.solution}</p>
              </div>
            </div>

            <div class="detail-box architecture-box">
              <h4>⚙️ Architecture & Pipeline</h4>
              <code>${currentProject.architecture}</code>
            </div>

            <div class="detail-box">
              <h4>✨ Key Features</h4>
              <ul class="features-list">
                ${currentProject.keyFeatures.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            ${currentProject.metrics ? `
              <div class="metrics-banner">
                <strong>Verified Real Highlight:</strong> ${currentProject.metrics}
              </div>
            ` : ''}

            <div class="tech-stack-row">
              <span class="tech-label">CORE TECHNOLOGIES:</span>
              <div class="tech-tags">
                ${currentProject.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn-secondary close-dialog-btn">Return to Communications</button>
        </div>
      </div>
    `;

    this.bindDialogEvents();

    // Project switching in sidebar
    this.container.querySelectorAll('[data-project-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = (e.currentTarget as HTMLElement).getAttribute('data-project-id');
        if (pId) {
          this.world.audio.playSfx('click');
          window.history.replaceState(null, '', `#projects/${pId}`);
          this.showCommsProjectsModal(pId);
        }
      });
    });

    this.container.classList.remove('hidden');
  }

  // 5. ADMIN: CAREER, CV & EXPERIENCE
  public showAdminCareerModal() {
    this.currentModal = 'experience_cv';
    const { experience, personal } = PORTFOLIO_DATA;

    this.container.innerHTML = `
      <div class="space-dialog">
        <div class="dialog-header">
          <div class="header-tag-box">
            <span class="station-badge">ADMINISTRATION RECORDS DESK</span>
            <span class="dialog-title">CAREER EXPERIENCE & VERIFIED CV</span>
          </div>
          <button class="dialog-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="dialog-body">
          <!-- INTERACTIVE CARD SWIPE TASK -->
          <div class="card-swipe-box" id="admin-card-swipe">
            <div class="swipe-header">
              <span class="swipe-badge">SECURITY TASK // CARD SWIPE</span>
              <span class="swipe-status-display" id="swipe-status-msg">PLEASE SWIPE ID CARD</span>
              <div class="swipe-lights">
                <span class="swipe-led red-led active" id="swipe-red-led"></span>
                <span class="swipe-led green-led" id="swipe-green-led"></span>
              </div>
            </div>
            <div class="swipe-scanner-track" id="swipe-track">
              <div class="swipe-id-card" id="draggable-id-card">
                <div class="card-chip"></div>
                <div class="card-id-text">
                  <strong>MOHAMED AZIZ TABAKH</strong>
                  <span>DATA DEVELOPER & BI #112</span>
                </div>
                <div class="card-barcode">|| | ||| | || |||</div>
              </div>
            </div>
            <div class="swipe-footer-row">
              <span>💡 Drag card across scanner at normal speed</span>
              <button class="btn-quick-swipe" id="btn-quick-scan">⚡ Quick Scan ID</button>
            </div>
          </div>

          <div class="timeline-list">
            ${experience.map(exp => `
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <h3 class="exp-role">${exp.role}</h3>
                    <span class="exp-company">🏢 ${exp.company}</span>
                    <span class="exp-period">📅 ${exp.period} | 📍 ${exp.location}</span>
                  </div>
                  <p class="exp-desc">${exp.description}</p>
                  <ul class="exp-bullets">
                    ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
                  </ul>

                  <!-- Career Media Deliverable Preview -->
                  ${exp.imageUrl ? `
                    <div class="career-media-preview-box">
                      <div class="career-media-header">
                        <span class="media-header-tag">📸 VERIFIED PRODUCTION DELIVERABLE</span>
                        <span class="media-zoom-tip">🔍 Click to inspect high-resolution</span>
                      </div>
                      <div class="career-media-frame img-zoomable" data-full="${exp.imageUrl}" data-caption="${exp.imageCaption || exp.company}">
                        <img src="${exp.imageUrl}" alt="${exp.company} Deliverable" class="career-preview-photo" />
                        <div class="media-scanline"></div>
                      </div>
                      ${exp.imageCaption ? `
                        <div class="career-media-caption">
                          📌 <em>${exp.imageCaption}</em>
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}

                  <div class="tech-tags">
                    ${exp.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dialog-footer">
          <a href="${personal.resumeUrl}" download="Mohamed_Aziz_Tabakh_CV.pdf" class="btn-primary" target="_blank">
            📄 Download Official CV (resume.pdf)
          </a>
          <button class="btn-secondary close-dialog-btn">Return to Admin Desk</button>
        </div>
      </div>
    `;

    this.bindDialogEvents();

    // Initialize Card Swipe Task
    const cardEl = this.container.querySelector('#draggable-id-card') as HTMLElement;
    const trackEl = this.container.querySelector('#swipe-track') as HTMLElement;
    const statusMsg = this.container.querySelector('#swipe-status-msg') as HTMLElement;
    const redLed = this.container.querySelector('#swipe-red-led') as HTMLElement;
    const greenLed = this.container.querySelector('#swipe-green-led') as HTMLElement;
    const quickScanBtn = this.container.querySelector('#btn-quick-scan') as HTMLElement;

    let isDragging = false;
    let startX = 0;
    let swipeStartTime = 0;

    const onSwipeSuccess = () => {
      statusMsg.textContent = 'ACCEPTED. CREDENTIALS VERIFIED!';
      statusMsg.style.color = '#4ade80';
      redLed?.classList.remove('active');
      greenLed?.classList.add('active');
      this.world.audio.playSfx('complete');
      triggerHaptic('success');
      this.world.visitedStationIds.add('admin_career');
      this.world.onProgressChange?.(this.world.visitedStationIds.size, this.world.stations.length);
    };

    const resetCard = (msg?: string) => {
      if (msg) {
        statusMsg.textContent = msg;
        statusMsg.style.color = '#f87171';
        triggerHaptic('warning');
        this.world.audio.playSfx('close');
      }
      if (cardEl) {
        cardEl.style.transition = 'left 0.25s ease';
        cardEl.style.left = '6px';
        setTimeout(() => {
          cardEl.style.transition = '';
        }, 250);
      }
    };

    quickScanBtn?.addEventListener('click', () => {
      if (!cardEl || !trackEl) return;
      cardEl.style.transition = 'left 0.45s ease-in-out';
      const maxLeft = trackEl.clientWidth - cardEl.clientWidth - 10;
      cardEl.style.left = `${maxLeft}px`;
      setTimeout(() => {
        onSwipeSuccess();
      }, 450);
    });

    const startDrag = (clientX: number) => {
      isDragging = true;
      startX = clientX;
      swipeStartTime = Date.now();
      if (cardEl) cardEl.style.transition = '';
      if (statusMsg) {
        statusMsg.textContent = 'READING CARD...';
        statusMsg.style.color = '#38bdf8';
      }
      triggerHaptic('selection');
    };

    const moveDrag = (clientX: number) => {
      if (!isDragging || !cardEl || !trackEl) return;
      const dx = clientX - startX;
      const maxLeft = trackEl.clientWidth - cardEl.clientWidth - 10;
      const newLeft = Math.max(6, Math.min(maxLeft, 6 + dx));
      cardEl.style.left = `${newLeft}px`;
    };

    const endDrag = () => {
      if (!isDragging || !cardEl || !trackEl) return;
      isDragging = false;
      const duration = Date.now() - swipeStartTime;
      const currentLeft = parseFloat(cardEl.style.left || '6');
      const maxLeft = trackEl.clientWidth - cardEl.clientWidth - 10;

      if (currentLeft >= maxLeft * 0.75) {
        if (duration < 200) {
          resetCard('TOO FAST. BAD READ. TRY AGAIN.');
        } else if (duration > 950) {
          resetCard('TOO SLOW. TIMED OUT. TRY AGAIN.');
        } else {
          cardEl.style.left = `${maxLeft}px`;
          onSwipeSuccess();
        }
      } else {
        resetCard();
      }
    };

    cardEl?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      cardEl.setPointerCapture(e.pointerId);
      startDrag(e.clientX);
    });

    cardEl?.addEventListener('pointermove', (e) => {
      moveDrag(e.clientX);
    });

    cardEl?.addEventListener('pointerup', (e) => {
      cardEl.releasePointerCapture(e.pointerId);
      endDrag();
    });

    cardEl?.addEventListener('pointercancel', endDrag);

    this.container.classList.remove('hidden');
  }

  // 6. ELECTRICAL: SKILLS CALIBRATION TASK
  public showElectricalSkillsModal() {
    this.currentModal = 'skills_task';
    const { skills } = PORTFOLIO_DATA;

    this.container.innerHTML = `
      <div class="space-dialog skills-dialog">
        <div class="dialog-header">
          <div class="header-tag-box">
            <span class="station-badge">ELECTRICAL SWITCHBOARD</span>
            <span class="dialog-title">TECHNICAL SKILLS CALIBRATION TASK</span>
          </div>
          <button class="dialog-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="dialog-body">
          <!-- INTERACTIVE WIRE FIXING TASK -->
          <div class="wire-task-box" id="electrical-wire-task">
            <div class="wire-task-header">
              <span class="wire-badge">CIRCUIT RESTORATION TASK // FIX WIRING</span>
              <span class="wire-status-text" id="wire-status-text">TAP A LEFT WIRE THEN MATCHING RIGHT PORT</span>
            </div>
            <div class="wire-board" id="wire-board">
              <div class="wire-column left">
                <div class="wire-node" data-color="red" data-side="left">
                  <span class="wire-color-tag" style="background:#ef4444;"></span>
                  <span>RED (Python & DWH)</span>
                </div>
                <div class="wire-node" data-color="blue" data-side="left">
                  <span class="wire-color-tag" style="background:#3b82f6;"></span>
                  <span>BLUE (SQL & SSIS)</span>
                </div>
                <div class="wire-node" data-color="yellow" data-side="left">
                  <span class="wire-color-tag" style="background:#eab308;"></span>
                  <span>YELLOW (Power BI & DAX)</span>
                </div>
                <div class="wire-node" data-color="pink" data-side="left">
                  <span class="wire-color-tag" style="background:#ec4899;"></span>
                  <span>PINK (Robotics & C++)</span>
                </div>
              </div>

              <div class="wire-column right">
                <div class="wire-node" data-color="yellow" data-side="right">
                  <span>TERMINAL YELLOW</span>
                  <span class="wire-color-tag" style="background:#eab308;"></span>
                </div>
                <div class="wire-node" data-color="red" data-side="right">
                  <span>TERMINAL RED</span>
                  <span class="wire-color-tag" style="background:#ef4444;"></span>
                </div>
                <div class="wire-node" data-color="pink" data-side="right">
                  <span>TERMINAL PINK</span>
                  <span class="wire-color-tag" style="background:#ec4899;"></span>
                </div>
                <div class="wire-node" data-color="blue" data-side="right">
                  <span>TERMINAL BLUE</span>
                  <span class="wire-color-tag" style="background:#3b82f6;"></span>
                </div>
              </div>
            </div>
          </div>

          <div class="skills-task-banner">
            ⚡ <strong>Circuit Status:</strong> Click any technical competence node to calibrate and verify proficiency level!
          </div>

          <div class="skills-categories-wrapper">
            ${skills.map(cat => `
              <div class="skill-category-card">
                <div class="cat-header">
                  <span class="cat-icon">${cat.icon}</span>
                  <h3 class="cat-title">${cat.category}</h3>
                </div>
                <div class="skills-items-grid">
                  ${cat.skills.map(s => `
                    <div class="skill-pill clickable-skill-node ${s.highlight ? 'highlight-pill' : ''}">
                      <div class="skill-pill-top">
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-level">${s.level}</span>
                      </div>
                      ${s.description ? `<div class="skill-desc">${s.description}</div>` : ''}
                      <span class="node-indicator">⚡ Calibrate</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn-secondary close-dialog-btn">Return to Electrical Room</button>
        </div>
      </div>
    `;

    this.bindDialogEvents();

    // Wire Fixing Task Logic
    let selectedLeftNode: HTMLElement | null = null;
    let connectedWires = 0;
    const wireStatusText = this.container.querySelector('#wire-status-text') as HTMLElement;

    this.container.querySelectorAll('.wire-node[data-side="left"]').forEach(node => {
      node.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        if (el.classList.contains('connected')) return;

        this.container.querySelectorAll('.wire-node[data-side="left"]').forEach(n => n.classList.remove('selected'));
        el.classList.add('selected');
        selectedLeftNode = el;
        triggerHaptic('selection');
        this.world.audio.playSfx('click');
        if (wireStatusText) wireStatusText.textContent = `SELECTED ${el.getAttribute('data-color')?.toUpperCase()} — TAP MATCHING TERMINAL`;
      });
    });

    this.container.querySelectorAll('.wire-node[data-side="right"]').forEach(node => {
      node.addEventListener('click', (e) => {
        const rightEl = e.currentTarget as HTMLElement;
        if (rightEl.classList.contains('connected') || !selectedLeftNode) return;

        const leftColor = selectedLeftNode.getAttribute('data-color');
        const rightColor = rightEl.getAttribute('data-color');

        if (leftColor === rightColor) {
          // Connected!
          selectedLeftNode.classList.remove('selected');
          selectedLeftNode.classList.add('connected');
          rightEl.classList.add('connected');
          connectedWires++;

          triggerHaptic('medium');
          this.world.audio.playSfx('complete');
          selectedLeftNode = null;

          if (connectedWires >= 4) {
            if (wireStatusText) {
              wireStatusText.textContent = '⚡ ALL 4 CIRCUITS ONLINE! POWER +100%!';
              wireStatusText.style.color = '#4ade80';
            }
            triggerHaptic('success');
            this.world.visitedStationIds.add('electrical_skills');
            this.world.onProgressChange?.(this.world.visitedStationIds.size, this.world.stations.length);

            // Auto calibrate all skill nodes
            this.container.querySelectorAll('.clickable-skill-node').forEach(sk => {
              sk.classList.add('calibrated');
              const ind = sk.querySelector('.node-indicator');
              if (ind) ind.textContent = '✓ 100% ONLINE';
            });
          } else {
            if (wireStatusText) wireStatusText.textContent = `CIRCUIT ${connectedWires}/4 RESTORED! SELECT NEXT WIRE`;
          }
        } else {
          // Mismatch
          triggerHaptic('warning');
          this.world.audio.playSfx('close');
          if (wireStatusText) wireStatusText.textContent = `MISMATCH! ${leftColor?.toUpperCase()} CANNOT CONNECT TO ${rightColor?.toUpperCase()}`;
        }
      });
    });

    // Node click calibration sound
    this.container.querySelectorAll('.clickable-skill-node').forEach(node => {
      node.addEventListener('click', (e) => {
        this.world.audio.playSfx('complete');
        triggerHaptic('light');
        (e.currentTarget as HTMLElement).classList.add('calibrated');
        const ind = (e.currentTarget as HTMLElement).querySelector('.node-indicator');
        if (ind) ind.textContent = '✓ CALIBRATED';
      });
    });

    this.container.classList.remove('hidden');
  }

  // 7. REACTOR: FINAL MISSION & CONTACT
  public showReactorFinalMissionModal() {
    this.currentModal = 'final_mission';
    const { personal } = PORTFOLIO_DATA;

    this.container.innerHTML = `
      <div class="space-dialog contact-dialog">
        <div class="dialog-header">
          <div class="header-tag-box">
            <span class="station-badge">REACTOR CORE TERMINAL</span>
            <span class="dialog-title">FINAL MISSION : TRANSMISSION LINK</span>
          </div>
          <button class="dialog-close-btn" aria-label="Close">✕</button>
        </div>

        <div class="dialog-body">
          <div class="final-mission-banner">
            ☢️ <strong>MISSION STATUS : OBJECTIVES MET</strong><br/>
            You have explored the engineering world of Mohamed Aziz Tabakh. Establish direct transmission below:
          </div>

          <div class="reactor-contact-identity-card">
            <div class="reactor-avatar-frame img-zoomable" data-full="${personal.avatarUrl}" data-caption="${personal.name}">
              <img src="${personal.avatarUrl}" alt="${personal.name}" class="reactor-avatar-img" />
              <div class="reactor-scanline"></div>
            </div>
            <div class="reactor-identity-meta">
              <h3 class="reactor-officer-name">${personal.name}</h3>
              <span class="reactor-officer-role">${personal.title}</span>
              <span class="reactor-frequency">SECURE QUANTUM COMMS FREQUENCY : 108.4 MHz</span>
              <span class="reactor-online-badge">● READY FOR TRANSMISSION / HIRING CONTACT</span>
            </div>
          </div>

          <div class="channels-grid">
            <a href="mailto:${personal.email}" class="channel-card">
              <span class="channel-icon">✉️</span>
              <div class="channel-info">
                <span class="channel-name">Direct Email</span>
                <span class="channel-val">${personal.email}</span>
              </div>
            </a>

            <a href="tel:${personal.phone.replace(/\s+/g, '')}" class="channel-card">
              <span class="channel-icon">📞</span>
              <div class="channel-info">
                <span class="channel-name">Phone / WhatsApp</span>
                <span class="channel-val">${personal.phone}</span>
              </div>
            </a>

            <a href="${personal.githubUrl}" target="_blank" rel="noopener noreferrer" class="channel-card">
              <span class="channel-icon">💻</span>
              <div class="channel-info">
                <span class="channel-name">GitHub Profile</span>
                <span class="channel-val">medaziztabakh</span>
              </div>
            </a>

            <a href="${personal.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="channel-card">
              <span class="channel-icon">🔗</span>
              <div class="channel-info">
                <span class="channel-name">LinkedIn Profile</span>
                <span class="channel-val">Mohamed Aziz Tabakh</span>
              </div>
            </a>
          </div>

          <div class="location-banner">
            📍 <strong>Base Location:</strong> ${personal.location} | Open to opportunities in Business Intelligence, Data Engineering & Advanced Analytics.
          </div>
        </div>

        <div class="dialog-footer">
          <a href="${personal.resumeUrl}" download="Mohamed_Aziz_Tabakh_CV.pdf" class="btn-primary" target="_blank">
            📄 Download Official CV (PDF)
          </a>
          <button class="btn-secondary close-dialog-btn">Complete Mission & Return</button>
        </div>
      </div>
    `;

    this.bindDialogEvents();
    this.container.classList.remove('hidden');
  }

  private bindDialogEvents() {
    this.container.querySelectorAll('.dialog-close-btn, .close-dialog-btn').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    this.container.querySelectorAll('[data-warp]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stationId = (e.currentTarget as HTMLElement).getAttribute('data-warp');
        if (stationId) {
          this.close(true);
          this.world.teleportToStation(stationId);
          const target = this.world.stations.find(s => s.id === stationId);
          if (target) {
            this.world.triggerStation(target);
          }
        }
      });
    });

    // Wire up all zoomable images to open the high-res Lightbox
    this.container.querySelectorAll('.img-zoomable').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement;
        const src = target.getAttribute('data-full') || (target as HTMLImageElement).src || target.querySelector('img')?.src;
        const caption = target.getAttribute('data-caption') || target.getAttribute('title') || '';
        if (src) {
          this.openLightbox(src, caption);
        }
      });
    });
  }
}
