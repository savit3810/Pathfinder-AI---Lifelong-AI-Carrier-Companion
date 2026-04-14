import { useState } from 'react';
import { motion } from 'framer-motion';
import { careerPaths } from '@/lib/careerData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const burnoutFactors: Record<string, { workload: number; competition: number; monotony: number; stress: number }> = {
  swe: { workload: 70, competition: 80, monotony: 30, stress: 65 },
  ds: { workload: 65, competition: 75, monotony: 25, stress: 60 },
  pm: { workload: 75, competition: 70, monotony: 35, stress: 70 },
  design: { workload: 55, competition: 65, monotony: 40, stress: 50 },
  cyber: { workload: 80, competition: 60, monotony: 45, stress: 75 },
  ai: { workload: 85, competition: 90, monotony: 20, stress: 70 },
  ca: { workload: 80, competition: 55, monotony: 60, stress: 72 },
  doctor: { workload: 95, competition: 85, monotony: 30, stress: 90 },
};

export default function CareerSimulation() {
  const [selectedA, setSelectedA] = useState('swe');
  const [selectedB, setSelectedB] = useState('ds');

  const careerA = careerPaths.find((c) => c.id === selectedA)!;
  const careerB = careerPaths.find((c) => c.id === selectedB)!;

  const baseA = parseInt(careerA.salary.replace(/[^0-9]/g, '')) || 8;
  const baseB = parseInt(careerB.salary.replace(/[^0-9]/g, '')) || 10;
  const growthRate = (g: string) => g === 'Very High' ? 0.18 : g === 'High' ? 0.15 : g === 'Stable' ? 0.08 : 0.10;

  const projectionData = Array.from({ length: 6 }, (_, i) => ({
    year: `Year ${i}`,
    [careerA.name]: Math.round(baseA * Math.pow(1 + growthRate(careerA.growth), i)),
    [careerB.name]: Math.round(baseB * Math.pow(1 + growthRate(careerB.growth), i)),
  }));

  const burnA = burnoutFactors[selectedA] || burnoutFactors.swe;
  const burnB = burnoutFactors[selectedB] || burnoutFactors.swe;
  const burnoutScoreA = Math.round((burnA.workload + burnA.competition + burnA.monotony + burnA.stress) / 4);
  const burnoutScoreB = Math.round((burnB.workload + burnB.competition + burnB.monotony + burnB.stress) / 4);

  const riskScore = (career: typeof careerA) => Math.round((100 - career.demand + career.automation) / 2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Career Simulation</h1>
        <p className="text-muted-foreground mt-1">Compare paths, project future, and assess risks</p>
      </div>

      {/* Career Selectors */}
      <div className="grid md:grid-cols-2 gap-4">
        {[{ label: 'Career A', value: selectedA, set: setSelectedA, color: 'primary' },
          { label: 'Career B', value: selectedB, set: setSelectedB, color: 'accent' }].map((sel) => (
          <div key={sel.label} className="bg-gradient-card rounded-xl p-5 border border-border">
            <p className="text-sm text-muted-foreground mb-2">{sel.label}</p>
            <select
              value={sel.value}
              onChange={(e) => sel.set(e.target.value)}
              className="w-full bg-secondary text-foreground border border-border rounded-lg px-3 py-2"
            >
              {careerPaths.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Salary Projection Chart */}
      <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">📈 5-Year Salary Projection (LPA)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
            <XAxis dataKey="year" tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 14%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" LPA" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 8%)', border: '1px solid hsl(220, 14%, 16%)', borderRadius: '8px', color: 'hsl(210, 20%, 95%)' }} />
            <Legend />
            <Line type="monotone" dataKey={careerA.name} stroke="hsl(160, 84%, 44%)" strokeWidth={3} dot={{ fill: 'hsl(160, 84%, 44%)' }} />
            <Line type="monotone" dataKey={careerB.name} stroke="hsl(260, 70%, 60%)" strokeWidth={3} dot={{ fill: 'hsl(260, 70%, 60%)' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Side-by-side Comparison */}
      <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">⚖️ "What If" Comparison</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[{ career: careerA, color: 'primary', burn: burnA, burnScore: burnoutScoreA },
            { career: careerB, color: 'accent', burn: burnB, burnScore: burnoutScoreB }].map(({ career, color, burn, burnScore }) => (
            <div key={career.id} className="space-y-4">
              <h3 className={`font-display text-lg font-semibold text-${color}`}>{career.name}</h3>
              {[
                { label: 'Salary Range', value: career.salary },
                { label: 'Growth', value: career.growth },
                { label: 'Demand', value: `${career.demand}%` },
                { label: 'Automation Risk', value: `${career.automation}%` },
                { label: 'Career Risk Score', value: `${riskScore(career)}/100` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-foreground font-medium">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Required Skills</span>
                <span className="text-foreground font-medium">{career.skills.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {career.skills.map((s) => (
                  <span key={s} className={`px-2 py-0.5 rounded text-xs bg-${color}/10 text-${color}`}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Burnout Predictor */}
      <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/3 to-warning/3" />
        <div className="relative z-10">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">😰 Burnout Risk Predictor</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[{ career: careerA, burn: burnA, score: burnoutScoreA, color: 'primary' },
              { career: careerB, burn: burnB, score: burnoutScoreB, color: 'accent' }].map(({ career, burn, score, color }) => (
              <div key={career.id}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-display font-semibold text-${color}`}>{career.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    score >= 70 ? 'bg-destructive/10 text-destructive' : score >= 50 ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                  }`}>
                    {score}% risk
                  </span>
                </div>
                {Object.entries(burn).map(([key, val]) => (
                  <div key={key} className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="capitalize">{key}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <motion.div
                        className={`h-full rounded-full ${val >= 70 ? 'bg-destructive' : val >= 50 ? 'bg-warning' : 'bg-primary'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Self */}
      <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5" />
        <div className="relative z-10">
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">🔮 Future Self Projection — 5 Years</h2>
          <p className="text-muted-foreground mb-6">Based on {careerA.name} path:</p>
          <div className="grid sm:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="font-display text-3xl font-bold text-primary">₹{projectionData[5][careerA.name]} LPA</p>
              <p className="text-sm text-muted-foreground mt-1">Expected Salary</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="font-display text-3xl font-bold text-accent">Senior</p>
              <p className="text-sm text-muted-foreground mt-1">Expected Level</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="font-display text-3xl font-bold text-info">{careerA.skills.length + 5}</p>
              <p className="text-sm text-muted-foreground mt-1">Skills Mastered</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="font-display text-3xl font-bold text-warning">{riskScore(careerA)}</p>
              <p className="text-sm text-muted-foreground mt-1">Career Risk Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
