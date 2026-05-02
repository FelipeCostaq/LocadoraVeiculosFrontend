import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car, LogOut, User, LayoutDashboard, Briefcase, Users, Layers } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
        <Car size={28} />
        <span>Locadora</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <div className="flex items-center gap-4 border-l border-border pl-4">
              <span className="text-muted-foreground flex items-center gap-1">
                <User size={18} />
                {user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
