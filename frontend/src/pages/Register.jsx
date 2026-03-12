import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
      username: '', password: '', name: '', email: '', avatar_url: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) {
              setError('A imagem deve ter no máximo 2MB.');
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, avatar_url: reader.result });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await api.register(formData.username, formData.password, formData.name, formData.email, formData.avatar_url);
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Falha ao registrar.');
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
      <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract Vibrant Background"
          style={{
              position: 'fixed',
              top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.6) saturate(1.2)',
              zIndex: -1
          }}
      />
      
      <div 
        style={{ 
            maxWidth: '500px', 
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
            <h2 className="text-2xl font-bold" style={{ color: 'white' }}>Criar sua Conta</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Preencha os dados abaixo para personalizar o seu perfil.</p>
        </div>
        
        {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-4" style={{ flexDirection: 'column' }}>
          
          {/* Avatar Preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', position: 'relative' }}>
              <label 
                  htmlFor="avatar-upload" 
                  style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
              >
                  {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', transition: 'transform 0.2s' }} />
                  ) : (
                      <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '3px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textAlign: 'center', transition: 'all 0.2s' }}>
                          Adicionar<br/>Foto
                      </div>
                  )}
                  <input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                  />
              </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="flex gap-2" style={{ flexDirection: 'column' }}>
                <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Nome Completo *</label>
                <input 
                className="input w-full"
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                placeholder="João Silva"
                required
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                />
            </div>
            
            <div className="flex gap-2" style={{ flexDirection: 'column' }}>
                <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Usuário (Login) *</label>
                <input 
                className="input w-full"
                type="text" 
                name="username"
                value={formData.username} 
                onChange={handleChange}
                placeholder="joaosilva"
                required
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                />
            </div>
          </div>

          <div className="flex gap-2" style={{ flexDirection: 'column' }}>
            <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Email *</label>
            <input 
              className="input w-full"
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              placeholder="joao@email.com"
              required
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          </div>
          
          <div className="flex gap-2" style={{ flexDirection: 'column', display: 'none' }}>
            {/* Hidden since we replaced it with the visual upload above, but kept in case we want to revert */}
          </div>

          <div className="flex gap-2" style={{ flexDirection: 'column' }}>
            <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Senha *</label>
            <input 
              className="input w-full"
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange}
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                height: '48px',
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                overflow: 'hidden'
            }}
          >
            {loading ? 'Criando conta...' : 'Cadastrar e Entrar'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              Já possui conta? <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>Faça login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
