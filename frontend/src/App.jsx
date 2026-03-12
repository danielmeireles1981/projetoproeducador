import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, CalendarDays } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CalendarView from './pages/CalendarView';

import './index.css';

function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <aside className="sidebar">
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="text-lg font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckSquare size={24} color="var(--primary)" />
          Task Master
        </h2>
      </div>

      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link 
          to="/dashboard" 
          className="flex items-center gap-4 text-sm font-medium" 
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive('/dashboard') ? 'white' : 'var(--text-muted)', background: isActive('/dashboard') ? 'var(--primary)' : 'transparent' }}
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        
        <Link 
          to="/tasks" 
          className="flex items-center gap-4 text-sm font-medium" 
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive('/tasks') ? 'white' : 'var(--text-muted)', background: isActive('/tasks') ? 'var(--primary)' : 'transparent' }}
        >
          <CheckSquare size={18} /> Minhas Tarefas
        </Link>

        <Link 
          to="/calendar" 
          className="flex items-center gap-4 text-sm font-medium" 
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive('/calendar') ? 'white' : 'var(--text-muted)', background: isActive('/calendar') ? 'var(--primary)' : 'transparent' }}
        >
          <CalendarDays size={18} /> Calendário
        </Link>
      </nav>

      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{user.username}</span>
          <button className="btn-outline" style={{ display: 'flex', padding: '0.5rem', border: 'none' }} onClick={logout} title="Logout">
            <LogOut size={16} color="var(--text-muted)" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function PrivateLayout({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route path="/" element={<PrivateLayout><Navigate to="/dashboard" replace /></PrivateLayout>} />
        
        <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
        <Route path="/tasks" element={<PrivateLayout><Tasks /></PrivateLayout>} />
        <Route path="/calendar" element={<PrivateLayout><CalendarView /></PrivateLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
