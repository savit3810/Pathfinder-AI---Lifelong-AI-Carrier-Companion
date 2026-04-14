import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Globe, Award, Filter, Star, ExternalLink, CheckCircle2, Clock, Zap, Building } from 'lucide-react';

const conferenceData = [
  {
    id: 'c1', name: 'TechCareers India Summit 2026', organizer: 'NASSCOM & PathFinder AI',
    date: '2026-05-10', endDate: '2026-05-11', location: 'Mumbai + Online',
    type: 'Hybrid', category: 'Technology', registered: 1200, capacity: 2000,
    status: 'upcoming', featured: true,
    description: "India's largest career conference for tech students — featuring 40+ speakers from FAANG, unicorns, and top startups. Includes placement fair, workshops, hackathon, and networking dinner.",
    highlights: ['40+ Industry Speakers', 'Placement Fair (50+ Companies)', 'Live Hackathon', 'Resume Review Booths'],
    tags: ['Technology', 'Placement', 'Networking', 'Startups'],
    badge: '🏆 Top Event',
    avatar: '💻'
  },
  {
    id: 'c2', name: 'Campus Placement Summit 2026', organizer: 'PathFinder AI',
    date: '2026-04-28', endDate: '2026-04-28', location: 'Online (Zoom)',
    type: 'Virtual', category: 'Placement', registered: 875, capacity: 1500,
    status: 'upcoming', featured: true,
    description: "A one-day virtual summit exclusively for final-year students preparing for campus placements. Covers DSA, aptitude, group discussions, and HR round preparation.",
    highlights: ['Live DSA Mock Contest', 'HR Round Simulation', 'Resume ATS Checker', '1:1 Mentorship Slots'],
    tags: ['Campus Placement', 'DSA', 'Interview Prep', 'Students'],
    badge: '🎓 Student Special',
    avatar: '🏫'
  },
  {
    id: 'c3', name: 'STEM Careers Expo 2026', organizer: 'IIT Delhi & IISc',
    date: '2026-06-05', endDate: '2026-06-07', location: 'IIT Delhi, New Delhi',
    type: 'Offline', category: 'Research & STEM', registered: 650, capacity: 1000,
    status: 'upcoming', featured: false,
    description: "3-day expo covering research, innovation, and STEM careers. Features lab tours, PhD admissions guidance, international scholarship workshops, and talks by IIT professors.",
    highlights: ['PhD Admissions Guidance', 'International Scholarship Workshops', 'Lab Tours', 'Research Paper Presentations'],
    tags: ['STEM', 'Research', 'PhD', 'IIT'],
    badge: null,
    avatar: '🔬'
  },
  {
    id: 'c4', name: 'India Startup Career Fair 2026', organizer: 'Inc42 & Sequoia India',
    date: '2026-06-20', endDate: '2026-06-20', location: 'Bangalore + Online',
    type: 'Hybrid', category: 'Startups', registered: 430, capacity: 800,
    status: 'upcoming', featured: false,
    description: "Connect with 100+ YC-backed and Sequoia-funded startups hiring freshers and experienced talent. Direct interviews on-site. Equity crash course included.",
    highlights: ['100+ Startups Hiring', 'Direct On-site Interviews', 'Equity Masterclass', 'Founder AMA Sessions'],
    tags: ['Startups', 'Entrepreneurship', 'Funding', 'Hiring'],
    badge: '🚀 Fast Hiring',
    avatar: '🦄'
  },
  {
    id: 'c5', name: 'Women in Tech India Conference', organizer: 'GirlScript Foundation',
    date: '2026-07-15', endDate: '2026-07-16', location: 'Pune + Online',
    type: 'Hybrid', category: 'Diversity & Inclusion', registered: 780, capacity: 1200,
    status: 'upcoming', featured: true,
    description: "Empowering women in technology through workshops, panel discussions, and networking. Features industry leaders from Google, Microsoft, and more sharing their journeys.",
    highlights: ['Panel Discussions with Women Leaders', 'Scholarship Announcements', 'Mentorship Speed Dating', 'Job Board with D&I Commitments'],
    tags: ['Women in Tech', 'Diversity', 'Mentorship', 'Scholarships'],
    badge: '💜 Diversity Event',
    avatar: '👩‍💻'
  },
  {
    id: 'c6', name: 'Global AI & Career Summit', organizer: 'PathFinder AI x Google for Education',
    date: '2026-03-15', endDate: '2026-03-15', location: 'Online',
    type: 'Virtual', category: 'Technology', registered: 2100, capacity: 2000,
    status: 'completed', featured: false,
    description: "The biggest virtual AI career summit in South Asia, with talks from Google Brain, DeepMind, and OpenAI researchers. Recording available.",
    highlights: ['Google Brain Research Talks', 'DeepMind Guest Session', '2100+ Attendees', 'AI Career Roadmaps'],
    tags: ['AI', 'Machine Learning', 'Research', 'Google'],
    badge: '✅ Completed',
    avatar: '🤖'
  },
];

const categories = ['All', 'Technology', 'Placement', 'Research & STEM', 'Startups', 'Diversity & Inclusion'];
const typeColors: Record<string, string> = {
  Virtual: 'bg-info/10 text-info border-info/20',
  Hybrid: 'bg-warning/10 text-warning border-warning/20',
  Offline: 'bg-accent/10 text-accent border-accent/20',
};

export default function ConferenceSessions() {
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'All'|'Virtual'|'Hybrid'|'Offline'>('All');
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const filtered = conferenceData.filter(c => {
    const matchCat = filter === 'All' || c.category === filter;
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    return matchCat && matchType;
  });

  const featured = conferenceData.filter(c => c.featured && c.status === 'upcoming');

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
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Career Conferences</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Conference Sessions</h1>
          <p className="text-muted-foreground max-w-xl">
            Attend India's top career conferences — network with industry leaders, attend workshops, get hired, and accelerate your growth.
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-accent" />
              <span><strong className="text-foreground">6</strong> conferences this season</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span><strong className="text-foreground">6,000+</strong> total registrations</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="w-4 h-4 text-warning" />
              <span><strong className="text-foreground">150+</strong> companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" /> Featured Conferences
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-gradient-card border border-accent/20 rounded-2xl p-5 hover:border-accent/40 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{c.avatar}</span>
                  <div className="flex-1 min-w-0">
                    {c.badge && (
                      <span className="text-xs font-medium text-foreground bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full mb-1 inline-block">{c.badge}</span>
                    )}
                    <h3 className="font-display text-sm font-bold text-foreground leading-snug">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.organizer}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium border ${typeColors[c.type]}`}>{c.type}</span>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {c.highlights.slice(0, 3).map(h => (
                    <li key={h} className="flex items-center gap-2 text-xs text-foreground">
                      <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />{h}
                    </li>
                  ))}
                </ul>
                <div className="w-full bg-secondary rounded-full h-1.5 mb-3">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${Math.min(100, (c.registered / c.capacity) * 100)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mb-3">{c.registered.toLocaleString()}/{c.capacity.toLocaleString()} registered</p>
                <button onClick={() => toggleRegister(c.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${registered.has(c.id) ? 'bg-accent/10 text-accent border border-accent/30' : 'bg-gradient-primary text-primary-foreground hover:opacity-90'}`}
                >
                  {registered.has(c.id) ? '✓ Registered' : 'Register Free →'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <div className="flex gap-2 flex-wrap items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${filter === cat ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}
            >{cat}</button>
          ))}
        </div>
        <div className="sm:ml-auto flex gap-2">
          {(['All','Virtual','Hybrid','Offline'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${typeFilter === t ? 'bg-accent/10 text-accent border border-accent/30' : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'}`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* All Conferences */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No conferences match the current filter.</div>
        ) : filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-gradient-card border rounded-xl p-5 hover:border-accent/30 transition-all ${c.status === 'completed' ? 'opacity-75 border-border' : 'border-border'}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <span className="text-4xl mt-1 shrink-0">{c.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                  <h3 className="font-display text-base font-bold text-foreground">{c.name}</h3>
                  {c.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 font-medium">{c.badge}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeColors[c.type]}`}>{c.type}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{c.organizer}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {c.highlights.map(h => (
                    <span key={h} className="flex items-center gap-1 text-xs bg-secondary border border-border rounded-lg px-2 py-1 text-foreground">
                      <Zap className="w-3 h-3 text-primary" /> {h}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{t}</span>)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0 min-w-[140px]">
                <div className="text-right text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" />{c.date}{c.endDate !== c.date ? ` – ${c.endDate}` : ''}</p>
                  <p className="flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" />{c.location}</p>
                  <p className="flex items-center gap-1 justify-end"><Users className="w-3 h-3" />{c.registered.toLocaleString()} attending</p>
                </div>
                {c.status === 'upcoming' ? (
                  <button onClick={() => toggleRegister(c.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${registered.has(c.id) ? 'bg-accent/10 text-accent border border-accent/30' : 'bg-gradient-primary text-primary-foreground hover:opacity-90'}`}
                  >
                    {registered.has(c.id) ? '✓ Registered' : 'Register Free'}
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl text-sm font-medium bg-secondary border border-border text-muted-foreground">Completed</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
