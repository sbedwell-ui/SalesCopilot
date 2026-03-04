import { Router } from 'express';
import { prisma } from '../index.js';

export const resultsRouter = Router();

// POST /api/results — record a test result
resultsRouter.post('/', async (req, res) => {
  try {
    const { testCaseId, testerId, status, notes } = req.body;
    if (!testCaseId || !testerId || !status) {
      return res.status(400).json({ error: 'testCaseId, testerId, and status are required' });
    }

    const validStatuses = ['pass', 'fail', 'blocked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const result = await prisma.testResult.create({
      data: {
        testCaseId,
        testerId,
        status,
        notes: notes || null,
      },
      include: { tester: true, testCase: true },
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('POST /api/results error:', err);
    res.status(500).json({ error: 'Failed to record result' });
  }
});

// GET /api/results — audit log of all test results
resultsRouter.get('/', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const offset = Number(req.query.offset) || 0;

    const [results, total] = await Promise.all([
      prisma.testResult.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          tester: true,
          testCase: {
            include: { category: true },
          },
        },
      }),
      prisma.testResult.count(),
    ]);

    res.json({ results, total, limit, offset });
  } catch (err) {
    console.error('GET /api/results error:', err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});
