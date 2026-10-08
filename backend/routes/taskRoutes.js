import express from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  toggleTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.get('/stats', getTaskStats);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTask);

export default router;
