# 🚀 Pathfinder AI: Lifelong AI Career Companion

Pathfinder AI is a state-of-the-art student lifecycle and career guidance platform designed to empower students through data-driven insights. By leveraging advanced machine learning models and intuitive visualizations, Pathfinder AI helps students navigate their educational journey and career transitions with confidence.

![Pathfinder AI Banner](https://images.unsplash.com/photo-1454165833767-027ffea10c4d?q=80&w=2070&auto=format&fit=crop)

## ✨ key Features

- **🤖 Predictive ML Pipeline**: 
  - **Salary Prediction**: Estimate future earning potential based on skill sets and academic performance.
  - **Success Prediction**: analyze the likelihood of success in different academic and professional domains.
- **📊 Interactive Dashboards**: 
  - **Student View**: Track progress, growth journey, and motivation levels.
  - **Parent/Senior View**: Monitor and mentor students through data-backed recommendations.
  - **Admin Dashboard**: Comprehensive overview of student performance and system health.
- **🤝 Senior Matching System**: Connect students with appropriate mentors and seniors based on domain alignment and expertise.
- **💬 AI Chatbot**: Real-time career guidance and query resolution powered by natural language processing.
- **📈 Advanced Visualizations**: Dynamic charts (using Recharts and Chart.js) to visualize student growth and predictive outcomes.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Visuals**: [Lucide Icons](https://lucide.dev/) & [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Motor](https://motor.readthedocs.io/) (Async driver)
- **Machine Learning**: [Scikit-learn](https://scikit-learn.org/), [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/savit3810/Pathfinder-AI---Lifelong-AI-Carrier-Companion.git
   cd Pathfinder-AI---Lifelong-AI-Carrier-Companion
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   ```

3. **Backend Setup**:
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start Backend**:
   ```bash
   cd api
   uvicorn index:app --reload
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
├── api/                # FastAPI Backend
│   ├── models/         # ML Pickled Models
│   ├── data/           # Training Datasets
│   ├── index.py        # Main API Entry Point
│   └── train_models.py # ML Pipeline Scripts
├── src/                # Frontend Source
│   ├── components/     # UI & Page Components
│   ├── hooks/          # Custom Hooks
│   ├── pages/          # Application Views
│   └── lib/            # Utilities & Store
├── public/             # Static Assets
└── index.html          # Frontend Entry
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit Pull Requests or open Issues to help improve Pathfinder AI.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built for excellence.* 🌟
