import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, Sparkles, Copy, CheckCircle2,
  User, Mail, Lock, Key, Briefcase, GraduationCap, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, UserRole, roleLabels, roleIcons } from '@/lib/store';

interface AuthScreenProps {
  onBack: () => void;
}

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: '', color: '', width: '0%' };
  const strong = pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  const medium = pw.length >= 6 && (/[A-Z]/.test(pw) || /[0-9]/.test(pw));
  if (strong) return { label: 'Strong', color: 'bg-primary', width: '100%' };
  if (medium) return { label: 'Medium', color: 'bg-warning', width: '60%' };
  return { label: 'Weak', color: 'bg-destructive', width: '30%' };
}

const STUDENT_ROLES: UserRole[] = ['class10', 'class12', 'college', 'graduate'];
const roleDescriptions: Record<string, string> = {
  class10: 'Discover your ideal stream & explore careers',
  class12: 'Ace entrance exams & plan your future',
  college: 'Build skills, ace placements & grow',
  graduate: 'Land your dream job with AI guidance',
  parent: 'Monitor & support your child\'s journey',
};

// ─── Parent Code Modal ────────────────────────────────────────────────────────
function ParentCodeModal({ code, onClose }: { code: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-sm bg-card border border-primary/30 rounded-2xl p-8 text-center relative shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Your Parent Invite Code</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Share this code with your parent so they can monitor your progress on PathFinder AI.
        </p>
        <div className="bg-secondary border border-border rounded-xl p-4 mb-4">
          <p className="font-mono text-2xl font-bold text-primary tracking-widest">{code}</p>
        </div>
        <button
          onClick={copy}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all text-primary font-medium mb-4"
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <p className="text-xs text-muted-foreground mb-4">
          You can always find this code on your dashboard home page.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
        >
          Go to Dashboard →
        </button>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── AuthScreen ───────────────────────────────────────────────────────────────
export default function AuthScreen({ onBack }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'info' | 'role' | 'extra'>('info');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Signup state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [careerGoal, setCareerGoal] = useState('');
  const [childCode, setChildCode] = useState('');
  const [localError, setLocalError] = useState('');

  const { loginWithCredentials, signup, authError, clearError, signupParentCode, clearSignupCode } = useAppStore();

  const handleLogin = () => {
    clearError();
    setLocalError('');
    if (!loginEmail || !loginPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }
    loginWithCredentials(loginEmail, loginPassword);
  };

  const handleStep1 = () => {
    setLocalError('');
    if (!name.trim() || !email.trim() || !password || !confirmPw) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPw) {
      setLocalError('Passwords do not match.');
      return;
    }
    setStep('role');
  };

  const handleStep2 = () => {
    setLocalError('');
    if (!selectedRole) {
      setLocalError('Please select your role.');
      return;
    }
    setStep('extra');
  };

  const handleSignup = () => {
    setLocalError('');
    clearError();
    const result = signup({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: selectedRole!,
      linkedChildCode: selectedRole === 'parent' ? childCode.trim() : undefined,
      careerGoal: careerGoal.trim() || undefined,
    });
    if (!result.success && result.error) {
      setLocalError(result.error);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setStep('info');
    setLocalError('');
    clearError();
    setSelectedRole(null);
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 grid-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
      <AnimatePresence>
        {signupParentCode && (
          <ParentCodeModal code={signupParentCode} onClose={clearSignupCode} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="glass-strong rounded-2xl p-8 border border-border">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">PathFinder AI</span>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-secondary p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setStep('info'); setLocalError(''); clearError(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setStep('info'); setLocalError(''); clearError(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* ── LOGIN ── */}
            {mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">Welcome back</h2>
                <p className="text-sm text-muted-foreground mb-6">Sign in to continue your journey</p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-foreground mb-1.5 block">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        placeholder="you@example.com"
                        className="pl-9 bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-foreground mb-1.5 block">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showLoginPw ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter your password"
                        className="pl-9 pr-10 bg-secondary border-border"
                      />
                      <button type="button" onClick={() => setShowLoginPw(!showLoginPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button onClick={handleLogin} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                    Sign In <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                  <strong className="text-primary">Admin?</strong> Use your admin credentials to access the control panel.
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <button onClick={switchMode} className="text-primary hover:underline font-medium">Sign Up</button>
                </p>
              </motion.div>
            )}

            {/* ── SIGNUP STEP 1: Basic Info ── */}
            {mode === 'signup' && step === 'info' && (
              <motion.div key="signup-info" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">Create account</h2>
                <p className="text-sm text-muted-foreground mb-5">Join 12,000+ students already on PathFinder AI 🚀</p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wide">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="pl-9 bg-secondary border-border" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wide">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9 bg-secondary border-border" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wide">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="pl-9 pr-10 bg-secondary border-border" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && (() => {
                      const s = getPasswordStrength(password);
                      return (
                        <div className="mt-1.5">
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${s.color}`} style={{ width: s.width }} />
                          </div>
                          <p className={`text-xs mt-1 ${s.label === 'Strong' ? 'text-primary' : s.label === 'Medium' ? 'text-warning' : 'text-destructive'}`}>
                            Password strength: {s.label}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wide">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleStep1()} placeholder="Re-enter password" className="pl-9 bg-secondary border-border" />
                    </div>
                  </div>
                  <Button onClick={handleStep1} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{' '}
                  <button onClick={switchMode} className="text-primary hover:underline font-medium">Log In</button>
                </p>
              </motion.div>
            )}

            {/* ── SIGNUP STEP 2: Role ── */}
            {mode === 'signup' && step === 'role' && (
              <motion.div key="signup-role" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                <button onClick={() => setStep('info')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="font-display text-xl font-bold text-foreground mb-1">Select Your Role</h2>
                <p className="text-sm text-muted-foreground mb-5">We'll personalize everything for you</p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                )}

                <div className="space-y-2 mb-5">
                  {([...STUDENT_ROLES, 'parent'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedRole === role ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/30'}`}
                    >
                      <span className="text-2xl">{roleIcons[role]}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{roleLabels[role]}</p>
                        <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
                      </div>
                      {selectedRole === role && <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
                <Button onClick={handleStep2} disabled={!selectedRole} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* ── SIGNUP STEP 3: Extra Info ── */}
            {mode === 'signup' && step === 'extra' && (
              <motion.div key="signup-extra" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                <button onClick={() => setStep('role')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="font-display text-xl font-bold text-foreground mb-1">Almost There!</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  {selectedRole === 'parent' ? "Link to your child's account" : "Tell us your career goal"}
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                )}

                {selectedRole === 'parent' ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-primary" />
                        <p className="text-sm font-medium text-foreground">Child's Invite Code</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Ask your child to find their invite code on their PathFinder AI dashboard (e.g. <strong>PF-ARYN-4821</strong>).
                      </p>
                      <Input
                        value={childCode}
                        onChange={e => setChildCode(e.target.value.toUpperCase())}
                        placeholder="PF-XXXX-0000"
                        className="font-mono bg-secondary border-border"
                      />
                    </div>
                    <Button onClick={handleSignup} disabled={!childCode.trim()} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      Create Account <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block uppercase tracking-wide">
                        <Briefcase className="w-3.5 h-3.5 inline mr-1" /> Your Career Goal (optional)
                      </Label>
                      <Input
                        value={careerGoal}
                        onChange={e => setCareerGoal(e.target.value)}
                        placeholder="e.g. Software Engineer at Google"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary shrink-0" />
                        <p className="text-xs text-foreground/80">
                          A unique <strong className="text-primary">Parent Invite Code</strong> will be generated for you after signup. Share it with your parent!
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleSignup} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      <GraduationCap className="w-4 h-4 mr-2" /> Create Account
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
