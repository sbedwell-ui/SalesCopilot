import { Router } from 'express';
import { prisma } from '../index.js';

export const testersRouter = Router();

// GET /api/testers — all testers (active only by default, ?includeInactive=true for all)
testersRouter.get('/', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const testers = await prisma.tester.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { assignments: true, testResults: true },
        },
      },
    });
    res.json(testers);
  } catch (err) {
    console.error('GET /api/testers error:', err);
    res.status(500).json({ error: 'Failed to fetch testers' });
  }
});

// POST /api/testers — create tester (or reactivate inactive tester with same name)
testersRouter.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if an inactive tester with the same name exists — reactivate them
    const inactive = await prisma.tester.findFirst({
      where: { name, isActive: false },
    });

    if (inactive) {
      const reactivated = await prisma.tester.update({
        where: { id: inactive.id },
        data: {
          isActive: true,
          ...(email && { email }),
        },
        include: {
          _count: {
            select: { assignments: true, testResults: true },
          },
        },
      });
      return res.json(reactivated);
    }

    const tester = await prisma.tester.create({
      data: { name, email: email || null, role: role || 'tester' },
    });
    res.status(201).json(tester);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'A tester with that name already exists' });
    }
    console.error('POST /api/testers error:', err);
    res.status(500).json({ error: 'Failed to create tester' });
  }
});

// PATCH /api/testers/:id — update tester
testersRouter.patch('/:id', async (req, res) => {
  try {
    const { name, email, isActive } = req.body;
    const tester = await prisma.tester.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    res.json(tester);
  } catch (err) {
    console.error('PATCH /api/testers/:id error:', err);
    res.status(500).json({ error: 'Failed to update tester' });
  }
});

// DELETE /api/testers/:id — soft-delete tester with optional result clearing
testersRouter.delete('/:id', async (req, res) => {
  try {
    // Verify tester exists
    const tester = await prisma.tester.findUnique({
      where: { id: req.params.id },
    });

    if (!tester) {
      return res.status(404).json({ error: 'Tester not found' });
    }

    if (tester.role === 'system') {
      return res.status(403).json({ error: 'Cannot remove system testers' });
    }

    const { clearResults } = req.body || {};

    // If clearResults, delete all TestResult records for this tester
    if (clearResults) {
      await prisma.testResult.deleteMany({
        where: { testerId: tester.id },
      });
    }

    // Soft-delete: set isActive = false
    const updated = await prisma.tester.update({
      where: { id: tester.id },
      data: { isActive: false },
      include: {
        _count: {
          select: { assignments: true, testResults: true },
        },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('DELETE /api/testers/:id error:', err);
    res.status(500).json({ error: 'Failed to remove tester' });
  }
});
