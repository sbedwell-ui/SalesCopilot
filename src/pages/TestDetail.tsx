import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, ClipboardCheck, FileImage, User } from 'lucide-react';
import { api } from '../lib/api';
import { parsePageRef, pageImageUrl } from '../lib/parsePageRef';
import StatusBadge from '../components/StatusBadge';
import TesterPicker from '../components/TesterPicker';
import PageThumbnail from '../components/PageThumbnail';
import ImageLightbox from '../components/ImageLightbox';
import type { TestCase, TestStatus } from '../lib/types';

export default function TestDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [testerId, setTesterId] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: testCase, isLoading } = useQuery<TestCase>({
    queryKey: ['testCase', id],
    queryFn: () => api.getTestCase(id!),
    enabled: !!id,
  });

  const assignMutation = useMutation({
    mutationFn: ({ testCaseId, testerId }: { testCaseId: string; testerId: string }) =>
      api.assignTester(testCaseId, testerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCase', id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const resultMutation = useMutation({
    mutationFn: (data: { testCaseId: string; testerId: string; status: string; notes?: string }) =>
      api.recordResult(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testCase', id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setStatus('');
      setNotes('');
      setTesterId('');
    },
  });

  if (isLoading) return <div className="p-8 text-data3-text-muted">Loading...</div>;
  if (!testCase) return <div className="p-8 text-red-400">Test case not found</div>;

  const latestResult = testCase.testResults?.[0];
  const currentStatus: TestStatus = (latestResult?.status as TestStatus) || 'untested';
  const currentAssignee = testCase.assignments?.[0];
  const steps: string[] = JSON.parse(testCase.testSteps || '[]');
  const prereqs: string[] = JSON.parse(testCase.prerequisites || '[]');
  const pages = testCase.pageRef
    ? parsePageRef(testCase.pageRef).map((num) => ({
        pageNumber: num,
        imageUrl: pageImageUrl(num),
      }))
    : [];

  const handleAssign = (newTesterId: string) => {
    if (newTesterId) {
      assignMutation.mutate({ testCaseId: testCase.id, testerId: newTesterId });
    }
  };

  const handleSubmitResult = () => {
    if (!status || !testerId) return;
    resultMutation.mutate({
      testCaseId: testCase.id,
      testerId,
      status,
      notes: notes || undefined,
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Back navigation */}
      {testCase.category && (
        <Link
          to={`/category/${testCase.category.slug}`}
          className="inline-flex items-center gap-1 text-sm text-data3-text-muted hover:text-white"
        >
          <ArrowLeft size={14} />
          {testCase.category.name}
        </Link>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{testCase.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-data3-text-muted">
            <span>{testCase.persona}</span>
            {testCase.pageRef && <span>PDF {testCase.pageRef}</span>}
          </div>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {/* User story */}
      <div className="bg-data3-surface-light border border-data3-border rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-data3-accent mb-1">
          <BookOpen size={14} />
          User Story
        </div>
        <p className="text-sm text-white">{testCase.userStory}</p>
      </div>

      {/* Reference Pages */}
      {pages.length > 0 && (
        <div className="bg-data3-card border border-data3-border-light rounded-lg p-4 shadow-md shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-data3-text-muted mb-2">
            <FileImage size={14} />
            Reference Pages
          </div>
          <div className="flex flex-wrap gap-3">
            {pages.map((page, index) => (
              <PageThumbnail
                key={page.pageNumber}
                pageNumber={page.pageNumber}
                imageUrl={page.imageUrl}
                onClick={() => setLightboxIndex(index)}
              />
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          pages={pages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      {/* Assignment */}
      <div className="bg-data3-card border border-data3-border-light rounded-lg p-4 shadow-md shadow-black/15">
        <div className="flex items-center gap-2 text-sm font-medium text-data3-text-muted mb-2">
          <User size={14} />
          Assigned To
        </div>
        <div className="flex items-center gap-3">
          {currentAssignee ? (
            <span className="text-sm text-white font-medium">{currentAssignee.tester?.name}</span>
          ) : (
            <span className="text-sm text-data3-text-muted">Unassigned</span>
          )}
          <div className="w-48">
            <TesterPicker
              value={currentAssignee?.testerId || ''}
              onChange={handleAssign}
            />
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <div className="bg-data3-card border border-data3-border-light rounded-lg p-4 shadow-md shadow-black/15">
          <h3 className="text-sm font-medium text-data3-text-muted mb-2">Prerequisites</h3>
          <ul className="list-disc list-inside space-y-1">
            {prereqs.map((p, i) => (
              <li key={i} className="text-sm text-white/90">{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Test steps */}
      <div className="bg-data3-card border border-data3-border-light rounded-lg p-4 shadow-md shadow-black/15">
        <div className="flex items-center gap-2 text-sm font-medium text-data3-text-muted mb-2">
          <ClipboardCheck size={14} />
          Test Steps
        </div>
        <ol className="list-decimal list-inside space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="text-sm text-white/90">{s}</li>
          ))}
        </ol>
      </div>

      {/* CRM Notes */}
      {testCase.crmNotes && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-amber-400 mb-1">Salesforce Notes</h3>
          <p className="text-sm text-amber-200">{testCase.crmNotes}</p>
        </div>
      )}

      {/* Record result form */}
      <div className="bg-data3-card border border-data3-border-light rounded-lg p-4 shadow-md shadow-black/15">
        <h3 className="text-sm font-semibold text-data3-text-muted mb-3">Record Test Result</h3>
        <div className="grid gap-3">
          <div>
            <label className="block text-xs font-medium text-data3-text-muted mb-1">Tester</label>
            <div className="w-full">
              <TesterPicker value={testerId} onChange={setTesterId} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-data3-text-muted mb-1">Status</label>
            <div className="flex gap-2">
              {(['pass', 'fail', 'blocked'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    status === s
                      ? s === 'pass'
                        ? 'bg-green-900/30 border-green-500/50 text-green-400'
                        : s === 'fail'
                        ? 'bg-red-900/30 border-red-500/50 text-red-400'
                        : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400'
                      : 'border-data3-border text-data3-text-muted hover:bg-data3-surface-light'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-data3-text-muted mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="block w-full rounded-md bg-data3-surface-light border-data3-border text-white text-sm focus:border-data3-accent focus:ring-data3-accent"
              placeholder="Add notes about the test result..."
            />
          </div>
          <button
            onClick={handleSubmitResult}
            disabled={!status || !testerId || resultMutation.isPending}
            className="px-4 py-2 text-sm font-medium bg-data3-accent text-white rounded-lg hover:bg-data3-accent/80 disabled:opacity-50 transition-colors"
          >
            {resultMutation.isPending ? 'Saving...' : 'Submit Result'}
          </button>
        </div>
      </div>

      {/* Result history */}
      {testCase.testResults && testCase.testResults.length > 0 && (
        <div className="bg-data3-card border border-data3-border-light rounded-lg p-4 shadow-md shadow-black/15">
          <h3 className="text-sm font-semibold text-data3-text-muted mb-3">Result History</h3>
          <div className="space-y-2">
            {testCase.testResults.map((r) => (
              <div key={r.id} className="flex items-start gap-3 text-sm py-2 border-b border-data3-border last:border-0">
                <StatusBadge status={r.status as TestStatus} />
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium">{r.tester?.name}</span>
                  {r.notes && <p className="text-data3-text-muted mt-0.5">{r.notes}</p>}
                </div>
                <span className="text-xs text-data3-text-muted flex-shrink-0">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
