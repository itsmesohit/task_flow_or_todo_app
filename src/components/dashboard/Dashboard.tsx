import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Header } from './Header';
import { StatsOverview } from './StatsOverview';
import { TaskToolbar } from './TaskToolbar';
import { TaskList } from './TaskList';
import { TaskModal } from './TaskModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Task } from '../../types';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { deleteTask } = useTasks();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good day, {user?.name ? user.name.split(' ')[0] : 'there'} 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Here is what needs your attention today, prioritized by urgency.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
            <CalendarIcon className="w-4 h-4 text-brand-500" />
            <span>{todayFormatted}</span>
          </div>
        </div>

        {/* Metric Cards */}
        <StatsOverview />

        {/* Toolbar (Search, Filter, Sort, Add) */}
        <TaskToolbar onOpenCreateModal={handleOpenCreateModal} />

        {/* Task Cards List */}
        <TaskList
          onEditTask={handleOpenEditModal}
          onDeleteTask={handleOpenDeleteModal}
          onOpenCreateModal={handleOpenCreateModal}
        />

      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
};
