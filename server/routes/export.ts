import { Router } from 'express';
import { format } from '@fast-csv/format';
import { prisma } from '../index.js';

export const exportRouter = Router();

// GET /api/export/csv — export all test cases with status as CSV
exportRouter.get('/csv', async (_req, res) => {
  try {
    const testCases = await prisma.testCase.findMany({
      orderBy: [{ category: { displayOrder: 'asc' } }, { displayOrder: 'asc' }],
      include: {
        category: true,
        assignments: { include: { tester: true } },
        testResults: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { tester: true },
        },
      },
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="copilot-sales-test-results.csv"');

    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    for (const tc of testCases) {
      const latestResult = tc.testResults[0];
      const assignee = tc.assignments[0]?.tester?.name || '';

      csvStream.write({
        Category: tc.category.name,
        'Test Case': tc.title,
        Priority: tc.priority,
        Persona: tc.persona,
        'Assigned To': assignee,
        Status: latestResult?.status || 'untested',
        'Tested By': latestResult?.tester?.name || '',
        'Tested At': latestResult?.createdAt?.toISOString() || '',
        Notes: latestResult?.notes || '',
        'Page Ref': tc.pageRef || '',
      });
    }

    csvStream.end();
  } catch (err) {
    console.error('GET /api/export/csv error:', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});
