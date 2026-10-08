export type Priority = 'high' | 'medium' | 'low';

export type TaskCategory = 
  | 'Work' 
  | 'Personal' 
  | 'Urgent' 
  | 'Study' 
  | 'Finance' 
  | 'Health' 
  | 'Other';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD or ISO string
  category: TaskCategory | string;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type SortOption = 
  | 'smart'            // Priority + Due Date (High Priority & Soonest Due first)
  | 'dueDateAsc'       // Due date earliest first
  | 'dueDateDesc'      // Due date latest first
  | 'priorityDesc'     // High -> Medium -> Low
  | 'priorityAsc'      // Low -> Medium -> High
  | 'createdDesc'      // Newest created first
  | 'createdAsc'       // Oldest created first
  | 'titleAsc';        // Alphabetical A-Z

export type StatusFilter = 'all' | 'pending' | 'completed' | 'overdue';

export interface FilterState {
  status: StatusFilter;
  priority: 'all' | Priority;
  category: 'all' | string;
  search: string;
  sortBy: SortOption;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
}
