import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { CheckSquare, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats } = useTasks();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow</span>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200/60">
                Dashboard
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500">
              Priority & Due-Date Task Organizer
            </p>
          </div>
        </div>

        {/* User stats badge & Profile & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Tasks indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 rounded-full border border-slate-200/70 text-xs text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">{stats.pending}</span>
            <span>active tasks</span>
          </div>

          {/* User info */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                {user?.name}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight truncate max-w-[140px]">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            title="Sign out of your account"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
