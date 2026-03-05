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

  if (isLoading) return <div className="p-8 text-data3-text-muted">Loading...</div>;

  const activeTesters = testers?.filter((t) => t.isActive) ?? [];
  const inactiveTesters = testers?.filter((t) => !t.isActive) ?? [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Testers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-data3-accent text-white rounded-lg hover:bg-data3-accent/80"
        >
          <Plus size={14} />
          Add Tester
        </button>
      </div>

      {showForm && (
        <div className="bg-data3-card border border-data3-border-light rounded-lg shadow-md shadow-black/15 p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-data3-text-muted mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md bg-data3-surface-light border-data3-border text-white text-sm focus:border-data3-accent focus:ring-data3-accent"
              placeholder="Tester name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-data3-text-muted mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md bg-data3-surface-light border-data3-border text-white text-sm focus:border-data3-accent focus:ring-data3-accent"
              placeholder="tester@example.com"
            />
          </div>
          {createMutation.isError && (
            <p className="text-sm text-red-400">{(createMutation.error as Error).message}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!name.trim() || createMutation.isPending}
              className="px-3 py-1.5 text-sm bg-data3-accent text-white rounded-lg hover:bg-data3-accent/80 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-sm border border-data3-border rounded-lg hover:bg-data3-surface-light text-data3-text-muted"
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
            className="flex items-center justify-between bg-data3-card border border-data3-border-light rounded-lg shadow-md shadow-black/15 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white">{t.name}</p>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-data3-text-muted">
                {t.email && <span>{t.email}</span>}
                <span className="capitalize">{t.role}</span>
                <span>{t._count?.assignments ?? 0} assigned</span>
                <span>{t._count?.testResults ?? 0} results</span>
              </div>
            </div>
            {t.role !== 'system' && (
              <button
                onClick={() => setRemovingTester(t)}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded text-red-400 bg-red-900/30 hover:bg-red-900/50"
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
          <h3 className="text-sm font-semibold text-data3-text-muted uppercase tracking-wider pt-2">
            Inactive Testers ({inactiveTesters.length})
          </h3>
          {inactiveTesters.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between bg-data3-card border border-data3-border-light rounded-lg shadow-md shadow-black/15 px-4 py-3 opacity-60"
            >
              <div>
                <p className="text-sm font-medium text-data3-text-muted">{t.name}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-data3-text-muted">
                  {t.email && <span>{t.email}</span>}
                  <span className="capitalize">{t.role}</span>
                  <span>{t._count?.assignments ?? 0} assigned</span>
                  <span>{t._count?.testResults ?? 0} results</span>
                </div>
              </div>
              <button
                onClick={() => reactivateMutation.mutate(t.id)}
                disabled={reactivateMutation.isPending}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded text-green-400 bg-green-900/30 hover:bg-green-900/50"
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
            className="bg-data3-surface rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Remove Tester</h3>
                <p className="text-sm text-data3-text-muted">
                  Remove <strong>{removingTester.name}</strong> from the active team?
                </p>
              </div>
            </div>

            <p className="text-sm text-data3-text-muted">
              Choose whether to keep or clear their existing test results. Assignments will be preserved in either case.
            </p>

            {deleteMutation.isError && (
              <p className="text-sm text-red-400">{(deleteMutation.error as Error).message}</p>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={() => deleteMutation.mutate({ id: removingTester.id, clearResults: false })}
                disabled={deleteMutation.isPending}
                className="w-full px-4 py-2 text-sm font-medium bg-yellow-900/30 border border-yellow-500/50 text-yellow-400 rounded-lg hover:bg-yellow-900/50 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Removing...' : 'Remove & Keep Results'}
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: removingTester.id, clearResults: true })}
                disabled={deleteMutation.isPending}
                className="w-full px-4 py-2 text-sm font-medium bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-900/50 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Removing...' : 'Remove & Clear Results'}
              </button>
              <button
                onClick={() => setRemovingTester(null)}
                disabled={deleteMutation.isPending}
                className="w-full px-4 py-2 text-sm font-medium border border-data3-border text-data3-text-muted rounded-lg hover:bg-data3-surface-light"
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
