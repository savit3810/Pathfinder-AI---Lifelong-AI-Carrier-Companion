import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, DollarSign, Zap } from 'lucide-react';
import { careerPaths } from '@/lib/careerData';

export default function CareerExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = careerPaths.find((c) => c.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Career Explorer</h1>
        <p className="text-muted-foreground mt-1">Explore careers with demand, risk, and salary insights.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {careerPaths.map((career, i) => (
          <motion.button
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(career.id)}
            className={`text-left p-5 rounded-xl border transition-all duration-200 ${
              selected === career.id
                ? 'border-primary bg-primary/5 glow-primary'
                : 'border-border bg-gradient-card hover:border-primary/30'
            }`}
          >
            <h3 className="font-display font-semibold text-foreground mb-2">{career.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">{career.growth}</span>
              <span>{career.salary}</span>
            </div>
            {/* Demand bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Demand</span>
                <span>{career.demand}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${career.demand}%` }} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-card rounded-2xl p-8 border border-border"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">{active.name}</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Demand</p>
                <p className="font-display font-bold text-foreground">{active.demand}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Automation Risk</p>
                <p className="font-display font-bold text-foreground">{active.automation}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salary Range</p>
                <p className="font-display font-bold text-foreground">{active.salary}</p>
              </div>
            </div>
          </div>

          <h3 className="font-display font-semibold text-foreground mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {active.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>

          {/* Career Risk Score */}
          <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
            <h4 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" /> Career Risk Score
            </h4>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-display font-bold text-foreground">
                {Math.round((100 - active.demand + active.automation) / 2)}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {active.automation < 20 ? 'Low risk — this career is resilient to automation.' : 'Moderate risk — keep upskilling to stay competitive.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
