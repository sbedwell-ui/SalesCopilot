// Shared types matching the Prisma schema + API responses

export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  description: string;
  color: string;
  stats?: CategoryStats;
}

export interface CategoryStats {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  untested: number;
}

export interface Tester {
  id: string;
  name: string;
  email: string | null;
  role: string;
  isActive: boolean;
  _count?: { assignments: number; testResults: number };
}

export interface TestCase {
  id: string;
  categoryId: string;
  category?: Category;
  title: string;
  userStory: string;
  persona: string;
  testSteps: string; // JSON array
  prerequisites: string; // JSON array
  crmNotes: string | null;
  pageRef: string | null;
  displayOrder: number;
  assignments?: TestAssignment[];
  testResults?: TestResult[];
}

export interface TestAssignment {
  id: string;
  testCaseId: string;
  testCase?: TestCase;
  testerId: string;
  tester?: Tester;
  assignedAt: string;
}

export interface TestResult {
  id: string;
  testCaseId: string;
  testCase?: TestCase;
  testerId: string;
  tester?: Tester;
  status: 'pass' | 'fail' | 'blocked';
  notes: string | null;
  createdAt: string;
}

export interface DashboardData {
  overall: {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    untested: number;
    assigned: number;
  };
  recentResults: TestResult[];
  testerStats: TesterStat[];
}

export interface TesterStat {
  id: string;
  name: string;
  assigned: number;
  passed: number;
  failed: number;
  blocked: number;
}

export interface ResultsPage {
  results: TestResult[];
  total: number;
  limit: number;
  offset: number;
}

export type TestStatus = 'pass' | 'fail' | 'blocked' | 'untested';
