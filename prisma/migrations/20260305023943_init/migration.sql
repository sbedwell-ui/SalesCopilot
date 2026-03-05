-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tester" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'tester',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userStory" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "testSteps" TEXT NOT NULL,
    "prerequisites" TEXT NOT NULL,
    "crmNotes" TEXT,
    "pageRef" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAssignment" (
    "id" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "testerId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "testerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tester_name_key" ON "Tester"("name");

-- CreateIndex
CREATE INDEX "TestCase_categoryId_idx" ON "TestCase"("categoryId");

-- CreateIndex
CREATE INDEX "TestAssignment_testerId_idx" ON "TestAssignment"("testerId");

-- CreateIndex
CREATE UNIQUE INDEX "TestAssignment_testCaseId_key" ON "TestAssignment"("testCaseId");

-- CreateIndex
CREATE INDEX "TestResult_testCaseId_idx" ON "TestResult"("testCaseId");

-- CreateIndex
CREATE INDEX "TestResult_testerId_idx" ON "TestResult"("testerId");

-- CreateIndex
CREATE INDEX "TestResult_createdAt_idx" ON "TestResult"("createdAt");

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES "Tester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES "Tester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
