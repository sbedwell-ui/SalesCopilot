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
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-8 text-red-500">Failed to load dashboard</div>;
  }

  const { overall, recentResults, testerStats } = dashboard;
  const completionPct = overall.total > 0 ? Math.round((overall.passed / overall.total) * 100) : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Copilot for Sales V8.1 Testing Progress</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: overall.total, color: 'text-gray-900' },
          { label: 'Passed', value: overall.passed, color: 'text-green-600' },
          { label: 'Failed', value: overall.failed, color: 'text-red-600' },
          { label: 'Blocked', value: overall.blocked, color: 'text-yellow-600' },
          { label: 'Untested', value: overall.untested, color: 'text-gray-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Overall Progress</p>
          <p className="text-sm font-bold text-gray-900">{completionPct}%</p>
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
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
        <div className="space-y-3">
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="block hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                </div>
                <span className="text-xs text-gray-500">
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
          {recentResults.length === 0 ? (
            <p className="text-sm text-gray-400">No test results yet</p>
          ) : (
            <div className="space-y-2">
              {recentResults.map((r) => (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <StatusBadge status={r.status as TestStatus} />
                  <Link to={`/test/${r.testCaseId}`} className="text-gray-700 hover:text-blue-600 truncate flex-1">
                    {r.testCase?.title}
                  </Link>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {r.tester?.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tester stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tester Progress</h3>
          {testerStats.length === 0 ? (
            <p className="text-sm text-gray-400">No testers assigned yet</p>
          ) : (
            <div className="space-y-2">
              {testerStats.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{t.name}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{t.assigned} assigned</span>
                    <span className="text-green-600">{t.passed} pass</span>
                    <span className="text-red-600">{t.failed} fail</span>
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
