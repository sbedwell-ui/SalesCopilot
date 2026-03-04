import { Router } from 'express';
import { prisma } from '../index.js';

export const dashboardRouter = Router();

// GET /api/dashboard — overall stats
dashboardRouter.get('/', async (_req, res) => {
  try {
    // Get all test cases with their latest result
    const testCases = await prisma.testCase.findMany({
      include: {
        testResults: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        assignments: true,
      },
    });

    const total = testCases.length;
    let passed = 0;
    let failed = 0;
    let blocked = 0;
    let assigned = 0;

    for (const tc of testCases) {
      if (tc.assignments.length > 0) assigned++;
      const latest = tc.testResults[0];
      if (latest?.status === 'pass') passed++;
      else if (latest?.status === 'fail') failed++;
      else if (latest?.status === 'blocked') blocked++;
    }

    const untested = total - passed - failed - blocked;

    // Recent activity
    const recentResults = await prisma.testResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        tester: true,
        testCase: { include: { category: true } },
      },
    });

    // Per-tester stats
    const testers = await prisma.tester.findMany({
      where: { isActive: true, role: 'tester' },
      include: {
        assignments: true,
        testResults: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const testerStats = testers.map((t) => {
      // Get unique test case IDs this tester has results for
      const resultsByTestCase = new Map<string, string>();
      for (const r of t.testResults) {
        if (!resultsByTestCase.has(r.testCaseId)) {
          resultsByTestCase.set(r.testCaseId, r.status);
        }
      }
      let tPassed = 0;
      let tFailed = 0;
      let tBlocked = 0;
      for (const status of resultsByTestCase.values()) {
        if (status === 'pass') tPassed++;
        else if (status === 'fail') tFailed++;
        else if (status === 'blocked') tBlocked++;
      }
      return {
        id: t.id,
        name: t.name,
        assigned: t.assignments.length,
        passed: tPassed,
        failed: tFailed,
        blocked: tBlocked,
      };
    });

    res.json({
      overall: { total, passed, failed, blocked, untested, assigned },
      recentResults,
      testerStats,
    });
  } catch (err) {
    console.error('GET /api/dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});
