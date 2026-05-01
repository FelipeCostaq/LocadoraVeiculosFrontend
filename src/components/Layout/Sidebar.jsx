import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Layers, Users, CalendarDays } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Geral' },
    { to: '/dashboard/veiculos', icon: Car, label: 'Veículos' },
    { to: '/dashboard/categorias', icon: Layers, label: 'Categorias' },
    { to: '/dashboard/clientes', icon: Users, label: 'Clientes' },
    { to: '/dashboard/locacoes', icon: CalendarDays, label: 'Locações' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-73px)] p-4 flex flex-col gap-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/dashboard'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-foreground hover:bg-muted'
            }`
          }
        >
          <link.icon size={20} />
          <span className="font-medium">{link.label}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
