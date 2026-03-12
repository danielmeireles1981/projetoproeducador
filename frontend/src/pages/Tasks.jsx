import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, CheckCircle, Circle, Tag } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ptsks, pcats] = await Promise.all([
          api.getTasks(),
          api.getCategories()
      ]);
      setTasks(ptsks);
      setCategories(pcats);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      const tagArray = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      await api.createTask({
          title,
          due_date: date || null,
          priority,
          category_id: categoryId || null,
          tags: tagArray
      });

      setTitle('');
      setDate('');
      setTagInput('');
      setPriority('medium');
      setCategoryId('');
      
      loadData();
    } catch(err) {
       console.error(err);
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    try {
        await api.updateTaskStatus(task.id, newStatus);
        loadData();
    } catch(err) {
        console.error(err);
    }
  };

  const deleteTask = async (id) => {
      try {
          await api.deleteTask(id);
          loadData();
      } catch(err) {
          console.error(err);
      }
  };

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
      
      {/* Task List Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <header style={{ marginBottom: '1rem' }}>
            <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
            <p className="text-muted">Gerencie suas atividades diárias.</p>
        </header>

        {loading ? (
            <div className="text-muted">Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
            <div className="card text-center text-muted" style={{ padding: '3rem 1rem' }}>
                Você não possui nenhuma tarefa.
            </div>
        ) : (
            tasks.map(t => (
                <div key={t.id} className="card flex justify-between items-center" style={{ padding: '1rem', opacity: t.status === 'done' ? 0.6 : 1 }}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => toggleStatus(t)} style={{ background: 'transparent', display: 'flex' }}>
                            {t.status === 'done' ? (
                                <CheckCircle color="var(--success)" />
                            ) : (
                                <Circle color="var(--text-muted)" />
                            )}
                        </button>
                        
                        <div>
                            <h4 style={{ textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.title}</h4>
                            <div className="flex items-center gap-2 text-xs" style={{ marginTop: '0.25rem' }}>
                                {t.category_name && (
                                    <span style={{ color: t.category_color, border: `1px solid ${t.category_color}`, padding: '2px 8px', borderRadius: '12px' }}>
                                        {t.category_name}
                                    </span>
                                )}
                                {t.due_date && <span className="text-muted">{t.due_date}</span>}
                                {t.priority && (
                                    <span style={{ 
                                        color: t.priority === 'high' ? 'var(--danger)' : t.priority === 'medium' ? 'var(--warning)' : 'var(--text-muted)' 
                                    }}>
                                        • Prioridade: {t.priority}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button onClick={() => deleteTask(t.id)} className="btn-outline" style={{ padding: '0.5rem', display: 'flex', border: 'none' }}>
                        <Trash2 size={16} color="var(--danger)" />
                    </button>
                </div>
            ))
        )}
      </div>

      {/* Create Task Form Column */}
      <div className="card" style={{ position: 'sticky', top: '2rem' }}>
        <h3 className="font-bold mb-4" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Nova Tarefa
        </h3>
        
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label className="text-xs font-medium text-muted">Título *</label>
                <input required className="input w-full" value={title} onChange={e=>setTitle(e.target.value)} placeholder="O que precisa ser feito?" />
            </div>

            <div>
                <label className="text-xs font-medium text-muted">Data Limite</label>
                <input type="date" className="input w-full" value={date} onChange={e=>setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
            </div>

            <div>
                <label className="text-xs font-medium text-muted">Prioridade</label>
                <select className="input w-full" value={priority} onChange={e=>setPriority(e.target.value)}>
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta (Urgente)</option>
                </select>
            </div>

            <div>
                <label className="text-xs font-medium text-muted">Categoria</label>
                <select className="input w-full" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
                    <option value="">Sem categoria</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-xs font-medium text-muted"><Tag size={12} style={{ display:'inline', marginRight: '4px' }}/> Tags (separadas por vírgula)</label>
                <input className="input w-full" value={tagInput} onChange={e=>setTagInput(e.target.value)} placeholder="ex: design, urgente" />
            </div>

            <button type="submit" className="btn w-full" style={{ marginTop: '0.5rem' }}>Adicionar Tarefa</button>
        </form>
      </div>

    </div>
  );
}
