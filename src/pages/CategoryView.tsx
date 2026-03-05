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

  if (isLoading) return <div className="p-8 text-data3-text-muted">Loading...</div>;
  if (!category) return <div className="p-8 text-red-400">Category not found</div>;

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
        <h2 className="text-2xl font-bold text-white">{category.name}</h2>
      </div>
      <p className="text-sm text-data3-text-muted">{category.description}</p>

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
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-data3-border rounded-lg hover:bg-data3-surface-light text-data3-text-muted"
        >
          <Users size={14} />
          Bulk Assign
        </button>

        {showBulk && (
          <>
            <label className="flex items-center gap-1.5 text-sm text-data3-text-muted">
              <input
                type="checkbox"
                checked={selectedIds.size === testCases.length && testCases.length > 0}
                onChange={selectAll}
                className="rounded border-data3-border"
              />
              Select all
            </label>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-data3-text-muted">{selectedIds.size} selected</span>
                <div className="w-48">
                  <TesterPicker value={bulkTesterId} onChange={setBulkTesterId} />
                </div>
                <button
                  onClick={handleBulkAssign}
                  disabled={!bulkTesterId || bulkMutation.isPending}
                  className="px-3 py-1.5 text-sm bg-data3-accent text-white rounded-lg hover:bg-data3-accent/80 disabled:opacity-50"
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
