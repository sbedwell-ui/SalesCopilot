interface ProgressBarProps {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  showLabels?: boolean;
}

export default function ProgressBar({ total, passed, failed, blocked, showLabels = false }: ProgressBarProps) {
  if (total === 0) return null;
  const pctPass = (passed / total) * 100;
  const pctFail = (failed / total) * 100;
  const pctBlock = (blocked / total) * 100;

  return (
    <div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
        {pctPass > 0 && (
          <div className="bg-green-500 transition-all" style={{ width: `${pctPass}%` }} />
        )}
        {pctFail > 0 && (
          <div className="bg-red-500 transition-all" style={{ width: `${pctFail}%` }} />
        )}
        {pctBlock > 0 && (
          <div className="bg-yellow-500 transition-all" style={{ width: `${pctBlock}%` }} />
        )}
      </div>
      {showLabels && (
        <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
          <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />{passed} passed</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />{failed} failed</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1" />{blocked} blocked</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1" />{total - passed - failed - blocked} untested</span>
        </div>
      )}
    </div>
  );
}
