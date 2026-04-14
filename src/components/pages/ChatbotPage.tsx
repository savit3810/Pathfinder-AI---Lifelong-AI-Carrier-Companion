import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';

interface Message { role: 'user'|'assistant'; content: string; }

// ─── Smart AI Brain ─────────────────────────────────────────────────────────
function buildResponse(input: string, userName: string, role: string): string {
  const q = input.toLowerCase();
  const n = userName;

  // Greetings
  if (/^(hi|hello|hey|good morning|good evening|namaste)\b/.test(q)) {
    return `## 👋 Hello, ${n}!\n\nI'm your **AI Career Mentor** on PathFinder AI. I can help you with:\n\n- 🎯 **Career path selection** & comparisons\n- 📚 **Entrance exam** guidance (JEE, NEET, GATE, CAT)\n- 💡 **Skill development** roadmaps\n- 🎤 **Interview prep** strategies\n- 📄 **Resume & portfolio** tips\n- 🔄 **Career switching** plans\n\nWhat's on your mind today?`;
  }

  // Stream selection (Class 10)
  if (q.includes('stream') || q.includes('science') && q.includes('commerce') || q.includes('arts') || q.includes('pcm') || q.includes('pcb')) {
    return `## 🔬 Stream Selection Guide\n\nHi ${n}! Choosing your stream after Class 10 is crucial. Here's a breakdown:\n\n### 🔬 Science (PCM)\n- Best for: Engineering, Architecture, IT, Defence\n- Key exams: JEE Main, JEE Advanced, BITSAT\n- Avg salary: ₹6–25 LPA (entry level)\n\n### 🧬 Science (PCB)\n- Best for: Medicine, Pharmacy, Biotechnology\n- Key exams: NEET UG, AIIMS, JIPMER\n- Avg salary: ₹5–20 LPA (entry level)\n\n### 📊 Commerce\n- Best for: CA, Finance, Banking, Business\n- Key exams: CA Foundation, CMA, CS\n- Avg salary: ₹5–18 LPA (entry level)\n\n### 🎨 Arts/Humanities\n- Best for: Law, Psychology, Journalism, Design\n- Key exams: CLAT, NID, NLUs\n- Avg salary: ₹4–15 LPA (entry level)\n\n> 💡 **Pro Tip:** Don't choose based on peer pressure. Take the **Career DNA Quiz** to discover your natural strengths!\n\n*Want me to compare specific careers in any stream?*`;
  }

  // JEE / Engineering
  if (q.includes('jee') || (q.includes('engineer') && (q.includes('how') || q.includes('prepare') || q.includes('exam')))) {
    return `## 📐 JEE Preparation Strategy\n\nGreat goal, ${n}! Here's your JEE roadmap:\n\n### 📅 Timeline (12-18 months)\n| Phase | Focus |\n|---|---|\n| Month 1-3 | NCERT mastery (Physics, Chemistry, Math) |\n| Month 4-8 | Concept deep-dives + topic tests |\n| Month 9-12 | Previous year papers + mock tests |\n| Month 13+ | Revision & weak area targeting |\n\n### 📚 Best Resources\n- **Physics**: HC Verma, DC Pandey\n- **Chemistry**: NCERT + MS Chouhan (Organic)\n- **Math**: RD Sharma, Cengage\n\n### ⚡ Daily Routine\n1. Morning: Theory (2 hrs)\n2. Afternoon: Practice problems (3 hrs)\n3. Evening: Revision + notes (1 hr)\n4. Night: Mock test analysis (1 hr)\n\n> 🎯 Target: 95+ percentile in JEE Main → JEE Advanced → IIT\n\n*Use the Roadmap page to set your JEE milestone calendar!*`;
  }

  // NEET / Medical
  if (q.includes('neet') || q.includes('mbbs') || q.includes('medical') || q.includes('doctor')) {
    return `## 🩺 NEET Preparation Guide\n\nMedicine is a noble goal, ${n}! Here's your strategy:\n\n### 🎯 NEET 2026 Key Info\n- **Date**: May 2026\n- **Total Marks**: 720 (180 questions × 4)\n- **Subjects**: Biology (360) + Physics (180) + Chemistry (180)\n- **Qualifying**: 50th percentile for General\n\n### 📖 Subject Strategy\n| Subject | Weight | Focus Areas |\n|---|---|---|\n| Biology | 50% | NCERT line by line |\n| Chemistry | 25% | Org. reactions + NCERT |\n| Physics | 25% | Numericals + theory |\n\n### 💡 Top Tips\n1. **Biology is the game-changer** — at least 340/360 is essential\n2. Solve 10 years of previous papers\n3. Join a test series with AIR ranking\n4. Target 600+ for top government colleges\n\n> 🏆 Top colleges: AIIMS Delhi, JIPMER, MAMC, Grant Medical`;
  }

  // CAT / MBA
  if (q.includes('cat') || q.includes('mba') || q.includes('management')) {
    return `## 📈 CAT & MBA Roadmap\n\nExcellent ambition, ${n}! Here's everything you need:\n\n### 📊 CAT Sections\n| Section | Time | Score Weight |\n|---|---|---|\n| VARC | 40 min | 34 questions |\n| DILR | 40 min | 32 questions |\n| QA | 40 min | 34 questions |\n\n### 🎯 Score Targets\n- **IIM ABC**: 99+ percentile\n- **IIM New IIMs**: 95-98 percentile\n- **XLRI, MDI, IIFT**: 92-96 percentile\n\n### 📅 6-Month Plan\n- Month 1-2: Concepts (QA + Vocab building)\n- Month 3-4: DILR practice + VARC strategies\n- Month 5-6: Full mocks + analysis\n\n> 💡 Reading 1 editorial/article daily boosts VARC by 15-20%`;
  }

  // Career comparison
  if (q.includes('vs') && (q.includes('data') || q.includes('software') || q.includes('engineer') || q.includes('product') || q.includes('design'))) {
    if (q.includes('data science') || (q.includes('data') && q.includes('software'))) {
      return `## 📊 Software Engineer vs Data Scientist\n\n| Factor | Software Engineer | Data Scientist |\n|---|---|---|\n| **Avg Salary** | ₹8–25 LPA | ₹10–30 LPA |\n| **Demand (2026)** | 🔥 Very High | 🔥 Very High |\n| **Entry Level** | Easier (more roles) | Moderate (upskilling needed) |\n| **Core Skills** | DSA, System Design | ML, Stats, Python |\n| **Growth Ceiling** | Very High | Very High |\n| **Automation Risk** | 15% | 20% |\n\n### 🤔 Which Should YOU Choose?\n- **Choose SWE if**: You enjoy building products, logic, and systems\n- **Choose DS if**: You love patterns, math, and making data tell stories\n\n> 💡 **Hot Hybrid**: ML Engineer (combines both!) — highest demand, ₹15–50 LPA\n\n*Use Career Simulation to project 5-year earnings for each path!*`;
    }
    return `## 🔍 Career Comparison\n\n${n}, that's a great question! Career choices depend on:\n\n### Key Comparison Factors\n1. **Salary trajectory** — entry level vs senior\n2. **Demand growth** — check job boards for openings\n3. **Skill alignment** — what comes naturally to you?\n4. **Work-life balance** — some careers demand 70+ hrs/week\n5. **Automation risk** — future-proof your choice\n\n> 💡 Try asking: *"Compare SWE vs Data Scientist"* or *"Compare Product Manager vs Developer"* for specific data!\n\n*Use the Career Simulation tool to model financial outcomes for any 2 careers side by side.*`;
  }

  // Internship
  if (q.includes('internship')) {
    return `## 💼 Internship Strategy for ${n}\n\n### 🎯 Where to Find Internships\n| Platform | Best For |\n|---|---|\n| **Internshala** | Diverse roles, stipend-based |\n| **LinkedIn** | Top companies, networking |\n| **AngelList (Wellfound)** | Startups |\n| **Unstop** | Competitions + PPOs |\n| **Company Websites** | Direct applications |\n\n### 📋 Application Tips\n1. **Customize each cover letter** (never send generic)\n2. Cold email HR: 200-word email with your value proposition\n3. Aim for 30+ applications/week\n4. **Portfolio projects** > marks in most tech internships\n\n### ✅ What Interviewers Look For\n- 1-2 relevant projects with GitHub links\n- Communication & problem-solving ability\n- Enthusiasm & cultural fit\n- Basic domain knowledge\n\n> 🏆 Target 3+month internships for better PPO conversion rates`;
  }

  // Resume
  if (q.includes('resume') || q.includes('cv')) {
    return `## 📄 Resume Building Guide\n\nHere's what top recruiters actually want to see, ${n}:\n\n### ✅ Must-Have Sections (in order)\n1. **Header** — Name, Phone, Email, LinkedIn, GitHub\n2. **Summary** — 2-line value proposition\n3. **Skills** — Technical + soft skills, categorized\n4. **Experience** — Internships with measurable impact\n5. **Projects** — 3-4 with tech stack + GitHub link\n6. **Education** — CGPA if > 7.5, relevant coursework\n7. **Certifications** — Only relevant ones\n\n### ⚠️ Common Mistakes\n- ❌ Generic objective statements\n- ❌ No quantified achievements\n- ❌ Inconsistent formatting\n- ❌ Longer than 1 page (for freshers)\n\n### 💡 ATS Optimization\n- Use keywords from the job description\n- Avoid tables/columns in ATS submissions\n- Use action verbs: *built, designed, optimized, led*\n\n> 🔧 Use the **Resume Analyzer** on PathFinder to get an ATS score + detailed feedback!`;
  }

  // Interview prep
  if (q.includes('interview')) {
    return `## 🎤 Interview Mastery Guide\n\n${n}, here's your complete interview playbook:\n\n### 🧠 Technical Interviews\n| Round | Focus |\n|---|---|\n| Online Assessment | DSA, Aptitude |\n| Technical Round 1 | DSA + Projects |\n| Technical Round 2 | System Design |\n| HR Round | Culture fit, Goals |\n\n### 📝 The STAR Method (Behavioral)\n- **S**ituation → Set the scene\n- **T**ask → What was your responsibility?\n- **A**ction → What did YOU specifically do?\n- **R**esult → Quantify the outcome\n\n### 🎯 Preparation Checklist\n- [ ] 75-100 LeetCode problems (Easy + Medium)\n- [ ] 5+ STAR stories prepared\n- [ ] Research company mission, values, recent news\n- [ ] Prepare 3 smart questions for interviewers\n- [ ] Mock interview with a peer or AI simulator\n\n> 🚀 Try the **Interview Simulator** — get real-time AI feedback on your responses!`;
  }

  // Skills
  if (q.includes('skill') || q.includes('learn') || q.includes('course')) {
    return `## ⚡ Top Skills for 2026\n\n### 🔥 High-Demand Technical Skills\n| Skill | Growth | Avg Salary Boost |\n|---|---|---|\n| AI/ML Engineering | +42% | ₹8-15 LPA extra |\n| Cloud (AWS/GCP/Azure) | +35% | ₹5-12 LPA extra |\n| Cybersecurity | +33% | ₹6-14 LPA extra |\n| Full-Stack Dev | +28% | ₹4-10 LPA extra |\n| DevOps & MLOps | +30% | ₹5-13 LPA extra |\n\n### 🎯 Recommended for Your Stage (${role})\n${role === 'Class 10 Student' ? '- Python basics (2 months)\n- Logical thinking & problem solving\n- Digital literacy & MS Office' :
role === 'Class 11-12 Student' ? '- C++ for JEE / Python for projects\n- Excel & basic data analysis\n- Communication skills' :
role === 'College Student' ? '- DSA → System Design\n- One specialization (ML/Cloud/Web)\n- Soft skills: presentation, leadership' :
'- Advanced DSA + System Design\n- Cloud certification (AWS CCP/SAA)\n- Behavioral interview prep'}\n\n### 💡 Free Resources\n- **Coursera** (audit for free)\n- **freeCodeCamp** (full courses)\n- **CS50 Harvard** (best intro to CS)\n- **NPTEL** (IIT professors, free)`;
  }

  // Salary / package
  if (q.includes('salary') || q.includes('package') || q.includes('lpa') || q.includes('ctc')) {
    return `## 💰 Tech Salary Guide India 2026\n\n### Entry Level (0-2 yrs)\n| Role | Median CTC | Top 10% |\n|---|---|---|\n| Software Engineer | ₹8 LPA | ₹25 LPA |\n| Data Analyst | ₹6 LPA | ₹18 LPA |\n| ML Engineer | ₹12 LPA | ₹35 LPA |\n| Product Manager | ₹10 LPA | ₹28 LPA |\n| Cybersecurity Analyst | ₹7 LPA | ₹20 LPA |\n\n### 🚀 How to Maximize Your First CTC\n1. Crack FAANG/MNC campus placements (₹20-45 LPA)\n2. Build strong GitHub + competitive programming profile\n3. Get 2+ internships with PPO potential\n4. Negotiate! Always negotiate — counter by 10-15%\n\n> 💡 City matters: Bangalore > Hyderabad > Pune > Chennai > Delhi for tech roles`;
  }

  // Parent-specific
  if (role.toLowerCase().includes('parent')) {
    return `## 👨‍👩‍👧 Supporting Your Child's Career Journey\n\n${n}, as a parent, here's how you can best support your child:\n\n### 🤝 The Supportive Parent's Role\n- **Listen first** — understand their interests, not just marks\n- **Research together** — explore career options as a team\n- **Avoid comparison** — every child's path is unique\n- **Celebrate small wins** — XP and badges matter to them!\n\n### 📊 Understanding Your Child's Dashboard\n- **XP Points** → Tracks how active they are on the platform\n- **Skills Radar** → Shows strength across key competencies\n- **Career Matches** → AI-recommended careers based on their profile\n- **Milestones** → Key tasks they should be completing\n\n### 🆘 Signs to Watch For\n- Low platform activity over 2+ weeks\n- Declining quiz scores\n- Unread mentor suggestions\n\n> 💡 Use the **Parent Dashboard** to view detailed insights, alerts, and AI-generated recommendations for your child!`;
  }

  // Job search
  if (q.includes('job') || q.includes('placement') || q.includes('hire') || q.includes('campus')) {
    return `## 💼 Job Search Masterplan — ${n}\n\n### 🎯 Campus Placement Strategy\n**Timeline** (starts 6 months before placements):\n1. **CGPA**: Maintain 7+ (eligibility cutoff for most companies)\n2. **DSA**: 100+ LeetCode problems\n3. **Projects**: 2-3 strong portfolio projects\n4. **Profile**: LinkedIn optimized, GitHub active\n\n### 🏢 Off-Campus Strategy\n- Apply on LinkedIn, Naukri, Instahyre, Cutshort\n- Set job alerts for target companies\n- Build referral network (alumni are gold!)\n- Cold message HR/Engineering managers on LinkedIn\n\n### 💡 The 5-Application Rule\nApply to:\n1. Dream company (stretch)\n2. Strong-fit company\n3. Good-fit company × 2\n4. Backup company\n\n> 📊 Track your applications in a spreadsheet — aim for 30+ applications/week`;
  }

  // Default smart fallback
  return `## 💡 PathFinder AI Mentor\n\nThat's a great question, ${n}! Let me guide you:\n\n### 🧭 I Can Help With:\n- **Stream Selection** → "Which stream should I choose after Class 10?"\n- **Exam Prep** → "How do I prepare for JEE/NEET/CAT?"\n- **Career Paths** → "Compare Software Engineer vs Data Scientist"\n- **Skills** → "What skills should I learn in 2026?"\n- **Internships** → "How do I get my first internship?"\n- **Interviews** → "How to crack technical interviews?"\n- **Resume** → "How to build ATS-friendly resume?"\n- **Salaries** → "What's the salary for ML engineers?"\n\n### 🚀 Try These Smart Queries\n- *"I'm in Class 10 — which stream is best for AI?"*\n- *"How to prepare for JEE in 6 months?"*\n- *"What are top skills for placement at Google?"*\n\n*I'm analyzing over 2 million career data points to give you the smartest guidance!* 🤖`;
}

const suggestionsByRole: Record<string, string[]> = {
  class10: ['Which stream is best for AI career?', 'How to prepare for JEE?', 'Compare Science vs Commerce', 'Best careers for creative thinkers'],
  class12: ['JEE vs NEET — which is right for me?', 'How to crack JEE in 6 months?', 'NEET preparation tips', 'What after class 12 without JEE?'],
  college: ['How to get my first internship?', 'Build a resume that beats ATS', 'Top skills for campus placements', 'Compare SWE vs Data Scientist'],
  graduate: ['How to crack FAANG interviews?', 'Salary negotiation tips', 'How to switch into ML/AI?', 'Job search strategy 2026'],
  parent: ['How to support my child\'s career choice?', 'What is JEE/NEET?', 'Good careers for arts students', 'How to read my child\'s dashboard?'],
  admin: ['Platform usage analytics', 'Top career trends 2026', 'How AI mentoring works', 'Skills in demand 2026'],
};

export default function ChatbotPage() {
  const user = useAppStore(s => s.user);
  const role = user?.role || 'college';
  const name = user?.name || 'there';

  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `## 🤖 Hi ${name}! I'm your AI Career Mentor\n\nI'm trained on millions of career trajectories, salary data, and university insights to give you **personalized, realistic career advice**.\n\nWhat would you like to explore today?`
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(p => [...p, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      setMessages(p => [...p, { role: 'assistant', content: buildResponse(text, name, user?.currentStage || role) }]);
      setIsTyping(false);
    }, delay);
  };

  const suggestions = suggestionsByRole[role] || suggestionsByRole.college;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">AI Career Mentor</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
            Smart AI · Real data · Personalized for you
          </p>
        </div>
        <button
          onClick={() => { setMessages([{ role: 'assistant', content: `## 🤖 Chat cleared!\n\nHow can I help you today, ${name}? Ask me anything about careers, exams, skills, or job search!` }]); }}
          className="ml-auto p-2 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-colors text-muted-foreground hover:text-foreground"
          title="New chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-gradient-card border border-border text-foreground rounded-bl-md'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_th]:py-1.5 [&_td]:py-1.5 [&_h2]:text-base [&_h2]:mt-0 [&_h3]:text-sm [&_blockquote]:border-primary/30 [&_blockquote]:bg-primary/5 [&_blockquote]:py-1 [&_blockquote]:px-3 [&_blockquote]:rounded-r-lg [&_code]:bg-secondary [&_code]:px-1 [&_code]:rounded">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-accent" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-gradient-card border border-border rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-muted-foreground ml-1">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs text-muted-foreground font-medium">Suggested questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder="Ask me about careers, exams, skills, or interviews..."
          className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <Button
          onClick={() => send(input)}
          disabled={!input.trim() || isTyping}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-4 shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
