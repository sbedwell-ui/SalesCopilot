import { Router } from 'express';
import { prisma } from '../index.js';

export const categoriesRouter = Router();

// GET /api/categories — all categories with test case counts and progress
categoriesRouter.get('/', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        testCases: {
          select: {
            id: true,
            testResults: {
              select: { status: true },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const result = categories.map((cat) => {
      const total = cat.testCases.length;
      let passed = 0;
      let failed = 0;
      let blocked = 0;

      for (const tc of cat.testCases) {
        const latest = tc.testResults[0];
        if (latest?.status === 'pass') passed++;
        else if (latest?.status === 'fail') failed++;
        else if (latest?.status === 'blocked') blocked++;
      }

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        displayOrder: cat.displayOrder,
        description: cat.description,
        color: cat.color,
        stats: { total, passed, failed, blocked, untested: total - passed - failed - blocked },
      };
    });

    res.json(result);
  } catch (err) {
    console.error('GET /api/categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug — single category with full test cases
categoriesRouter.get('/:slug', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        testCases: {
          orderBy: { displayOrder: 'asc' },
          include: {
            assignments: { include: { tester: true } },
            testResults: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: { tester: true },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error('GET /api/categories/:slug error:', err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});
