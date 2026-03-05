const BASE = '/api';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  // Handle CSV/blob responses
  if (res.headers.get('content-type')?.includes('text/csv')) {
    return res.blob() as unknown as T;
  }
  return res.json();
}

export const api = {
  // Categories
  getCategories: () => request<import('./types').Category[]>('/categories'),
  getCategory: (slug: string) =>
    request<import('./types').Category & { testCases: import('./types').TestCase[] }>(
      `/categories/${slug}`
    ),

  // Test cases
  getTestCase: (id: string) => request<import('./types').TestCase>(`/test-cases/${id}`),
  updateTestCase: (id: string, data: { priority?: string }) =>
    request<import('./types').TestCase>(`/test-cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Testers
  getTesters: () => request<import('./types').Tester[]>('/testers'),
  getAllTesters: () => request<import('./types').Tester[]>('/testers?includeInactive=true'),
  createTester: (data: { name: string; email?: string }) =>
    request<import('./types').Tester>('/testers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTester: (id: string, data: Partial<{ name: string; email: string; isActive: boolean }>) =>
    request<import('./types').Tester>(`/testers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTester: (id: string, clearResults: boolean) =>
    request<import('./types').Tester>(`/testers/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ clearResults }),
    }),

  // Assignments
  assignTester: (testCaseId: string, testerId: string) =>
    request<import('./types').TestAssignment>('/assignments', {
      method: 'PUT',
      body: JSON.stringify({ testCaseId, testerId }),
    }),
  bulkAssign: (testCaseIds: string[], testerId: string) =>
    request<{ count: number }>('/assignments/bulk', {
      method: 'POST',
      body: JSON.stringify({ testCaseIds, testerId }),
    }),
  removeAssignment: (testCaseId: string) =>
    request<{ success: boolean }>(`/assignments/${testCaseId}`, { method: 'DELETE' }),

  // Results
  recordResult: (data: { testCaseId: string; testerId: string; status: string; notes?: string }) =>
    request<import('./types').TestResult>('/results', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getResults: (limit = 100, offset = 0) =>
    request<import('./types').ResultsPage>(`/results?limit=${limit}&offset=${offset}`),

  // Dashboard
  getDashboard: () => request<import('./types').DashboardData>('/dashboard'),

  // Export
  exportCsv: () => request<Blob>('/export/csv'),
};
