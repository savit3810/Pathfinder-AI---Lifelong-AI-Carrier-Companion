import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Bell, Flame, Target, TrendingUp, Zap, BookOpen, Calendar, ArrowUpRight, Brain, FileText, Bot, Compass, BarChart3, Briefcase, CheckCircle2, X } from 'lucide-react';
import { useAppStore, UserRole } from '@/lib/store';
import { examDeadlines, careerPaths } from '@/lib/careerData';
import { AreaChart, Area, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { StudentParentCodePanel } from '@/components/pages/ParentDashboard';

const skillRadarData = [
  { skill: 'Programming', current: 75, required: 90 },
  { skill: 'DSA', current: 50, required: 85 },
  { skill: 'System Design', current: 30, required: 80 },
  { skill: 'Databases', current: 65, required: 75 },
  { skill: 'Communication', current: 80, required: 70 },
  { skill: 'Problem Solving', current: 70, required: 85 },
];

const progressData = [
  { week: 'W1', xp: 200 },
  { week: 'W2', xp: 450 },
  { week: 'W3', xp: 600 },
  { week: 'W4', xp: 750 },
  { week: 'W5', xp: 1050 },
  { week: 'W6', xp: 1250 },
];

const trendingCareers = [
  { name: 'AI/ML Engineer', growth: 42 },
  { name: 'Cybersecurity', growth: 35 },
  { name: 'Data Scientist', growth: 28 },
  { name: 'Cloud Architect', growth: 25 },
  { name: 'Product Manager', growth: 18 },
];

const roleQuickActions: Record<UserRole, { label: string; icon: string; page: string }[]> = {
  class10: [
    { label: 'Stream Selector', icon: '🔬', page: 'career' },
    { label: 'Career DNA Quiz', icon: '🧬', page: 'quiz' },
    { label: 'Explore Careers', icon: '🧭', page: 'career' },
    { label: 'AI Mentor Chat', icon: '🤖', page: 'chatbot' },
  ],
  class12: [
    { label: 'Career Options', icon: '🎯', page: 'career' },
    { label: 'Entrance Exams', icon: '📅', page: 'journey' },
    { label: 'Career DNA Quiz', icon: '🧬', page: 'quiz' },
    { label: 'AI Mentor Chat', icon: '🤖', page: 'chatbot' },
  ],
  college: [
    { label: 'Analyze Resume', icon: '📄', page: 'resume' },
    { label: 'Skill Heatmap', icon: '📊', page: 'skills' },
    { label: 'Smart Roadmap', icon: '🗺️', page: 'roadmap' },
    { label: 'AI Mentor Chat', icon: '🤖', page: 'chatbot' },
  ],
  graduate: [
    { label: 'Mock Interview', icon: '🎤', page: 'interview' },
    { label: 'Job Readiness', icon: '💼', page: 'readiness' },
    { label: 'Analyze Resume', icon: '📄', page: 'resume' },
    { label: 'Career Sim', icon: '📈', page: 'simulation' },
  ],
  parent: [
    { label: 'View Progress', icon: '📊', page: 'journey' },
    { label: 'Career Options', icon: '🧭', page: 'career' },
    { label: 'Exam Calendar', icon: '📅', page: 'journey' },
    { label: 'AI Mentor Chat', icon: '🤖', page: 'chatbot' },
  ],
  admin: [
    { label: 'User Management', icon: '👥', page: 'admin-users' },
    { label: 'Speaker Sessions', icon: '🎤', page: 'admin-speakers' },
    { label: 'Conferences', icon: '📅', page: 'admin-conferences' },
    { label: 'Settings', icon: '⚙️', page: 'admin-settings' },
  ],
};

const roleMessages: Record<UserRole, string> = {
  class10: "Let's discover the perfect stream for your future! 🔬",
  class12: "Focus on entrance exams and career planning! 📚",
  college: "Build skills, internships & your portfolio! 🎓",
  graduate: "Time to land your dream job! Let's get you ready. 💼",
  parent: "Monitor your child's career journey progress. 👨‍👩‍👧",
  admin: "Welcome to the Admin Control Panel. Manage everything here. 🛡️",
};

export default function HomePage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const user = useAppStore((s) => s.user);
  const role = user?.role || 'college';
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // Compute streak from weeklyProgress
  const streak = Math.min(
    (user as any)?.weeklyProgress?.length || 1,
    7
  );

  const statCards = role === 'parent' ? [
    { label: 'Journey Progress', value: '65%', icon: Target, color: 'text-primary' },
    { label: 'Skills Tracked', value: '12', icon: Zap, color: 'text-accent' },
    { label: 'Quizzes Taken', value: '3', icon: Brain, color: 'text-info' },
    { label: 'Career Matches', value: '5', icon: Compass, color: 'text-warning' },
  ] : [
    { label: 'XP Points', value: `${user?.xp?.toLocaleString() || '1,250'}`, icon: Flame, color: 'text-warning' },
    { label: 'Skills Tracked', value: `${user?.skills?.length || 12}`, icon: Zap, color: 'text-primary' },
    { label: 'Job Readiness', value: `${user?.jobReadiness || 64}%`, icon: Target, color: 'text-accent' },
    { label: 'Badges Earned', value: `${user?.badges?.length || 3}`, icon: Award, color: 'text-info' },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {!dismissedBanner && role !== 'admin' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <Bell className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-foreground flex-1">
            🎯 <strong className="text-primary">New:</strong> Interview Simulator now has 4 round types with live timer & STAR scoring! 
            <button onClick={() => onNavigate('interview')} className="underline text-primary ml-1 hover:no-underline">Try it →</button>
          </p>
          <button onClick={() => setDismissedBanner(true)} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-card rounded-2xl p-8 border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-gradient-primary">{user?.name}</span> 👋
            </h1>
            <p className="text-muted-foreground">{roleMessages[role]}</p>
          </div>
          {/* Streak + Level badges */}
          {role !== 'admin' && role !== 'parent' && (
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                    <Flame key={i} className={`w-4 h-4 ${i < streak ? 'text-warning' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <span className="text-xs text-warning font-bold">{streak} Day Streak</span>
              </div>
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle2 className="w-5 h-5 text-primary mb-0.5" />
                <span className="text-xs text-primary font-bold">{(user?.xp || 0).toLocaleString()} XP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Parent Invite Code Panel — shows for students only */}
      <StudentParentCodePanel />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions - Role-adapted */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {roleQuickActions[role].map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.page)}
                className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/30 transition-all text-left group"
              >
                <span className="text-xl">{action.icon}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* XP Progress Chart */}
        {role !== 'parent' ? (
          <div className="bg-gradient-card rounded-xl p-6 border border-border">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> XP Progress
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis dataKey="week" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 8%)', border: '1px solid hsl(220, 14%, 16%)', borderRadius: '8px', color: 'hsl(210, 20%, 95%)' }} />
                <Area type="monotone" dataKey="xp" stroke="hsl(160, 84%, 44%)" fill="url(#xpGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-gradient-card rounded-xl p-6 border border-border">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Upcoming Exams
            </h2>
            <div className="space-y-3">
              {examDeadlines.slice(0, 4).map((exam) => (
                <div key={exam.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{exam.name}</p>
                    <p className="text-xs text-muted-foreground">{exam.category}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{exam.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Second row - Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        {role !== 'parent' && (
          <div className="bg-gradient-card rounded-xl p-6 border border-border">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" /> Skill Radar
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="hsl(220, 14%, 16%)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
                <Radar name="Current" dataKey="current" stroke="hsl(160, 84%, 44%)" fill="hsl(160, 84%, 44%)" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Required" dataKey="required" stroke="hsl(260, 70%, 60%)" fill="hsl(260, 70%, 60%)" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-primary" /> Your Skills
              </span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-accent" /> Target
              </span>
            </div>
          </div>
        )}

        {/* Trending Careers */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-warning" /> Trending Careers 2026
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendingCareers} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
              <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 8%)', border: '1px solid hsl(220, 14%, 16%)', borderRadius: '8px', color: 'hsl(210, 20%, 95%)' }} />
              <Bar dataKey="growth" fill="hsl(160, 84%, 44%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exam Deadlines (non-parent) */}
      {role !== 'parent' && (
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Upcoming Exams & Deadlines
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {examDeadlines.map((exam) => (
              <div key={exam.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{exam.category}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{exam.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" /> {role === 'parent' ? "Student's Badges" : 'Your Badges'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {(user?.badges || []).map((badge) => (
            <div key={badge} className="px-4 py-2 rounded-full bg-warning/10 border border-warning/20 text-sm text-foreground">
              {badge}
            </div>
          ))}
          <div className="px-4 py-2 rounded-full border border-dashed border-muted-foreground/30 text-sm text-muted-foreground">
            + {role === 'parent' ? 'Encourage more activity' : 'Complete quiz to earn more'}
          </div>
        </div>
      </div>
    </div>
  );
}
