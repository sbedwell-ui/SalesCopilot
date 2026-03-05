import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import type { ResultsPage, TestStatus } from '../lib/types';

const PAGE_SIZE = 50;

export default function AuditLog() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery<ResultsPage>({
    queryKey: ['results', page],
    queryFn: () => api.getResults(PAGE_SIZE, page * PAGE_SIZE),
  });

  if (isLoading) return <div className="p-8 text-data3-text-muted">Loading...</div>;

  const results = data?.results ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Audit Log</h2>
        <span className="text-sm text-data3-text-muted">{total} results</span>
      </div>

      {results.length === 0 ? (
        <p className="text-data3-text-muted text-sm">No test results recorded yet.</p>
      ) : (
        <div className="bg-data3-card border border-data3-border-light rounded-lg shadow-md shadow-black/15 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-data3-border bg-data3-surface">
                <th className="text-left px-4 py-2 font-medium text-data3-text-muted">Time</th>
                <th className="text-left px-4 py-2 font-medium text-data3-text-muted">Test Case</th>
                <th className="text-left px-4 py-2 font-medium text-data3-text-muted">Category</th>
                <th className="text-left px-4 py-2 font-medium text-data3-text-muted">Tester</th>
                <th className="text-left px-4 py-2 font-medium text-data3-text-muted">Status</th>
                <th className="text-left px-4 py-2 font-medium text-data3-text-muted">Notes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b border-data3-border hover:bg-data3-surface-light transition-colors">
                  <td className="px-4 py-2 text-data3-text-muted text-xs whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/test/${r.testCaseId}`}
                      className="text-white hover:text-data3-accent"
                    >
                      {r.testCase?.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-data3-text-muted">
                    {r.testCase?.category?.name}
                  </td>
                  <td className="px-4 py-2 text-data3-text-muted">{r.tester?.name}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={r.status as TestStatus} />
                  </td>
                  <td className="px-4 py-2 text-data3-text-muted truncate max-w-[200px]">
                    {r.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 text-sm border border-data3-border rounded hover:bg-data3-surface-light text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-data3-text-muted">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 text-sm border border-data3-border rounded hover:bg-data3-surface-light text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
