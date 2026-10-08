import { Task } from '../models/Task.js';

// Priority weight for smart sorting
const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
};

// @desc    Get all tasks for authenticated user with filters and smart sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy = 'smart' } = req.query;
    const userId = req.user._id;

    // Base filter: user's tasks
    const query = { user: userId };

    // Status filter
    const now = new Date();
    if (status === 'pending') {
      query.completed = false;
    } else if (status === 'completed') {
      query.completed = true;
    } else if (status === 'overdue') {
      query.completed = false;
      query.dueDate = { $ne: null, $lt: now.toISOString() };
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Keyword search
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
      ];
    }

    let tasks = await Task.find(query);

    // Apply sorting
    tasks.sort((a, b) => {
      // Completed items go to the bottom unless sorting explicitly
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (sortBy) {
        case 'smart': {
          // 1. Priority (High > Medium > Low)
          const pDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
          if (pDiff !== 0) return pDiff;

          // 2. Due Date (Earliest first)
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          if (a.dueDate && !b.dueDate) return -1;
          if (!a.dueDate && b.dueDate) return 1;

          // 3. Newest first
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
          const pDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
          if (pDiff !== 0) return pDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        case 'priorityAsc': {
          const pDiff = (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
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

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks: tasks.map((t) => t.toJSON()),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching tasks.',
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      category: category ? category.trim() : 'Work',
      completed: false,
      completedAt: null,
    });

    return res.status(201).json({
      success: true,
      task: task.toJSON(),
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating task.',
    });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You do not own this task.',
      });
    }

    return res.status(200).json({
      success: true,
      task: task.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You do not own this task.',
      });
    }

    const { title, description, priority, dueDate, category } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (category !== undefined) task.category = category.trim();

    await task.save();

    return res.status(200).json({
      success: true,
      task: task.toJSON(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating task.',
    });
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You do not own this task.',
      });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();

    return res.status(200).json({
      success: true,
      task: task.toJSON(),
    });
  } catch (error) {
    console.error('Error toggling task:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling task.',
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You do not own this task.',
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting task.',
    });
  }
};

// @desc    Get dashboard metrics & analytics for authenticated user
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, completed, pending, overdue, highPriority] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, completed: true }),
      Task.countDocuments({ user: userId, completed: false }),
      Task.countDocuments({
        user: userId,
        completed: false,
        dueDate: { $ne: null, $lt: now.toISOString() },
      }),
      Task.countDocuments({
        user: userId,
        completed: false,
        priority: 'high',
      }),
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        overdue,
        highPriority,
        completionRate,
      },
    });
  } catch (error) {
    console.error('Error computing task stats:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error computing stats.',
    });
  }
};
