import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Star, RotateCcw, Clock, ChevronRight, Trophy, Zap, BookOpen, Code2, Users, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';

// ── Question bank by category ────────────────────────────────────────────────
const questionBank: Record<string, { q: string; tip: string; timeLimit: number }[]> = {
  behavioral: [
    { q: 'Tell me about yourself and your career goals.', tip: 'Keep it under 2 minutes. Focus on relevant experience & what drives you.', timeLimit: 120 },
    { q: 'Describe a time you faced a major challenge. How did you overcome it?', tip: 'Use the STAR method: Situation, Task, Action, Result.', timeLimit: 120 },
    { q: 'Tell me about a time you had a conflict with a teammate. How was it resolved?', tip: 'Show empathy, communication, and a win-win outcome.', timeLimit: 120 },
    { q: 'Where do you see yourself in 5 years?', tip: 'Show ambition aligned with the company\'s growth trajectory.', timeLimit: 90 },
    { q: 'Why should we hire you over other candidates?', tip: 'Quantify your unique value proposition with specific data points.', timeLimit: 90 },
  ],
  technical: [
    { q: 'Explain the difference between a stack and a queue. Give a real-world use case for each.', tip: 'Think of browser history (stack) and a print spooler (queue).', timeLimit: 90 },
    { q: 'What is Big O notation? What is the Big O of binary search?', tip: 'O(log n) — explain why it halves the search space at each step.', timeLimit: 90 },
    { q: 'Explain polymorphism in OOP with a real-world example.', tip: 'Think of a "Shape" base class with Circle/Square overriding draw().', timeLimit: 100 },
    { q: 'What is a RESTful API? What makes an API truly RESTful?', tip: 'Mention statelessness, HTTP verbs, resource-based URLs, and status codes.', timeLimit: 90 },
    { q: 'How does garbage collection work in Java/Python?', tip: 'Reference counting vs mark-and-sweep vs generational GC.', timeLimit: 100 },
  ],
  hr: [
    { q: 'What is your greatest professional weakness?', tip: 'Pick a real weakness — show self-awareness and what you\'re doing to fix it.', timeLimit: 90 },
    { q: 'Why do you want to work at our company specifically?', tip: 'Do your research — mention their products, culture, or recent news.', timeLimit: 90 },
    { q: 'What motivates you in your work?', tip: 'Link your answer to intrinsic motivation — impact, learning, problem-solving.', timeLimit: 90 },
    { q: 'Describe your ideal work environment.', tip: 'Be honest but show alignment with the company culture.', timeLimit: 90 },
    { q: 'How do you handle working under pressure and tight deadlines?', tip: 'Share a specific example with a positive outcome.', timeLimit: 90 },
  ],
  system_design: [
    { q: 'Design a URL shortener like bit.ly. Walk me through your architecture.', tip: 'Cover: API layer, hash generation, DB choice (SQL vs NoSQL), caching, analytics.', timeLimit: 180 },
    { q: 'How would you design a notification system for 10 million users?', tip: 'Think message queues (Kafka/RabbitMQ), fan-out strategy, push vs pull.', timeLimit: 180 },
    { q: 'What is horizontal vs vertical scaling? When would you use each?', tip: 'Vertical: bigger server. Horizontal: more servers. Trade-offs matter.', timeLimit: 120 },
  ],
};

const categories = [
  { id: 'behavioral', label: 'Behavioral', icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
  { id: 'technical', label: 'Technical', icon: Code2, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'hr', label: 'HR Round', icon: Brain, color: 'text-warning', bg: 'bg-warning/10' },
  { id: 'system_design', label: 'System Design', icon: BookOpen, color: 'text-info', bg: 'bg-info/10' },
];

// ── Scoring engine ────────────────────────────────────────────────────────────
function scoreAnswer(answer: string, timeUsed: number, timeLimit: number): { score: number; feedback: string; tips: string[] } {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const timeRatio = Math.min(timeUsed / timeLimit, 1);

  let score = 30;
  // Length scoring (sweet spot 80-200 words)
  if (words >= 80 && words <= 200) score += 30;
  else if (words >= 40 && words < 80) score += 20;
  else if (words > 200) score += 22;
  else score += Math.max(0, words * 0.3);

  // STAR method keywords
  const starKeywords = ['situation', 'task', 'action', 'result', 'outcome', 'achieved', 'led', 'built', 'improved', 'reduced', 'increased'];
  const matched = starKeywords.filter(k => answer.toLowerCase().includes(k)).length;
  score += matched * 4;

  // Time penalty/bonus
  if (timeRatio < 0.3) score -= 10; // Too fast (not enough depth)
  if (timeRatio > 0.95) score -= 5; // Ran over time

  score = Math.min(100, Math.max(20, Math.round(score)));

  const feedback = score >= 80
    ? 'Excellent answer! Strong structure, relevant details, and good depth.'
    : score >= 65
    ? 'Good answer. Add more specific examples and quantify your impact where possible.'
    : score >= 50
    ? 'Average answer. Try the STAR method and include concrete results.'
    : 'Needs improvement. Be more specific, avoid vague generalities, and use examples.';

  const tips: string[] = [];
  if (words < 60) tips.push('Your answer is too brief — aim for 80-150 words');
  if (matched < 2) tips.push('Use STAR method keywords: situation, action, result');
  if (!answer.includes('%') && !answer.match(/\d+/)) tips.push('Quantify your impact (e.g., "improved performance by 30%")');
  if (score >= 80) tips.push('Consider adding a memorable closing statement');

  return { score, feedback, tips };
}

export default function InterviewSim() {
  const [step, setStep] = useState<'select' | 'interview' | 'done'>('select');
  const [category, setCategory] = useState('behavioral');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [scores, setScores] = useState<{ q: string; score: number; feedback: string; tips: string[] }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeUsed, setTimeUsed] = useState(0);
  const updateXP = useAppStore((s) => s.updateXP);

  const questions = questionBank[category] || questionBank.behavioral;
  const current = questions[currentQ];

  // Timer
  useEffect(() => {
    if (step !== 'interview') return;
    setTimeLeft(current.timeLimit);
    setTimeUsed(0);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
      setTimeUsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQ, step]);

  const submitAnswer = () => {
    const result = scoreAnswer(answer, timeUsed, current.timeLimit);
    setScores([...scores, { q: current.q, ...result }]);
    setAnswer('');
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep('done');
      updateXP(75);
    }
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0;
  const timerColor = timeLeft > 30 ? 'text-primary' : timeLeft > 10 ? 'text-warning' : 'text-destructive';
  const timerPct = (timeLeft / (current?.timeLimit || 1)) * 100;

  // ── Category selection screen ──────────────────────────────────────────────
  if (step === 'select') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">AI Interview Simulator</h1>
          <p className="text-muted-foreground mt-1">Choose a round type and practice with real-time AI scoring</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setCategory(cat.id); setCurrentQ(0); setScores([]); setAnswer(''); setStep('interview'); }}
              className={`bg-gradient-card rounded-xl p-6 border text-left transition-all ${
                category === cat.id ? 'border-primary glow-primary' : 'border-border hover:border-primary/40'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center mb-4`}>
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{cat.label}</h3>
              <p className="text-sm text-muted-foreground">{questionBank[cat.id].length} questions · AI scored</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {Math.round(questionBank[cat.id].reduce((s, q) => s + q.timeLimit, 0) / 60)} min total
              </div>
            </motion.button>
          ))}
        </div>
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" /> How scoring works
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex gap-2"><span className="text-primary">•</span> Answer length & depth (40%)</div>
            <div className="flex gap-2"><span className="text-primary">•</span> STAR method usage (35%)</div>
            <div className="flex gap-2"><span className="text-primary">•</span> Time management (25%)</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (step === 'done') {
    const label = avgScore >= 80 ? '🌟 Interview Ready!' : avgScore >= 65 ? '👍 Good — Keep Practicing' : '💪 Needs More Practice';
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Interview Results</h1>
            <p className="text-muted-foreground mt-1">{categories.find((c) => c.id === category)?.label} Round</p>
          </div>
          <Button onClick={() => { setStep('select'); setCurrentQ(0); setScores([]); }} variant="outline" className="border-border">
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-gradient-card rounded-2xl p-6 border border-border text-center sm:col-span-1">
            <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
            <p className="font-display text-5xl font-bold text-primary mb-1">{avgScore}%</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-6 border border-border sm:col-span-2 flex flex-wrap gap-4 items-center">
            {[
              { label: 'Questions', value: scores.length },
              { label: 'Best Score', value: `${Math.max(...scores.map((s) => s.score))}%` },
              { label: 'XP Earned', value: '+75 XP' },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 text-center">
                <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {scores.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-gradient-card rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-sm font-medium text-foreground">{s.q}</p>
                <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-bold ${
                  s.score >= 80 ? 'bg-primary/10 text-primary' : s.score >= 65 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                }`}>{s.score}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{s.feedback}</p>
              {s.tips.length > 0 && (
                <div className="space-y-1">
                  {s.tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3 text-warning mt-0.5 shrink-0" /> {tip}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── Interview screen ───────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {categories.find((c) => c.id === category)?.label} Round
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Question {currentQ + 1} of {questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 font-display text-2xl font-bold ${timerColor}`}>
          <Clock className="w-5 h-5" />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div className="absolute left-0 top-0 h-full rounded-full bg-gradient-primary"
          animate={{ width: `${((currentQ) / questions.length) * 100}%` }} />
        {/* Timer bar */}
        <motion.div
          className={`absolute left-0 top-0 h-full opacity-30 ${timeLeft <= 10 ? 'bg-destructive' : 'bg-warning'}`}
          style={{ width: `${timerPct}%`, transformOrigin: 'right' }}
          animate={{ width: `${timerPct}%` }} transition={{ duration: 1 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="bg-gradient-card rounded-2xl p-8 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎤</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              {categories.find((c) => c.id === category)?.label}
            </span>
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-3">{current.q}</h2>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/15 mb-6">
            <span className="text-warning text-sm">💡</span>
            <p className="text-sm text-muted-foreground">{current.tip}</p>
          </div>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be specific, use examples, and quantify your impact."
            rows={6}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground mb-4 focus:ring-primary/40"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {answer.trim().split(/\s+/).filter(Boolean).length} words · Aim for 80–150
            </span>
            <Button onClick={submitAnswer} disabled={!answer.trim()} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Send className="w-4 h-4 mr-2" />
              {currentQ < questions.length - 1 ? 'Submit & Next' : 'Submit & Finish'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Previous answers preview */}
      {scores.length > 0 && (
        <div className="flex gap-2">
          {scores.map((s, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                s.score >= 80 ? 'bg-primary/10 text-primary' : s.score >= 65 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
              }`}>
              <Star className="w-3 h-3" /> Q{i + 1}: {s.score}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
