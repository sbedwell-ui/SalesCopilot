import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
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
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle?.(testCase.id)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )}

      <div className="flex-1 min-w-0">
        <Link
          to={`/test/${testCase.id}`}
          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          {testCase.title}
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-500">{testCase.persona}</span>
          {assignee && (
            <span className="text-xs text-gray-400">Assigned: {assignee}</span>
          )}
          {testCase.pageRef && (
            <span className="text-xs text-gray-400">{testCase.pageRef}</span>
          )}
        </div>
      </div>

      <StatusBadge status={status} />

      <Link to={`/test/${testCase.id}`} className="text-gray-400 hover:text-gray-600">
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
