import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Star, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const interviewQuestions = [
  { q: 'Tell me about yourself and your career goals.', tip: 'Keep it under 2 minutes. Focus on relevant experience.' },
  { q: 'What is your greatest strength and how does it help in this role?', tip: 'Use the STAR method with specific examples.' },
  { q: 'Describe a challenging project you worked on. How did you handle it?', tip: 'Highlight problem-solving and outcomes.' },
  { q: 'Where do you see yourself in 5 years?', tip: 'Show ambition aligned with the company.' },
  { q: 'Why should we hire you over other candidates?', tip: 'Quantify your unique value proposition.' },
];

export default function InterviewSim() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [scores, setScores] = useState<{ q: string; score: number; feedback: string }[]>([]);
  const [done, setDone] = useState(false);

  const submitAnswer = () => {
    const wordCount = answer.trim().split(/\s+/).length;
    const score = Math.min(100, Math.max(30, 40 + wordCount * 2 + Math.random() * 20));
    const feedback = score > 70
      ? 'Good structure and detail. Consider adding more quantifiable results.'
      : 'Try to be more specific. Use the STAR method for stronger answers.';

    setScores([...scores, { q: interviewQuestions[currentQ].q, score: Math.round(score), feedback }]);
    setAnswer('');

    if (currentQ < interviewQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setDone(true);
    }
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0;

  if (!started) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">AI Interview Simulator</h1>
          <p className="text-muted-foreground mt-1">Practice with AI-powered mock interviews</p>
        </div>
        <div className="bg-gradient-card rounded-2xl p-12 border border-border text-center">
          <div className="text-6xl mb-6">🎤</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Ready for your mock interview?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You'll answer {interviewQuestions.length} common interview questions. Each answer will be scored and reviewed.
          </p>
          <Button onClick={() => setStarted(true)} size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary">
            Start Interview
          </Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Interview Results</h1>
            <p className="text-muted-foreground mt-1">Here's how you performed</p>
          </div>
          <Button onClick={() => { setStarted(false); setDone(false); setCurrentQ(0); setScores([]); }} variant="outline" className="border-border text-foreground">
            <RotateCcw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>

        <div className="bg-gradient-card rounded-2xl p-8 border border-border text-center">
          <p className="text-muted-foreground mb-2">Overall Score</p>
          <p className="font-display text-5xl font-bold text-primary mb-2">{avgScore}%</p>
          <p className="text-sm text-muted-foreground">
            {avgScore >= 75 ? '🌟 Excellent! You\'re interview ready.' : avgScore >= 50 ? '👍 Good start. Keep practicing!' : '💪 Room for growth. Practice makes perfect.'}
          </p>
        </div>

        <div className="space-y-4">
          {scores.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-gradient-card rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-sm font-medium text-foreground">{s.q}</p>
                <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-bold ${
                  s.score >= 75 ? 'bg-primary/10 text-primary' : s.score >= 50 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                }`}>{s.score}%</span>
              </div>
              <p className="text-sm text-muted-foreground">{s.feedback}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Mock Interview</h1>
        <p className="text-muted-foreground mt-1">Question {currentQ + 1} of {interviewQuestions.length}</p>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-secondary">
        <motion.div className="h-full rounded-full bg-gradient-primary" animate={{ width: `${((currentQ + 1) / interviewQuestions.length) * 100}%` }} />
      </div>

      <div className="bg-gradient-card rounded-2xl p-8 border border-border">
        <div className="text-3xl mb-4">🎤</div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">{interviewQuestions[currentQ].q}</h2>
        <p className="text-sm text-muted-foreground mb-6">💡 Tip: {interviewQuestions[currentQ].tip}</p>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={6}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground mb-4"
        />
        <Button onClick={submitAnswer} disabled={!answer.trim()} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Send className="w-4 h-4 mr-2" /> Submit Answer
        </Button>
      </div>
    </div>
  );
}
