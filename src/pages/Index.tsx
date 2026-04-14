import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Landing from '@/components/Landing';
import AuthScreen from '@/components/AuthScreen';
import DashboardLayout from '@/components/DashboardLayout';
import HomePage from '@/components/pages/HomePage';
import JourneyPage from '@/components/pages/JourneyPage';
import CareerExplorer from '@/components/pages/CareerExplorer';
import CareerQuiz from '@/components/pages/CareerQuiz';
import SkillAnalysis from '@/components/pages/SkillAnalysis';
import RoadmapPage from '@/components/pages/RoadmapPage';
import ResumeAnalyzer from '@/components/pages/ResumeAnalyzer';
import InterviewSim from '@/components/pages/InterviewSim';
import JobReadiness from '@/components/pages/JobReadiness';
import CareerSimulation from '@/components/pages/CareerSimulation';
import CoursesPage from '@/components/pages/CoursesPage';
import ChatbotPage from '@/components/pages/ChatbotPage';
import ParentDashboard from '@/components/pages/ParentDashboard';
import AdminDashboard from '@/components/pages/AdminDashboard';
import SpeakerSessions from '@/components/pages/SpeakerSessions';
import ConferenceSessions from '@/components/pages/ConferenceSessions';
import MLIntelligence from '@/components/pages/MLIntelligence';

const Index = () => {
  const { isAuthenticated, user } = useAppStore();
  const [showAuth, setShowAuth] = useState(false);
  const [activePage, setActivePage] = useState('home');

  if (!isAuthenticated && !showAuth) {
    return <Landing onGetStarted={() => setShowAuth(true)} />;
  }

  if (!isAuthenticated && showAuth) {
    return <AuthScreen onBack={() => setShowAuth(false)} />;
  }

  // ── Admin routing ──
  if (user?.role === 'admin') {
    const adminDefaultPage = activePage.startsWith('admin-') ? activePage : 'admin-home';
    const adminPages: Record<string, React.ReactNode> = {
      'admin-home': <AdminDashboard section="overview" />,
      'admin-users': <AdminDashboard section="users" />,
      'admin-speakers': <AdminDashboard section="speakers" />,
      'admin-conferences': <AdminDashboard section="conferences" />,
      'admin-settings': <AdminDashboard section="settings" />,
    };

    const handleAdminNav = (page: string) => {
      if (page === 'home') setActivePage('admin-home');
      else setActivePage(page);
    };

    return (
      <DashboardLayout activePage={adminDefaultPage} onNavigate={handleAdminNav}>
        {adminPages[adminDefaultPage] || <AdminDashboard section="overview" />}
      </DashboardLayout>
    );
  }

  // ── Parent routing ──
  if (user?.role === 'parent') {
    const parentPages: Record<string, React.ReactNode> = {
      home: <ParentDashboard />,
      career: <CareerExplorer />,
      speakers: <SpeakerSessions />,
      conferences: <ConferenceSessions />,
      chatbot: <ChatbotPage />,
    };

    return (
      <DashboardLayout activePage={activePage} onNavigate={setActivePage}>
        {parentPages[activePage] || <ParentDashboard />}
      </DashboardLayout>
    );
  }

  // ── Student routing ──
  const studentPages: Record<string, React.ReactNode> = {
    home: <HomePage onNavigate={setActivePage} />,
    journey: <JourneyPage />,
    career: <CareerExplorer />,
    quiz: <CareerQuiz />,
    skills: <SkillAnalysis />,
    roadmap: <RoadmapPage />,
    resume: <ResumeAnalyzer />,
    interview: <InterviewSim />,
    readiness: <JobReadiness />,
    simulation: <CareerSimulation />,
    'ml-intelligence': <MLIntelligence />,
    courses: <CoursesPage />,
    speakers: <SpeakerSessions />,
    conferences: <ConferenceSessions />,
    chatbot: <ChatbotPage />,
  };

  return (
    <DashboardLayout activePage={activePage} onNavigate={setActivePage}>
      {studentPages[activePage] || <HomePage onNavigate={setActivePage} />}
    </DashboardLayout>
  );
};

export default Index;
