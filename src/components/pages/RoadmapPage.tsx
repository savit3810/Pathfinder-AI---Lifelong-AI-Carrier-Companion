import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ArrowDown } from 'lucide-react';

const roadmapSteps = [
  { phase: 'Foundation', duration: '0-3 months', status: 'done', items: ['Learn Python basics', 'Understand data types & structures', 'Complete CS50 intro course', 'Build 2 small projects'] },
  { phase: 'Core Skills', duration: '3-6 months', status: 'current', items: ['Learn DSA fundamentals', 'Start SQL & databases', 'Build portfolio website', 'Contribute to open source'] },
  { phase: 'Specialization', duration: '6-9 months', status: 'upcoming', items: ['Choose ML or Web Dev track', 'Complete specialization course', 'Build 3 domain projects', 'Get first internship'] },
  { phase: 'Job Ready', duration: '9-12 months', status: 'upcoming', items: ['System design basics', 'Mock interviews practice', 'Resume optimization', 'Apply to 50+ companies'] },
  { phase: 'Career Launch', duration: '12+ months', status: 'upcoming', items: ['Land first full-time role', 'Negotiate salary', 'Plan 5-year growth', 'Start mentoring others'] },
];

const statusColors = {
  done: 'border-primary bg-primary/10',
  current: 'border-accent bg-accent/10 glow-accent',
  upcoming: 'border-border bg-gradient-card',
};

export default function RoadmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Smart Roadmap</h1>
        <p className="text-muted-foreground mt-1">Your personalized step-by-step career plan</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {roadmapSteps.map((step, i) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6"
            >
              {/* Timeline dot */}
              <div className="relative z-10 shrink-0 mt-6">
                {step.status === 'done' ? (
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                ) : step.status === 'current' ? (
                  <div className="w-12 h-12 rounded-full border-2 border-accent bg-accent/20 flex items-center justify-center animate-pulse-glow">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                ) : (
                  <Circle className="w-12 h-12 text-muted-foreground/30" />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 rounded-xl p-6 border ${statusColors[step.status as keyof typeof statusColors]}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-lg font-semibold text-foreground">{step.phase}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">{step.duration}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {step.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={step.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
