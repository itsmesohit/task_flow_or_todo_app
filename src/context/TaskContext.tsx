import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Task, FilterState, TaskStats, SortOption, StatusFilter, Priority } from '../types';
import { useAuth } from './AuthContext';
import { tasksApi } from '../services/api';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: FilterState;
  stats: TaskStats;
  categories: string[];
  isFetching: boolean;
  addTask: (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  setSearch: (search: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setPriorityFilter: (priority: 'all' | Priority) => void;
  setCategoryFilter: (category: 'all' | string) => void;
  setSortBy: (sortBy: SortOption) => void;
  resetFilters: () => void;
  seedDemoTasksIfEmpty: () => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialFilters: FilterState = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: '',
  sortBy: 'smart',
};

const defaultStats: TaskStats = {
  total: 0,
  completed: 0,
  pending: 0,
  overdue: 0,
  highPriority: 0,
  completionRate: 0,
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Fetch tasks from backend
  const refreshTasks = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setTasks([]);
      return;
    }

    try {
      setIsFetching(true);
      const res = await tasksApi.getTasks();
      if (res.success && Array.isArray(res.tasks)) {
        setTasks(res.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks from API:', error);
    } finally {
      setIsFetching(false);
    }
  }, [isAuthenticated, user]);

  // Load tasks on authentication
  useEffect(() => {
    if (isAuthenticated) {
      refreshTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, refreshTasks]);

  const addTask = async (
    taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'>
  ) => {
    try {
      const res = await tasksApi.createTask(taskData);
      if (res.success && res.task) {
        setTasks((prev) => [res.task, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  };

  const updateTask = async (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
  ) => {
    try {
      const res = await tasksApi.updateTask(id, updates);
      if (res.success && res.task) {
        setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await tasksApi.deleteTask(id);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  const toggleTaskComplete = async (id: string) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : null,
              }
            : t
        )
      );

      const res = await tasksApi.toggleTask(id);
      if (res.success && res.task) {
        setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Revert if error
      refreshTasks();
    }
  };

  const seedDemoTasksIfEmpty = async () => {
    const today = new Date();
    const formatOffset = (offsetDays: number, timeStr = '17:00') => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T${timeStr}`;
    };

    const seeds = [
      {
        title: 'Submit Q3 Product Roadmap & Strategy Deck',
        description: 'Finalize executive slides with target metrics and release timelines.',
        priority: 'high' as Priority,
        dueDate: formatOffset(0, '15:30'),
        category: 'Work',
      },
      {
        title: 'Review pull request for auth token expiration bug',
        description: 'Check security regressions and verify OAuth2 refresh cycle edge cases.',
        priority: 'high' as Priority,
        dueDate: formatOffset(1, '12:00'),
        category: 'Work',
      },
      {
        title: 'Pay quarterly cloud infrastructure invoice',
        description: 'Review AWS & MongoDB Atlas usage breakdown before authorizing payment.',
        priority: 'medium' as Priority,
        dueDate: formatOffset(-1, '09:00'),
        category: 'Finance',
      },
      {
        title: 'Annual health checkup appointment',
        description: 'Bring recent lab results and health insurance card to Dr. Vance clinic.',
        priority: 'medium' as Priority,
        dueDate: formatOffset(3, '10:15'),
        category: 'Health',
      },
    ];

    for (const seed of seeds) {
      await addTask(seed);
    }
  };

  // Filter setters
  const setSearch = (search: string) => setFilters((prev) => ({ ...prev, search }));
  const setStatusFilter = (status: StatusFilter) => setFilters((prev) => ({ ...prev, status }));
  const setPriorityFilter = (priority: 'all' | Priority) => setFilters((prev) => ({ ...prev, priority }));
  const setCategoryFilter = (category: 'all' | string) => setFilters((prev) => ({ ...prev, category }));
  const setSortBy = (sortBy: SortOption) => setFilters((prev) => ({ ...prev, sortBy }));
  const resetFilters = () => setFilters(initialFilters);

  // Available categories
  const categories = useMemo(() => {
    const defaultCats = ['Work', 'Personal', 'Urgent', 'Study', 'Finance', 'Health'];
    const customCats = tasks.map((t) => t.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...customCats]));
  }, [tasks]);

  const priorityWeight: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  // Filtered & Sorted Tasks computation
  const filteredTasks = useMemo(() => {
    const now = new Date().getTime();

    return tasks
      .filter((task) => {
        if (filters.status === 'pending' && task.completed) return false;
        if (filters.status === 'completed' && !task.completed) return false;
        if (filters.status === 'overdue') {
          if (task.completed || !task.dueDate) return false;
          const dueTime = new Date(task.dueDate).getTime();
          if (dueTime >= now) return false;
        }

        if (filters.priority !== 'all' && task.priority !== filters.priority) {
          return false;
        }

        if (filters.category !== 'all' && task.category !== filters.category) {
          return false;
        }

        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description?.toLowerCase().includes(query);
          const matchCat = task.category?.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        switch (filters.sortBy) {
          case 'smart': {
            const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
            if (pDiff !== 0) return pDiff;

            if (a.dueDate && b.dueDate) {
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }

          case 'dueDateAsc': {
            if (a.dueDate && b.dueDate) {
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;
            return 0;
          }

          case 'dueDateDesc': {
            if (a.dueDate && b.dueDate) {
              return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            }
            if (a.dueDate && !b.dueDate) return 1;
            if (!a.dueDate && b.dueDate) return -1;
            return 0;
          }

          case 'priorityDesc': {
            const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
            if (pDiff !== 0) return pDiff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }

          case 'priorityAsc': {
            const pDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
            if (pDiff !== 0) return pDiff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }

          case 'createdDesc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

          case 'createdAsc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

          case 'titleAsc':
            return a.title.localeCompare(b.title);

          default:
            return 0;
        }
      });
  }, [tasks, filters]);

  // Overall Statistics computation
  const stats = useMemo<TaskStats>(() => {
    if (!tasks || tasks.length === 0) return defaultStats;

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const now = new Date().getTime();
    const overdue = tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate).getTime() < now;
    }).length;
    const highPriority = tasks.filter((t) => !t.completed && t.priority === 'high').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      highPriority,
      completionRate,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        filters,
        stats,
        categories,
        isFetching,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        setSearch,
        setStatusFilter,
        setPriorityFilter,
        setCategoryFilter,
        setSortBy,
        resetFilters,
        seedDemoTasksIfEmpty,
        refreshTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
