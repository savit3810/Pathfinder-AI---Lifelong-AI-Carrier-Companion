import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { quizQuestions, personalityTraits, careerPaths } from '@/lib/careerData';
import { useAppStore } from '@/lib/store';

export default function CareerQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const updateUser = useAppStore((s) => s.updateUser);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (current < quizQuestions.length - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
      // Compute personality
      const traitScores: Record<string, number> = {};
      quizQuestions.forEach((q, i) => {
        q.traits.forEach((t) => {
          traitScores[t] = (traitScores[t] || 0) + newAnswers[i];
        });
      });
      const topTraits = Object.entries(traitScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([t]) => t);
      updateUser({
        personality: topTraits,
        xp: 1250 + 200,
        badges: ['🌟 Early Adopter', '🧬 DNA Decoded'],
      });
    }
  };

  const getResults = () => {
    const traitScores: Record<string, number> = {};
    quizQuestions.forEach((q, i) => {
      q.traits.forEach((t) => {
        traitScores[t] = (traitScores[t] || 0) + answers[i];
      });
    });
    const topTraits = Object.entries(traitScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([t]) => t);

    const careerMatches = careerPaths
      .map((c) => {
        const matchingTraits = personalityTraits.filter(
          (pt) => topTraits.includes(pt.trait) && pt.careers.includes(c.id)
        );
        return { ...c, matchScore: (matchingTraits.length / topTraits.length) * 100 };
      })
      .filter((c) => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return { topTraits, careerMatches };
  };

  const restart = () => {
    setCurrent(0);
    setAnswers([]);
    setDone(false);
  };

  if (done) {
    const { topTraits, careerMatches } = getResults();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Your Career DNA</h1>
            <p className="text-muted-foreground mt-1">Based on your personality analysis</p>
          </div>
          <Button onClick={restart} variant="outline" size="sm" className="border-border text-foreground">
            <RotateCcw className="w-4 h-4 mr-2" /> Retake
          </Button>
        </div>

        {/* Traits */}
        <div className="bg-gradient-card rounded-2xl p-8 border border-border">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" /> Your Top Traits
          </h2>
          <div className="flex flex-wrap gap-3">
            {topTraits.map((t) => (
              <span key={t} className="px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-display font-semibold text-lg">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Career Matches */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Best Career Matches</h2>
          {careerMatches.map((career, i) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card rounded-xl p-6 border border-border flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-display text-xl font-bold text-primary">#{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground">{career.name}</h3>
                <p className="text-sm text-muted-foreground">{career.salary} · {career.growth} growth</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl font-bold text-primary">{Math.round(career.matchScore)}%</p>
                <p className="text-xs text-muted-foreground">match</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const progress = ((current + 1) / quizQuestions.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Career DNA Quiz</h1>
        <p className="text-muted-foreground mt-1">Discover your personality traits and ideal careers</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {current + 1} of {quizQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-gradient-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="bg-gradient-card rounded-2xl p-8 border border-border"
        >
          <p className="font-display text-xl font-semibold text-foreground mb-8">
            "{quizQuestions[current].q}"
          </p>
          <div className="grid grid-cols-5 gap-3">
            {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((label, i) => (
              <button
                key={label}
                onClick={() => handleAnswer(i + 1)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-secondary hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < 2 ? 'bg-destructive/10 text-destructive' : i === 2 ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs text-muted-foreground text-center">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
