import express from 'express';
import { triggerExecution, getExecution, getAllExecutions } from '../controllers/executionController.js';

const router = express.Router();

router.route('/').get(getAllExecutions);
router.route('/:id').get(getExecution);
router.route('/trigger/:taskId').post(triggerExecution);

export default router;
