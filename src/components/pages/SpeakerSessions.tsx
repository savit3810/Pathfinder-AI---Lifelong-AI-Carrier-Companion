import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Calendar, Clock, Users, Star, Filter, ChevronRight, ExternalLink, Play, CheckCircle2, Building } from 'lucide-react';

const speakerData = [
  {
    id: 's1', name: 'Priya Sharma', title: 'Senior ML Engineer', company: 'Google India',
    topic: 'Breaking into AI/ML: From Student to Googler',
    date: '2026-04-15', time: '4:00 PM IST', duration: '60 min',
    category: 'AI/ML', registered: 234, capacity: 500,
    status: 'upcoming', featured: true,
    description: 'Priya shares her journey from a Tier-2 college to Google, covering the skills, projects, and mindset that made the difference. Includes live Q&A.',
    tags: ['Machine Learning', 'Career Switch', 'Google', 'Interview Tips'],
    avatar: '🎯'
  },
  {
    id: 's2', name: 'Rahul Mehta', title: 'Product Manager', company: 'Microsoft',
    topic: 'From Engineering to Product: PM Career Guide',
    date: '2026-04-22', time: '5:00 PM IST', duration: '45 min',
    category: 'Product Management', registered: 189, capacity: 400,
    status: 'upcoming', featured: true,
    description: 'Rahul decodes the PM role, the transition from engineering, and how to crack PM interviews at top tech companies.',
    tags: ['Product Management', 'Career Switch', 'Microsoft', 'Leadership'],
    avatar: '📱'
  },
  {
    id: 's3', name: 'Dr. Ananya Krishnan', title: 'Associate Professor & Industry Advisor', company: 'IIT Bombay',
    topic: 'Research vs Industry: Making the Right Choice',
    date: '2026-03-30', time: '3:00 PM IST', duration: '75 min',
    category: 'Higher Education', registered: 312, capacity: 300,
    status: 'completed', featured: false,
    description: 'Dr. Krishnan dives into the pros and cons of academia vs industry, and how to decide between an MS, PhD, or direct placement.',
    tags: ['Research', 'IIT', 'PhD', 'Higher Education'],
    avatar: '🎓'
  },
  {
    id: 's4', name: 'Arjun Nair', title: 'Cybersecurity Architect', company: 'Palo Alto Networks',
    topic: 'Cybersecurity in 2026: Skills, Certs & Salaries',
    date: '2026-05-05', time: '6:00 PM IST', duration: '60 min',
    category: 'Cybersecurity', registered: 98, capacity: 350,
    status: 'upcoming', featured: false,
    description: 'Arjun breaks down the fastest-growing field in tech — from ethical hacking to cloud security, with real salary benchmarks.',
    tags: ['Cybersecurity', 'Ethical Hacking', 'Career Growth', 'Certifications'],
    avatar: '🔐'
  },
  {
    id: 's5', name: 'Sneha Reddy', title: 'UX Design Lead', company: 'Flipkart',
    topic: 'Design Careers: Breaking In Without a Design Degree',
    date: '2026-05-12', time: '4:30 PM IST', duration: '50 min',
    category: 'Design', registered: 145, capacity: 400,
    status: 'upcoming', featured: false,
    description: 'Sneha went from a commerce background to leading UX at Flipkart. She shares her portfolio strategy and non-traditional entry path.',
    tags: ['UX Design', 'Portfolio', 'Career Switch', 'Flipkart'],
    avatar: '🎨'
  },
  {
    id: 's6', name: 'Vikram Joshi', title: 'Founding Engineer', company: 'Zepto (YC W21)',
    topic: 'Startup Engineering: What No One Tells You',
    date: '2026-05-20', time: '7:00 PM IST', duration: '60 min',
    category: 'Startups', registered: 203, capacity: 500,
    status: 'upcoming', featured: true,
    description: 'Vikram shares the realities of working at a fast-growing startup — equity, role breadth, culture, and how to join one fresh out of college.',
    tags: ['Startups', 'Founding Team', 'Equity', 'YC'],
    avatar: '🚀'
  },
];

const categories = ['All', 'AI/ML', 'Product Management', 'Higher Education', 'Cybersecurity', 'Design', 'Startups'];
const categoryColors: Record<string, string> = {
  'AI/ML': 'bg-primary/10 text-primary border-primary/20',
  'Product Management': 'bg-accent/10 text-accent border-accent/20',
  'Higher Education': 'bg-warning/10 text-warning border-warning/20',
  'Cybersecurity': 'bg-destructive/10 text-destructive border-destructive/20',
  'Design': 'bg-info/10 text-info border-info/20',
  'Startups': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function SpeakerSessions() {
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all'|'upcoming'|'completed'>('all');
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const filtered = speakerData.filter(s => {
    const matchCat = filter === 'All' || s.category === filter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchCat && matchStatus;
  });

  const featured = speakerData.filter(s => s.featured && s.status === 'upcoming');

  const toggleRegister = (id: string) => {
    setRegistered(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-card border border-border rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Live Industry Sessions</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Industry Speaker Sessions</h1>
          <p className="text-muted-foreground max-w-xl">
            Learn directly from professionals at top companies. Get real insights on careers, skills, and the industry — no fluff, just honest guidance.
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span><strong className="text-foreground">1,200+</strong> students registered</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mic className="w-4 h-4 text-accent" />
              <span><strong className="text-foreground">6</strong> sessions this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" /> Featured Sessions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-gradient-card border border-primary/20 rounded-2xl p-5 relative overflow-hidden hover:border-primary/40 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">{s.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.title} · {s.company}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${categoryColors[s.category] || 'bg-secondary text-muted-foreground border-border'}`}>{s.category}</span>
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-2 leading-snug">{s.topic}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.time}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.registered}/{s.capacity}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 mb-4">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${Math.min(100, (s.registered / s.capacity) * 100)}%` }} />
                </div>
                <button
                  onClick={() => toggleRegister(s.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${registered.has(s.id) ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-gradient-primary text-primary-foreground hover:opacity-90'}`}
                >
                  {registered.has(s.id) ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Registered</span> : 'Register Free →'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground mt-2" />
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${filter === c ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}
            >{c}</button>
          ))}
        </div>
        <div className="sm:ml-auto flex gap-2">
          {(['all','upcoming','completed'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-accent/10 text-accent border border-accent/30' : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'}`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* All Sessions */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No sessions match the current filter.</div>
        ) : filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-gradient-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-3xl shrink-0">{s.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display text-base font-bold text-foreground">{s.topic}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${categoryColors[s.category] || ''}`}>{s.category}</span>
                  {s.status === 'completed' && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Completed</span>}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{s.name} · {s.title} · {s.company}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{t}</span>)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-right text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" /> {s.date}</p>
                  <p className="flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {s.time}</p>
                  <p className="flex items-center gap-1 justify-end"><Users className="w-3 h-3" /> {s.registered} registered</p>
                </div>
                {s.status === 'upcoming' ? (
                  <button onClick={() => toggleRegister(s.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${registered.has(s.id) ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-gradient-primary text-primary-foreground hover:opacity-90'}`}
                  >
                    {registered.has(s.id) ? '✓ Registered' : 'Register Free'}
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all">
                    <Play className="w-3.5 h-3.5" /> Watch Recording
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
