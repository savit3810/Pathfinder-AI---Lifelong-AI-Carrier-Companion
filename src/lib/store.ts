import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = 'class10' | 'class12' | 'college' | 'graduate' | 'parent' | 'admin';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface Milestone {
  name: string;
  date: string;
  status: 'done' | 'upcoming' | 'overdue';
}

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  parentCode?: string;
  linkedChildCode?: string;
  xp: number;
  badges: string[];
  skills: string[];
  interests: string[];
  personality?: string[];
  resumeScore: number;
  jobReadiness: number;
  currentStage: string;
  careerGoal?: string;
  createdAt: string;
  lastActive?: string;
  achievements: Achievement[];
  weeklyProgress: { week: string; xp: number }[];
  milestones: Milestone[];
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills: string[];
  interests: string[];
  personality?: string[];
  resumeScore: number;
  jobReadiness: number;
  xp: number;
  badges: string[];
  currentStage: string;
  parentCode?: string;
  linkedChildCode?: string;
  careerGoal?: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  email: string;
  stage: string;
  parentCode: string;
  xp: number;
  badges: string[];
  resumeScore: number;
  jobReadiness: number;
  progressPercent: number;
  careerGoal: string;
  skills: { name: string; level: number }[];
  weeklyProgress: { week: string; xp: number }[];
  milestones: Milestone[];
  missingSkills: string[];
  careerRecommendations: { title: string; match: number; reason: string }[];
  alerts: { type: 'warning' | 'success' | 'info'; message: string }[];
  aiInsights: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  achievements: Achievement[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const ADMIN_EMAIL = 'savit.m.singh@slrtce.in';
export const ADMIN_PASSWORD = 'Savit@2006';
const ACCOUNTS_KEY = 'pathfinder_accounts_v2';

export const roleLabels: Record<UserRole, string> = {
  class10: 'Class 10 Student',
  class12: 'Class 11-12 Student',
  college: 'College Student',
  graduate: 'Graduate / Job Seeker',
  parent: 'Parent',
  admin: 'Administrator',
};

export const roleIcons: Record<UserRole, string> = {
  class10: '🎒',
  class12: '📚',
  college: '🎓',
  graduate: '💼',
  parent: '👨‍👩‍👧',
  admin: '🛡️',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateParentCode(name: string): string {
  const namePart = name.replace(/\s+/g, '').slice(0, 4).toUpperCase().padEnd(4, 'X');
  const numPart = Math.floor(1000 + Math.random() * 9000);
  return `PF-${namePart}-${numPart}`;
}

function getDefaultMilestones(role: UserRole): Milestone[] {
  const base: Milestone[] = [
    { name: 'Profile Setup', date: new Date().toLocaleDateString(), status: 'done' },
    { name: 'Career DNA Quiz', date: 'Pending', status: 'upcoming' },
    { name: 'Skill Analysis', date: 'Pending', status: 'upcoming' },
  ];
  const extra: Record<string, Milestone[]> = {
    class10: [{ name: 'Stream Selection', date: 'March 2026', status: 'upcoming' }],
    class12: [
      { name: 'Entrance Exam Registration', date: 'Dec 2025', status: 'upcoming' },
      { name: 'Mock Test Series', date: 'Jan 2026', status: 'upcoming' },
    ],
    college: [
      { name: 'Internship Application', date: 'Feb 2026', status: 'upcoming' },
      { name: 'Resume Review', date: 'Pending', status: 'upcoming' },
    ],
    graduate: [
      { name: 'Mock Interview', date: 'Pending', status: 'upcoming' },
      { name: 'Job Applications (50+)', date: 'Ongoing', status: 'upcoming' },
    ],
  };
  return [...base, ...(extra[role] || [])];
}

// ─── Storage ──────────────────────────────────────────────────────────────────
export function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: Account[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch { /* storage full */ }
}

function findByEmail(email: string): Account | null {
  return loadAccounts().find(a => a.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findChildByCode(code: string): Account | null {
  return loadAccounts().find(a => a.parentCode === code) || null;
}

export function deleteAccountById(id: string): void {
  const accounts = loadAccounts().filter(a => a.id !== id);
  saveAccounts(accounts);
}

// ─── Build child profile from account ────────────────────────────────────────
export function buildChildProfile(account: Account): ChildProfile {
  const xp = account.xp || 0;
  const skillsList = account.skills.length > 0
    ? account.skills.map((s, i) => ({ name: s, level: 40 + (i * 12) % 55 }))
    : [
        { name: 'Programming', level: 60 },
        { name: 'Mathematics', level: 72 },
        { name: 'Communication', level: 55 },
        { name: 'Problem Solving', level: 68 },
        { name: 'Critical Thinking', level: 50 },
      ];

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    stage: roleLabels[account.role],
    parentCode: account.parentCode || '',
    xp,
    badges: account.badges.length > 0 ? account.badges : ['🌟 Early Adopter'],
    resumeScore: account.resumeScore || 42,
    jobReadiness: account.jobReadiness || 35,
    progressPercent: Math.min(100, Math.round(xp / 30)),
    careerGoal: account.careerGoal || 'Software Engineer',
    skills: skillsList,
    weeklyProgress: account.weeklyProgress?.length > 0
      ? account.weeklyProgress
      : [{ week: 'W1', xp: 0 }, { week: 'W2', xp: Math.floor(xp * 0.3) }, { week: 'W3', xp: Math.floor(xp * 0.6) }, { week: 'W4', xp: xp }],
    milestones: account.milestones?.length > 0 ? account.milestones : getDefaultMilestones(account.role),
    missingSkills: ['Advanced DSA', 'System Design', 'Cloud Computing', 'Leadership Skills', 'Data Analysis'],
    careerRecommendations: [
      { title: 'Software Engineer', match: 88, reason: 'Strong technical inclination and problem-solving skills' },
      { title: 'Data Scientist', match: 75, reason: 'Good analytical and mathematical foundation' },
      { title: 'Product Manager', match: 65, reason: 'Communication and strategic thinking observed' },
    ],
    alerts: [
      ...(xp < 100 ? [{ type: 'warning' as const, message: 'Low activity detected — encourage your child to complete daily challenges!' }] : []),
      { type: 'info' as const, message: `${account.name} has earned ${xp} XP total on PathFinder AI.` },
      { type: 'success' as const, message: 'Account linked successfully. Progress monitoring is active.' },
    ],
    aiInsights: {
      strengths: [
        'Enrolled and actively exploring career options',
        'Showing interest in technology-related fields',
        'Badge collection indicates consistent platform usage',
      ],
      weaknesses: [
        'Career DNA Quiz not completed yet',
        'Interview practice module not started',
        account.resumeScore < 50 ? 'Resume score is below competitive threshold' : 'Resume needs keyword optimization',
      ],
      suggestions: [
        'Encourage completing the Career DNA Quiz for personalized career insights',
        'Schedule weekly check-ins to discuss progress and goals',
        'Review internship/exam deadlines together on the Journey page',
      ],
    },
    achievements: account.achievements || [],
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────
interface AppState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  childProfile: ChildProfile | null;
  authError: string | null;
  signupParentCode: string | null;

  login: (user: UserProfile) => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    linkedChildCode?: string;
    careerGoal?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateXP: (amount: number) => void;
  clearError: () => void;
  clearSignupCode: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  childProfile: null,
  authError: null,
  signupParentCode: null,

  login: (user) => {
    let childProfile: ChildProfile | null = null;
    if (user.role === 'parent' && user.linkedChildCode) {
      const child = findChildByCode(user.linkedChildCode);
      if (child) childProfile = buildChildProfile(child);
    }
    set({ isAuthenticated: true, user, childProfile, authError: null });
  },

  loginWithCredentials: (email, password) => {
    // Admin check
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const adminUser: UserProfile = {
        id: 'admin-001',
        name: 'Savit Singh',
        email: ADMIN_EMAIL,
        role: 'admin',
        skills: [],
        interests: [],
        resumeScore: 100,
        jobReadiness: 100,
        xp: 999999,
        badges: ['🛡️ Administrator', '⭐ Super Admin'],
        currentStage: 'Administrator',
      };
      set({ isAuthenticated: true, user: adminUser, childProfile: null, authError: null });
      return true;
    }

    const account = findByEmail(email);
    if (!account) {
      set({ authError: 'No account found with this email address.' });
      return false;
    }
    if (account.password !== password) {
      set({ authError: 'Incorrect password. Please try again.' });
      return false;
    }

    // Update last active
    const accounts = loadAccounts();
    const idx = accounts.findIndex(a => a.id === account.id);
    if (idx >= 0) {
      accounts[idx].lastActive = new Date().toISOString();
      accounts[idx].isActive = true;
      saveAccounts(accounts);
    }

    let childProfile: ChildProfile | null = null;
    if (account.role === 'parent' && account.linkedChildCode) {
      const child = findChildByCode(account.linkedChildCode);
      if (child) childProfile = buildChildProfile(child);
    }

    const user: UserProfile = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      skills: account.skills,
      interests: account.interests,
      personality: account.personality,
      resumeScore: account.resumeScore,
      jobReadiness: account.jobReadiness,
      xp: account.xp,
      badges: account.badges,
      currentStage: account.currentStage,
      parentCode: account.parentCode,
      linkedChildCode: account.linkedChildCode,
      careerGoal: account.careerGoal,
    };

    set({ isAuthenticated: true, user, childProfile, authError: null });
    return true;
  },

  signup: ({ name, email, password, role, linkedChildCode, careerGoal }) => {
    if (findByEmail(email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (role === 'parent') {
      if (!linkedChildCode?.trim()) {
        return { success: false, error: "Please enter your child's invite code." };
      }
      const child = findChildByCode(linkedChildCode.trim());
      if (!child) {
        return { success: false, error: 'Invalid invite code. Please ask your child to share their code from their dashboard.' };
      }
    }

    const id = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const parentCode = (role !== 'parent' && role !== 'admin') ? generateParentCode(name) : undefined;

    const newAccount: Account = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      parentCode,
      linkedChildCode: linkedChildCode?.trim(),
      xp: 0,
      badges: ['🌟 Early Adopter'],
      skills: [],
      interests: [],
      resumeScore: 0,
      jobReadiness: 0,
      currentStage: roleLabels[role],
      careerGoal: careerGoal || 'To be determined',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      achievements: [{ id: 'a1', title: 'First Steps', description: 'Created your PathFinder AI account', earnedAt: new Date().toISOString(), icon: '🎉' }],
      weeklyProgress: [{ week: 'W1', xp: 0 }],
      milestones: getDefaultMilestones(role),
      isActive: true,
    };

    const accounts = loadAccounts();
    accounts.push(newAccount);
    saveAccounts(accounts);

    let childProfile: ChildProfile | null = null;
    if (role === 'parent' && linkedChildCode) {
      const child = findChildByCode(linkedChildCode.trim());
      if (child) childProfile = buildChildProfile(child);
    }

    const user: UserProfile = {
      id,
      name: newAccount.name,
      email: newAccount.email,
      role,
      skills: [],
      interests: [],
      resumeScore: 0,
      jobReadiness: 0,
      xp: 0,
      badges: ['🌟 Early Adopter'],
      currentStage: roleLabels[role],
      parentCode,
      linkedChildCode: linkedChildCode?.trim(),
      careerGoal,
    };

    set({
      isAuthenticated: true,
      user,
      childProfile,
      authError: null,
      signupParentCode: parentCode || null,
    });
    return { success: true };
  },

  logout: () => set({ isAuthenticated: false, user: null, childProfile: null, authError: null, signupParentCode: null }),

  updateUser: (updates) =>
    set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),

  updateXP: (amount) => {
    const state = get();
    if (!state.user || state.user.role === 'admin') return;
    const newXP = (state.user.xp || 0) + amount;
    const accounts = loadAccounts();
    const idx = accounts.findIndex(a => a.id === state.user!.id);
    if (idx >= 0) {
      accounts[idx].xp = newXP;
      accounts[idx].weeklyProgress = [
        ...(accounts[idx].weeklyProgress || []),
        { week: `W${(accounts[idx].weeklyProgress?.length || 0) + 1}`, xp: newXP },
      ].slice(-8);
      saveAccounts(accounts);
    }
    set((s) => ({ user: s.user ? { ...s.user, xp: newXP } : null }));
  },

  clearError: () => set({ authError: null }),
  clearSignupCode: () => set({ signupParentCode: null }),
}));
