import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

const API = import.meta.env.PROD ? '/api' : 'http://localhost:8000';

type Tab = 'predict' | 'position' | 'seniors' | 'lifecycle' | 'metrics';

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function apiFetch(path: string, body?: object) {
  const res = await fetch(`${API}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function Badge({ label, color = 'primary' }: { label: string; color?: string }) {
  const cls: Record<string, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent:  'bg-accent/10 text-accent border-accent/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    info:    'bg-sky-500/10 text-sky-400 border-sky-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls[color] || cls.primary}`}>
      {label}
    </span>
  );
}

function ConfidenceMeter({ value, label }: { value: number; label: string }) {
  const color = value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span><span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function SectionCard({ title, children, glow }: { title: string; children: React.ReactNode; glow?: string }) {
  return (
    <div className={`relative rounded-2xl border border-border bg-gradient-card p-6 overflow-hidden ${glow ? 'shadow-lg' : ''}`}>
      {glow && <div className={`absolute inset-0 ${glow} opacity-5 pointer-events-none`} />}
      <h3 className="font-display text-lg font-semibold text-foreground mb-4 relative z-10">{title}</h3>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Predict Tab ──────────────────────────────────────────────────────────────
function PredictTab({ role }: { role: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<any>(null);
  const [error, setError]     = useState('');

  // Class 10
  const [math, setMath]           = useState(75);
  const [sci,  setSci]            = useState(70);
  const [eng,  setEng]            = useState(80);
  const [soc,  setSoc]            = useState(72);
  const [hin,  setHin]            = useState(68);
  const [techInt, setTechInt]     = useState(7);
  const [comInt,  setComInt]      = useState(5);
  const [artInt,  setArtInt]      = useState(3);

  // Class 12
  const [stream12, setStream12]   = useState('Science');
  const [m1, setM1]               = useState(80);
  const [m2, setM2]               = useState(75);
  const [m3, setM3]               = useState(78);
  const [mathM, setMathM]         = useState(85);
  const [phyM, setPhyM]           = useState(72);
  const [bioM, setBioM]           = useState(65);
  const [pref, setPref]           = useState('Mathematics');
  const [sk12, setSk12]           = useState(3);

  // College
  const [degree, setDegree]       = useState('B.Tech / B.E.');
  const [cgpa,   setCgpa]         = useState(7.5);
  const [skC,    setSkC]          = useState(6);
  const [proj,   setProj]         = useState(3);
  const [intern, setIntern]       = useState(1);
  const [cert,   setCert]         = useState(3);
  const [back,   setBack]         = useState(0);

  const handlePredict = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      let endpoint = ''; let body: any = {};
      if (role === 'class10') {
        endpoint = '/predict/stream';
        body = { math_marks: math, science_marks: sci, english_marks: eng,
                 social_marks: soc, hindi_marks: hin,
                 tech_interest: techInt, commerce_interest: comInt, art_interest: artInt };
      } else if (role === 'class12') {
        endpoint = '/predict/course';
        body = { stream: stream12, marks_subject1: m1, marks_subject2: m2, marks_subject3: m3,
                 math_marks: mathM, physics_marks: phyM, bio_marks: bioM,
                 preferred_subject: pref, skills_count: sk12 };
      } else {
        endpoint = '/predict/domain';
        body = { degree, cgpa, skills_count: skC, projects_count: proj,
                 internships_count: intern, certifications: cert, active_backlogs: back };
      }
      const data = await apiFetch(endpoint, body);
      setResult(data);
    } catch (e: any) {
      setError('Backend offline. Start the FastAPI server first (uvicorn main:app --reload).');
    }
    setLoading(false);
  };

  // Bar chart data from probabilities
  const chartData = result
    ? Object.entries(
        result.all_stream_probabilities || result.all_course_probabilities || result.top_domains || {}
      ).map(([k, v]) => ({ name: k.length > 14 ? k.slice(0, 14) + '…' : k, probability: v }))
        .sort((a, b) => (b.probability as number) - (a.probability as number))
        .slice(0, 6)
    : [];

  const InputNum = ({ label, value, setValue, min = 0, max = 100, step = 1 }: any) => (
    <div>
      <label className="text-xs text-muted-foreground block mb-1">{label}: <span className="text-foreground font-bold">{value}</span></label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full accent-primary h-1.5 cursor-pointer" />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <SectionCard title={role === 'class10' ? '🎒 Class 10 — Stream Predictor' : role === 'class12' ? '📚 Class 12 — Course Predictor' : '🎓 College — Domain Predictor'} glow="bg-gradient-to-br from-primary to-accent">
        <div className="space-y-4">
          {role === 'class10' && (
            <>
              <InputNum label="Math Marks (%)" value={math} setValue={setMath} />
              <InputNum label="Science Marks (%)" value={sci} setValue={setSci} />
              <InputNum label="English Marks (%)" value={eng} setValue={setEng} />
              <InputNum label="Social Science (%)" value={soc} setValue={setSoc} />
              <InputNum label="Hindi Marks (%)" value={hin} setValue={setHin} />
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Interest Levels (0–10)</p>
                <InputNum label="Technology Interest" value={techInt} setValue={setTechInt} min={0} max={10} />
                <InputNum label="Commerce Interest"   value={comInt}  setValue={setComInt}  min={0} max={10} />
                <InputNum label="Arts Interest"       value={artInt}  setValue={setArtInt}  min={0} max={10} />
              </div>
            </>
          )}
          {role === 'class12' && (
            <>
              <div>
                <label className="text-xs text-muted-foreground">Stream</label>
                <select value={stream12} onChange={e => setStream12(e.target.value)}
                  className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  {['Science', 'Commerce', 'Arts'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <InputNum label="Subject 1 Marks (%)" value={m1} setValue={setM1} />
              <InputNum label="Subject 2 Marks (%)" value={m2} setValue={setM2} />
              <InputNum label="Subject 3 Marks (%)" value={m3} setValue={setM3} />
              <InputNum label="Math Marks (%)"      value={mathM} setValue={setMathM} />
              <InputNum label="Physics Marks (%)"   value={phyM}  setValue={setPhyM} />
              <InputNum label="Biology Marks (%)"   value={bioM}  setValue={setBioM} />
              <div>
                <label className="text-xs text-muted-foreground">Preferred Subject</label>
                <select value={pref} onChange={e => setPref(e.target.value)}
                  className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  {['Mathematics', 'Biology', 'Economics', 'Computer Science', 'History', 'Business Studies'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <InputNum label="Skills Count" value={sk12} setValue={setSk12} min={0} max={10} />
            </>
          )}
          {(role === 'college' || role === 'graduate') && (
            <>
              <div>
                <label className="text-xs text-muted-foreground">Degree</label>
                <select value={degree} onChange={e => setDegree(e.target.value)}
                  className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                  {['B.Tech / B.E.', 'BCA', 'B.Sc CS', 'B.Com', 'MBA', 'B.Sc General', 'BA'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <InputNum label="CGPA" value={cgpa} setValue={setCgpa} min={4} max={10} step={0.1} />
              <InputNum label="Skills Count"       value={skC}    setValue={setSkC}    min={0} max={15} />
              <InputNum label="Projects Count"     value={proj}   setValue={setProj}   min={0} max={10} />
              <InputNum label="Internships"        value={intern} setValue={setIntern} min={0} max={5} />
              <InputNum label="Certifications"     value={cert}   setValue={setCert}   min={0} max={10} />
              <InputNum label="Active Backlogs"    value={back}   setValue={setBack}   min={0} max={10} />
            </>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePredict}
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-lg disabled:opacity-60"
          >
            {loading ? '🤖 Predicting…' : '🚀 Run ML Prediction'}
          </motion.button>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Result Panel */}
      <div className="space-y-4">
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Main result */}
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ML Prediction</p>
                <h2 className="font-display text-2xl font-bold text-primary">
                  {result.predicted_stream || result.predicted_course || result.predicted_domain}
                </h2>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <Badge label={`Confidence: ${result.confidence_pct}%`} color="success" />
                  <Badge label={result.confidence_level} color="primary" />
                  <Badge label={result.model_used} color="info" />
                  {result.model_accuracy && result.model_accuracy !== 'N/A' && (
                    <Badge label={`Model Acc: ${result.model_accuracy}%`} color="accent" />
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <ConfidenceMeter value={result.confidence_pct} label="Prediction Confidence" />
                </div>
              </div>

              {/* Probability Chart */}
              {chartData.length > 0 && (
                <SectionCard title="📊 Probability Distribution">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,16%)" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(215,14%,55%)', fontSize: 10 }} unit="%" />
                      <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215,14%,55%)', fontSize: 10 }} width={90} />
                      <Tooltip
                        contentStyle={{ background: 'hsl(220,18%,8%)', border: '1px solid hsl(220,14%,16%)', borderRadius: 8 }}
                        formatter={(v: any) => [`${v}%`, 'Probability']}
                      />
                      <Bar dataKey="probability" fill="hsl(160,84%,44%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </SectionCard>
              )}

              {/* Reasoning / skills */}
              {result.reasoning && result.reasoning.length > 0 && (
                <SectionCard title="🧠 AI Reasoning">
                  <ul className="space-y-2">
                    {result.reasoning.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">▸</span>{r}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              {/* Recommended skills / next steps */}
              {(result.recommended_subjects || result.recommended_skills || result.next_steps) && (
                <SectionCard title="✅ Next Steps & Recommended Skills">
                  <div className="flex flex-wrap gap-2">
                    {[...(result.recommended_subjects || []),
                      ...(result.recommended_skills    || []),
                      ...(result.next_steps            || [])
                    ].map((s: string, i: number) => (
                      <Badge key={i} label={s} color={i % 2 === 0 ? 'primary' : 'accent'} />
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm space-y-1">
                  {result.warnings.map((w: string, i: number) => <p key={i}>{w}</p>)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <div className="rounded-2xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
            <span className="text-5xl mb-4">🤖</span>
            <p className="text-muted-foreground text-sm">Fill in your details and click<br /><strong className="text-foreground">Run ML Prediction</strong></p>
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-primary/20 p-12 flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary mb-4" />
            <p className="text-muted-foreground text-sm">Running ML Models…</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Position Analysis Tab ────────────────────────────────────────────────────
function PositionTab({ role }: { role: string }) {
  const [score,   setScore]   = useState(72.0);
  const [skills,  setSkills]  = useState(5);
  const [extra,   setExtra]   = useState(75.0);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<any>(null);
  const [error,   setError]   = useState('');

  const run = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await apiFetch('/analyze/position', {
        role: role === 'graduate' ? 'graduate' : role,
        overall_score: score,
        skills_count: skills,
        extra_score: extra,
      });
      setResult(data);
    } catch {
      setError('Backend offline. Please start FastAPI server.');
    }
    setLoading(false);
  };

  const radarData = result ? [
    { subject: 'Academic', value: result.academic_percentile },
    { subject: 'Skills',   value: result.skill_percentile   },
    { subject: 'Readiness',value: result.readiness_score    },
    { subject: 'Projects', value: extra                     },
    { subject: 'Activity', value: skills * 7                },
  ] : [];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <SectionCard title="📊 Your Academic Profile" glow="bg-gradient-to-br from-accent to-primary">
        <div className="space-y-5">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              {role === 'college' || role === 'graduate' ? 'CGPA × 10' : 'Overall Percentage'}: <span className="text-foreground font-bold">{score}%</span>
            </label>
            <input type="range" min={40} max={100} step={0.5} value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="w-full accent-accent h-1.5 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Skills Count: <span className="text-foreground font-bold">{skills}</span>
            </label>
            <input type="range" min={0} max={15} value={skills}
              onChange={e => setSkills(Number(e.target.value))}
              className="w-full accent-accent h-1.5 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Projects / Extra Activities Score: <span className="text-foreground font-bold">{extra}%</span>
            </label>
            <input type="range" min={0} max={100} step={1} value={extra}
              onChange={e => setExtra(Number(e.target.value))}
              className="w-full accent-accent h-1.5 cursor-pointer" />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={run} disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-white font-bold text-sm disabled:opacity-60">
            {loading ? '⏳ Analyzing…' : '📍 Analyze My Position'}
          </motion.button>
          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
      </SectionCard>

      <div className="space-y-4">
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Ranking card */}
              <div className={`rounded-2xl border p-6 ${
                result.academic_percentile >= 80 ? 'border-emerald-500/40 bg-emerald-500/5' :
                result.academic_percentile >= 50 ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-red-500/40 bg-red-500/5'
              }`}>
                <p className="text-2xl font-bold mb-1">{result.ranking_message}</p>
                <Badge label={result.ranking_label}
                  color={result.academic_percentile >= 80 ? 'success' : result.academic_percentile >= 50 ? 'warning' : 'primary'} />
                <p className="text-xs text-muted-foreground mt-2">{result.compared_to}</p>
              </div>

              {/* Meter cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Academic Percentile', value: result.academic_percentile, color: '#10b981' },
                  { label: 'Skill Percentile',    value: result.skill_percentile,    color: '#3b82f6' },
                  { label: 'Readiness Score',     value: result.readiness_score,     color: '#8b5cf6' },
                ].map(m => (
                  <div key={m.label} className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
                    <p className="text-2xl font-display font-bold" style={{ color: m.color }}>{m.value}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Radar */}
              <SectionCard title="🕸️ Performance Radar">
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(220,14%,18%)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(215,14%,55%)', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(215,14%,40%)', fontSize: 9 }} />
                    <Radar name="You" dataKey="value" stroke="hsl(160,84%,44%)" fill="hsl(160,84%,44%)" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </SectionCard>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-2 gap-3">
                {result.strengths.length > 0 && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">✅ Strengths</p>
                    <ul className="space-y-1">
                      {result.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.areas_to_improve.length > 0 && (
                  <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                    <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">📈 Improve</p>
                    <ul className="space-y-1">
                      {result.areas_to_improve.map((s: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <div className="rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
            <span className="text-5xl mb-4">📍</span>
            <p className="text-sm text-muted-foreground">See exactly where you stand<br />compared to your peers</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Seniors / Alumni Tab ─────────────────────────────────────────────────────
function SeniorsTab() {
  const [pct10,    setPct10]   = useState(72);
  const [stream,   setStream]  = useState('Science');
  const [cgpa,     setCgpa]    = useState(7.5);
  const [skills,   setSkills]  = useState(5);
  const [topN,     setTopN]    = useState(3);
  const [loading,  setLoading] = useState(false);
  const [result,   setResult]  = useState<any>(null);
  const [error,    setError]   = useState('');

  const run = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await apiFetch('/seniors/match', {
        class10_percentage: pct10, stream, cgpa, skills_count: skills, top_n: topN,
      });
      setResult(data);
    } catch {
      setError('Backend offline. Please start FastAPI server.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="🎓 Find Alumni Who Were Once Like You" glow="bg-gradient-to-br from-violet-500 to-primary">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Class 10 %: <span className="text-foreground font-bold">{pct10}</span></label>
            <input type="range" min={40} max={99} value={pct10} onChange={e => setPct10(Number(e.target.value))}
              className="w-full accent-primary h-1.5 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Stream</label>
            <select value={stream} onChange={e => setStream(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {['Science', 'Commerce', 'Arts'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">CGPA: <span className="text-foreground font-bold">{cgpa}</span></label>
            <input type="range" min={5} max={10} step={0.1} value={cgpa} onChange={e => setCgpa(Number(e.target.value))}
              className="w-full accent-primary h-1.5 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Skills Count: <span className="text-foreground font-bold">{skills}</span></label>
            <input type="range" min={1} max={12} value={skills} onChange={e => setSkills(Number(e.target.value))}
              className="w-full accent-primary h-1.5 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Show top: <span className="text-foreground font-bold">{topN}</span> seniors</label>
            <input type="range" min={1} max={6} value={topN} onChange={e => setTopN(Number(e.target.value))}
              className="w-full accent-primary h-1.5 cursor-pointer" />
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={run} disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-primary text-white font-bold text-sm disabled:opacity-60">
          {loading ? '🔍 Matching…' : '🔍 Find My Alumni Matches'}
        </motion.button>
        {error && <p className="text-destructive text-xs mt-2">{error}</p>}
      </SectionCard>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-sm text-violet-300 font-medium">💡 {result.motivation_note}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.matched_seniors?.map((s: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-gradient-card p-5 hover:border-primary/40 transition-colors">
                  {/* Avatar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.current_company}</p>
                    </div>
                    <Badge label={`${s.similarity_pct}% match`} color="success" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { l: 'Class 10',  v: `${s.class10_percentage}%` },
                      { l: 'Stream',    v: s.stream           },
                      { l: 'Degree',    v: s.degree           },
                      { l: 'CGPA',      v: s.cgpa             },
                      { l: 'Domain',    v: s.current_domain   },
                      { l: 'YoE',       v: `${s.years_of_experience} yrs` },
                    ].map(r => (
                      <div key={r.l} className="rounded-lg bg-secondary/50 p-2">
                        <p className="text-xs text-muted-foreground">{r.l}</p>
                        <p className="text-xs font-semibold text-foreground truncate">{r.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Salary highlight */}
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 mb-3">
                    <p className="text-xs text-muted-foreground">Current Salary</p>
                    <p className="font-display text-xl font-bold text-primary">₹{s.current_salary_lpa} LPA</p>
                  </div>

                  {/* Story */}
                  <p className="text-xs text-muted-foreground leading-relaxed italic">"{s.success_story}"</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lifecycle Tab ────────────────────────────────────────────────────────────
function LifecycleTab({ role }: { role: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const d = await apiFetch(`/lifecycle/${role}`);
      setData(d);
    } catch {
      setError('Backend offline. Please start FastAPI server.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">🗺️ Student Lifecycle Tracker</h2>
          <p className="text-sm text-muted-foreground">Full journey from Class 10 to Career Growth</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={load} disabled={loading}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm disabled:opacity-60">
          {loading ? 'Loading…' : 'Load My Lifecycle'}
        </motion.button>
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Tip */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">💡 {data.current_tip}</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent opacity-30" />
              <div className="space-y-4 pl-16">
                {data.stages?.map((stage: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative rounded-2xl border p-5 transition-all ${
                      stage.status === 'done'    ? 'border-emerald-500/30 bg-emerald-500/5' :
                      stage.status === 'current' ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/10' :
                                                   'border-border bg-gradient-card opacity-80'
                    }`}>
                    {/* Circle on timeline */}
                    <div className={`absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${
                      stage.status === 'done'    ? 'bg-emerald-500 border-emerald-600 text-white' :
                      stage.status === 'current' ? 'bg-primary border-primary/60 text-black'     :
                                                   'bg-secondary border-border text-muted-foreground'
                    }`}>
                      {stage.status === 'done' ? '✓' : stage.step}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stage.icon}</span>
                      <div>
                        <p className={`font-semibold ${
                          stage.status === 'done'    ? 'text-emerald-400' :
                          stage.status === 'current' ? 'text-primary'     : 'text-foreground'
                        }`}>{stage.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{stage.status}</p>
                      </div>
                      {stage.status === 'current' && (
                        <span className="ml-auto px-3 py-1 rounded-full bg-primary text-black text-xs font-bold animate-pulse">
                          YOU ARE HERE
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!data && !loading && (
        <div className="rounded-2xl border border-dashed border-border p-16 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">🗺️</span>
          <p className="text-sm text-muted-foreground">Click to load your complete career lifecycle roadmap</p>
        </div>
      )}
    </div>
  );
}

// ─── Model Metrics Tab ────────────────────────────────────────────────────────
function MetricsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const d = await apiFetch('/model-metrics');
      setData(d.metrics);
    } catch {
      setError('Backend offline. Please start FastAPI server.');
    }
    setLoading(false);
  };

  const accData = data ? [
    { name: 'Class-10 Stream (RF)',     accuracy: data.class10_stream?.accuracy_pct   || 0 },
    { name: 'Class-12 Course (RF)',     accuracy: data.class12_course?.accuracy_pct   || 0 },
    { name: 'College Domain (DT)',      accuracy: data.college_domain?.dt_accuracy_pct || 0 },
    { name: 'College Domain (LR)',      accuracy: data.college_domain?.lr_accuracy_pct || 0 },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">📊 Model Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">Real accuracy scores from trained scikit-learn models</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={load} disabled={loading}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm disabled:opacity-60">
          {loading ? 'Loading…' : 'Load Metrics'}
        </motion.button>
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Model accuracy chart */}
            <SectionCard title="🎯 Classification Model Accuracy">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={accData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,16%)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(215,14%,55%)', fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'hsl(215,14%,55%)', fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ background: 'hsl(220,18%,8%)', border: '1px solid hsl(220,14%,16%)', borderRadius: 8 }}
                    formatter={(v: any) => [`${v}%`, 'Accuracy']} />
                  <Bar dataKey="accuracy" fill="hsl(160,84%,44%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>

            {/* Model cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Class10 */}
              {data.class10_stream && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎒</span>
                    <div><p className="font-semibold text-foreground">Class-10 Stream Predictor</p>
                    <Badge label={data.class10_stream.model} color="primary" /></div>
                  </div>
                  <ConfidenceMeter value={data.class10_stream.accuracy_pct} label="Model Accuracy" />
                  <p className="text-xs text-muted-foreground mt-2">Trained on 3,000 student records</p>
                  <p className="text-xs text-muted-foreground">Classes: {data.class10_stream.classes?.join(' · ')}</p>
                </div>
              )}

              {/* Class12 */}
              {data.class12_course && (
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📚</span>
                    <div><p className="font-semibold text-foreground">Class-12 Course Predictor</p>
                    <Badge label={data.class12_course.model} color="accent" /></div>
                  </div>
                  <ConfidenceMeter value={data.class12_course.accuracy_pct} label="Model Accuracy" />
                  <p className="text-xs text-muted-foreground mt-2">Trained on 3,000 student records</p>
                </div>
              )}

              {/* College DT */}
              {data.college_domain && (
                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎓</span>
                    <div><p className="font-semibold text-foreground">College Domain (Decision Tree)</p>
                    <Badge label="Decision Tree Classifier" color="info" /></div>
                  </div>
                  <ConfidenceMeter value={data.college_domain.dt_accuracy_pct} label="DT Accuracy" />
                  <ConfidenceMeter value={data.college_domain.lr_accuracy_pct} label="LR Accuracy" />
                  <p className="text-xs text-muted-foreground mt-2">Trained on 3,000 student records</p>
                </div>
              )}

              {/* Salary */}
              {data.salary && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💰</span>
                    <div><p className="font-semibold text-foreground">Salary Predictor</p>
                    <Badge label="Random Forest + Linear Regression" color="success" /></div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>RF  → MAE: <span className="text-foreground font-semibold">{data.salary.random_forest_regressor?.mae_lpa} LPA</span> | R²: <span className="text-emerald-400 font-semibold">{data.salary.random_forest_regressor?.r2}</span></p>
                    <p>LR  → MAE: <span className="text-foreground font-semibold">{data.salary.linear_regression?.mae_lpa} LPA</span> | R²: <span className="text-emerald-400 font-semibold">{data.salary.linear_regression?.r2}</span></p>
                  </div>
                </div>
              )}
            </div>

            {/* Feature importance note */}
            <SectionCard title="🔬 Models Used in PathFinder AI">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: '🌲', name: 'Random Forest Classifier', use: 'Stream & Course prediction', acc: 'Handles non-linear patterns, 200 trees' },
                  { icon: '🌳', name: 'Decision Tree Classifier', use: 'Domain prediction',           acc: 'Interpretable, fast inference' },
                  { icon: '📈', name: 'Logistic Regression',      use: 'Domain prediction (ensemble)', acc: 'Probabilistic, good baseline' },
                  { icon: '📉', name: 'Linear + RF Regressor',    use: 'Salary projection',            acc: 'Continuous value prediction' },
                ].map(m => (
                  <div key={m.name} className="rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="text-xl mb-1">{m.icon}</p>
                    <p className="font-semibold text-foreground text-sm">{m.name}</p>
                    <p className="text-xs text-primary mt-0.5">{m.use}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.acc}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {!data && !loading && (
        <div className="rounded-2xl border border-dashed border-border p-16 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">📊</span>
          <p className="text-sm text-muted-foreground">View accuracy scores and metrics for all 4 ML models</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MLIntelligence() {
  const user    = useAppStore(s => s.user);
  const role    = user?.role || 'college';
  const [tab, setTab] = useState<Tab>('predict');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'predict',   label: 'ML Predictor',       icon: '🤖' },
    { id: 'position',  label: 'My Position',         icon: '📍' },
    { id: 'seniors',   label: 'Alumni Inspiration',  icon: '🎓' },
    { id: 'lifecycle', label: 'Lifecycle Tracker',   icon: '🗺️' },
    { id: 'metrics',   label: 'Model Metrics',       icon: '📊' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-card p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">🧠</span>
                <h1 className="font-display text-3xl font-bold text-foreground">ML Intelligence Hub</h1>
              </div>
              <p className="text-muted-foreground max-w-xl">
                AI-powered career predictions using <strong className="text-foreground">Random Forest</strong>,{' '}
                <strong className="text-foreground">Decision Tree</strong>, and{' '}
                <strong className="text-foreground">Logistic Regression</strong> models trained on{' '}
                <strong className="text-foreground">9,500 student records</strong>.
              </p>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">ML Backend Required</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Student Records', value: '9,500', icon: '📋' },
              { label: 'ML Models',       value: '4',      icon: '🤖' },
              { label: 'Alumni Profiles', value: '500',    icon: '🎓' },
              { label: 'Accuracy (avg)',  value: '~90%',   icon: '🎯' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-secondary/50 px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-display text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Backend start instruction */}
          <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
            <p className="text-xs text-yellow-400 font-medium">⚡ Start backend: <code className="bg-yellow-500/10 px-2 py-0.5 rounded ml-1">cd backend  →  python generate_data.py  →  python train_models.py  →  uvicorn main:app --reload</code></p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/50 border border-border flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
          {tab === 'predict'   && <PredictTab   role={role} />}
          {tab === 'position'  && <PositionTab  role={role} />}
          {tab === 'seniors'   && <SeniorsTab   />}
          {tab === 'lifecycle' && <LifecycleTab role={role} />}
          {tab === 'metrics'   && <MetricsTab   />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
