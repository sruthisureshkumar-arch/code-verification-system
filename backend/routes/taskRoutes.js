import express from 'express';
import { getTasks, createTask, getTaskStats, getTask, deleteAllTasks } from '../controllers/taskController.js';

const router = express.Router();

router.route('/').get(getTasks).post(createTask).delete(deleteAllTasks);
router.route('/stats').get(getTaskStats);
router.route('/:id').get(getTask);

export default router;
