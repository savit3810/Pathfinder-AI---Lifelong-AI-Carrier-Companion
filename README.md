# 🚀 PathFinder AI — Lifelong AI Career Companion

<div align="center">

![PathFinder AI](https://img.shields.io/badge/PathFinder_AI-v2.0-emerald?style=for-the-badge&logo=sparkles&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**India's most comprehensive AI-powered student lifecycle and career guidance platform.**  
From Class 10 → Graduation → Dream Job — powered by ML, gamification, and real-time career intelligence.

[🌐 Live Demo](https://pathfinder-ai-beb6d1d0-main.vercel.app/) · [📖 Docs](#) · [🐛 Report Bug](https://github.com/savit3810/Pathfinder-AI---Lifelong-AI-Carrier-Companion/issues) · [✨ Request Feature](https://github.com/savit3810/Pathfinder-AI---Lifelong-AI-Carrier-Companion/issues)

</div>

---

## 📸 Screenshots

> Full-featured dark-mode dashboard with glassmorphism effects, animated charts, and real-time ML predictions.

| Student Dashboard | Resume Analyzer | Interview Simulator |
|:-:|:-:|:-:|
| XP + Skill Radar | ATS Score + Radar | Category Select + Timer |

---

## ✨ Key Features

### 🤖 AI & ML Intelligence
- **Salary Prediction** — ML model estimates earning potential based on skill set, role & experience
- **Career Success Predictor** — Scikit-learn pipeline for probability of academic/professional success
- **Stream Recommender** — For Class 10 students: Science/Commerce/Arts recommendation engine
- **AI Career Mentor Chatbot** — Role-aware conversational guidance on exams, jobs, salaries & skills

### 📊 Dashboards for Everyone
| Role | Access |
|---|---|
| 🎒 Class 10 Student | Stream selector, career explorer, AI chatbot, quiz |
| 📚 Class 11-12 Student | Entrance exam roadmap, career DNA quiz, ML predictions |
| 🎓 College Student | Resume analyzer, skill heatmap, interview sim, roadmap |
| 💼 Graduate / Job Seeker | Mock interviews, job readiness tracker, career simulation |
| 👨‍👩‍👧 Parent | Real-time child progress monitoring, AI insights, alerts |
| 🛡️ Admin | Full user management, speaker & conference management |

### 🏆 Gamification System
- **XP Points** — Earned for every action: quiz, chatbot, resume analysis
- **Level System** — Beginner → Explorer → Achiever → Champion → Legend
- **Badges & Achievements** — 12+ unlockable badges tracking real user progress
- **Monthly Challenges** — Dynamic goals refreshed each month
- **Leaderboard** — Compete with other students in your cohort

### 📄 Career Tools
- **Resume Analyzer** — ATS score, keyword audit, skill gap detection, radar chart visualization
- **Interview Simulator** — 4 categories (Behavioral/Technical/HR/System Design), countdown timer, STAR scoring
- **Career DNA Quiz** — Personality + aptitude assessment mapping to career paths
- **Skill Analysis** — Skill heatmap with benchmarks against industry requirements
- **Career Simulation** — 5-year financial projection for different career paths
- **Smart Roadmap Builder** — Milestone-based plans with deadline tracking

### 👨‍👩‍👧 Parent Portal
- Real-time child activity monitoring via unique invite codes
- AI-generated alerts, strengths, weaknesses & suggestions
- Career recommendation engine for parents
- Weekly progress charts and milestone tracking

### 🎓 Community Features
- **Speaker Sessions** — Book and manage sessions with industry experts
- **Conference Hub** — Virtual and in-person career conference calendar
- **AI Mentor** — 24/7 conversational guide with role-specific answers

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core framework |
| Vite | Build tool & dev server |
| Tailwind CSS + Shadcn UI | Styling & component library |
| Framer Motion | Animations & page transitions |
| Zustand | Global state management |
| Recharts | Interactive data visualizations |
| React Markdown | Chatbot message rendering |
| Lucide Icons | Icon system |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI (Python) | REST API framework |
| MongoDB + Motor | Async database |
| Scikit-learn | ML model training & inference |
| Pandas + NumPy | Data processing |
| Uvicorn | ASGI server |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB instance (local or Atlas)
- npm or bun

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/savit3810/Pathfinder-AI---Lifelong-AI-Carrier-Companion.git
cd Pathfinder-AI---Lifelong-AI-Carrier-Companion
```

### 2️⃣ Frontend Setup
```bash
npm install
npm run dev
# App runs on http://localhost:5173
```

### 3️⃣ Backend Setup
```bash
cd api
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn index:app --reload
# API runs on http://localhost:8000
```

### 4️⃣ Demo Login Credentials
| Role | Email | Password |
|---|---|---|
| 🛡️ Admin | savit.m.singh@slrtce.in | Savit@2006 |
| 🎓 Student | Register via Sign Up | Your choice |
| 👨‍👩‍👧 Parent | Register + child invite code | Your choice |

---

## 📂 Project Structure

```
pathfinder-ai/
├── api/                        # FastAPI Backend
│   ├── models/                 # Pickled ML models (.pkl)
│   ├── data/                   # Training datasets
│   ├── index.py               # Main API entry (700+ lines)
│   ├── train_models.py        # ML pipeline training scripts
│   └── requirements.txt
│
├── src/                        # React Frontend
│   ├── components/
│   │   ├── pages/             # 17+ page components
│   │   │   ├── HomePage.tsx          # Dashboard home with charts
│   │   │   ├── ChatbotPage.tsx       # AI Mentor chatbot
│   │   │   ├── ResumeAnalyzer.tsx    # ATS analyzer + radar chart
│   │   │   ├── InterviewSim.tsx      # 4-category Interview simulator
│   │   │   ├── AchievementsPage.tsx  # Leaderboard + badges
│   │   │   ├── MLIntelligence.tsx    # ML predictions dashboard
│   │   │   ├── AdminDashboard.tsx    # Full admin control panel
│   │   │   ├── ParentDashboard.tsx   # Child monitoring portal
│   │   │   ├── CareerSimulation.tsx  # 5-year financial projections
│   │   │   └── ...
│   │   ├── AuthScreen.tsx     # Multi-step auth with role selection
│   │   ├── DashboardLayout.tsx # Collapsible sidebar navigation
│   │   └── Landing.tsx        # Animated landing page
│   ├── lib/
│   │   ├── store.ts           # Zustand global state
│   │   └── careerData.ts      # Career paths, exam data
│   └── index.css              # Design system + animations
│
├── public/                    # Static assets
├── vercel.json               # Deployment config
└── index.html                # Entry point
```

---

## 🎮 Gamification System

```
XP Thresholds:
  0      → 500   XP  = 🟠 Beginner
  500    → 1500  XP  = 🔵 Explorer
  1500   → 3500  XP  = 🟢 Achiever
  3500   → 7000  XP  = 🟡 Champion
  7000+        XP  = 🟣 Legend
```

| Action | XP Reward |
|---|---|
| Account created | +10 XP |
| Resume analyzed | +50 XP |
| Interview completed | +75 XP |
| Career DNA quiz | +50 XP |
| Monthly challenge | +50–200 XP |

---

## 🏆 Built for Hackathons

PathFinder AI was designed with **national-level hackathon winning criteria** in mind:

- ✅ **Real-world problem** — Career guidance crisis for 250M+ Indian students
- ✅ **Novel AI/ML integration** — Custom trained salary & success prediction models
- ✅ **Complete product** — Auth, dashboards, analytics, gamification, admin portal
- ✅ **Multi-stakeholder** — Student, parent, admin all served from one platform
- ✅ **Production-ready** — Vercel-deployed frontend, FastAPI backend, environment configs

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
See our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork → Create branch → Commit → Push → Pull Request
git checkout -b feature/amazing-feature
git commit -m 'feat: add amazing feature'
git push origin feature/amazing-feature
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ for India's Students**

*PathFinder AI — Your career, your journey.* 🌟

⭐ Star this repo if PathFinder AI helped you find your path!

</div>
