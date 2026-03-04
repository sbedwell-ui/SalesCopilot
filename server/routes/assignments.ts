import { Router } from 'express';
import { prisma } from '../index.js';

export const assignmentsRouter = Router();

// PUT /api/assignments — assign tester to test case (upsert on testCaseId)
assignmentsRouter.put('/', async (req, res) => {
  try {
    const { testCaseId, testerId } = req.body;
    if (!testCaseId || !testerId) {
      return res.status(400).json({ error: 'testCaseId and testerId are required' });
    }

    // Upsert: one assignment per test case
    const existing = await prisma.testAssignment.findUnique({
      where: { testCaseId },
    });

    let assignment;
    if (existing) {
      assignment = await prisma.testAssignment.update({
        where: { id: existing.id },
        data: { testerId },
        include: { tester: true, testCase: true },
      });
    } else {
      assignment = await prisma.testAssignment.create({
        data: { testCaseId, testerId },
        include: { tester: true, testCase: true },
      });
    }

    res.json(assignment);
  } catch (err) {
    console.error('PUT /api/assignments error:', err);
    res.status(500).json({ error: 'Failed to assign tester' });
  }
});

// POST /api/assignments/bulk — bulk assign tester to multiple test cases
assignmentsRouter.post('/bulk', async (req, res) => {
  try {
    const { testCaseIds, testerId } = req.body;
    if (!Array.isArray(testCaseIds) || !testerId) {
      return res.status(400).json({ error: 'testCaseIds (array) and testerId are required' });
    }

    const results = [];
    for (const testCaseId of testCaseIds) {
      const existing = await prisma.testAssignment.findUnique({
        where: { testCaseId },
      });

      if (existing) {
        const updated = await prisma.testAssignment.update({
          where: { id: existing.id },
          data: { testerId },
        });
        results.push(updated);
      } else {
        const created = await prisma.testAssignment.create({
          data: { testCaseId, testerId },
        });
        results.push(created);
      }
    }

    res.json({ count: results.length, assignments: results });
  } catch (err) {
    console.error('POST /api/assignments/bulk error:', err);
    res.status(500).json({ error: 'Failed to bulk assign' });
  }
});

// DELETE /api/assignments/:testCaseId — remove assignment
assignmentsRouter.delete('/:testCaseId', async (req, res) => {
  try {
    await prisma.testAssignment.delete({
      where: { testCaseId: req.params.testCaseId },
    });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/assignments/:testCaseId error:', err);
    res.status(500).json({ error: 'Failed to remove assignment' });
  }
});
