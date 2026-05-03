import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/client";
import {
  Car,
  Users,
  CalendarDays,
  Layers,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    veiculos: 0,
    clientes: 0,
    locacoes: 0,
    categorias: 0,
  });
  const [ultimasLocacoes, setUltimasLocacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const resVei = await api.get("/veiculos").catch((e) => {
        console.error("Erro veículos", e);
        return { data: [] };
      });
      const resCli = await api.get("/clientes").catch((e) => {
        console.error("Erro clientes", e);
        return { data: [] };
      });
      const resLoc = await api.get("/veiculoalocado").catch((e) => {
        console.error("Erro locações", e);
        return { data: [] };
      });
      const resCat = await api.get("/categoria").catch((e) => {
        console.error("Erro categorias", e);
        return { data: [] };
      });

      setStats({
        veiculos: resVei.data?.length || 0,
        clientes: (resCli.data || []).filter((c) => c.ativo).length,
        locacoes: (resLoc.data || []).filter((l) => l.status === 0).length,
        categorias: resCat.data?.length || 0,
      });

      setUltimasLocacoes((resLoc.data || []).slice(-5).reverse());
    } catch (error) {
      console.error("Erro grave ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, []);

  const statCards = [
    {
      label: "Veículos na Frota",
      value: stats.veiculos,
      icon: Car,
      color: "text-primary",
      path: "/dashboard/veiculos",
    },
    {
      label: "Clientes Ativos",
      value: stats.clientes,
      icon: Users,
      color: "text-blue-500",
      path: "/dashboard/clientes",
    },
    {
      label: "Locações Ativas",
      value: stats.locacoes,
      icon: CalendarDays,
      color: "text-green-500",
      path: "/dashboard/locacoes",
    },
    {
      label: "Categorias",
      value: stats.categorias,
      icon: Layers,
      color: "text-purple-500",
      path: "/dashboard/categorias",
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-medium">
          Sincronizando dados reais...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold">Olá, {user?.email.split("@")[0]}</h2>
        <p className="text-muted-foreground">
          Aqui está o estado real da sua locadora agora.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => navigate(stat.path)}
            className="bg-card border border-border p-6 rounded-xl hover:border-primary transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon
                className={`${stat.color} group-hover:scale-110 transition-transform`}
                size={24}
              />
              <TrendingUp
                size={16}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Últimas Locações</h3>
            <button
              onClick={() => navigate("/dashboard/locacoes")}
              className="text-primary text-sm font-bold hover:underline"
            >
              Ver tudo
            </button>
          </div>
          <div className="space-y-4">
            {ultimasLocacoes.length > 0 ? (
              ultimasLocacoes.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Car size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase">
                        {loc.placaVeiculo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cliente ID: {loc.clienteId.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      loc.status === 1
                        ? "bg-muted text-muted-foreground"
                        : loc.status === 0
                          ? "bg-green-500/10 text-green-500"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {loc.status === 1
                      ? "CONCLUÍDA"
                      : loc.status === 0
                        ? "EM ANDAMENTO"
                        : "CANCELADA"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground italic text-sm">
                Nenhuma locação registrada ainda.
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/dashboard/veiculos")}
              className="bg-muted/50 hover:bg-primary/10 hover:border-primary/50 border border-transparent p-6 rounded-2xl flex flex-col items-center gap-3 transition-all group"
            >
              <Car
                size={32}
                className="text-primary group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-bold">Novo Veículo</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/clientes")}
              className="bg-muted/50 hover:bg-blue-500/10 hover:border-blue-500/50 border border-transparent p-6 rounded-2xl flex flex-col items-center gap-3 transition-all group"
            >
              <Users
                size={32}
                className="text-blue-500 group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-bold">Novo Cliente</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/locacoes")}
              className="bg-muted/50 hover:bg-green-500/10 hover:border-green-500/50 border border-transparent p-6 rounded-2xl flex flex-col items-center gap-3 transition-all group"
            >
              <CalendarDays
                size={32}
                className="text-green-500 group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-bold">Nova Locação</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/categorias")}
              className="bg-muted/50 hover:bg-purple-500/10 hover:border-purple-500/50 border border-transparent p-6 rounded-2xl flex flex-col items-center gap-3 transition-all group"
            >
              <Layers
                size={32}
                className="text-purple-500 group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-bold">Categorias</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
