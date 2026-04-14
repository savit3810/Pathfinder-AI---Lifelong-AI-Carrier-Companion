import { motion } from 'framer-motion';
import { useAppStore, roleLabels } from '@/lib/store';
import { CheckCircle2, Circle, Star } from 'lucide-react';

const journeyStages = [
  { id: 'class10', label: 'Class 10', milestones: ['Choose stream', 'Explore interests', 'Take aptitude test'] },
  { id: 'class12', label: 'Class 11-12', milestones: ['Master subjects', 'Prepare for entrance exams', 'Shortlist colleges'] },
  { id: 'college', label: 'College', milestones: ['Build core skills', 'Do internships', 'Create portfolio'] },
  { id: 'graduate', label: 'Job Seeker', milestones: ['Polish resume', 'Practice interviews', 'Apply strategically'] },
];

export default function JourneyPage() {
  const user = useAppStore((s) => s.user);
  const currentIdx = journeyStages.findIndex((s) => s.id === user?.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">My Career Journey</h1>
        <p className="text-muted-foreground mt-1">Track your progress from school to career</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-8">
          {journeyStages.map((stage, i) => {
            const isComplete = i < currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6"
              >
                <div className="relative z-10">
                  {isComplete ? (
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  ) : isCurrent ? (
                    <div className="w-12 h-12 rounded-full border-2 border-accent bg-accent/20 flex items-center justify-center animate-pulse-glow">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                  ) : (
                    <Circle className="w-12 h-12 text-muted-foreground/30" />
                  )}
                </div>
                <div className={`flex-1 rounded-xl p-6 border ${
                  isCurrent ? 'border-accent bg-accent/5 glow-accent' : isComplete ? 'border-primary/30 bg-primary/5' : 'border-border bg-gradient-card'
                }`}>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{stage.label}</h3>
                  {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">You are here</span>}
                  <ul className="mt-3 space-y-2">
                    {stage.milestones.map((m) => (
                      <li key={m} className="flex items-center gap-2 text-sm">
                        {isComplete ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground/30" />}
                        <span className={isComplete ? 'text-muted-foreground line-through' : 'text-foreground'}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
