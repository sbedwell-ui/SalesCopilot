import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import type { Category, DashboardData, TestStatus } from '../lib/types';

export default function Dashboard() {
  const { data: dashboard, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: api.getDashboard,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  if (isLoading) {
    return <div className="p-8 text-data3-text-muted">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-8 text-red-400">Failed to load dashboard</div>;
  }

  const { overall, recentResults, testerStats } = dashboard;
  const completionPct = overall.total > 0 ? Math.round((overall.passed / overall.total) * 100) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-data3-text-muted mt-1">Copilot for Sales V8.1 Testing Progress</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: overall.total, color: 'text-white' },
          { label: 'Passed', value: overall.passed, color: 'text-green-400' },
          { label: 'Failed', value: overall.failed, color: 'text-red-400' },
          { label: 'Blocked', value: overall.blocked, color: 'text-yellow-400' },
          { label: 'Untested', value: overall.untested, color: 'text-data3-text-muted' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-data3-card rounded-lg border border-data3-border-light p-4 shadow-md shadow-black/15">
            <p className="text-xs font-medium text-data3-text-muted uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-data3-card rounded-lg border border-data3-border-light p-4 shadow-md shadow-black/15">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-data3-text-muted">Overall Progress</p>
          <p className="text-sm font-bold text-white">{completionPct}%</p>
        </div>
        <ProgressBar
          total={overall.total}
          passed={overall.passed}
          failed={overall.failed}
          blocked={overall.blocked}
          showLabels
        />
      </div>

      {/* Category breakdown */}
      <div className="bg-data3-card rounded-lg border border-data3-border-light p-4 shadow-md shadow-black/15">
        <h3 className="text-sm font-semibold text-data3-text-muted mb-3">Categories</h3>
        <div className="space-y-3">
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="block hover:bg-data3-surface-light rounded-lg p-2 -mx-2 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-medium text-white">{cat.name}</span>
                </div>
                <span className="text-xs text-data3-text-muted">
                  {cat.stats?.passed ?? 0}/{cat.stats?.total ?? 0}
                </span>
              </div>
              {cat.stats && (
                <ProgressBar
                  total={cat.stats.total}
                  passed={cat.stats.passed}
                  failed={cat.stats.failed}
                  blocked={cat.stats.blocked}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-data3-card rounded-lg border border-data3-border-light p-4 shadow-md shadow-black/15">
          <h3 className="text-sm font-semibold text-data3-text-muted mb-3">Recent Activity</h3>
          {recentResults.length === 0 ? (
            <p className="text-sm text-data3-text-muted">No test results yet</p>
          ) : (
            <div className="space-y-2">
              {recentResults.map((r) => (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <StatusBadge status={r.status as TestStatus} />
                  <Link to={`/test/${r.testCaseId}`} className="text-white hover:text-data3-accent truncate flex-1">
                    {r.testCase?.title}
                  </Link>
                  <span className="text-xs text-data3-text-muted flex-shrink-0">
                    {r.tester?.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tester stats */}
        <div className="bg-data3-card rounded-lg border border-data3-border-light p-4 shadow-md shadow-black/15">
          <h3 className="text-sm font-semibold text-data3-text-muted mb-3">Tester Progress</h3>
          {testerStats.length === 0 ? (
            <p className="text-sm text-data3-text-muted">No testers assigned yet</p>
          ) : (
            <div className="space-y-2">
              {testerStats.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-white font-medium">{t.name}</span>
                  <div className="flex items-center gap-3 text-xs text-data3-text-muted">
                    <span>{t.assigned} assigned</span>
                    <span className="text-green-400">{t.passed} pass</span>
                    <span className="text-red-400">{t.failed} fail</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
