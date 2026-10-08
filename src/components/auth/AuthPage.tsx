import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, ArrowRight, Lock, Mail, User as UserIcon, Sparkles, CheckSquare, Clock, ShieldAlert } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, loginAsDemo } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLoginTab) {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to login');
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || 'Failed to register');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Branding / Features Side */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-600 via-indigo-600 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white block">TaskFlow</span>
                <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">Priority & Due-Date System</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug mb-4">
              Focus on what matters most today.
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-8">
              A streamlined task management dashboard intelligently ordered by priority level and due date urgency.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-white/20 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Smart Priority & Due-Date Sorting</h4>
                  <p className="text-xs text-indigo-200">High-priority tasks due earliest automatically bubble to the top.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-white/20 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Overdue & Urgency Detection</h4>
                  <p className="text-xs text-indigo-200">Real-time status badges for Due Today, Overdue, and Due Soon.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-white/20 mt-0.5">
                  <ShieldAlert className="w-4 h-4 text-sky-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Private Multi-User Accounts</h4>
                  <p className="text-xs text-indigo-200">Secure client-side isolation with persisted task storage.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Shortcut */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Instant Access
                </span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full text-white font-medium">Pre-loaded</span>
              </div>
              <p className="text-xs text-indigo-100 mb-3">
                Try out the app instantly with sample tasks and pre-configured priorities.
              </p>
              <button
                type="button"
                onClick={loginAsDemo}
                className="w-full py-2 px-3 bg-white text-brand-700 hover:bg-indigo-50 font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <span>Demo Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Tab switch */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-8 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(true);
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  isLoginTab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(false);
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  !isLoginTab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isLoginTab ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {isLoginTab
                  ? 'Enter your credentials to access your task dashboard.'
                  : 'Start organizing your tasks with smart priority ordering.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
                <span className="font-bold text-base leading-none mt-0.5">•</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                {!isLoginTab && (
                  <p className="text-[11px] text-slate-400 mt-1">Must be at least 6 characters</p>
                )}
              </div>

              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-brand-500/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLoginTab ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                {isLoginTab ? "Don't have an account yet?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(!isLoginTab);
                    setError(null);
                  }}
                  className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  {isLoginTab ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
