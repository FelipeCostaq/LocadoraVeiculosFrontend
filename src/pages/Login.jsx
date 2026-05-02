import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      console.log('Iniciando tentativa de login...');
      await login(email, password);
      
      // Se chegamos aqui, o POST foi 200. 
      // O checkAuth() dentro do login() pode ter falhado se o cookie demorar a propagar,
      // mas o login em si funcionou.
      console.log('Sucesso! Redirecionando...');
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      console.error('Erro detalhado:', err);
      // Se o erro for apenas o checkAuth mas o POST funcionou, tentamos seguir
      if (err.message?.includes('CORS/Cookies')) {
        console.warn('Possível problema de cookies, tentando entrar mesmo assim...');
        navigate('/dashboard', { replace: true });
      } else {
        setError('E-mail ou senha inválidos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Bem-vindo</h2>
        <p className="text-muted-foreground text-center mb-8">Faça login para gerenciar sua locadora.</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="email"
                required
                className="w-full bg-input border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="password"
                required
                className="w-full bg-input border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
