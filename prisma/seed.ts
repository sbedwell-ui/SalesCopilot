import { PrismaClient } from '@prisma/client';
import { categories } from './seed-data/categories.js';
import { testCases } from './seed-data/test-cases.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Upsert categories
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        displayOrder: cat.displayOrder,
        description: cat.description,
        color: cat.color,
      },
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
    console.log(`  Category: ${record.name} (${record.id})`);
  }

  // Upsert test cases (keyed on title uniqueness within category)
  let created = 0;
  let updated = 0;
  for (const tc of testCases) {
    const categoryId = categoryMap.get(tc.categorySlug);
    if (!categoryId) {
      console.warn(`  SKIP: Unknown category slug "${tc.categorySlug}" for "${tc.title}"`);
      continue;
    }

    // Check if a test case with this title already exists in this category
    const existing = await prisma.testCase.findFirst({
      where: { title: tc.title, categoryId },
    });

    if (existing) {
      await prisma.testCase.update({
        where: { id: existing.id },
        data: {
          userStory: tc.userStory,
          persona: tc.persona,
          testSteps: tc.testSteps,
          prerequisites: tc.prerequisites,
          crmNotes: tc.crmNotes,
          pageRef: tc.pageRef,
          displayOrder: tc.displayOrder,
        },
      });
      updated++;
    } else {
      await prisma.testCase.create({
        data: {
          categoryId,
          title: tc.title,
          userStory: tc.userStory,
          persona: tc.persona,
          testSteps: tc.testSteps,
          prerequisites: tc.prerequisites,
          crmNotes: tc.crmNotes,
          pageRef: tc.pageRef,
          displayOrder: tc.displayOrder,
        },
      });
      created++;
    }
  }

  // Seed default testers
  const defaultTesters = [
    { name: 'Unassigned', role: 'system', isActive: true },
  ];

  for (const t of defaultTesters) {
    await prisma.tester.upsert({
      where: { name: t.name },
      update: { role: t.role, isActive: t.isActive },
      create: t,
    });
  }

  console.log(`\nSeed complete:`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Test cases: ${created} created, ${updated} updated (${testCases.length} total)`);
  console.log(`  Testers: ${defaultTesters.length} (default)`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
