import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { categoriesRouter } from './routes/categories.js';
import { testCasesRouter } from './routes/test-cases.js';
import { testersRouter } from './routes/testers.js';
import { assignmentsRouter } from './routes/assignments.js';
import { resultsRouter } from './routes/results.js';
import { dashboardRouter } from './routes/dashboard.js';
import { exportRouter } from './routes/export.js';

const app = express();
const port = Number(process.env.PORT) || 3001;

export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/categories', categoriesRouter);
app.use('/api/test-cases', testCasesRouter);
app.use('/api/testers', testersRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/results', resultsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/export', exportRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
