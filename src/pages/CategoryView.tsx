import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { api } from '../lib/api';
import TestCard from '../components/TestCard';
import ProgressBar from '../components/ProgressBar';
import TesterPicker from '../components/TesterPicker';
import type { Category, TestCase, TestStatus } from '../lib/types';

export default function CategoryView() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTesterId, setBulkTesterId] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const { data: category, isLoading } = useQuery<Category & { testCases: TestCase[] }>({
    queryKey: ['category', slug],
    queryFn: () => api.getCategory(slug!),
    enabled: !!slug,
  });

  const bulkMutation = useMutation({
    mutationFn: ({ testCaseIds, testerId }: { testCaseIds: string[]; testerId: string }) =>
      api.bulkAssign(testCaseIds, testerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', slug] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSelectedIds(new Set());
      setBulkTesterId('');
      setShowBulk(false);
    },
  });

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!category) return <div className="p-8 text-red-500">Category not found</div>;

  const testCases = category.testCases || [];
  const stats = {
    total: testCases.length,
    passed: testCases.filter((tc) => tc.testResults?.[0]?.status === 'pass').length,
    failed: testCases.filter((tc) => tc.testResults?.[0]?.status === 'fail').length,
    blocked: testCases.filter((tc) => tc.testResults?.[0]?.status === 'blocked').length,
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === testCases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(testCases.map((tc) => tc.id)));
    }
  };

  const handleBulkAssign = () => {
    if (selectedIds.size > 0 && bulkTesterId) {
      bulkMutation.mutate({ testCaseIds: [...selectedIds], testerId: bulkTesterId });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
      </div>
      <p className="text-sm text-gray-500">{category.description}</p>

      <ProgressBar
        total={stats.total}
        passed={stats.passed}
        failed={stats.failed}
        blocked={stats.blocked}
        showLabels
      />

      {/* Bulk actions toolbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowBulk(!showBulk)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
        >
          <Users size={14} />
          Bulk Assign
        </button>

        {showBulk && (
          <>
            <label className="flex items-center gap-1.5 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={selectedIds.size === testCases.length && testCases.length > 0}
                onChange={selectAll}
                className="rounded border-gray-300 text-blue-600"
              />
              Select all
            </label>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
                <div className="w-48">
                  <TesterPicker value={bulkTesterId} onChange={setBulkTesterId} />
                </div>
                <button
                  onClick={handleBulkAssign}
                  disabled={!bulkTesterId || bulkMutation.isPending}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {bulkMutation.isPending ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Test cases list */}
      <div className="space-y-2">
        {testCases.map((tc) => (
          <TestCard
            key={tc.id}
            testCase={tc}
            selectable={showBulk}
            selected={selectedIds.has(tc.id)}
            onToggle={toggleSelect}
          />
        ))}
      </div>
    </div>
  );
}
