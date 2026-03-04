import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CategoryView from './pages/CategoryView';
import TestDetail from './pages/TestDetail';
import Testers from './pages/Testers';
import AuditLog from './pages/AuditLog';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category/:slug" element={<CategoryView />} />
        <Route path="/test/:id" element={<TestDetail />} />
        <Route path="/testers" element={<Testers />} />
        <Route path="/audit" element={<AuditLog />} />
      </Route>
    </Routes>
  );
}
