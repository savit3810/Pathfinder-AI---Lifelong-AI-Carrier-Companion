import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const categories = [
  { name: 'Resume Quality', score: 72, icon: '📄', tip: 'Add more quantified achievements' },
  { name: 'Technical Skills', score: 65, icon: '⚡', tip: 'Focus on DSA and System Design' },
  { name: 'Soft Skills', score: 80, icon: '💬', tip: 'Great communication skills!' },
  { name: 'Interview Prep', score: 45, icon: '🎤', tip: 'Practice mock interviews daily' },
  { name: 'Portfolio', score: 55, icon: '🎨', tip: 'Add 2-3 more projects' },
  { name: 'Networking', score: 30, icon: '🤝', tip: 'Connect with 50+ professionals' },
];

const radarData = categories.map((c) => ({ subject: c.name, score: c.score, fullMark: 100 }));

const actionPlan = [
  { week: 'Week 1-2', tasks: ['Optimize resume with keywords', 'Complete 2 LeetCode problems/day'], priority: 'high' },
  { week: 'Week 3-4', tasks: ['Build portfolio project', 'Practice mock interviews'], priority: 'high' },
  { week: 'Week 5-6', tasks: ['Network on LinkedIn', 'Apply to 20+ positions'], priority: 'medium' },
  { week: 'Week 7-8', tasks: ['System design practice', 'Attend virtual meetups'], priority: 'medium' },
];

export default function JobReadiness() {
  const overallScore = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Job Readiness Tracker</h1>
        <p className="text-muted-foreground mt-1">Track your readiness across all dimensions</p>
      </div>

      {/* Big Score + Radar */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-card rounded-2xl p-8 border border-border text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
          <div className="relative z-10">
            <p className="text-muted-foreground mb-4">You are</p>
            <div className="relative w-44 h-44 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
                <motion.circle
                  cx="50" cy="50" r="42" stroke="url(#readinessGradient)" strokeWidth="6" fill="none"
                  strokeLinecap="round" strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * overallScore) / 100 }}
                  transition={{ duration: 1.5 }}
                />
                <defs>
                  <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-5xl font-bold text-foreground">{overallScore}%</span>
                <span className="text-sm text-muted-foreground">Job Ready</span>
              </div>
            </div>
            <p className="text-lg font-display font-semibold text-foreground">
              {overallScore >= 75 ? '🚀 Almost there! Keep going!' : overallScore >= 50 ? '💪 Good progress. Focus on weak areas.' : '🌱 Just getting started. You got this!'}
            </p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-gradient-card rounded-2xl p-8 border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Readiness Radar</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220, 14%, 16%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="hsl(160, 84%, 44%)" fill="hsl(160, 84%, 44%)" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-gradient-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="font-display font-semibold text-foreground">{cat.name}</h3>
            </div>
            <div className="flex items-end gap-3">
              <span className={`font-display text-3xl font-bold ${
                cat.score >= 70 ? 'text-primary' : cat.score >= 40 ? 'text-warning' : 'text-destructive'
              }`}>{cat.score}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-secondary">
              <motion.div
                className={`h-full rounded-full ${
                  cat.score >= 70 ? 'bg-gradient-primary' : cat.score >= 40 ? 'bg-warning' : 'bg-destructive'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${cat.score}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">💡 {cat.tip}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Plan */}
      <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">🎯 8-Week Action Plan</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {actionPlan.map((phase, i) => (
            <motion.div
              key={phase.week}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-xl border ${
                phase.priority === 'high' ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-foreground">{phase.week}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  phase.priority === 'high' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>{phase.priority}</span>
              </div>
              <ul className="space-y-2">
                {phase.tasks.map((task) => (
                  <li key={task} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span> {task}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
