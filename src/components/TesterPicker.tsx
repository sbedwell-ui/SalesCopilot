import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Tester } from '../lib/types';

interface TesterPickerProps {
  value: string;
  onChange: (testerId: string) => void;
  excludeSystem?: boolean;
}

export default function TesterPicker({ value, onChange, excludeSystem = true }: TesterPickerProps) {
  const { data: testers } = useQuery<Tester[]>({
    queryKey: ['testers'],
    queryFn: api.getTesters,
  });

  const filtered = excludeSystem
    ? testers?.filter((t) => t.role !== 'system')
    : testers;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md bg-data3-surface-light border-data3-border text-white text-sm focus:border-data3-accent focus:ring-data3-accent"
    >
      <option value="">Select tester...</option>
      {filtered?.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
