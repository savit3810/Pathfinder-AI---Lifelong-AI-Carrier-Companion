import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

const mockAnalysis = {
  score: 72,
  skills: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'Communication'],
  missing: ['System Design', 'Docker', 'AWS', 'CI/CD'],
  strengths: ['Strong programming foundation', 'Good project descriptions', 'Quantified achievements'],
  improvements: ['Add more keywords for ATS', 'Include certifications section', 'Expand technical skills section', 'Add links to portfolio/GitHub'],
  careerMatch: [
    { career: 'Software Engineer', match: 78 },
    { career: 'Full Stack Developer', match: 72 },
    { career: 'Data Analyst', match: 55 },
  ],
};

export default function ResumeAnalyzer() {
  const [analyzed, setAnalyzed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const updateUser = useAppStore((s) => s.updateUser);

  const handleAnalyze = () => {
    setAnalyzed(true);
    updateUser({
      skills: mockAnalysis.skills,
      resumeScore: mockAnalysis.score,
    });
  };

  if (!analyzed) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-1">Upload your resume for AI-powered analysis</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleAnalyze(); }}
          className={`bg-gradient-card rounded-2xl p-16 border-2 border-dashed text-center transition-all cursor-pointer ${
            dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
          }`}
          onClick={handleAnalyze}
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">Drop your resume here</h3>
          <p className="text-sm text-muted-foreground mb-6">PDF, DOCX supported (max 5MB)</p>
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <FileText className="w-4 h-4 mr-2" /> Upload & Analyze
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Resume Analysis</h1>
        <p className="text-muted-foreground mt-1">AI-powered insights from your resume</p>
      </div>

      {/* Score */}
      <div className="bg-gradient-card rounded-2xl p-8 border border-border text-center">
        <p className="text-muted-foreground mb-2">Resume Score</p>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" />
            <motion.circle
              cx="50" cy="50" r="42" stroke="hsl(var(--primary))" strokeWidth="8" fill="none"
              strokeLinecap="round"
              strokeDasharray={264}
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 - (264 * mockAnalysis.score) / 100 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-bold text-foreground">
            {mockAnalysis.score}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Good — room for improvement</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Found */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" /> Skills Detected
          </h2>
          <div className="flex flex-wrap gap-2">
            {mockAnalysis.skills.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">{s}</span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" /> Missing Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {mockAnalysis.missing.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-sm">{s}</span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4">✅ Strengths</h2>
          <ul className="space-y-2">
            {mockAnalysis.strengths.map((s) => (
              <li key={s} className="text-sm text-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4">⚡ Improvements</h2>
          <ul className="space-y-2">
            {mockAnalysis.improvements.map((s) => (
              <li key={s} className="text-sm text-foreground flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Career Match */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border">
        <h2 className="font-display font-semibold text-foreground mb-4">Career Match %</h2>
        <div className="space-y-4">
          {mockAnalysis.careerMatch.map((cm) => (
            <div key={cm.career}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground font-medium">{cm.career}</span>
                <span className="text-primary font-bold">{cm.match}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${cm.match}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
