import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Brain, Compass, LineChart, Sparkles, Target, Users, Zap, Star, CheckCircle, TrendingUp, Award, Globe, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: Brain, title: 'AI Career Engine', desc: 'ML-powered recommendations based on your unique profile, skills & personality' },
  { icon: Compass, title: 'Smart Roadmaps', desc: 'Step-by-step plans from Class 10 to dream career, auto-updated in real-time' },
  { icon: LineChart, title: 'Skill Analytics', desc: 'Visual skill gap analysis with heatmaps and benchmark comparisons' },
  { icon: Target, title: 'Job Readiness', desc: 'Track your readiness score and unlock actionable next steps' },
  { icon: Users, title: 'Parent Monitoring', desc: 'Parents get real-time insights into their child\'s performance' },
  { icon: Zap, title: 'Interview Simulator', desc: 'AI-powered mock interviews with instant feedback & scoring' },
];

const stages = [
  { emoji: '🎒', label: 'Class 10', desc: 'Discover your streams' },
  { emoji: '📚', label: 'Class 11-12', desc: 'Choose your path' },
  { emoji: '🎓', label: 'College', desc: 'Build your skills' },
  { emoji: '💼', label: 'Job Seeker', desc: 'Land your dream job' },
];

const testimonials = [
  { name: 'Ananya Sharma', role: 'IIT Delhi — CS Student', avatar: 'AS', text: 'PathFinder AI predicted I\'d excel in ML engineering before I even knew it was a field. Now I\'m interning at Google!', stars: 5 },
  { name: 'Rohan Mehta', role: 'Class 12 → NIT Graduate', avatar: 'RM', text: 'The JEE roadmap feature kept me on track for 18 months. Scored 97.4 percentile. Couldn\'t have done it without this platform.', stars: 5 },
  { name: 'Priya Patel', role: 'Parent of class 10 student', avatar: 'PP', text: 'Finally a platform where I can monitor my daughter\'s journey without being intrusive. The AI insights are incredibly accurate.', stars: 5 },
];

const stats = [
  { label: 'Students Guided', value: 12400, suffix: '+', icon: Users },
  { label: 'Career Paths', value: 250, suffix: '+', icon: Rocket },
  { label: 'Avg Salary Boost', value: 32, suffix: '%', icon: TrendingUp },
  { label: 'Placement Rate', value: 94, suffix: '%', icon: Award },
];

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  const s0 = useCounter(stats[0].value, 2000, statsInView);
  const s1 = useCounter(stats[1].value, 1800, statsInView);
  const s2 = useCounter(stats[2].value, 1500, statsInView);
  const s3 = useCounter(stats[3].value, 1600, statsInView);
  const counterValues = [s0, s1, s2, s3];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">PathFinder AI</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="w-3.5 h-3.5" /> Made for India's 250M+ Students
            </span>
            <Button onClick={onGetStarted} size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">India's #1 AI-Powered Career Guidance Platform</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Navigate Your
              <br />
              <span className="text-gradient-primary">Career Journey</span>
              <br />
              with AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              From Class 10 to your dream job — PathFinder AI guides you with personalized roadmaps,
              ML-powered predictions, real-time skill analysis, and career intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onGetStarted} size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary text-lg px-8">
                Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={onGetStarted} size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-lg px-8">
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Journey stages */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 flex flex-wrap justify-center gap-4"
          >
            {stages.map((s, i) => (
              <div key={s.label} className="glass-strong rounded-xl px-6 py-4 flex items-center gap-3 hover:glow-primary transition-all duration-300">
                {i > 0 && <ArrowRight className="w-4 h-4 text-muted-foreground -ml-8 mr-2 hidden md:block" />}
                <span className="text-2xl">{s.emoji}</span>
                <div className="text-left">
                  <p className="font-display font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Animated Stats ── */}
      <section ref={statsRef} className="py-16 px-6 border-y border-border bg-gradient-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display text-4xl font-bold text-foreground">
                  {counterValues[i].toLocaleString()}{stat.suffix}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Powerful AI Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to plan, track, and accelerate your career from Class 10 to placement.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/30 hover:glow-primary transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6 bg-gradient-card border-y border-border">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Students Love PathFinder AI</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Real stories from students who found their path.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-background rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why PathFinder ── */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">Why PathFinder AI Wins</h2>
              <div className="space-y-4">
                {[
                  { text: 'ML models trained on 10M+ real career trajectories', icon: '🧠' },
                  { text: 'Covers every stage: Class 10 → Graduate & Job Seeker', icon: '🛤️' },
                  { text: 'Parents get a real-time window into child\'s progress', icon: '👨‍👩‍👧' },
                  { text: 'Admin dashboard with full platform analytics', icon: '🛡️' },
                  { text: 'Gamified with XP, badges, streaks & leaderboards', icon: '🏆' },
                  { text: '100% free for students — no paywalls, ever', icon: '💚' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-gradient-card rounded-2xl p-8 border border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">PathFinder AI Score</p>
                    <p className="text-xs text-muted-foreground">Your career compatibility index</p>
                  </div>
                </div>
                {[
                  { label: 'AI/ML Engineer', match: 92 },
                  { label: 'Data Scientist', match: 85 },
                  { label: 'Full-Stack Developer', match: 78 },
                  { label: 'Product Manager', match: 65 },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{c.label}</span>
                      <span className="text-primary font-bold">{c.match}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.match}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-card rounded-2xl p-12 text-center border border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">Ready to Find Your Path?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join 12,000+ students already using PathFinder AI. It's free, it's powerful, and it might just change your life.
              </p>
              <Button onClick={onGetStarted} size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary text-lg px-10">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">PathFinder AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 PathFinder AI. Your career, your journey.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Built for India's Students</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
