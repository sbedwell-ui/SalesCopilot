import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, UserPlus, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import type { Tester } from '../lib/types';

export default function Testers() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [removingTester, setRemovingTester] = useState<Tester | null>(null);

  const { data: testers, isLoading } = useQuery<Tester[]>({
    queryKey: ['testers', 'all'],
    queryFn: api.getAllTesters,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['testers'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const createMutation = useMutation({
    mutationFn: api.createTester,
    onSuccess: () => {
      invalidateAll();
      setName('');
      setEmail('');
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, clearResults }: { id: string; clearResults: boolean }) =>
      api.deleteTester(id, clearResults),
    onSuccess: () => {
      invalidateAll();
      setRemovingTester(null);
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => api.updateTester(id, { isActive: true }),
    onSuccess: () => invalidateAll(),
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    createMutation.mutate({ name: name.trim(), email: email.trim() || undefined });
  };

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;

  const activeTesters = testers?.filter((t) => t.isActive) ?? [];
  const inactiveTesters = testers?.filter((t) => !t.isActive) ?? [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Testers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={14} />
          Add Tester
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tester name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="tester@example.com"
            />
          </div>
          {createMutation.isError && (
            <p className="text-sm text-red-600">{(createMutation.error as Error).message}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!name.trim() || createMutation.isPending}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active testers */}
      <div className="space-y-2">
        {activeTesters.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{t.name}</p>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                {t.email && <span>{t.email}</span>}
                <span className="capitalize">{t.role}</span>
                <span>{t._count?.assignments ?? 0} assigned</span>
                <span>{t._count?.testResults ?? 0} results</span>
              </div>
            </div>
            {t.role !== 'system' && (
              <button
                onClick={() => setRemovingTester(t)}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded text-red-600 bg-red-50 hover:bg-red-100"
              >
                <Trash2 size={12} />
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Inactive testers */}
      {inactiveTesters.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-2">
            Inactive Testers ({inactiveTesters.length})
          </h3>
          {inactiveTesters.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 opacity-60"
            >
              <div>
                <p className="text-sm font-medium text-gray-400">{t.name}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                  {t.email && <span>{t.email}</span>}
                  <span className="capitalize">{t.role}</span>
                  <span>{t._count?.assignments ?? 0} assigned</span>
                  <span>{t._count?.testResults ?? 0} results</span>
                </div>
              </div>
              <button
                onClick={() => reactivateMutation.mutate(t.id)}
                disabled={reactivateMutation.isPending}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded text-green-700 bg-green-50 hover:bg-green-100"
              >
                <UserPlus size={12} />
                Re-add
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Remove confirmation dialog */}
      {removingTester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Remove Tester</h3>
                <p className="text-sm text-gray-500">
                  Remove <strong>{removingTester.name}</strong> from the active team?
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Choose whether to keep or clear their existing test results. Assignments will be preserved in either case.
            </p>

            {deleteMutation.isError && (
              <p className="text-sm text-red-600">{(deleteMutation.error as Error).message}</p>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={() => deleteMutation.mutate({ id: removingTester.id, clearResults: false })}
                disabled={deleteMutation.isPending}
                className="w-full px-4 py-2 text-sm font-medium bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-100 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Removing...' : 'Remove & Keep Results'}
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: removingTester.id, clearResults: true })}
                disabled={deleteMutation.isPending}
                className="w-full px-4 py-2 text-sm font-medium bg-red-50 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Removing...' : 'Remove & Clear Results'}
              </button>
              <button
                onClick={() => setRemovingTester(null)}
                disabled={deleteMutation.isPending}
                className="w-full px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
