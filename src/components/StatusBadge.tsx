import type { TestStatus } from '../lib/types';

const config: Record<TestStatus, { label: string; bg: string; text: string }> = {
  pass: { label: 'Pass', bg: 'bg-green-100', text: 'text-green-700' },
  fail: { label: 'Fail', bg: 'bg-red-100', text: 'text-red-700' },
  blocked: { label: 'Blocked', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  untested: { label: 'Untested', bg: 'bg-gray-100', text: 'text-gray-500' },
};

export default function StatusBadge({ status }: { status: TestStatus }) {
  const { label, bg, text } = config[status] || config.untested;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
