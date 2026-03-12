import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
    CheckCircle, 
    Calendar, 
    AlertCircle, 
    ListTodo
} from 'lucide-react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return <div className="container">Loading Dashboard...</div>;

  // Filter out categories with 0 count to avoid empty slices looking weird, or keep them if you want.
  const chartData = stats.byCategory
    .filter(c => c.count > 0)
    .map(c => ({
      name: c.name,
      value: c.count,
      color: c.color
    }));

  // Mock data for the "Evolução" (Evolution) chart
  const evolutionData = [
      { name: 'Seg', completas: Math.max(0, stats.completed - 4) },
      { name: 'Ter', completas: Math.max(0, stats.completed - 2) },
      { name: 'Qua', completas: stats.completed },
      { name: 'Qui', completas: stats.completed + 1 },
      { name: 'Sex', completas: stats.completed + 3 },
  ];

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Premium Hero Banner */}
      <div style={{ 
          width: '100%', 
          height: '240px', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
          <img 
              src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80" 
              alt="Dashboard Banner" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user?.avatar_url ? (
                  <img 
                      src={user.avatar_url} 
                      alt="Avatar" 
                      style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid white', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} 
                  />
              ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
                  </div>
              )}
              <div>
                  <h1 className="text-2xl font-bold" style={{ fontSize: '2.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Olá, {user?.name || user?.username}.</h1>
                  <p style={{ fontSize: '1.2rem', color: '#e5e7eb', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Você tem {stats.today} tarefas para hoje. Mantenha o foco!</p>
              </div>
          </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card flex items-center gap-4">
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
                <ListTodo color="var(--primary)" size={32} />
            </div>
            <div>
                <p className="text-sm text-muted">Total (Ativas)</p>
                <h3 className="text-2xl font-bold">{stats.total - stats.completed}</h3>
            </div>
        </div>
        
        <div className="card flex items-center gap-4">
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%' }}>
                <CheckCircle color="var(--success)" size={32} />
            </div>
            <div>
                <p className="text-sm text-muted">Concluídas</p>
                <h3 className="text-2xl font-bold">{stats.completed}</h3>
            </div>
        </div>

        <div className="card flex items-center gap-4">
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '50%' }}>
                <Calendar color="var(--warning)" size={32} />
            </div>
            <div>
                <p className="text-sm text-muted">Para Hoje</p>
                <h3 className="text-2xl font-bold" style={{ color: stats.today > 0 ? 'var(--warning)' : '' }}>{stats.today}</h3>
            </div>
        </div>

        <div className="card flex items-center gap-4">
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '50%' }}>
                <AlertCircle color="var(--danger)" size={32} />
            </div>
            <div>
                <p className="text-sm text-muted">Atrasadas</p>
                <h3 className="text-2xl font-bold" style={{ color: stats.overdue > 0 ? 'var(--danger)' : '' }}>{stats.overdue}</h3>
            </div>
        </div>
      </div>

      {/* Analytics Section with 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Categories Chart */}
          <div className="card" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="font-bold mb-4">Tarefas por Categoria</h3>
            <div style={{ flex: 1 }}>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip 
                            contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                            itemStyle={{ color: 'var(--text-main)' }} 
                        />
                        <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center text-muted" style={{ height: '100%' }}>
                        Nenhuma tarefa categorizada ainda.
                    </div>
                )}
            </div>
          </div>

          {/* Evolution Bar Chart */}
          <div className="card" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="font-bold mb-4">Evolução (Últimos Dias)</h3>
            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="completas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

      </div>
      
    </div>
  );
}
