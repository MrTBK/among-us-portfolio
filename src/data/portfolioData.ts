export interface Project {
  id: string;
  name: string;
  stationId: string;
  roomName: string;
  shortDescription: string;
  category: 'Data Engineering' | 'Business Intelligence' | 'Machine Learning' | 'Software & Mobile' | 'Robotics & AI';
  problem: string;
  solution: string;
  technologies: string[];
  architecture: string;
  keyFeatures: string[];
  metrics?: string;
  githubUrl?: string;
  demoUrl?: string;
  icon?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: {
    name: string;
    level: string;
    highlight?: boolean;
    description?: string;
  }[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  bullets: string[];
  technologies: string[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  specialization: string;
  period: string;
  location: string;
  details?: string[];
}

export interface CompetitionItem {
  title: string;
  roleOrRank: string;
  date: string;
  description: string;
  highlights: string[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    subtitle: string;
    location: string;
    email: string;
    phone: string;
    bio: string;
    resumeUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    avatarUrl: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  competitions: CompetitionItem[];
  skills: SkillCategory[];
  projects: Project[];
}

export const PORTFOLIO_DATA: PortfolioData = {
  personal: {
    name: "Mohamed Aziz Tabakh",
    title: "Business Intelligence Student & Data Developer",
    subtitle: "Robotics Trainer | Competitive Programmer | Problem Solver",
    location: "Tunis, Tunisia",
    email: "Mohamedaziz.tabakh@esen.tn",
    phone: "+216 56 597 139",
    bio: "Business Intelligence student at ESEN with strong expertise in Data Warehousing, automated ETL/ELT pipelines, SQL optimization, and analytical dashboards. Active competitive programmer (TCPC finalist) and robotics mentor combining deep algorithmic rigor with modern full-stack data solutions.",
    resumeUrl: "resume.pdf",
    githubUrl: "https://github.com/medaziztabakh",
    linkedinUrl: "https://linkedin.com/in/mohamed-aziz-tabakh",
    avatarUrl: "profile.jpg"
  },
  education: [
    {
      institution: "École Supérieure d’Économie Numérique (ESEN)",
      degree: "Licence en Informatique de Gestion",
      specialization: "Business Intelligence (BI)",
      period: "2024 – Présent",
      location: "La Manouba, Tunisie",
      details: [
        "Specialized in Dimensional Modeling, Data Warehousing, Advanced Databases & Business Analytics",
        "Active leader of the Problem Solving Department at HiVE Club"
      ]
    },
    {
      institution: "Lycée Mohamed Arbi Chammari",
      degree: "Baccalauréat en Sciences de l’Informatique",
      specialization: "Sciences de l’Informatique",
      period: "2024",
      location: "Tunisie",
      details: [
        "Focus on algorithms, computer architectures, and software logic"
      ]
    }
  ],
  experience: [
    {
      company: "COFICAB",
      role: "Stagiaire – Business Intelligence & Data",
      period: "Août 2026 – Août 2026",
      location: "Tunis, Tunisie",
      description: "End-to-end data pipeline development, data quality architecture, and executive business intelligence modeling for automotive wiring and cabling data.",
      bullets: [
        "Developed automated ETL pipelines with Python and SSIS to extract, clean, and load complex multi-source Excel sheets into SQL Server.",
        "Engineered a quarantine zone for strict data quality control, automated schema validation, and real-time flow monitoring.",
        "Modeled a Star Schema Data Warehouse in SSMS optimized for analytical query performance and dimensional reporting.",
        "Built a Full-Stack management platform integrating interactive Power BI dashboards and an enterprise AI assistant for automated data insights."
      ],
      technologies: ["Python", "SQL Server", "SSIS", "SSMS", "Power BI", "ETL", "Data Quality", "Star Schema"],
      imageUrl: "coficab.png",
      imageCaption: "COFICAB — Star Schema DWH & Executive Business Intelligence Platform"
    },
    {
      company: "Youth Yes We Care",
      role: "Formateur Robotique & Algorithmique",
      period: "Juin 2024 – Présent",
      location: "Tunis, Tunisie",
      description: "Mentoring young innovators and students in embedded systems, electronics prototyping, and algorithmic problem-solving.",
      bullets: [
        "Conducted hands-on training workshops in Arduino programming, sensory circuits, and C/C++ embedded logic.",
        "Prepared and coached university and high school student teams for local and regional educational robotics competitions.",
        "Designed structured project-based curriculums covering motor drivers, ultrasonic telemetry, and wireless robotics control."
      ],
      technologies: ["Arduino", "C++", "C", "Electronics", "Sensors", "Embedded Systems", "Robotics"],
      imageUrl: "competitions/bee-battle.jpg",
      imageCaption: "Bee Battle Robotics Tournament Mentorship & Prototyping"
    }
  ],
  competitions: [
    {
      title: "TCPC — Tunisian Collegiate Programming Contest",
      roleOrRank: "Ranked 32 / 100 National University Teams",
      date: "Mars 2026",
      description: "Tunisia's premier competitive programming championship and the official qualifying contest for ACPC (Arab & Africa Collegiate Programming Championship) and ICPC.",
      highlights: [
        "Solved complex algorithmic and discrete mathematical problems in C++ under real-time contest pressure.",
        "Ranked 32nd out of 100 top university teams across Tunisia.",
        "High-performance implementations involving graphs, dynamic programming, and data structures."
      ],
      imageUrl: "competitions/tcpc-2026.jpg",
      imageCaption: "TCPC 2026 National Finalists — Ranked 32 / 100 Nationwide"
    },
    {
      title: "Monopoly Hackathon — TBS (Tunis Business School)",
      roleOrRank: "1st Place Winner (Lauréat)",
      date: "Mai 2026",
      description: "Prestigious technological innovation hackathon evaluated on strategic technological architecture, execution feasibility, and technical prowess.",
      highlights: [
        "Ranked 1st place among all participating collegiate teams.",
        "Architected an innovative technological solution uniting data engineering and real-world business strategy."
      ],
      imageUrl: "competitions/monopoly-hackathon.jpg",
      imageCaption: "TBS Monopoly Hackathon — 1st Place Champion Team"
    },
    {
      title: "ESEN HiVE Club",
      roleOrRank: "Chef du Département Problem Solving",
      date: "Septembre 2025 – Présent",
      description: "Leading the competitive programming and algorithmic coaching department at ESEN.",
      highlights: [
        "Organized and coached students in competitive problem solving and time-efficient implementations.",
        "Delivered specialized workshops preparing club members for online Codeforces rounds."
      ],
      imageUrl: "competitions/esen-hive-contest.jpg",
      imageCaption: "HiVE Problem Solving Coaching & Team Contests at ESEN"
    },
    {
      title: "CodeX Problem Solving Tournament",
      roleOrRank: "Competitive Programming Finalist",
      date: "2025",
      description: "Inter-collegiate programming contest challenging participants with real-time algorithmic problem sets, time complexity optimization, and data structures.",
      highlights: [
        "Solved complex algorithmic challenges under strict live contest conditions.",
        "Applied optimal Big-O time and space complexity algorithms."
      ],
      imageUrl: "competitions/codex-cp.jpg",
      imageCaption: "CodeX Algorithmic Problem Solving Challenge"
    },
    {
      title: "Winter Cup Problem Solving Championship",
      roleOrRank: "Competitive Programming Finalist",
      date: "2025",
      description: "Prestigious algorithmic tournament focusing on advanced data structures, computational logic, dynamic programming, and combinatorial search.",
      highlights: [
        "Competed in multi-hour problem solving sprint against university teams.",
        "Advanced discrete mathematics and graph theory implementations."
      ],
      imageUrl: "competitions/winter-cup.jpg",
      imageCaption: "Winter Cup Competitive Programming Championship"
    },
    {
      title: "Bee Battle National Robotics Competition",
      roleOrRank: "Robotics Trainer & Mentor (Youth Yes We Care)",
      date: "2025",
      description: "National robotics engineering contest pitting autonomous and teleoperated robots against challenging arena obstacle courses.",
      highlights: [
        "Coached student engineering teams in Arduino C/C++ embedded programming.",
        "Supervised microcontroller circuits, sensory feedback routines, and motor driver PWM control loops."
      ],
      imageUrl: "competitions/bee-battle.jpg",
      imageCaption: "Bee Battle National Robotics Competition Arena"
    },
    {
      title: "Elite Council Club",
      roleOrRank: "Associé à l’Innovation Technique",
      date: "Octobre 2024 – Mai 2025",
      description: "Managing technical operations, software infrastructure, and logistics.",
      highlights: [
        "Supervised hardware setups and technical software environments for student events and hackathons."
      ]
    }
  ],
  skills: [
    {
      category: "Business Intelligence & Data",
      icon: "📊",
      skills: [
        { name: "Dimensional Modeling", level: "Advanced", highlight: true, description: "Star Schema, Snowflake Schema, Conformed Dimensions, Fact Tables" },
        { name: "Data Warehousing", level: "Advanced", highlight: true, description: "SSMS, Enterprise DWH Design, Historical Data Management" },
        { name: "ETL / ELT Pipelines", level: "Advanced", highlight: true, description: "Python, SSIS, Automated Ingestion, Data Transformation" },
        { name: "Data Quality Assurance", level: "Advanced", highlight: true, description: "Quarantine Zones, Validation Rules, Anomaly Detection" },
        { name: "Performance Analysis", level: "Advanced", highlight: false, description: "Query Optimization, Indexing Strategies, Execution Plans" },
        { name: "Data Marts", level: "Intermediate", highlight: false, description: "Departmental Analytics, Optimized Data Aggregation" }
      ]
    },
    {
      category: "Databases & BI Tools",
      icon: "🗄️",
      skills: [
        { name: "SQL Server (SSMS)", level: "Advanced", highlight: true, description: "Stored Procedures, T-SQL, DWH Hosting, Performance Tuning" },
        { name: "Power BI", level: "Advanced", highlight: true, description: "DAX, Power Query (M), Interactive Dashboards, Data Storytelling" },
        { name: "SSIS", level: "Advanced", highlight: true, description: "Control Flow, Data Flow Transformations, Batch Package Automation" },
        { name: "PostgreSQL", level: "Intermediate", highlight: true, description: "Relational Modeling, Analytical Queries, JSONB Data" },
        { name: "MySQL & SQLite", level: "Intermediate", highlight: false, description: "Local Storage, Mobile Offline Datasets, Operational DBs" },
        { name: "Oracle XE", level: "Intermediate", highlight: false, description: "PL/SQL, Relational Structures, Enterprise Concepts" }
      ]
    },
    {
      category: "Programming Languages",
      icon: "💻",
      skills: [
        { name: "SQL", level: "Advanced", highlight: true, description: "Complex Joins, Window Functions, CTEs, Aggregations, DDL/DML" },
        { name: "Python", level: "Advanced", highlight: true, description: "Pandas, NumPy, Scikit-learn, Automated ETL, Data Scripting" },
        { name: "C++", level: "Advanced", highlight: true, description: "Competitive Programming (TCPC), STL, Memory Efficiency, High Speed" },
        { name: "C", level: "Intermediate", highlight: false, description: "Pointers, Embedded Systems, Low-level Memory Operations" },
        { name: "JavaScript", level: "Intermediate", highlight: false, description: "ES6+, DOM Manipulation, Asynchronous Programming, Web Apps" },
        { name: "PHP", level: "Intermediate", highlight: false, description: "Server-side Scripting, Database Backend Connectivity" }
      ]
    },
    {
      category: "Web & DevOps Tools",
      icon: "⚙️",
      skills: [
        { name: "Linux / Bash", level: "Intermediate", highlight: true, description: "Command Line Automation, Shell Scripting, Cron, System Administration" },
        { name: "Docker", level: "Intermediate", highlight: true, description: "Containerization, Environment Reproducibility, Multi-stage Builds" },
        { name: "Flask", level: "Intermediate", highlight: false, description: "Python Web APIs, RESTful Endpoints, Microservices" },
        { name: "Angular", level: "Intermediate", highlight: false, description: "Component Architecture, TypeScript, Enterprise Web Frontends" },
        { name: "Git & GitHub", level: "Advanced", highlight: true, description: "Version Control, Branching Workflows, Collaborative Repositories" },
        { name: "Arduino / Embedded", level: "Advanced", highlight: false, description: "Microcontroller Logic, PWM, Sensor Interfacing, Robotics" }
      ]
    }
  ],
  projects: [
    {
      id: "supplychain-iq",
      name: "SupplyChainIQ",
      stationId: "upper_engine",
      roomName: "Upper Engine",
      shortDescription: "End-to-end supply-chain intelligence and inventory management platform with demand forecasting and risk analysis.",
      category: "Business Intelligence",
      problem: "Traditional supply chain departments struggle with fragmented inventory spreadsheets, untracked supplier delivery delays, unexpected stock-outs, and a lack of unified logistical risk visibility.",
      solution: "Engineered an end-to-end decision support platform featuring automated ETL ingestion, a modeled Star Schema Data Warehouse, interactive analytical dashboards, demand forecasting, and a secure administration web interface.",
      technologies: ["Python", "SQL Server", "Power BI", "SSIS", "Flask", "Data Warehousing", "ETL"],
      architecture: "Multi-tier BI Architecture: Multi-source Excel/ERP Ingestion -> Python/SSIS ETL Data Cleaning & Transformation -> SQL Server Star Schema Data Warehouse (Fact_Inventory, Dim_Supplier, Dim_Product, Dim_Time, Dim_Warehouse) -> Power BI Executive Dashboards & Web Admin Portal.",
      keyFeatures: [
        "Automated stock level tracking and reorder point threshold alerts",
        "Supplier scorecard monitoring delivery timeliness and defect rates",
        "Demand forecasting to preempt critical stock-out scenarios",
        "Logistical risk analysis quantifying lead-time volatility",
        "Secure web administration portal for inventory managers"
      ],
      metrics: "End-to-end multi-source ingestion pipeline with automated data validation",
      githubUrl: "https://github.com/medaziztabakh/SupplyChainIQ",
      imageUrl: "supplychainiq.png",
      imageCaption: "SupplyChainIQ — End-to-End Logistical BI & Demand Forecasting System"
    },
    {
      id: "dataforge",
      name: "DataForge",
      stationId: "electrical",
      roomName: "Electrical Room",
      shortDescription: "Production-style data engineering platform featuring automated ELT/ETL pipelines, data quality checks, and pipeline monitoring.",
      category: "Data Engineering",
      problem: "Raw enterprise data flows are prone to schema drift, corrupt records, silent pipeline failures, and unmonitored data ingestion crashes.",
      solution: "Built a production-grade data engineering framework with automated pipeline orchestration, schema contracts, quarantine error buffers, and observability logging.",
      technologies: ["Python", "PostgreSQL", "Docker", "Linux", "SQL", "Data Quality"],
      architecture: "Raw Storage Ingestion -> Extraction & Type Validation -> Quarantine Isolation Layer for Corrupt Records -> Transformation & Normalization Engine -> Analytical Data Warehouse Marts -> Execution Metrics Dashboard.",
      keyFeatures: [
        "Automated pipeline scheduling and fault-tolerant retry workflows",
        "Isolation quarantine zone capturing non-compliant data payloads",
        "Custom data quality verification rules (null checks, range constraints, duplicate detection)",
        "Dockerized environment ensuring reproducible execution across Linux servers",
        "Detailed pipeline telemetry and runtime logging"
      ],
      metrics: "Automated quarantine isolation layer preventing corrupt records from entering analytical stores",
      githubUrl: "https://github.com/medaziztabakh/DataForge",
      imageUrl: "dataforge.png",
      imageCaption: "DataForge — Automated Data Pipeline & Quarantine Architecture"
    },
    {
      id: "churnlab",
      name: "ChurnLab",
      stationId: "reactor",
      roomName: "Reactor Room",
      shortDescription: "Production-style customer churn prediction and MLOps platform with experiment tracking and drift analysis.",
      category: "Machine Learning",
      problem: "Subscription and service businesses lose valuable customers without advance warning because predictive ML models are rarely deployed to production or monitored for feature drift.",
      solution: "Designed a production-style machine learning and MLOps architecture that trains predictive churn models, tracks experimentation iterations, flags model drift, and provides role-based actionable retention recommendations.",
      technologies: ["Python", "Scikit-Learn", "Flask", "PostgreSQL", "MLOps", "Pandas"],
      architecture: "Data Ingestion & Feature Engineering Pipeline -> ML Model Training & Hyperparameter Tuning -> Experiment Metrics Tracking -> Drift Detection Engine -> Flask REST API Inference Service -> Role-Based Dashboard.",
      keyFeatures: [
        "Customer churn probability scoring with explainable feature importance",
        "Model drift monitoring over time against new operational datasets",
        "Role-based workflows separating data scientists and retention officers",
        "Automated feature transformation and categorical encoding pipelines"
      ],
      metrics: "Production-ready inference pipeline with real-time churn risk classification",
      githubUrl: "https://github.com/medaziztabakh/ChurnLab"
    },
    {
      id: "salespulse",
      name: "SalesPulse",
      stationId: "admin",
      roomName: "Admin Room",
      shortDescription: "Commercial performance decision support platform with dimensional DWH modeling and interactive Power BI dashboards.",
      category: "Business Intelligence",
      problem: "Sales leadership requires immediate insight into product margins, regional revenue performance, and historical sales trends without querying transactional production databases.",
      solution: "Modeled a dedicated dimensional Star Schema Data Warehouse, automated data cleansing workflows, and delivered executive Power BI dashboards with DAX calculations.",
      technologies: ["Power BI", "SQL Server", "SSMS", "DAX", "Data Modeling", "ETL"],
      architecture: "Transactional Sales DB -> Automated Cleansing & ETL -> Star Schema DWH (Fact_Sales, Dim_Customer, Dim_Region, Dim_Product, Dim_Date) -> Power BI DAX Metrics Model -> Interactive Visual Dashboards.",
      keyFeatures: [
        "Executive KPI tracking: YoY growth, profit margins, sales velocity, and regional breakdown",
        "Dynamic DAX time-intelligence calculations (MTD, QTD, YTD comparisons)",
        "Interactive drill-through by product family, store location, and sales representative",
        "Clean, automated data transformation preventing inconsistent pricing data"
      ],
      metrics: "Comprehensive dimensional model supporting sub-second drill-through analytics",
      githubUrl: "https://github.com/medaziztabakh/SalesPulse"
    },
    {
      id: "customer360",
      name: "Customer360",
      stationId: "cockpit",
      roomName: "Navigation / Cockpit",
      shortDescription: "Unified Customer 360° analytics and segmentation platform for behavioral and lifetime value modeling.",
      category: "Business Intelligence",
      problem: "Disparate customer touchpoints create siloed information, hindering effective customer retention, personalization, and lifetime value calculation.",
      solution: "Engineered an analytical customer data hub consolidating interactions, purchases, and support logs into unified customer profiles and RFM segmentation models.",
      technologies: ["Python", "SQL", "PostgreSQL", "Power BI", "Data Modeling"],
      architecture: "Multi-Source Extraction -> Entity Resolution & Deduplication -> Analytical Customer Data Store -> RFM Segmentation Modeling -> BI Visualization.",
      keyFeatures: [
        "Unified 360° customer behavioral profiles",
        "RFM (Recency, Frequency, Monetary) segmentation",
        "Customer lifetime value (CLV) estimation indicators",
        "Exportable cohorts for targeted communication campaigns"
      ],
      metrics: "Unified profile consolidation across multiple historical transaction feeds",
      githubUrl: "https://github.com/medaziztabakh/Customer360",
      imageUrl: "catemer360.png",
      imageCaption: "Customer360 — Customer Lifetime Value & RFM Behavioral Segmentation"
    },
    {
      id: "masroufi",
      name: "Masroufi (مصروفي)",
      stationId: "medbay",
      roomName: "Medbay",
      shortDescription: "Private offline-first personal finance mobile application for Tunisia with local SQLite storage.",
      category: "Software & Mobile",
      problem: "Many personal finance apps require cloud sync, expose sensitive financial data, or fail when users have unstable mobile network connectivity in Tunisia.",
      solution: "Built a 100% offline-first, private personal finance mobile application designed specifically for the Tunisian context, running locally on SQLite.",
      technologies: ["JavaScript", "SQLite", "Mobile UI", "CSS3", "Offline-First"],
      architecture: "Client Application UI -> Local SQLite Storage Engine -> Private Data Encryption -> Multilingual Locale Provider (Arabic & French) -> Budget Analytics Engine.",
      keyFeatures: [
        "100% offline operation ensuring total financial privacy",
        "Localized Tunisian Dinar currency and expense categorization",
        "Multilingual interface supporting Arabic and French",
        "Interactive monthly budget progress indicators and spending summaries",
        "Zero tracking and zero remote cloud dependencies"
      ],
      metrics: "Zero cloud dependencies with instant local query execution on SQLite",
      githubUrl: "https://github.com/medaziztabakh/Masroufi",
      imageUrl: "masroufi.png",
      imageCaption: "Masroufi (مصروفي) — Offline-First Private Mobile Personal Finance Platform"
    },
    {
      id: "maintiq",
      name: "MaintIQ",
      stationId: "lower_engine",
      roomName: "Lower Engine",
      shortDescription: "Industrial maintenance analytics and equipment failure KPI tracking platform.",
      category: "Business Intelligence",
      problem: "Manufacturing plants suffer unplanned downtime due to reactive maintenance strategies and lack of failure rate metrics.",
      solution: "Engineered an industrial maintenance analytics system tracking operational KPIs, failure frequencies, and predictive maintenance schedules.",
      technologies: ["Python", "SQL", "Power BI", "Data Analytics"],
      architecture: "Sensor/Log Ingestion -> Failure Metric Computation -> Relational Storage -> Maintenance KPI Reporting Dashboard.",
      keyFeatures: [
        "MTBF (Mean Time Between Failures) and MTTR (Mean Time to Repair) tracking",
        "Critical equipment risk classification",
        "Preventive maintenance scheduling recommendations",
        "Downtime cost impact visualization"
      ],
      metrics: "Actionable equipment failure tracking with MTBF and MTTR analytics",
      githubUrl: "https://github.com/medaziztabakh/MaintIQ"
    },
    {
      id: "shadow-code",
      name: "Shadow Code",
      stationId: "security",
      roomName: "Security Room",
      shortDescription: "Full chess game engine with Deep Reinforcement Learning AI and multiplayer Pygame GUI.",
      category: "Robotics & AI",
      problem: "Implementing chess requires handling complex game-state branching, legal move generation, and training an intelligent agent without massive compute clusters.",
      solution: "Developed a comprehensive chess game with AI powered by deep reinforcement learning, complex state management, and real-time multiplayer graphical interface.",
      technologies: ["Python", "Pygame", "Reinforcement Learning", "Algorithms", "Game AI"],
      architecture: "Board State Representation Engine -> Deep RL Policy & Value Network -> Minimax Search with Alpha-Beta Pruning -> Pygame Event & Render Loop.",
      keyFeatures: [
        "Complete chess rule engine (castling, en passant, pawn promotion, checkmate)",
        "Deep reinforcement learning decision-making algorithms",
        "Real-time local multiplayer and human-vs-AI gameplay modes",
        "Optimized graphical interface with move validation and state history"
      ],
      metrics: "Custom Pygame interface with complete legal move validation and RL decision model",
      githubUrl: "https://github.com/medaziztabakh/ShadowCode"
    },
    {
      id: "arduino-robotics",
      name: "Arduino Robotics Suite",
      stationId: "storage",
      roomName: "Storage Room",
      shortDescription: "Embedded robotics suite including autonomous obstacle-avoidance car, Bluetooth RC vehicle, and Mecanum omnidirectional robot.",
      category: "Robotics & AI",
      problem: "Robotics requires synchronizing microcontroller timing, ultrasonic sensor feedback, motor PWM drivers, and wireless communication.",
      solution: "Engineered three complete robotic prototypes: Bluetooth smartphone-controlled vehicle, autonomous obstacle-avoiding vehicle, and a 4-wheel Mecanum omnidirectional robot.",
      technologies: ["Arduino", "C++", "C", "Ultrasonic Sensors", "Bluetooth RF", "Motor Drivers"],
      architecture: "Sensor Input Layer (Ultrasonic/RF) -> Arduino Microcontroller Processing & Closed-Loop Control -> Motor Driver H-Bridge Output -> Omni/Differential Drive Movement.",
      keyFeatures: [
        "Autonomous obstacle-avoiding vehicle using ultrasonic telemetry and real-time decision steering",
        "Wireless Bluetooth RC car controlled via mobile application commands",
        "Mecanum wheel omnidirectional robot executing 360-degree vector translation and rotation",
        "Custom motor driver integration and power distribution"
      ],
      metrics: "3 physical working robotic prototypes built and deployed for educational mentoring",
      githubUrl: "https://github.com/medaziztabakh/ArduinoRobotics"
    },
    {
      id: "bookcycle",
      name: "BookCycle Tunisia",
      stationId: "comms",
      roomName: "Communications",
      shortDescription: "Full-stack web platform enabling textbook sharing and academic peer exchange across universities.",
      category: "Software & Mobile",
      problem: "University textbooks are expensive and often discarded after single semesters while junior students search for affordable study materials.",
      solution: "Created a full-stack student-centric textbook exchange platform connecting university students for book sharing, trading, and recycling.",
      technologies: ["JavaScript", "PHP", "MySQL", "HTML5/CSS3", "REST"],
      architecture: "Web Frontend -> PHP Backend API Services -> MySQL Relational Database -> Authentication & Book Listing Search.",
      keyFeatures: [
        "Search and filter by university, major, and course module",
        "Direct peer messaging and exchange status tracking",
        "Responsive student marketplace UI"
      ],
      metrics: "Collaborative academic book-sharing platform for Tunisian students",
      githubUrl: "https://github.com/medaziztabakh/BookCycle-Tunisia",
      imageUrl: "bookcycle.jpg",
      imageCaption: "BookCycle Tunisia — Collegiate Textbook Sharing & Peer Exchange Platform"
    },
    {
      id: "peer-finder",
      name: "Peer Finder",
      stationId: "weapons",
      roomName: "Weapons Room",
      shortDescription: "Student collaboration matching tool with skill-based affinity algorithms for academic projects.",
      category: "Software & Mobile",
      problem: "Students struggle to find compatible teammates with complementary technical skillsets for hackathons and academic capstones.",
      solution: "Developed an intuitive matching application pairing students based on skills, project interests, and availability.",
      technologies: ["JavaScript", "HTML5", "CSS3", "Matching Algorithms"],
      architecture: "Frontend SPA -> Skill Vectorization -> Euclidean Affinity Calculation -> Candidate Match Ranking.",
      keyFeatures: [
        "Skill vector and interest tagging",
        "Affinity score ranking algorithm",
        "Responsive project team formation interface"
      ],
      metrics: "Skill-affinity matching engine for collegiate project collaboration",
      githubUrl: "https://github.com/medaziztabakh/PeerFinder"
    }
  ]
};
