import React from 'react';
import { Task } from '../../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6">
        
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Task?</h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
          Are you sure you want to remove this task? This action cannot be undone.
        </p>

        {/* Task preview card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 mb-6">
          <p className="text-xs font-semibold text-slate-900 line-clamp-2">
            {task.title}
          </p>
          {task.category && (
            <span className="inline-block mt-1 text-[10px] font-medium bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-full">
              {task.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-rose-500/25 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};
