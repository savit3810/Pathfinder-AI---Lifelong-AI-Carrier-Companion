import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Award, Target, Zap, Crown, ChevronUp, Lock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';

// ── Mock leaderboard ─────────────────────────────────────────────────────────
const leaderboard = [
  { rank: 1, name: 'Arjun Kapoor', xp: 9850, role: 'College Student', badge: '🥇', avatar: 'AK' },
  { rank: 2, name: 'Sneha Rao', xp: 8720, role: 'Graduate', badge: '🥈', avatar: 'SR' },
  { rank: 3, name: 'Riya Mehta', xp: 7640, role: 'College Student', badge: '🥉', avatar: 'RM' },
  { rank: 4, name: 'Vikram Nair', xp: 6200, role: 'Class 12', badge: '⭐', avatar: 'VN' },
  { rank: 5, name: 'Pooja Sharma', xp: 5800, role: 'Graduate', badge: '⭐', avatar: 'PS' },
  { rank: 6, name: 'Karan Gupta', xp: 4950, role: 'College Student', badge: '⭐', avatar: 'KG' },
  { rank: 7, name: 'Aanya Patel', xp: 4400, role: 'Class 10', badge: '⭐', avatar: 'AP' },
  { rank: 8, name: 'Dhruv Singh', xp: 3810, role: 'Class 12', badge: '⭐', avatar: 'DS' },
];

// ── Achievement definitions ───────────────────────────────────────────────────
const allAchievements = [
  { id: 'first_steps', title: 'First Steps', desc: 'Created your PathFinder AI account', icon: '🎉', xpReward: 10, category: 'onboarding', unlocked: true },
  { id: 'quiz_master', title: 'Quiz Master', desc: 'Complete the Career DNA Quiz', icon: '🧬', xpReward: 50, category: 'learning', unlocked: false },
  { id: 'resume_pro', title: 'Resume Pro', desc: 'Analyze your resume and score above 70', icon: '📄', xpReward: 50, category: 'career', unlocked: false },
  { id: 'interview_ready', title: 'Interview Ready', desc: 'Complete a full interview simulation', icon: '🎤', xpReward: 75, category: 'career', unlocked: false },
  { id: 'skill_seeker', title: 'Skill Seeker', desc: 'Add 5 or more skills to your profile', icon: '⚡', xpReward: 30, category: 'learning', unlocked: false },
  { id: 'streak_3', title: 'On Fire 🔥', desc: 'Log in 3 days in a row', icon: '🔥', xpReward: 40, category: 'engagement', unlocked: false },
  { id: 'streak_7', title: 'Week Warrior', desc: 'Maintain a 7-day activity streak', icon: '🗡️', xpReward: 100, category: 'engagement', unlocked: false },
  { id: 'career_explorer', title: 'Career Explorer', desc: 'Browse 10+ career paths', icon: '🧭', xpReward: 25, category: 'exploration', unlocked: false },
  { id: 'mentor_chat', title: 'AI Mentor Chat', desc: 'Send 10+ messages to the AI Mentor', icon: '🤖', xpReward: 30, category: 'engagement', unlocked: false },
  { id: 'roadmap_builder', title: 'Roadmap Builder', desc: 'Set and save your career roadmap', icon: '🗺️', xpReward: 40, category: 'planning', unlocked: false },
  { id: 'top_10', title: 'Rising Star', desc: 'Reach the top 10 on the leaderboard', icon: '🌟', xpReward: 200, category: 'achievement', unlocked: false },
  { id: 'perfect_interview', title: 'Perfect Round', desc: 'Score 90%+ in an interview simulation', icon: '💯', xpReward: 150, category: 'achievement', unlocked: false },
];

const categories = ['all', 'onboarding', 'learning', 'career', 'engagement', 'planning', 'achievement', 'exploration'];
const categoryLabels: Record<string, string> = {
  all: 'All', onboarding: '🚀 Onboarding', learning: '📚 Learning',
  career: '💼 Career', engagement: '🔥 Engagement', planning: '🗺️ Planning',
  achievement: '🏆 Achievements', exploration: '🧭 Exploration',
};

// ── Monthly challenges ────────────────────────────────────────────────────────
const monthlyChallenges = [
  { title: 'April Resume Rush', desc: 'Analyze your resume at least once this month', progress: 100, total: 1, icon: '📄', xp: 50, done: true },
  { title: 'Interview Blitz', desc: 'Complete 3 interview simulations', progress: 1, total: 3, icon: '🎤', xp: 150, done: false },
  { title: 'Chatbot Conversations', desc: 'Have 20 conversations with AI Mentor', progress: 7, total: 20, icon: '🤖', xp: 100, done: false },
  { title: 'Career Path Explorer', desc: 'View 5 different career paths', progress: 2, total: 5, icon: '🧭', xp: 75, done: false },
];

export default function AchievementsPage() {
  const user = useAppStore((s) => s.user);
  const [activeFilter, setActiveFilter] = useState('all');

  const userXP = user?.xp || 0;
  const userBadges = user?.badges || ['🌟 Early Adopter'];

  // Determine user rank
  const userRank = leaderboard.findIndex((l) => l.xp <= userXP);
  const effectiveRank = userRank === -1 ? leaderboard.length + 1 : userRank + 1;

  // Mark earned achievements
  const achievements = allAchievements.map((a) => ({
    ...a,
    unlocked: a.unlocked || (a.id === 'first_steps') ||
      (a.id === 'resume_pro' && (user?.resumeScore || 0) >= 70) ||
      (a.id === 'skill_seeker' && (user?.skills?.length || 0) >= 5),
  }));

  const filtered = activeFilter === 'all' ? achievements : achievements.filter((a) => a.category === activeFilter);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  const levelInfo = [
    { name: 'Beginner', min: 0, max: 500, color: 'text-muted-foreground' },
    { name: 'Explorer', min: 500, max: 1500, color: 'text-info' },
    { name: 'Achiever', min: 1500, max: 3500, color: 'text-primary' },
    { name: 'Champion', min: 3500, max: 7000, color: 'text-warning' },
    { name: 'Legend', min: 7000, max: Infinity, color: 'text-accent' },
  ];
  const level = levelInfo.find((l) => userXP >= l.min && userXP < l.max) || levelInfo[0];
  const nextLevel = levelInfo[levelInfo.indexOf(level) + 1];
  const levelProgress = nextLevel ? ((userXP - level.min) / (nextLevel.min - level.min)) * 100 : 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Achievements & Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Your progress, badges, and standing among all users</p>
      </div>

      {/* XP Level card */}
      <div className="bg-gradient-card rounded-2xl p-6 border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-display text-xl font-bold text-foreground">{user?.name}</p>
              <p className={`text-sm font-semibold ${level.color}`}>Level: {level.name}</p>
              <p className="text-xs text-muted-foreground">{userXP.toLocaleString()} XP total</p>
            </div>
          </div>
          <div className="flex-1 md:ml-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{level.name}</span>
              {nextLevel && <span className="text-muted-foreground">{nextLevel.name} — {nextLevel.min.toLocaleString()} XP</span>}
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-primary" initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }} transition={{ duration: 1 }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {nextLevel ? `${(nextLevel.min - userXP).toLocaleString()} XP to ${nextLevel.name}` : '🏆 Maximum Level Reached!'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-warning">{unlocked}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-primary">#{effectiveRank}</p>
              <p className="text-xs text-muted-foreground">Rank</p>
            </div>
          </div>
        </div>

        {/* Badge strip */}
        {userBadges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 relative z-10">
            {userBadges.map((b) => (
              <span key={b} className="px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-sm text-foreground">{b}</span>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard + Monthly Challenges */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-warning" /> Top Students This Month
          </h2>
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <motion.div key={entry.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  i < 3 ? 'bg-gradient-to-r from-warning/5 to-transparent border border-warning/10' : 'bg-secondary/30 border border-transparent hover:border-border'
                }`}>
                <span className="text-xl w-8 text-center">{entry.badge}</span>
                <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {entry.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </motion.div>
            ))}

            {/* Current user's rank */}
            <div className="mt-3 p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3">
              <Star className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">You — #{effectiveRank}</p>
                <p className="text-xs text-muted-foreground">{userXP.toLocaleString()} XP</p>
              </div>
              {effectiveRank > 1 && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>{(leaderboard[effectiveRank - 2]?.xp - userXP + 1).toLocaleString()} XP to climb</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Challenges */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" /> April Monthly Challenges
          </h2>
          <div className="space-y-4">
            {monthlyChallenges.map((ch) => (
              <div key={ch.title} className={`p-4 rounded-xl border transition-all ${ch.done ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary/20'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ch.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ch.title}</p>
                      <p className="text-xs text-muted-foreground">{ch.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-warning shrink-0 ml-2">+{ch.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div className={`h-full rounded-full ${ch.done ? 'bg-gradient-primary' : 'bg-warning/60'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((ch.progress / ch.total) * 100, 100)}%` }}
                      transition={{ duration: 0.8 }} />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {ch.done ? <CheckCircle2 className="w-4 h-4 text-primary inline" /> : `${ch.progress}/${ch.total}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements grid */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" /> All Achievements
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-bold">{unlocked}/{achievements.length}</span>
          </h2>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}>
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ach, i) => (
            <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                ach.unlocked
                  ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                  : 'border-border bg-secondary/20 opacity-60'
              }`}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  ach.unlocked ? 'bg-gradient-primary shadow-md' : 'bg-secondary'
                }`}>
                  {ach.unlocked ? ach.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${ach.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{ach.title}</p>
                  <p className="text-xs text-muted-foreground">{ach.desc}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Zap className="w-3 h-3 text-warning" />
                    <span className="text-xs text-warning font-medium">+{ach.xpReward} XP</span>
                    {ach.unlocked && <span className="ml-1 text-xs text-primary font-medium">✓ Earned</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
