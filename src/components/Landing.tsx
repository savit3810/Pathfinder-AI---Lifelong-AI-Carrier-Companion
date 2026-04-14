import { motion } from 'framer-motion';
import { ArrowRight, Brain, Compass, LineChart, Sparkles, Target, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Brain, title: 'AI Career Engine', desc: 'ML-powered recommendations based on your unique profile' },
  { icon: Compass, title: 'Smart Roadmaps', desc: 'Step-by-step plans from education to dream career' },
  { icon: LineChart, title: 'Skill Analytics', desc: 'Visual skill gap analysis with heatmaps' },
  { icon: Target, title: 'Job Readiness', desc: 'Track your readiness score in real-time' },
  { icon: Users, title: 'Mentor Matching', desc: 'Connect with industry professionals' },
  { icon: Zap, title: 'Interview Simulator', desc: 'AI-powered mock interviews with feedback' },
];

const stages = [
  { emoji: '🎒', label: 'Class 10', desc: 'Discover your streams' },
  { emoji: '📚', label: 'Class 11-12', desc: 'Choose your path' },
  { emoji: '🎓', label: 'College', desc: 'Build your skills' },
  { emoji: '💼', label: 'Job Seeker', desc: 'Land your dream job' },
];

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">PathFinder AI</span>
          </div>
          <Button onClick={onGetStarted} size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Get Started <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Your Lifelong AI Career Companion</span>
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
              skill analysis, and real-time career intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onGetStarted} size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary text-lg px-8">
                Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={onGetStarted} size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-lg px-8">
                Explore Features
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

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Powerful AI Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to plan, track, and accelerate your career growth.</p>
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-card rounded-2xl p-12 text-center border border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">Ready to Find Your Path?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of students already using PathFinder AI to navigate their career journey.</p>
              <Button onClick={onGetStarted} size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary text-lg px-10">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">PathFinder AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 PathFinder AI. Your career, your journey.</p>
        </div>
      </footer>
    </div>
  );
}
