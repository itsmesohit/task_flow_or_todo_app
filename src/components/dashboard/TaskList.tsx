import React from 'react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { CheckCircle, Inbox, Plus, RefreshCw } from 'lucide-react';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onOpenCreateModal: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  onEditTask,
  onDeleteTask,
  onOpenCreateModal,
}) => {
  const { tasks, filteredTasks, filters, resetFilters, seedDemoTasksIfEmpty } = useTasks();

  // If user has zero tasks in their account
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks created yet</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Your task board is completely empty! Add your first task to start organizing with smart priority and due-date tracking.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Task</span>
          </button>
          <button
            type="button"
            onClick={seedDemoTasksIfEmpty}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Load Sample Tasks</span>
          </button>
        </div>
      </div>
    );
  }

  // If tasks exist, but current filters match 0 tasks
  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No matching tasks found</h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-5">
          No tasks match your current filter criteria:
          {filters.status !== 'all' && <span className="font-semibold text-slate-700"> status: {filters.status}, </span>}
          {filters.priority !== 'all' && <span className="font-semibold text-slate-700"> priority: {filters.priority}, </span>}
          {filters.category !== 'all' && <span className="font-semibold text-slate-700"> category: {filters.category}, </span>}
          {filters.search && <span className="font-semibold text-slate-700"> query: "{filters.search}"</span>}
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header row showing task count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
        <span className="text-xs text-slate-400">
          Sorted by:{' '}
          <span className="font-semibold text-slate-700">
            {filters.sortBy === 'smart'
              ? 'Priority & Due Date'
              : filters.sortBy === 'dueDateAsc'
              ? 'Soonest Due'
              : filters.sortBy === 'dueDateDesc'
              ? 'Latest Due'
              : filters.sortBy === 'priorityDesc'
              ? 'Highest Priority'
              : filters.sortBy === 'priorityAsc'
              ? 'Lowest Priority'
              : filters.sortBy === 'createdDesc'
              ? 'Newest'
              : 'Alphabetical'}
          </span>
        </span>
      </div>

      {/* Task cards list */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};
