import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password);
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Faça login.' } });
    } catch (err) {
      setError('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Criar Conta</h2>
        <p className="text-muted-foreground text-center mb-8">Junte-se à nossa plataforma de locação.</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="password"
                required
                className="w-full bg-input border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 mt-4 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
