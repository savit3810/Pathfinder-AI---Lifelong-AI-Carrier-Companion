import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertTriangle, BarChart3, Zap, Download, RefreshCw, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// ── Mock analysis engine: varies by file "name" seed ────────────────────────
function generateAnalysis(fileName: string) {
  const seed = fileName.length % 3;
  const variations = [
    {
      score: 72,
      atsScore: 68,
      skills: ['Python', 'JavaScript', 'React', 'SQL', 'Git', 'REST APIs'],
      missing: ['Docker', 'AWS', 'System Design', 'TypeScript'],
      strengths: ['Strong open-source projects listed', 'Quantified achievements in each role', 'Clean single-page format'],
      improvements: ['Add ATS keywords from job postings', 'Include a brief summary section', 'Add cloud platform certifications', 'Hyperlink GitHub & LinkedIn'],
      careerMatch: [
        { career: 'Software Engineer', match: 82 },
        { career: 'Full Stack Developer', match: 74 },
        { career: 'Data Analyst', match: 58 },
        { career: 'Product Manager', match: 41 },
      ],
      radarData: [
        { skill: 'Technical', score: 75 }, { skill: 'Communication', score: 62 },
        { skill: 'Leadership', score: 40 }, { skill: 'Projects', score: 80 },
        { skill: 'Certifications', score: 35 }, { skill: 'Education', score: 70 },
      ],
      keywords: { found: ['React', 'Node.js', 'REST', 'Agile', 'Git', 'SQL'], missing: ['Kubernetes', 'CI/CD', 'Microservices'] },
    },
    {
      score: 85,
      atsScore: 81,
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'Pandas', 'Tableau', 'Statistical Analysis'],
      missing: ['MLOps', 'Cloud ML (SageMaker)', 'Spark', 'A/B Testing'],
      strengths: ['Excellent project descriptions with metrics', 'Research publications listed', 'Diverse skill set'],
      improvements: ['Add industry certifications (AWS ML, TensorFlow)', 'Quantify model accuracy improvements', 'Add a skills bar chart visualization'],
      careerMatch: [
        { career: 'ML Engineer', match: 91 },
        { career: 'Data Scientist', match: 87 },
        { career: 'AI Research Analyst', match: 79 },
        { career: 'Software Engineer', match: 60 },
      ],
      radarData: [
        { skill: 'Technical', score: 90 }, { skill: 'Communication', score: 70 },
        { skill: 'Leadership', score: 55 }, { skill: 'Projects', score: 88 },
        { skill: 'Certifications', score: 60 }, { skill: 'Education', score: 85 },
      ],
      keywords: { found: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'Data Pipeline'], missing: ['MLOps', 'SageMaker', 'Distributed Computing'] },
    },
    {
      score: 57,
      atsScore: 48,
      skills: ['Java', 'Spring Boot', 'MySQL', 'HTML', 'CSS'],
      missing: ['Docker', 'Cloud', 'DSA', 'System Design', 'CI/CD', 'Unit Testing'],
      strengths: ['Good education section', 'Relevant coursework listed', 'Projects are recent'],
      improvements: ['Needs strong action verbs (Built, Designed, Optimized)', 'Add measurable outcomes to each point', 'No GitHub/LinkedIn links', 'Resume is 2 pages — compress to 1', 'Add at least 1 internship or professional experience'],
      careerMatch: [
        { career: 'Junior Software Developer', match: 65 },
        { career: 'Backend Engineer', match: 58 },
        { career: 'QA Engineer', match: 50 },
        { career: 'Web Developer', match: 45 },
      ],
      radarData: [
        { skill: 'Technical', score: 55 }, { skill: 'Communication', score: 45 },
        { skill: 'Leadership', score: 20 }, { skill: 'Projects', score: 60 },
        { skill: 'Certifications', score: 15 }, { skill: 'Education', score: 65 },
      ],
      keywords: { found: ['Java', 'Spring Boot', 'MySQL', 'HTML'], missing: ['Docker', 'Kubernetes', 'CI/CD', 'REST API', 'Git', 'Agile'] },
    },
  ];
  return variations[seed];
}

function ScoreArc({ score }: { score: number }) {
  const color = score >= 75 ? 'hsl(160, 84%, 44%)' : score >= 60 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 72%, 55%)';
  const label = score >= 75 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" stroke="hsl(220, 14%, 16%)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="50" cy="50" r="42"
          stroke={color} strokeWidth="8" fill="none"
          strokeLinecap="round"
          strokeDasharray={264}
          initial={{ strokeDashoffset: 264 }}
          animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [analyzed, setAnalyzed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('resume.pdf');
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const updateUser = useAppStore((s) => s.updateUser);
  const updateXP = useAppStore((s) => s.updateXP);

  const analysis = generateAnalysis(fileName);

  const handleAnalyze = (name = fileName) => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzed(true);
      setAnalyzing(false);
      const a = generateAnalysis(name);
      updateUser({ skills: a.skills, resumeScore: a.score });
      updateXP(50);
    }, 1800);
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    handleAnalyze(file.name);
  };

  if (!analyzed) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-1">AI-powered deep analysis — ATS score, skills, career match & more</p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          className={`bg-gradient-card rounded-2xl p-16 border-2 border-dashed text-center transition-all cursor-pointer ${
            dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/40 hover:bg-primary/2'
          }`}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {analyzing ? (
            <div className="space-y-4">
              <div className="text-5xl">🔍</div>
              <p className="font-display text-lg font-semibold text-foreground">Analyzing your resume...</p>
              <div className="flex justify-center gap-2 mt-2">
                {['Parsing skills', 'ATS check', 'Career match', 'Keyword scan'].map((step, i) => (
                  <motion.span key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4 }}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {step}
                  </motion.span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Drop your resume here</h3>
              <p className="text-sm text-muted-foreground mb-6">PDF, DOCX supported (max 5MB) · No data stored</p>
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                <FileText className="w-4 h-4 mr-2" /> Choose File & Analyze
              </Button>
            </>
          )}
        </div>

        {/* What we analyze */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: BarChart3, title: 'ATS Score', desc: 'See how recruiters\' filters score you' },
            { icon: TrendingUp, title: 'Skill Gap', desc: 'Know exactly what\'s missing for your target role' },
            { icon: Star, title: 'Career Match', desc: 'Which careers you\'re most qualified for' },
          ].map((item) => (
            <div key={item.title} className="bg-gradient-card rounded-xl p-5 border border-border flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Resume Analysis</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> {fileName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAnalyzed(false)} variant="outline" className="border-border text-foreground">
            <RefreshCw className="w-4 h-4 mr-2" /> Re-analyze
          </Button>
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* Score row */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-gradient-card rounded-2xl p-6 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">Overall Resume Score</p>
          <ScoreArc score={analysis.score} />
        </div>
        <div className="bg-gradient-card rounded-2xl p-6 border border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">ATS Compatibility</p>
          <ScoreArc score={analysis.atsScore} />
        </div>
        <div className="bg-gradient-card rounded-2xl p-6 border border-border flex flex-col justify-between">
          <p className="text-sm text-muted-foreground mb-3">Top Career Match</p>
          <div className="space-y-3 flex-1">
            {analysis.careerMatch.slice(0, 3).map((cm) => (
              <div key={cm.career}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{cm.career}</span>
                  <span className="text-primary font-bold">{cm.match}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary">
                  <motion.div className="h-full rounded-full bg-gradient-primary" initial={{ width: 0 }}
                    animate={{ width: `${cm.match}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" /> Resume Quality Radar
          </h2>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={analysis.radarData}>
              <PolarGrid stroke="hsl(220, 14%, 16%)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="hsl(160, 84%, 44%)" fill="hsl(160, 84%, 44%)" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Keyword audit */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" /> ATS Keyword Audit
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">✅ Keywords Found</p>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.found.map((k) => (
                  <span key={k} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">⚠️ Missing Keywords</p>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.missing.map((k) => (
                  <span key={k} className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4">✅ Strengths</h2>
          <ul className="space-y-3">
            {analysis.strengths.map((s) => (
              <li key={s} className="text-sm text-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-gradient-card rounded-xl p-6 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-4">⚡ Action Items</h2>
          <ul className="space-y-3">
            {analysis.improvements.map((s, i) => (
              <li key={s} className="text-sm text-foreground flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-warning/10 text-warning text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* XP earned banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
        <span className="text-2xl">🎉</span>
        <p className="text-sm text-foreground">You earned <span className="text-primary font-bold">+50 XP</span> for analyzing your resume! Keep improving to unlock the <span className="text-warning font-medium">Resume Pro</span> badge.</p>
      </motion.div>
    </div>
  );
}
