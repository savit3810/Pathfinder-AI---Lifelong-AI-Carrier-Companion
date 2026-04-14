import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, BookOpen, Bot, Brain, Briefcase, ChevronLeft, ChevronRight,
  Compass, FileText, Flame, Home, LineChart, LogOut, Map, Menu,
  Sparkles, Target, X, Zap, Users, Shield, Settings, Mic, Calendar,
  Activity, Bell, Cpu
} from 'lucide-react';
import { useAppStore, roleLabels } from '@/lib/store';

const allNavItems = [
  // Student + Parent pages
  { id: 'home', label: 'Dashboard', icon: Home, roles: ['class10', 'class12', 'college', 'graduate', 'parent'] },
  { id: 'journey', label: 'My Journey', icon: Map, roles: ['class10', 'class12', 'college', 'graduate'] },
  { id: 'career', label: 'Career Explorer', icon: Compass, roles: ['class10', 'class12', 'college', 'graduate', 'parent'] },
  { id: 'quiz', label: 'Career DNA Quiz', icon: Brain, roles: ['class10', 'class12', 'college', 'graduate'] },
  { id: 'skills', label: 'Skill Analysis', icon: BarChart3, roles: ['college', 'graduate'] },
  { id: 'roadmap', label: 'Roadmap', icon: Target, roles: ['class12', 'college', 'graduate'] },
  { id: 'resume', label: 'Resume Analyzer', icon: FileText, roles: ['college', 'graduate'] },
  { id: 'interview', label: 'Interview Sim', icon: Zap, roles: ['college', 'graduate'] },
  { id: 'readiness', label: 'Job Readiness', icon: Briefcase, roles: ['graduate'] },
  { id: 'simulation', label: 'Career Sim', icon: LineChart, roles: ['class12', 'college', 'graduate'] },
  { id: 'ml-intelligence', label: 'ML Intelligence', icon: Cpu, roles: ['class10', 'class12', 'college', 'graduate'] },
  { id: 'courses', label: 'Courses', icon: BookOpen, roles: ['class10', 'class12', 'college', 'graduate'] },
  { id: 'speakers', label: 'Speaker Sessions', icon: Mic, roles: ['class10', 'class12', 'college', 'graduate', 'parent'] },
  { id: 'conferences', label: 'Conferences', icon: Calendar, roles: ['class10', 'class12', 'college', 'graduate', 'parent'] },
  { id: 'chatbot', label: 'AI Mentor', icon: Bot, roles: ['class10', 'class12', 'college', 'graduate', 'parent'] },
  // Admin pages
  { id: 'admin-home', label: 'Overview', icon: Activity, roles: ['admin'] },
  { id: 'admin-users', label: 'User Management', icon: Users, roles: ['admin'] },
  { id: 'admin-speakers', label: 'Speaker Sessions', icon: Mic, roles: ['admin'] },
  { id: 'admin-conferences', label: 'Conferences', icon: Calendar, roles: ['admin'] },
  { id: 'admin-settings', label: 'System Settings', icon: Settings, roles: ['admin'] },
];

interface DashboardLayoutProps {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ activePage, onNavigate, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAppStore();

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role || 'college'));

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="font-display text-lg font-bold text-foreground truncate">PathFinder AI</span>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role + XP badge */}
      {(!collapsed || isMobile) && user && (
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-primary font-semibold truncate">{roleLabels[user.role]}</p>
            {user.role !== 'admin' && user.role !== 'parent' && (
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-warning" />
                <span className="text-xs text-warning font-bold">{(user.xp || 0).toLocaleString()} XP</span>
              </div>
            )}
          </div>
          {user.role === 'admin' && (
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">Full Access</span>
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              activePage === item.id
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-sidebar-border">
        {(!collapsed || isMobile) && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-sidebar-accent/50">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
          {(!collapsed || isMobile) && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors ml-auto text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border flex items-center gap-3 p-3 md:hidden">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent">
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold text-foreground">PathFinder AI</span>
        {user && user.role !== 'admin' && user.role !== 'parent' && (
          <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 border border-warning/20">
            <Flame className="w-3 h-3 text-warning" />
            <span className="text-xs text-warning font-bold">{(user.xp || 0).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-[280px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col md:hidden"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 flex-col overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 pt-14 md:pt-0 ${collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'}`}>
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
