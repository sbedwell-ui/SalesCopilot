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
      <div className="w-full h-2.5 bg-data3-surface-light rounded-full overflow-hidden flex">
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
        <div className="flex gap-4 mt-1.5 text-xs text-data3-text-muted">
          <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /><span className="text-green-400">{passed}</span> passed</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" /><span className="text-red-400">{failed}</span> failed</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1" /><span className="text-yellow-400">{blocked}</span> blocked</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-data3-text-muted/30 mr-1" />{total - passed - failed - blocked} untested</span>
        </div>
      )}
    </div>
  );
}
