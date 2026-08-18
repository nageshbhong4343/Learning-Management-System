import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginMode, UserRole } from '../../types/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LogIn, Lock, Mail, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState<string>(LoginMode.OTHER_THAN_QUESTION_SOLVING);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginMode === LoginMode.QUESTION_SOLVING_COMBO_OTP && !isOtpSent) {
        setIsOtpSent(true);
        setLoading(false);
        return;
      }
      await login(email, password, loginMode);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0] || 'Invalid credentials or login mode authorization error.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: UserRole) => {
    setError(null);
    const demoAccounts: Record<UserRole, { email: string; mode: string }> = {
      [UserRole.SUPER_ADMIN]: { email: 'superadmin@lms.com', mode: LoginMode.ALWAYS_ACTIVE },
      [UserRole.ADMIN]: { email: 'admin@lms.com', mode: LoginMode.OTHER_THAN_QUESTION_SOLVING },
      [UserRole.TRAINER]: { email: 'trainer@lms.com', mode: LoginMode.OTHER_THAN_QUESTION_SOLVING },
      [UserRole.PLACEMENT_OFFICER]: { email: 'placement@lms.com', mode: LoginMode.OTHER_THAN_QUESTION_SOLVING },
      [UserRole.STUDENT]: { email: 'student1@lms.com', mode: LoginMode.QUESTION_SOLVING },
      [UserRole.PARENT]: { email: 'parent@lms.com', mode: LoginMode.OTHER_THAN_QUESTION_SOLVING },
      [UserRole.HR_INTERVIEWER]: { email: 'hr@lms.com', mode: LoginMode.OTHER_THAN_QUESTION_SOLVING },
    };

    const target = demoAccounts[role];
    setEmail(target.email);
    setPassword('Password123!');
    setLoginMode(target.mode);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Brand Info */}
        <div className="lg:col-span-5 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-blue-400" /> Enterprise LMS Platform
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Training, Learning & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Placement</span> System
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            All-in-one ecosystem for automated learning management, sandboxed coding execution, aptitude assessments, mock interviews, and high-impact placement drives.
          </p>

          {/* Quick Demo Role Selector Pills */}
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              One-Click Demo Login (Select Role):
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Super Admin', role: UserRole.SUPER_ADMIN, color: 'hover:border-purple-500 hover:text-purple-400' },
                { label: 'Admin', role: UserRole.ADMIN, color: 'hover:border-blue-500 hover:text-blue-400' },
                { label: 'Trainer', role: UserRole.TRAINER, color: 'hover:border-emerald-500 hover:text-emerald-400' },
                { label: 'Placement Officer', role: UserRole.PLACEMENT_OFFICER, color: 'hover:border-amber-500 hover:text-amber-400' },
                { label: 'Student', role: UserRole.STUDENT, color: 'hover:border-cyan-500 hover:text-cyan-400' },
                { label: 'Parent', role: UserRole.PARENT, color: 'hover:border-rose-500 hover:text-rose-400' },
                { label: 'HR Interviewer', role: UserRole.HR_INTERVIEWER, color: 'hover:border-indigo-500 hover:text-indigo-400' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setDemoCredentials(item.role)}
                  className={`text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 transition duration-150 ${item.color}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Sign In to Account</h2>
                <p className="text-xs text-slate-400 mt-1">Enter your credentials and select your active login mode.</p>
              </div>
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email / Username / Phone"
                type="text"
                placeholder="e.g. student1@lms.com or admin@lms.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />

              {/* Configurable Authentication Login Mode */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Authentication & Access Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { mode: LoginMode.OTHER_THAN_QUESTION_SOLVING, label: 'Other Than Question Solving', desc: 'Standard LMS Dashboard' },
                    { mode: LoginMode.QUESTION_SOLVING, label: 'Question Solving', desc: 'Direct Assessment Engine' },
                    { mode: LoginMode.QUESTION_SOLVING_COMBO_OTP, label: 'Question Solving (Combo + OTP)', desc: 'Secure OTP Guard' },
                    { mode: LoginMode.ALWAYS_ACTIVE, label: 'Always Active', desc: 'Administrative Priority' },
                  ].map((m) => (
                    <label
                      key={m.mode}
                      className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                        loginMode === m.mode
                          ? 'border-blue-500 bg-blue-950/30 text-blue-200'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{m.label}</span>
                        <input
                          type="radio"
                          name="loginMode"
                          value={m.mode}
                          checked={loginMode === m.mode}
                          onChange={(e) => setLoginMode(e.target.value)}
                          className="accent-blue-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">{m.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {loginMode === LoginMode.QUESTION_SOLVING_COMBO_OTP && isOtpSent && (
                <Input
                  label="OTP Security Code"
                  type="text"
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  leftIcon={<KeyRound className="w-4 h-4" />}
                  helperText="Default Dev OTP: 123456 (Check server console log)"
                />
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  isLoading={loading}
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  {loginMode === LoginMode.QUESTION_SOLVING_COMBO_OTP && !isOtpSent
                    ? 'Request OTP & Sign In'
                    : 'Sign In to LMS Portal'}
                </Button>
              </div>
            </form>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="inline-flex items-center gap-1 text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> SimpleJWT Role Enforcement
              </span>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Contact administrator or use Reset Password endpoint."); }} className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
