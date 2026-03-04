import { Router } from 'express';
import { prisma } from '../index.js';

export const testCasesRouter = Router();

// GET /api/test-cases/:id — full test case detail
testCasesRouter.get('/:id', async (req, res) => {
  try {
    const testCase = await prisma.testCase.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        assignments: { include: { tester: true } },
        testResults: {
          orderBy: { createdAt: 'desc' },
          include: { tester: true },
        },
      },
    });

    if (!testCase) {
      return res.status(404).json({ error: 'Test case not found' });
    }

    res.json(testCase);
  } catch (err) {
    console.error('GET /api/test-cases/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch test case' });
  }
});
