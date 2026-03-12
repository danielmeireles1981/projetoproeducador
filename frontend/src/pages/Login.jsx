import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await api.login(username, password);
      login(user, token);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
        className="flex items-center justify-center" 
        style={{ 
            height: '100vh', 
            width: '100vw',
            position: 'relative',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
      {/* Vibrant Background Image */}
      <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract Vibrant Background"
          style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.6) saturate(1.2)'
          }}
      />
      
      {/* Glassmorphism Centered Card */}
      <div 
        style={{ 
            maxWidth: '420px', 
            width: '90%', 
            padding: '2.5rem',
            background: 'rgba(26, 29, 36, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            zIndex: 10
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                width: '64px', height: '64px', 
                borderRadius: '16px', 
                margin: '0 auto 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'white' }}>Task Master</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Acesse sua conta para organizar suas atividades.</p>
        </div>
        
        {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-4" style={{ flexDirection: 'column' }}>
          <div className="flex gap-2" style={{ flexDirection: 'column' }}>
            <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Usuário</label>
            <input 
              className="input w-full"
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="Ex: daniel"
              required
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
          
          <div className="flex gap-2" style={{ flexDirection: 'column' }}>
            <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Senha</label>
            <input 
              className="input w-full"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>

          <button 
            className="btn w-full relative" 
            type="submit" 
            disabled={loading} 
            style={{ 
                marginTop: '1rem', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
                border: 'none',
                height: '48px',
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                overflow: 'hidden'
            }}
          >
            {loading ? 'Entrando...' : 'Acessar Plataforma'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                  Ainda não tem cadastro? <a href="/register" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>Criar uma conta</a>
              </p>
          </div>
        </form>
      </div>
    </div>
  );
}
