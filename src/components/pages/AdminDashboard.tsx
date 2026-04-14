import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Activity, Shield, TrendingUp, Search,
  Award, BookOpen, Settings, Mic, Calendar, Trash2,
  RefreshCw, Bell, UserPlus, CheckCircle2
} from 'lucide-react';
import { loadAccounts, roleLabels, deleteAccountById, ADMIN_EMAIL } from '@/lib/store';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Input } from '@/components/ui/input';

const initialSpeakers = [
  { id: 's1', name: 'Priya Sharma', company: 'Google India', topic: 'Career in AI/ML', date: '2026-04-15', time: '4:00 PM', status: 'upcoming', registered: 234 },
  { id: 's2', name: 'Rahul Mehta', company: 'Microsoft', topic: 'Breaking into Big Tech', date: '2026-04-22', time: '5:00 PM', status: 'upcoming', registered: 189 },
  { id: 's3', name: 'Dr. Ananya Krishnan', company: 'IIT Bombay', topic: 'Research vs Industry', date: '2026-03-30', time: '3:00 PM', status: 'completed', registered: 312 },
];

const initialConferences = [
  { id: 'c1', name: 'TechCareers India 2026', organizer: 'NASSCOM', date: '2026-05-10', type: 'Hybrid', registered: 1200 },
  { id: 'c2', name: 'Campus Placement Summit', organizer: 'PathFinder AI', date: '2026-04-28', type: 'Virtual', registered: 875 },
  { id: 'c3', name: 'STEM Careers Expo', organizer: 'IIT Delhi', date: '2026-06-05', type: 'Offline', registered: 650 },
];

interface AdminDashboardProps { section: string; }

function OverviewSection({ accounts }: { accounts: ReturnType<typeof loadAccounts> }) {
  const totalUsers = accounts.length;
  const students = accounts.filter(a => ['class10','class12','college','graduate'].includes(a.role)).length;
  const parents = accounts.filter(a => a.role === 'parent').length;
  const avgXP = Math.round(accounts.reduce((s, a) => s + (a.xp || 0), 0) / (totalUsers || 1));

  const activityData = [
    { day: 'Mon', users: Math.max(1, Math.floor(totalUsers * 0.4)) },
    { day: 'Tue', users: Math.max(1, Math.floor(totalUsers * 0.55)) },
    { day: 'Wed', users: Math.max(1, Math.floor(totalUsers * 0.48)) },
    { day: 'Thu', users: Math.max(1, Math.floor(totalUsers * 0.65)) },
    { day: 'Fri', users: Math.max(1, Math.floor(totalUsers * 0.72)) },
    { day: 'Sat', users: Math.max(1, Math.floor(totalUsers * 0.88)) },
    { day: 'Sun', users: Math.max(1, Math.floor(totalUsers * 0.95)) },
  ];

  const roleCounts: Record<string,number> = {};
  accounts.forEach(a => { roleCounts[a.role] = (roleCounts[a.role]||0)+1; });
  const roleColors = ['#0ea5e9','#10b981','#f59e0b','#8b5cf6','#ef4444'];
  const roleData = Object.keys(roleCounts).map((role,i)=>({ name: roleLabels[role as keyof typeof roleLabels]||role, value: roleCounts[role], color: roleColors[i%roleColors.length] }));
  const recentSignups = [...accounts].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Students', value: students, icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Parents', value: parents, icon: Users, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Avg XP', value: avgXP.toLocaleString(), icon: Award, color: 'text-info', bg: 'bg-info/10' },
        ].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="bg-gradient-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`}/>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-card border border-border rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary"/> Platform Activity
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" vertical={false}/>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'hsl(215, 14%, 55%)',fontSize:12}}/>
              <YAxis axisLine={false} tickLine={false} tick={{fill:'hsl(215, 14%, 55%)',fontSize:12}}/>
              <Tooltip contentStyle={{backgroundColor:'hsl(220, 18%, 8%)',border:'1px solid hsl(220, 14%, 16%)',borderRadius:'8px'}} itemStyle={{color:'hsl(160, 84%, 44%)'}}/>
              <Area type="monotone" dataKey="users" stroke="hsl(160, 84%, 44%)" strokeWidth={2.5} fill="url(#aGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-card border border-border rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-foreground mb-4">User Demographics</h2>
          {roleData.length===0 ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No users yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                    {roleData.map((_,i)=><Cell key={i} fill={roleData[i].color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor:'hsl(220, 18%, 8%)',border:'1px solid hsl(220, 14%, 16%)',borderRadius:'8px',color:'white'}}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {roleData.map(r=>(
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:r.color}}/>
                      <span className="text-foreground">{r.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{r.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-gradient-card border border-border rounded-xl p-6">
        <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary"/> Recent Signups
        </h2>
        {recentSignups.length===0 ? <p className="text-muted-foreground text-sm">No signups yet.</p> : (
          <div className="space-y-3">
            {recentSignups.map(u=>(
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {u.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary border border-border text-foreground shrink-0">{roleLabels[u.role]}</span>
                <span className="text-xs text-muted-foreground shrink-0">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label:'System Status', value:'Operational', color:'text-primary', bg:'bg-primary/10', icon:CheckCircle2 },
          { label:'Server Uptime', value:'99.9%', color:'text-accent', bg:'bg-accent/10', icon:Activity },
          { label:'Data Security', value:'Secure', color:'text-warning', bg:'bg-warning/10', icon:Shield },
        ].map(s=>(
          <div key={s.label} className={`${s.bg} border border-border rounded-xl p-4 flex items-center gap-4`}>
            <s.icon className={`w-6 h-6 ${s.color}`}/>
            <div>
              <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersSection({ accounts, onRefresh }: { accounts: ReturnType<typeof loadAccounts>; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string|null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [announceSent, setAnnounceSent] = useState(false);

  const filtered = accounts.filter(a => {
    const ms = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    return ms && (roleFilter==='all' || a.role===roleFilter);
  });

  const handleDelete = (id: string) => { deleteAccountById(id); onRefresh(); setConfirmDelete(null); };
  const handleAnnounce = () => { if(!announcement.trim()) return; setAnnounceSent(true); setAnnouncement(''); setTimeout(()=>setAnnounceSent(false),3000); };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-card border border-border rounded-xl p-5">
        <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary"/> Send Announcement
        </h2>
        <div className="flex gap-3">
          <Input value={announcement} onChange={e=>setAnnouncement(e.target.value)} placeholder="Type a message to all users..." className="bg-secondary border-border"/>
          <button onClick={handleAnnounce} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 whitespace-nowrap">
            {announceSent ? '✓ Sent!' : 'Send'}
          </button>
        </div>
      </div>

      <div className="bg-gradient-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">User Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {accounts.length} users</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <Input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 bg-secondary border-border w-40"/>
            </div>
            <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none">
              <option value="all">All Roles</option>
              <option value="class10">Class 10</option>
              <option value="class12">Class 11-12</option>
              <option value="college">College</option>
              <option value="graduate">Graduate</option>
              <option value="parent">Parent</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">XP</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5">Invite Code</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length===0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No users found.</td></tr>
              ) : filtered.map(u=>(
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{u.name[0]?.toUpperCase()}</div>
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-full bg-secondary text-foreground text-xs font-medium border border-border">{roleLabels[u.role]}</span></td>
                  <td className="px-5 py-4 font-medium text-primary">{(u.xp||0).toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-mono text-xs text-foreground">{u.parentCode||'—'}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={()=>setConfirmDelete(u.id)} className="p-2 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-card border border-destructive/30 rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-destructive"/>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">Delete User?</h3>
              <p className="text-sm text-muted-foreground mb-5">This action is permanent and cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={()=>setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium">Cancel</button>
                <button onClick={()=>handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-medium">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpeakersSection() {
  const [speakers, setSpeakers] = useState(initialSpeakers);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({name:'',company:'',topic:'',date:'',time:'4:00 PM'});
  const add = () => {
    if(!form.name||!form.company||!form.topic||!form.date) return;
    setSpeakers(p=>[...p,{...form,id:`s${Date.now()}`,status:'upcoming',registered:0}]);
    setForm({name:'',company:'',topic:'',date:'',time:'4:00 PM'}); setAdding(false);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-xl font-bold text-foreground">Speaker Sessions</h2><p className="text-sm text-muted-foreground">{speakers.length} sessions</p></div>
        <button onClick={()=>setAdding(!adding)} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">+ Add Session</button>
      </div>
      {adding && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-gradient-card border border-primary/30 rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">New Speaker Session</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[{k:'name',l:'Speaker Name',p:'Dr. Jane Doe'},{k:'company',l:'Company',p:'Google India'},{k:'topic',l:'Topic',p:'AI/ML Careers'},{k:'date',l:'Date',p:'',t:'date'},{k:'time',l:'Time',p:'4:00 PM'}].map(f=>(
              <div key={f.k}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.l}</label>
                <Input type={f.t||'text'} value={form[f.k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} className="bg-secondary border-border"/>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={()=>setAdding(false)} className="flex-1 py-2 rounded-xl bg-secondary text-foreground text-sm">Cancel</button>
            <button onClick={add} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Save</button>
          </div>
        </motion.div>
      )}
      <div className="space-y-3">
        {speakers.map(s=>(
          <div key={s.id} className="bg-gradient-card border border-border rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Mic className="w-6 h-6 text-primary"/></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{s.company}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status==='completed'?'bg-primary/10 text-primary':'bg-warning/10 text-warning'}`}>{s.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{s.topic}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.date} · {s.time} · {s.registered} registered</p>
            </div>
            <button onClick={()=>setSpeakers(p=>p.filter(x=>x.id!==s.id))} className="p-2 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConferencesSection() {
  const [conferences, setConfs] = useState(initialConferences);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({name:'',organizer:'',date:'',type:'Virtual'});
  const add = () => {
    if(!form.name||!form.organizer||!form.date) return;
    setConfs(p=>[...p,{...form,id:`c${Date.now()}`,registered:0}]);
    setForm({name:'',organizer:'',date:'',type:'Virtual'}); setAdding(false);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-xl font-bold text-foreground">Conferences</h2><p className="text-sm text-muted-foreground">{conferences.length} conferences</p></div>
        <button onClick={()=>setAdding(!adding)} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">+ Add Conference</button>
      </div>
      {adding && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="bg-gradient-card border border-primary/30 rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">New Conference</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[{k:'name',l:'Name',p:'TechCareers 2026'},{k:'organizer',l:'Organizer',p:'NASSCOM'},{k:'date',l:'Date',p:'',t:'date'}].map(f=>(
              <div key={f.k}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.l}</label>
                <Input type={f.t||'text'} value={form[f.k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} className="bg-secondary border-border"/>
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none">
                <option>Virtual</option><option>Hybrid</option><option>Offline</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={()=>setAdding(false)} className="flex-1 py-2 rounded-xl bg-secondary text-foreground text-sm">Cancel</button>
            <button onClick={add} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Save</button>
          </div>
        </motion.div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {conferences.map(c=>(
          <div key={c.id} className="bg-gradient-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.type==='Virtual'?'bg-info/10 text-info':c.type==='Hybrid'?'bg-warning/10 text-warning':'bg-accent/10 text-accent'}`}>{c.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.organizer}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.date} · {c.registered.toLocaleString()} registered</p>
              </div>
              <button onClick={()=>setConfs(p=>p.filter(x=>x.id!==c.id))} className="p-2 rounded-lg text-destructive/60 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-6">
      <div><h2 className="font-display text-xl font-bold text-foreground">System Settings</h2><p className="text-sm text-muted-foreground">Configure platform-wide settings</p></div>
      <div className="grid gap-5">
        {[{label:'Platform Name',value:'PathFinder AI',desc:'Displayed across the platform'},{label:'Support Email',value:'support@pathfinderai.in',desc:'Contact email for users'},{label:'Max Free Users',value:'1000',desc:'Limit before payment required'}].map(s=>(
          <div key={s.label} className="bg-gradient-card border border-border rounded-xl p-5">
            <label className="text-sm font-medium text-foreground block mb-1">{s.label}</label>
            <p className="text-xs text-muted-foreground mb-2">{s.desc}</p>
            <Input defaultValue={s.value} className="bg-secondary border-border max-w-sm"/>
          </div>
        ))}
        <div className="bg-gradient-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-3">Admin Account</h3>
          <p className="text-sm text-muted-foreground">Email: <span className="text-foreground font-mono">{ADMIN_EMAIL}</span></p>
          <p className="text-sm text-muted-foreground mt-1">Access Level: <span className="text-primary font-semibold">Super Administrator</span></p>
        </div>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all w-fit">
          {saved?'✓ Saved!':'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ section }: AdminDashboardProps) {
  const [accounts, setAccounts] = useState(()=>loadAccounts());
  const refresh = () => setAccounts(loadAccounts());
  const map: Record<string, React.ReactNode> = {
    overview: <OverviewSection accounts={accounts}/>,
    users: <UsersSection accounts={accounts} onRefresh={refresh}/>,
    speakers: <SpeakersSection/>,
    conferences: <ConferencesSection/>,
    settings: <SettingsSection/>,
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary"/></div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Control Panel</h1>
          <p className="text-sm text-muted-foreground">Total registered users: <strong className="text-primary">{accounts.length}</strong></p>
        </div>
        <button onClick={refresh} className="ml-auto p-2 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4 text-muted-foreground"/>
        </button>
      </div>
      {map[section]||<OverviewSection accounts={accounts}/>}
    </div>
  );
}
