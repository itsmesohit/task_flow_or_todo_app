import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, Clock, AlertTriangle, Layers, Flame } from 'lucide-react';
import { StatusFilter } from '../../types';

export const StatsOverview: React.FC = () => {
  const { stats, filters, setStatusFilter } = useTasks();

  const handleCardClick = (targetStatus: StatusFilter) => {
    if (filters.status === targetStatus) {
      setStatusFilter('all');
    } else {
      setStatusFilter(targetStatus);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Tasks */}
        <button
          type="button"
          onClick={() => handleCardClick('all')}
          className={`text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            filters.status === 'all'
              ? 'bg-white border-brand-500 shadow-md ring-2 ring-brand-500/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.total}
            </span>
            <span className="text-xs text-slate-400 font-medium">all tracked</span>
          </div>
          {filters.status === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500" />
          )}
        </button>

        {/* Pending Tasks */}
        <button
          type="button"
          onClick={() => handleCardClick('pending')}
          className={`text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            filters.status === 'pending'
              ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-700">
              {stats.pending}
            </span>
            {stats.highPriority > 0 && (
              <span className="text-[11px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-semibold border border-rose-200/60 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500" /> {stats.highPriority} high
              </span>
            )}
          </div>
          {filters.status === 'pending' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          )}
        </button>

        {/* Completed Tasks */}
        <button
          type="button"
          onClick={() => handleCardClick('completed')}
          className={`text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            filters.status === 'completed'
              ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {stats.completed}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {stats.completionRate}%
            </span>
          </div>
          {filters.status === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
          )}
        </button>

        {/* Overdue Tasks */}
        <button
          type="button"
          onClick={() => handleCardClick('overdue')}
          className={`text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            filters.status === 'overdue'
              ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
              : stats.overdue > 0
              ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
              : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overdue
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              stats.overdue > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold ${
              stats.overdue > 0 ? 'text-rose-600' : 'text-slate-400'
            }`}>
              {stats.overdue}
            </span>
            <span className="text-xs text-slate-400 font-medium">needs attention</span>
          </div>
          {filters.status === 'overdue' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
            <span className="text-xs font-semibold text-slate-700">Overall Progress</span>
            <span className="text-xs text-slate-400">
              ({stats.completed} of {stats.total} tasks completed)
            </span>
          </div>
          <div className="flex items-center gap-3 flex-1 sm:max-w-md">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 min-w-[36px] text-right">
              {stats.completionRate}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
