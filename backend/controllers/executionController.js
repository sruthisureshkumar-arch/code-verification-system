
import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';
import asyncHandler from 'express-async-handler';
import { getDB } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MARS_JAR = path.join(__dirname, '..', 'Mars.jar');

function getCommand(lang, file) {
    if (lang === 'c') return `gcc "${file}.c" -o "${file}.out" && "${file}.out"`;
    if (lang === 'cpp') return `g++ "${file}.cpp" -o "${file}.out" && "${file}.out"`;
    if (lang === 'java') return `javac "${file}Main.java" && java -cp "${path.dirname(file)}" Main`;
    if (lang === 'mips') return `java -jar "${MARS_JAR}" ae1 se1 sm nc "${file}.asm"`;
    return `node "${file}.js"`;
}

function getExt(lang) {
    if (lang === 'c') return '.c';
    if (lang === 'cpp') return '.cpp';
    if (lang === 'java') return 'Main.java';
    if (lang === 'mips') return '.asm';
    return '.js';
}

export const triggerExecution = asyncHandler(async (req, res, next) => {
    if (!ObjectId.isValid(req.params.taskId)) return next(new AppError('Invalid Task ID', 400));

    const db = getDB();
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(req.params.taskId) });
    if (!task) return next(new AppError('Task not found', 404));

    const startTime = new Date();
    const lang = task.language || 'javascript';

    const { insertedId } = await db.collection('executions').insertOne({
        task: task._id, status: 'running', output: '', error: '',
        startTime, createdAt: startTime, updatedAt: startTime
    });

    res.status(201).json({ success: true, data: { _id: insertedId, status: 'running' } });

    // Safety timeout: mark as failed if execution doesn't complete within 15s
    const safetyTimer = setTimeout(() => {
        db.collection('executions').updateOne(
            { _id: insertedId, status: 'running' },
            { $set: { status: 'failed', error: 'Execution timed out (15s limit)', endTime: new Date(), durationMs: 15000, updatedAt: new Date() } }
        ).catch(err => console.error('Safety timeout DB update failed:', err));
    }, 15000);

    try {
        const tmpBase = path.join(os.tmpdir(), 'code_' + insertedId + '_');
        const tmpFile = tmpBase + getExt(lang);

        fs.writeFile(tmpFile, task.command, function (err) {
            if (err) {
                clearTimeout(safetyTimer);
                db.collection('executions').updateOne({ _id: insertedId },
                    { $set: { status: 'failed', error: err.message, updatedAt: new Date() } });
                return;
            }

            exec(getCommand(lang, tmpBase), { timeout: 8000 }, function (error, stdout, stderr) {
                clearTimeout(safetyTimer);
                const durationMs = new Date() - startTime;
                let finalErrorStr = '';
                if (error) {
                    const cleanOutput = (stdout + '\n' + stderr).replace(/.*java\.util\.prefs.*\n.*/ig, '').trim();
                    if (error.killed && (error.signal === 'SIGTERM' || error.signal === 'SIGKILL')) {
                        finalErrorStr = cleanOutput || 'Execution timed out. Does your program contain an infinite loop or wait for input?';
                    } else {
                        finalErrorStr = cleanOutput || error.message;
                    }
                }

                db.collection('executions').updateOne({ _id: insertedId }, {
                    $set: {
                        status: error ? 'failed' : 'completed',
                        output: stdout || '',
                        error: finalErrorStr,
                        endTime: new Date(),
                        durationMs,
                        updatedAt: new Date()
                    }
                }).catch(err => console.error('Execution DB update failed:', err));
            });
        });
    } catch (err) {
        clearTimeout(safetyTimer);
        console.error('Unexpected execution error:', err);
        db.collection('executions').updateOne({ _id: insertedId },
            { $set: { status: 'failed', error: err.message || 'Unexpected server error', updatedAt: new Date() } }
        ).catch(e => console.error('DB update after unexpected error failed:', e));
    }
});

export const getExecution = asyncHandler(async (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) return next(new AppError('Invalid ID', 400));
    const db = getDB();
    const execution = await db.collection('executions').findOne({ _id: new ObjectId(req.params.id) });
    if (!execution) return next(new AppError('Not found', 404));
    res.status(200).json({ success: true, data: execution });
});

export const getAllExecutions = asyncHandler(async (req, res) => {
    const db = getDB();
    const executions = await db.collection('executions').find({}).sort({ createdAt: -1 }).limit(50).toArray();
    res.status(200).json({ success: true, data: executions });
});
