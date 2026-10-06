# Mohamed Aziz Tabakh — Interactive Spaceship Portfolio

[![Deploy to GitHub Pages](https://github.com/MrTBK/among-us-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrTBK/among-us-portfolio/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now-success?style=for-the-badge&logo=rocket)](https://mrtbk.github.io/among-us-portfolio/)

🌐 **Live Website**: [https://mrtbk.github.io/among-us-portfolio/](https://mrtbk.github.io/among-us-portfolio/)

An authentic, production-quality interactive personal portfolio web application transformed from the Among Us game engine and assets for **Mohamed Aziz Tabakh**.

> **Business Intelligence Student & Data Developer**  
> *Robotics Trainer | Competitive Programmer | Problem Solver*  
> **ESEN — École Supérieure d’Économie Numérique** (Licence BI 2024–présent)

---

## 🚀 Live Experience & Modes

The portfolio delivers a dual-mode experience:
1. **Interactive Spaceship Game World**: Explore The Skeld spaceship in real-time at 60 FPS, control your astronaut, discover interactive project terminals, talk to NPC crewmates, and listen to spatial room audio.
2. **Accessible Classic Portfolio View**: Full, responsive, screen-reader-friendly conventional portfolio layout accessible via the topbar or direct deep-links (`#about`, `#skills`, `#projects`, `#experience`, `#competitions`, `#education`, `#contact`).

---

## 🛠️ Technical Stack & Architecture

- **Runtime Engine**: HTML5 Canvas 2D + TypeScript (ES2022) + Web Audio API
- **Build & Bundler**: Vite 8.x (lightning-fast development and optimized static builds)
- **Map & Asset Pipeline**:
  - Full-resolution Skeld map (`5792 x 3168`) rendered with viewport culling for silky-smooth 60 FPS
  - 296 pre-parsed AABB collision obstacles from `map.tmx` for realistic wall collisions and diagonal sliding
  - Multi-directional walk animations across 10 astronaut colors
  - Authentic Among Us items, terminals, emergency meeting tablets, and mini-map radar
- **Spatial Audio**: Dynamic room ambience cross-fades based on player coordinates (Cafeteria, Admin, Electrical, Reactor, etc.) with footsteps and sound effects (Mute/Unmute toggle supported)
- **Zero Heavy Runtimes**: Pure native TypeScript + Canvas 2D without bulky game engines or WASM overhead.

---

## 🕹️ Controls

| Action | Desktop Keyboard | Mobile / Tablet Touch |
|---|---|---|
| **Movement** | `W` `A` `S` `D` or `Arrow Keys` | Virtual Analog Touch Joystick (bottom-left) |
| **Inspect / Action** | `E`, `Space`, or `Enter` | Glowing `USE` button (bottom-right) |
| **Ship Radar Map** | `M` key | Radar Button (top-right) |
| **Close Modals** | `Escape` key | `✕` Close Button |
| **Direct Sections** | Topbar navigation chips | Topbar navigation chips |

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** v9+

### 2. Development Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:8080` in your browser.

### 3. Production Build
```bash
# Type check and build static production bundle
npm run build
```
The optimized static distribution will be created in `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Deployment
The `dist/` folder is 100% static and can be deployed directly to:
- **GitHub Pages**
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
- Any standard web server (Nginx, Apache, Caddy, AWS S3)

---

## 🗂️ Project Directory Structure

```
├── Assets/                 # Original game assets (Images, Maps, Sounds, Fonts)
├── public/                 # Static asset symlinks/serving
├── src/
│   ├── data/
│   │   ├── portfolioData.ts # Centralized portfolio profile, projects, skills, education
│   │   └── mapObstacles.ts  # 296 parsed collision boxes from map.tmx
│   ├── game/
│   │   ├── World.ts         # Canvas 2D engine, game loop, rendering & sector detection
│   │   ├── Camera.ts        # Viewport culling & smooth player tracking
│   │   ├── Player.ts        # Player physics, sprite animation, direction & AABB collisions
│   │   ├── Bot.ts           # Friendly NPC crewmates with contextual dialogue
│   │   ├── Station.ts       # Interactive portfolio stations & glowing highlights
│   │   ├── AudioManager.ts  # Spatial room ambience, footsteps & UI sound effects
│   │   └── Input.ts         # Keyboard, mouse, and touch virtual joystick
│   ├── ui/
│   │   ├── HUD.ts           # Topbar, progress bar, minimap toggle, sound & suit picker
│   │   ├── Minimap.ts       # Authentic radar mini-map overlay with fast-travel warp
│   │   ├── Modals.ts        # Among Us styled terminals, emergency meeting dossier & specs
│   │   ├── FallbackPortfolio.ts # Accessible full-page conventional portfolio layout
│   │   └── Router.ts        # Deep-linking URL hash router (#about, #projects, etc.)
│   ├── styles/
│   │   ├── main.css         # Game styles, HUD, typography, fonts, touch controls
│   │   ├── modals.css       # Authentic Among Us UI styling & sci-fi terminal layout
│   │   └── fallback.css     # Clean, modern accessible portfolio view styling
│   ├── main.ts              # App entry point & component coordinator
│   └── vite-env.d.ts        # TypeScript client definitions
├── index.html               # Main HTML5 entry point
├── package.json             # NPM package scripts & dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── resume.pdf               # Official CV for Mohamed Aziz Tabakh
```

---

## 👤 Profile & Portfolio Highlights

### Core Technologies
- **Business Intelligence & Data**: Dimensional Modeling (Star / Snowflake Schema), Data Warehousing, Data Marts, ETL/ELT, Data Quality & Quarantine Zones, Performance Optimization
- **Databases & BI Tools**: SQL Server (SSMS), SSIS, Power BI (DAX, Power Query), PostgreSQL, Oracle XE, MySQL, SQLite
- **Languages**: SQL, Python, C++, C, JavaScript, PHP
- **Web & DevOps**: Flask, Angular, Docker, Linux / Bash, Git / GitHub

### Key Featured Projects
1. **SupplyChainIQ** *(Upper Engine)*: End-to-end supply-chain intelligence & inventory management platform with demand forecasting, supplier defect scorecards, and Star Schema DWH.
2. **DataForge** *(Electrical Room)*: Production data engineering platform featuring automated pipeline orchestration, schema validation, and quarantine isolation zones.
3. **ChurnLab** *(Reactor Room)*: Production-style customer churn prediction and MLOps platform with experiment tracking and model drift analysis.
4. **SalesPulse** *(Admin Room)*: Commercial performance decision support system with dimensional modeling, automated cleansing, and interactive Power BI dashboards.
5. **Customer360** *(Cockpit)*: Unified customer behavioral profiles and RFM segmentation models.
6. **Masroufi (مصروفي)** *(Medbay)*: 100% offline-first private personal finance mobile application for Tunisia with local SQLite storage.
7. **MaintIQ** *(Lower Engine)*: Industrial predictive maintenance analytics with MTBF/MTTR equipment failure tracking.
8. **Shadow Code** *(Security Room)*: Chess game engine powered by Deep Reinforcement Learning AI with Pygame GUI.
9. **Arduino Robotics Suite** *(Storage Room)*: Autonomous ultrasonic obstacle-avoiding vehicle, Bluetooth RC car, and 4-wheel Mecanum omnidirectional robot.

### Professional Experience & Honors
- **COFICAB** — Stagiaire Business Intelligence & Data (Août 2026)
- **Youth Yes We Care** — Formateur Robotique & Algorithmique (Juin 2024–présent)
- **TCPC (Tunisian Collegiate Programming Contest)** — Ranked 32 / 100 University Teams Nationally (Mars 2026)
- **Monopoly Hackathon (TBS)** — 1st Place Winner (Mai 2026)
- **ESEN HiVE Club** — Chef du Département Problem Solving (Septembre 2025–présent)
- **Elite Council Club** — Associé à l’Innovation Technique (Octobre 2024–Mai 2025)

---

## 📄 License
MIT License. Original game assets belong to their respective copyright holders. Educational & personal portfolio use.
