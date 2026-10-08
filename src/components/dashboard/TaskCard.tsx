import React from 'react';
import { Task, Priority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { getDueDateStatus } from '../../utils/dateUtils';
import { Check, Calendar, AlertCircle, Edit3, Trash2, Tag, Flame } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { toggleTaskComplete } = useTasks();
  const dueStatus = getDueDateStatus(task.dueDate, task.completed);

  const priorityConfig: Record<
    Priority,
    { label: string; badgeClass: string; dotClass: string; icon?: React.ReactNode }
  > = {
    high: {
      label: 'High Priority',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dotClass: 'bg-rose-500',
      icon: <Flame className="w-3 h-3 text-rose-600 inline mr-0.5" />,
    },
    medium: {
      label: 'Medium Priority',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dotClass: 'bg-amber-500',
    },
    low: {
      label: 'Low Priority',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      dotClass: 'bg-slate-400',
    },
  };

  const pConfig = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200 opacity-75'
          : dueStatus.isOverdue
          ? 'border-rose-200 hover:border-rose-300 ring-1 ring-rose-500/10'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => toggleTaskComplete(task.id)}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'border-slate-300 hover:border-brand-500 bg-white hover:bg-brand-50/30'
          }`}
          title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide uppercase ${pConfig.badgeClass}`}
            >
              {pConfig.icon}
              <span>{pConfig.label}</span>
            </span>

            {/* Category */}
            {task.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50/70 text-indigo-700 border border-indigo-200/50">
                <Tag className="w-2.5 h-2.5" />
                <span>{task.category}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug break-words ${
              task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1.5 text-xs sm:text-sm line-clamp-2 leading-relaxed ${
                task.completed ? 'line-through text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all cursor-pointer"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer: Due date pill and timestamp */}
      <div className="pt-2 border-t border-slate-100/90 flex items-center justify-between gap-2 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          {/* Due date chip */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${dueStatus.bgClass} ${dueStatus.colorClass}`}
          >
            {dueStatus.isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            ) : (
              <Calendar className="w-3.5 h-3.5 opacity-70" />
            )}
            <span>{dueStatus.label}</span>
          </span>
        </div>

        {task.completed && task.completedAt && (
          <span className="text-[11px] text-emerald-600 font-medium ml-auto">
            ✓ Done
          </span>
        )}
      </div>
    </div>
  );
};
