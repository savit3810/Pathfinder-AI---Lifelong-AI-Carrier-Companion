import { useState } from 'react';
import { motion } from 'framer-motion';
import { skillCategories, careerPaths } from '@/lib/careerData';
import { useAppStore } from '@/lib/store';

export default function SkillAnalysis() {
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  const [userSkills, setUserSkills] = useState<Record<string, number>>(
    Object.fromEntries((user?.skills || []).map((s) => [s, 70]))
  );
  const [targetCareer, setTargetCareer] = useState(careerPaths[0].id);

  const target = careerPaths.find((c) => c.id === targetCareer)!;

  const toggleSkill = (skill: string) => {
    setUserSkills((prev) => {
      if (skill in prev) {
        const { [skill]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [skill]: 50 };
    });
  };

  const setLevel = (skill: string, level: number) => {
    setUserSkills((prev) => ({ ...prev, [skill]: level }));
  };

  const overallMatch = target.skills.reduce((sum, s) => sum + (userSkills[s] || 0), 0) / (target.skills.length * 100) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-1">Compare your skills against career requirements</p>
      </div>

      {/* Target Career Selector */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border">
        <h2 className="font-display font-semibold text-foreground mb-3">Target Career</h2>
        <div className="flex flex-wrap gap-2">
          {careerPaths.map((c) => (
            <button
              key={c.id}
              onClick={() => setTargetCareer(c.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                targetCareer === c.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-gradient-card rounded-2xl p-8 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Skill Heatmap — {target.name}</h2>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-primary">{Math.round(overallMatch)}%</p>
            <p className="text-xs text-muted-foreground">Overall Match</p>
          </div>
        </div>

        <div className="space-y-4">
          {target.skills.map((skill, i) => {
            const level = userSkills[skill] || 0;
            const color = level >= 70 ? 'bg-primary' : level >= 40 ? 'bg-warning' : 'bg-destructive';
            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{skill}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{level}%</span>
                    <button
                      onClick={() => toggleSkill(skill)}
                      className={`text-xs px-2 py-0.5 rounded ${level > 0 ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}
                    >
                      {level > 0 ? 'Have' : 'Add'}
                    </button>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-secondary cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  setLevel(skill, Math.max(10, Math.min(100, pct)));
                }}>
                  <motion.div
                    className={`h-full rounded-full ${color}`}
                    animate={{ width: `${level}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* All Skills */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border">
        <h2 className="font-display font-semibold text-foreground mb-4">All Skills — Click to add</h2>
        <div className="space-y-4">
          {skillCategories.map((cat) => (
            <div key={cat.name}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{cat.name}</p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      skill in userSkills
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-secondary text-muted-foreground border border-border hover:border-primary/30'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
