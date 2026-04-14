import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Brain, Briefcase, CheckCircle2, ChevronRight,
  Copy, FileText, Info, Lightbulb, Target, TrendingUp,
  User, Shield, Zap, Calendar, Star, Clock, Link2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';


// ─── No Child Linked Screen ───────────────────────────────────────────────────
function NoChildLinkedScreen() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-gradient-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <Link2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">No Child Account Linked</h2>
          <p className="text-muted-foreground text-sm mb-4">
            It looks like your account wasn't linked to a child during sign-up. Please log out and sign up again using your child's invite code.
          </p>
          <div className="p-3 rounded-xl bg-info/5 border border-info/20 text-left">
            <p className="text-xs text-info flex items-start gap-2">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Your child can find their invite code on their PathFinder AI home dashboard (e.g. <strong>PF-ARYN-4821</strong>).
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Section Tab Bar ──────────────────────────────────────────────────────────
const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'careers', label: 'Careers', icon: Briefcase },
  { id: 'milestones', label: 'Milestones', icon: Calendar },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'insights', label: 'AI Insights', icon: Brain },
];

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const child = useAppStore((s) => s.childProfile)!;
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(child.parentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: 'Journey Progress', value: `${child.progressPercent}%`, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Resume Score', value: `${child.resumeScore}%`, icon: FileText, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Job Readiness', value: `${child.jobReadiness}%`, icon: Briefcase, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'XP Earned', value: child.xp.toLocaleString(), icon: Zap, color: 'text-info', bg: 'bg-info/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Child Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-card border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shrink-0">
            {child.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-foreground">{child.name}</h2>
            <p className="text-muted-foreground text-sm">{child.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                {child.stage}
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium flex items-center gap-1">
                <Target className="w-3 h-3" /> Goal: {child.careerGoal}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-muted-foreground">Invite Code</p>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-all font-mono text-sm text-foreground"
            >
              {child.parentCode}
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-gradient-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-gradient-card border border-border rounded-xl p-6">
        <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-warning" /> Earned Badges
        </h3>
        <div className="flex flex-wrap gap-3">
          {child.badges.map((b) => (
            <div key={b} className="px-4 py-2 rounded-full bg-warning/10 border border-warning/20 text-sm text-foreground">{b}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Progress Tab ─────────────────────────────────────────────────────────────
function ProgressTab() {
  const child = useAppStore((s) => s.childProfile)!;
  return (
    <div className="space-y-6">
      {/* Overall Progress Bar */}
      <div className="bg-gradient-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Overall Journey Progress
          </h3>
          <span className="text-2xl font-bold text-primary">{child.progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${child.progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Based on quiz completions, skill growth, and milestone progress</p>
      </div>

      {/* Weekly XP Chart */}
      <div className="bg-gradient-card border border-border rounded-xl p-6">
        <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Weekly XP Growth
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={child.weeklyProgress}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
            <XAxis dataKey="week" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 8%)', border: '1px solid hsl(220, 14%, 16%)', borderRadius: '8px', color: 'hsl(210, 20%, 95%)' }} />
            <Area type="monotone" dataKey="xp" stroke="hsl(160, 84%, 44%)" fill="url(#xpGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Skills Radar */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-card border border-border rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" /> Skill Levels
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={child.skills.map((s) => ({ skill: s.name, level: s.level }))}>
              <PolarGrid stroke="hsl(220, 14%, 16%)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} tick={false} axisLine={false} domain={[0, 100]} />
              <Radar name="Skill" dataKey="level" stroke="hsl(160, 84%, 44%)" fill="hsl(160, 84%, 44%)" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Bars */}
        <div className="bg-gradient-card border border-border rounded-xl p-6">
          <h3 className="font-display text-base font-semibold text-foreground mb-4">Skill Breakdown</h3>
          <div className="space-y-4">
            {child.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `hsl(${skill.level > 70 ? '160, 84%, 44%' : skill.level > 50 ? '45, 100%, 55%' : '0, 84%, 60%'})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Resume Tab ───────────────────────────────────────────────────────────────
function ResumeTab() {
  const child = useAppStore((s) => s.childProfile)!;
  const scoreColor = child.resumeScore >= 80 ? 'text-primary' : child.resumeScore >= 60 ? 'text-warning' : 'text-destructive';
  const scoreBg = child.resumeScore >= 80 ? 'bg-primary/10' : child.resumeScore >= 60 ? 'bg-warning/10' : 'bg-destructive/10';

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-gradient-card border border-border rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Circular Score */}
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(220, 14%, 16%)" strokeWidth="10" />
              <motion.circle
                cx="60" cy="60" r="50" fill="none"
                stroke={child.resumeScore >= 80 ? 'hsl(160, 84%, 44%)' : child.resumeScore >= 60 ? 'hsl(45, 100%, 55%)' : 'hsl(0, 84%, 60%)'}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - child.resumeScore / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{child.resumeScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Resume Score</h2>
            <p className="text-muted-foreground text-sm mt-1 mb-3">
              {child.resumeScore >= 80 ? 'Great resume! Minor tweaks recommended.' :
               child.resumeScore >= 60 ? 'Decent resume. Key improvements needed.' :
               'Resume needs significant improvement before applying.'}
            </p>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${scoreBg} border ${child.resumeScore >= 80 ? 'border-primary/20' : child.resumeScore >= 60 ? 'border-warning/20' : 'border-destructive/20'}`}>
              <FileText className={`w-3.5 h-3.5 ${scoreColor}`} />
              <span className={`text-sm font-medium ${scoreColor}`}>
                {child.resumeScore >= 80 ? 'Competitive' : child.resumeScore >= 60 ? 'Needs Work' : 'Urgent Attention'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Skills */}
      <div className="bg-gradient-card border border-border rounded-xl p-6">
        <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" /> Missing Skills (Gap Analysis)
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {child.missingSkills.map((skill) => (
            <div key={skill} className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/15">
              <div className="w-2 h-2 rounded-full bg-warning shrink-0" />
              <span className="text-sm text-foreground">{skill}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-info/5 border border-info/15">
          <p className="text-xs text-info flex items-start gap-2">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Encourage your child to take PathFinder's skill courses and add these to their resume.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Careers Tab ──────────────────────────────────────────────────────────────
function CareersTab() {
  const child = useAppStore((s) => s.childProfile)!;
  const barData = child.careerRecommendations.map((c) => ({ name: c.title, match: c.match }));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-card border border-border rounded-xl p-6">
        <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-accent" /> Career Match Chart
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
            <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 8%)', border: '1px solid hsl(220, 14%, 16%)', borderRadius: '8px', color: 'hsl(210, 20%, 95%)' }} />
            <Bar dataKey="match" fill="hsl(160, 84%, 44%)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {child.careerRecommendations.map((rec, i) => (
          <motion.div key={rec.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-gradient-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-display text-base font-semibold text-foreground">{rec.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rec.match >= 85 ? 'bg-primary/10 text-primary' : rec.match >= 75 ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'}`}>
                    {rec.match}% Match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </div>
              <div className="w-14 shrink-0">
                <div className="w-14 h-14 rounded-xl bg-primary/5 border border-primary/15 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-primary">{rec.match}</span>
                  <span className="text-[10px] text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 w-full h-1.5 bg-secondary rounded-full">
              <motion.div className="h-full rounded-full bg-gradient-primary" initial={{ width: 0 }} animate={{ width: `${rec.match}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Milestones Tab ───────────────────────────────────────────────────────────
function MilestonesTab() {
  const child = useAppStore((s) => s.childProfile)!;
  const statusConfig = {
    done: { label: 'Completed', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: CheckCircle2 },
    upcoming: { label: 'Upcoming', color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', icon: Clock },
    overdue: { label: 'Overdue', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20', icon: AlertTriangle },
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-card border border-border rounded-xl p-1 overflow-hidden">
        {child.milestones.map((m, i) => {
          const cfg = statusConfig[m.status];
          const Icon = cfg.icon;
          return (
            <motion.div key={m.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`flex items-center justify-between p-4 rounded-lg m-1 border ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${cfg.color} shrink-0`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                {cfg.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Alerts Tab ───────────────────────────────────────────────────────────────
function AlertsTab() {
  const child = useAppStore((s) => s.childProfile)!;
  const alertConfig = {
    warning: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: AlertTriangle },
    success: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: CheckCircle2 },
    info: { color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', icon: Info },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-foreground">Active Alerts ({child.alerts.length})</h3>
        <span className="text-xs text-muted-foreground">AI-generated insights for parents</span>
      </div>
      {child.alerts.map((alert, i) => {
        const cfg = alertConfig[alert.type];
        const Icon = cfg.icon;
        return (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-4 p-5 rounded-xl border ${cfg.bg} ${cfg.border}`}>
            <div className={`w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${cfg.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{alert.type} alert</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── AI Insights Tab ──────────────────────────────────────────────────────────
function InsightsTab() {
  const child = useAppStore((s) => s.childProfile)!;
  const { strengths, weaknesses, suggestions } = child.aiInsights;

  const Section = ({ title, items, color, icon: Icon }: {
    title: string; items: string[]; color: string; icon: React.ElementType
  }) => (
    <div className={`bg-gradient-card border border-border rounded-xl p-6`}>
      <h3 className={`font-display text-base font-semibold mb-4 flex items-center gap-2 ${color}`}>
        <Icon className="w-4 h-4" /> {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 text-sm text-foreground">
            <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-card border border-primary/20 rounded-xl p-5 flex items-center gap-4 bg-primary/5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">AI-Generated Parental Insight Report</p>
          <p className="text-xs text-muted-foreground">Powered by PathFinder AI • Updated based on latest student activity</p>
        </div>
      </div>

      <Section title="Strengths" items={strengths} color="text-primary" icon={CheckCircle2} />
      <Section title="Areas to Improve" items={weaknesses} color="text-destructive" icon={AlertTriangle} />
      <Section title="Suggestions for You to Share" items={suggestions} color="text-warning" icon={Lightbulb} />
    </div>
  );
}

// ─── Parent Code Panel (for students) ────────────────────────────────────────
export function StudentParentCodePanel() {
  const user = useAppStore((s) => s.user);
  const [copied, setCopied] = useState(false);
  if (!user || user.role === 'parent' || !user.parentCode) return null;

  const copy = () => {
    navigator.clipboard.writeText(user.parentCode!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-card border border-primary/20 rounded-xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Your Parent Invite Code</p>
          <p className="text-xs text-muted-foreground">Share with your parent to let them monitor your journey</p>
        </div>
      </div>
      <button onClick={copy}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border hover:border-primary/40 transition-all font-mono text-sm text-foreground shrink-0">
        <span className="tracking-widest">{user.parentCode}</span>
        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
    </div>
  );
}

// ─── Main Parent Dashboard ────────────────────────────────────────────────────
export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const childProfile = useAppStore((s) => s.childProfile);

  if (!childProfile) return <NoChildLinkedScreen />;


  const tabContent: Record<string, React.ReactNode> = {
    overview: <OverviewTab />,
    progress: <ProgressTab />,
    resume: <ResumeTab />,
    careers: <CareersTab />,
    milestones: <MilestonesTab />,
    alerts: <AlertsTab />,
    insights: <InsightsTab />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-card border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="relative z-10">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Parent Dashboard <span className="text-gradient-primary">– {childProfile.name}</span>
          </h1>
          <p className="text-muted-foreground text-sm">Monitoring your child's career journey · {childProfile.stage}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.id === 'alerts' && (
              <span className="ml-1 w-4 h-4 rounded-full bg-destructive text-white text-[9px] flex items-center justify-center font-bold">
                {childProfile.alerts.filter((a) => a.type === 'warning').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
