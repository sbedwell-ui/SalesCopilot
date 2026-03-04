import { NavLink, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  ClipboardList,
  Download,
} from 'lucide-react';
import { api } from '../lib/api';
import type { Category } from '../lib/types';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/audit', icon: ClipboardList, label: 'Audit Log' },
  { to: '/testers', icon: Users, label: 'Testers' },
];

export default function Layout() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const handleExport = async () => {
    try {
      const blob = await api.exportCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'copilot-sales-test-results.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">Copilot for Sales</h1>
          <p className="text-xs text-gray-500 mt-0.5">Testing Checklist v8.1</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <div className="pt-3 pb-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Categories
            </p>
          </div>

          {categories?.map((cat) => (
            <NavLink
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="truncate">{cat.name}</span>
              {cat.stats && (
                <span className="ml-auto text-xs text-gray-400">
                  {cat.stats.passed}/{cat.stats.total}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
