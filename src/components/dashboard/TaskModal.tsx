import React, { useState, useEffect } from 'react';
import { Task, Priority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { X, Calendar, Flame, AlertCircle, Tag, Clock } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { addTask, updateTask, categories } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState('Work');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);

      if (taskToEdit.dueDate) {
        if (taskToEdit.dueDate.includes('T')) {
          const [d, t] = taskToEdit.dueDate.split('T');
          setDueDate(d);
          setDueTime(t.slice(0, 5));
        } else {
          setDueDate(taskToEdit.dueDate);
          setDueTime('');
        }
      } else {
        setDueDate('');
        setDueTime('');
      }

      if (categories.includes(taskToEdit.category)) {
        setCategory(taskToEdit.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else if (taskToEdit.category) {
        setIsCustomCategory(true);
        setCustomCategory(taskToEdit.category);
      } else {
        setCategory('Work');
        setIsCustomCategory(false);
      }
    } else {
      // Defaults for new task: due date tomorrow 17:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');

      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(`${yyyy}-${mm}-${dd}`);
      setDueTime('17:00');
      setCategory('Work');
      setIsCustomCategory(false);
      setCustomCategory('');
    }
    setError(null);
  }, [taskToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    const finalCategory = isCustomCategory
      ? customCategory.trim() || 'General'
      : category;

    let finalDueDate = dueDate;
    if (dueDate && dueTime) {
      finalDueDate = `${dueDate}T${dueTime}`;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: finalDueDate,
        category: finalCategory,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: finalDueDate,
        category: finalCategory,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {taskToEdit ? 'Modify Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-500">
              {taskToEdit
                ? 'Update task details, due date, or priority level.'
                : 'Add a new item to your intelligent priority task queue.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete quarterly financial review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add key objectives, links, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* High */}
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs ring-2 ring-rose-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>High</span>
              </button>

              {/* Medium */}
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'medium'
                    ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Medium</span>
              </button>

              {/* Low */}
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'low'
                    ? 'bg-slate-200/80 border-slate-400 text-slate-900 shadow-xs ring-2 ring-slate-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Low</span>
              </button>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Due Time (Optional)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category / Tag
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    disabled={isCustomCategory}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all disabled:opacity-50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="px-3 py-2.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 border border-brand-200/80 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  {isCustomCategory ? 'Use standard' : '+ Custom'}
                </button>
              </div>

              {isCustomCategory && (
                <input
                  type="text"
                  placeholder="Enter custom category name (e.g. Project Apollo)"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-indigo-50/50 border border-indigo-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/25 transition-all cursor-pointer"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
