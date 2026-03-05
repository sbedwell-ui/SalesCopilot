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
    <div className="flex h-screen bg-data3-background">
      {/* Sidebar */}
      <aside className="w-64 bg-data3-surface border-r border-data3-border flex flex-col">
        <div className="p-4 border-b border-data3-border">
          <img src="/SalesCopilotLogo.png" alt="Copilot for Sales" className="h-8 mb-2" />
          <h1 className="text-lg font-bold text-white">Copilot for Sales</h1>
          <p className="text-xs text-data3-text-muted mt-0.5">Testing Checklist</p>
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
                    ? 'bg-data3-surface-light text-data3-accent'
                    : 'text-data3-text-muted hover:bg-data3-surface-light hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <div className="pt-3 pb-1">
            <p className="px-3 text-xs font-semibold text-data3-text-muted uppercase tracking-wider">
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
                    ? 'bg-data3-surface-light text-data3-accent'
                    : 'text-data3-text-muted hover:bg-data3-surface-light hover:text-white'
                }`
              }
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="truncate">{cat.name}</span>
              {cat.stats && (
                <span className="ml-auto text-xs text-data3-text-muted">
                  {cat.stats.passed}/{cat.stats.total}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-data3-border">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-data3-text-muted hover:bg-data3-surface-light hover:text-white transition-colors"
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
