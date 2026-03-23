import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const getTasks = asyncHandler(async (req, res) => {
    const db = getDB();
    const tasks = await db.collection('tasks').find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json({ success: true, data: tasks });
});

export const createTask = asyncHandler(async (req, res, next) => {
    const { name, command, description, language } = req.body;

    if (!name || !command) {
        return next(new AppError('Please provide a name and command', 400));
    }

    if (name.length > 50) return next(new AppError('Name can not be more than 50 characters', 400));
    if (description && description.length > 500) return next(new AppError('Description can not be more than 500 characters', 400));

    const db = getDB();

    const newTask = {
        name: name.trim(),
        command,
        description,
        language: language || 'javascript',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db.collection('tasks').insertOne(newTask);

    const task = { _id: result.insertedId, ...newTask };

    res.status(201).json({ success: true, data: task });
});

export const getTaskStats = asyncHandler(async (req, res) => {
    const db = getDB();

    const stats = await db.collection('executions').aggregate([
        {
            $group: {
                _id: '$task',
                totalExecutions: { $sum: 1 },
                successfulExecutions: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                failedExecutions: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
            }
        },
        {
            $addFields: {
                taskId: {
                    $cond: {
                        if: { $eq: [{ $type: '$_id' }, 'string'] },
                        then: { $toObjectId: '$_id' },
                        else: '$_id'
                    }
                }
            }
        },
        {
            $lookup: { from: 'tasks', localField: 'taskId', foreignField: '_id', as: 'taskInfo' }
        },
        { $unwind: '$taskInfo' },
        {
            $project: {
                taskName: '$taskInfo.name',
                totalExecutions: 1,
                successfulExecutions: 1,
                failedExecutions: 1
            }
        }
    ]).toArray();

    res.status(200).json({ success: true, data: stats });
});

export const getTask = asyncHandler(async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return next(new AppError('Invalid Task ID format', 400));
    }

    const db = getDB();
    const taskId = new ObjectId(req.params.id);

    const task = await db.collection('tasks').findOne({ _id: taskId });

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    const executions = await db.collection('executions')
        .find({ task: taskId })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

    res.status(200).json({
        success: true,
        data: {
            task,
            recentExecutions: executions
        }
    });
});

export const deleteAllTasks = asyncHandler(async (req, res) => {
    const db = getDB();
    await db.collection('tasks').deleteMany({});
    res.status(200).json({ success: true, message: 'All tasks deleted' });
});
