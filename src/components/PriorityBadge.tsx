import type { Priority } from '../lib/types';

const config: Record<Priority, { label: string; bg: string; text: string }> = {
  High: { label: 'High', bg: 'bg-red-900/30', text: 'text-red-400' },
  Medium: { label: 'Medium', bg: 'bg-yellow-900/30', text: 'text-yellow-400' },
  Low: { label: 'Low', bg: 'bg-data3-surface-light', text: 'text-data3-text-muted' },
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const key = (priority as Priority) || 'Medium';
  const { label, bg, text } = config[key] || config.Medium;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
