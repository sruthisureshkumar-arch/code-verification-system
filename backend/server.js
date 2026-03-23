import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import taskRoutes from './routes/taskRoutes.js';
import executionRoutes from './routes/executionRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/executions', executionRoutes);

app.get('/', (req, res) => {
    res.send('Automated Execution Verification System API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
