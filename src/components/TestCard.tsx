import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import type { TestCase, TestStatus } from '../lib/types';

interface TestCardProps {
  testCase: TestCase;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
}

export default function TestCard({ testCase, selectable, selected, onToggle }: TestCardProps) {
  const latestResult = testCase.testResults?.[0];
  const status: TestStatus = (latestResult?.status as TestStatus) || 'untested';
  const assignee = testCase.assignments?.[0]?.tester?.name;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-data3-card border border-data3-border-light rounded-lg shadow-md shadow-black/15 hover:border-data3-accent/40 transition-colors">
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle?.(testCase.id)}
          className="w-4 h-4 rounded border-data3-border"
        />
      )}

      <div className="flex-1 min-w-0">
        <Link
          to={`/test/${testCase.id}`}
          className="text-sm font-medium text-white hover:text-data3-accent transition-colors"
        >
          {testCase.title}
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-data3-text-muted">{testCase.persona}</span>
          {assignee && (
            <span className="text-xs text-data3-text-muted">Assigned: {assignee}</span>
          )}
          {testCase.pageRef && (
            <span className="text-xs text-data3-text-muted">{testCase.pageRef}</span>
          )}
        </div>
      </div>

      <PriorityBadge priority={testCase.priority} />
      <StatusBadge status={status} />

      <Link to={`/test/${testCase.id}`} className="text-data3-text-muted hover:text-white">
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
