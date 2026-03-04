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

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;

  const results = data?.results ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Audit Log</h2>
        <span className="text-sm text-gray-500">{total} results</span>
      </div>

      {results.length === 0 ? (
        <p className="text-gray-400 text-sm">No test results recorded yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2 font-medium text-gray-500">Time</th>
                <th className="text-left px-4 py-2 font-medium text-gray-500">Test Case</th>
                <th className="text-left px-4 py-2 font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-2 font-medium text-gray-500">Tester</th>
                <th className="text-left px-4 py-2 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-500">Notes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/test/${r.testCaseId}`}
                      className="text-gray-800 hover:text-blue-600"
                    >
                      {r.testCase?.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {r.testCase?.category?.name}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{r.tester?.name}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={r.status as TestStatus} />
                  </td>
                  <td className="px-4 py-2 text-gray-500 truncate max-w-[200px]">
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
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
