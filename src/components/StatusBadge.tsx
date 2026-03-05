import type { TestStatus } from '../lib/types';

const config: Record<TestStatus, { label: string; bg: string; text: string }> = {
  pass: { label: 'Pass', bg: 'bg-green-900/30', text: 'text-green-400' },
  fail: { label: 'Fail', bg: 'bg-red-900/30', text: 'text-red-400' },
  blocked: { label: 'Blocked', bg: 'bg-yellow-900/30', text: 'text-yellow-400' },
  untested: { label: 'Untested', bg: 'bg-data3-surface-light', text: 'text-data3-text-muted' },
};

export default function StatusBadge({ status }: { status: TestStatus }) {
  const { label, bg, text } = config[status] || config.untested;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
