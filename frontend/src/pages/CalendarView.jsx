import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
    ChevronLeft, ChevronRight, Calendar as CalIcon, LayoutDashboard, CheckSquare, LogOut, CheckCircle, Circle, Trash2, X
} from 'lucide-react';
import { 
    format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      // Ensure date objects are easy to compare
      setTasks(data.filter(t => t.due_date).map(t => ({
          ...t,
          parsedDate: parseISO(t.due_date) // Assuming "2024-10-12" string format
      })));
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Calendar Grid generation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      const dayTasks = tasks.filter(t => isSameDay(t.parsedDate, cloneDay));

      days.push(
        <div 
          key={day.toISOString()} 
          className={`calendar-cell ${!isSameMonth(day, monthStart) ? 'text-muted' : ''}`}
          style={{ 
              minHeight: '100px', 
              padding: '0.5rem', 
              borderRight: '1px solid var(--border-color)', 
              borderBottom: '1px solid var(--border-color)',
              background: isSameDay(day, new Date()) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              display: 'flex', flexDirection: 'column'
          }}
        >
          <span className="font-medium text-sm" style={{ marginBottom: '8px', opacity: !isSameMonth(day, monthStart) ? 0.5 : 1 }}>
              {formattedDate}
          </span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '100px' }}>
              {dayTasks.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTask(t)}
                    style={{ 
                        fontSize: '11px', 
                        padding: '2px 4px', 
                        borderRadius: '4px', 
                        background: t.category_color ? `${t.category_color}33` : 'rgba(255,255,255,0.1)', // 33 is 20% opacity hex
                        borderLeft: `2px solid ${t.category_color || 'var(--text-muted)'}`,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textDecoration: t.status === 'done' ? 'line-through' : 'none',
                        color: t.status === 'done' ? 'var(--text-muted)' : 'inherit'
                    }}
                  >
                      {t.title}
                  </div>
              ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    
    rows.push(
      <div key={day.toISOString()} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
      
        {/* Banner */}
        <div style={{ 
            width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', position: 'relative',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
            <img 
                src="https://www.money.it/local/cache-gd2/62/8318a20bd1f2e7c50cda7f7865b0c5.jpg?1766604268" 
                alt="Calendar Planner Banner" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
            />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    Calendário Mensal
                </h1>
                <p style={{ color: '#e5e7eb', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    Visualize os prazos e mantenha a organização.
                </p>
            </div>
        </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header Controls */}
            <div className="flex items-center justify-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <h2 className="text-xl font-bold capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <div className="flex gap-2">
                    <button className="btn-outline" onClick={prevMonth} style={{ padding: '0.5rem', borderRadius: '8px' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="btn-outline" onClick={() => setCurrentDate(new Date())} style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
                        Hoje
                    </button>
                    <button className="btn-outline" onClick={nextMonth} style={{ padding: '0.5rem', borderRadius: '8px' }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            
            {/* Calendar Body */}
            <div>
                {/* Weekday Labels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                    {weekDays.map(w => (
                        <div key={w} className="text-center text-sm text-muted font-bold" style={{ padding: '0.75rem' }}>
                            {w}
                        </div>
                    ))}
                </div>
                {/* Days Grid */}
                <div style={{ borderTop: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>
                    {loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando tarefas...</div> : rows}
                </div>
            </div>
        </div>

        {/* Task Modal interaction */}
        {selectedTask && (
            <div style={{ 
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div className="card" style={{ width: '400px', position: 'relative' }}>
                    <button onClick={() => setSelectedTask(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent' }}>
                        <X size={20} color="var(--text-muted)" />
                    </button>
                    
                    <h3 className="font-bold text-xl mb-4" style={{ paddingRight: '2rem' }}>{selectedTask.title}</h3>
                    
                    <div className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {selectedTask.description && <p className="text-muted">{selectedTask.description}</p>}
                        
                        <div className="flex items-center gap-2">
                            <CalIcon size={16} color="var(--text-muted)" />
                            <span>Vencimento: {selectedTask.due_date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} color={selectedTask.status === 'done' ? 'var(--success)' : 'var(--warning)'} />
                            <span>Status: <b>{selectedTask.status === 'done' ? 'Concluída' : 'Pendente'}</b></span>
                        </div>
                        
                        {selectedTask.category_name && (
                            <div className="flex items-center gap-2">
                                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedTask.category_color }}></span>
                                <span>Categoria: {selectedTask.category_name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}
