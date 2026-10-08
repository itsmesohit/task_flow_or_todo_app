import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Search, Plus, ArrowUpDown, X } from 'lucide-react';
import { Priority, SortOption, StatusFilter } from '../../types';

interface TaskToolbarProps {
  onOpenCreateModal: () => void;
}

export const TaskToolbar: React.FC<TaskToolbarProps> = ({ onOpenCreateModal }) => {
  const {
    filters,
    categories,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setCategoryFilter,
    setSortBy,
    resetFilters,
  } = useTasks();

  const isFiltered =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.search.trim() !== '' ||
    filters.sortBy !== 'smart';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      {/* Top Row: Search + New Task Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title, description or category..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Action: Create Task */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-500/25 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Second Row: Status Pills + Priority Filter + Category Filter + Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        
        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'pending', 'completed', 'overdue'] as StatusFilter[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                filters.status === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All Tasks' : st}
            </button>
          ))}
        </div>

        {/* Filters and Sorting controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Priority filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.priority}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | Priority)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🔵 Low Priority</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.category}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Option (Highlighted) */}
          <div className="relative flex-1 sm:flex-initial flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-600 absolute left-2.5 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full sm:w-auto appearance-none bg-brand-50/70 border border-brand-200 text-brand-900 font-semibold text-xs rounded-lg pl-8 pr-8 py-2 hover:bg-brand-50 hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer shadow-xs"
              title="Sort tasks"
            >
              <option value="smart">⚡ Priority & Due Date (Smart)</option>
              <option value="dueDateAsc">📅 Due Date (Soonest first)</option>
              <option value="dueDateDesc">📅 Due Date (Latest first)</option>
              <option value="priorityDesc">🔥 Priority (High to Low)</option>
              <option value="priorityAsc">Priority (Low to High)</option>
              <option value="createdDesc">🕒 Recently Created</option>
              <option value="titleAsc">🔤 Title (A to Z)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="p-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              title="Reset all filters and sorting"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
