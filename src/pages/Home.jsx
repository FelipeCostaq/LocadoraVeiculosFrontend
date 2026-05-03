import React, { useState, useEffect, useRef } from "react";
import api from "../api/client";
import {
  Search,
  Car as CarIcon,
  Users,
  Fuel,
  Gauge,
  ChevronRight,
} from "lucide-react";
import heroImg from "../assets/hero.png";
import { formatCurrency } from "../utils/format";

const Home = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const catalogRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [veiculosRes, categoriasRes] = await Promise.all([
          api.get("/veiculos"),
          api.get("/categoria"),
        ]);

        if (isMounted) {
          // Filter only active vehicles
          setVeiculos(veiculosRes.data.filter((v) => v.ativo));
          setCategorias(categoriasRes.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredVeiculos = veiculos.filter(
    (v) =>
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCategoriaData = (id) => {
    return (
      categorias.find((c) => c.id === id) || {
        nome: "Econômico",
        valorDiaria: 89.9,
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_50%),radial-gradient(circle_at_bottom_left,var(--color-primary)_0%,transparent_50%)] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

          {/* Animated Decorative Elements */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                Alugue o carro <br />
                <span className="text-primary">perfeito</span> para sua <br />
                próxima jornada
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                As melhores opções de veículos com os melhores preços do
                mercado. Segurança, conforto e liberdade para você chegar onde
                quiser.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToCatalog}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 group"
              >
                Ver Catálogo
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section ref={catalogRef} className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Nossa Frota</h2>
            <p className="text-muted-foreground">
              Escolha o veículo que melhor se adapta ao seu estilo.
            </p>
          </div>

          <div className="relative max-w-md w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por modelo ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border h-[420px] animate-pulse"
              />
            ))
          ) : filteredVeiculos.length > 0 ? (
            filteredVeiculos.map((veiculo) => {
              const cat = getCategoriaData(veiculo.categoriaId);
              return (
                <div
                  key={veiculo.placa}
                  className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="h-56 bg-muted relative overflow-hidden border-b border-border/50">
                    {veiculo.imagemUrl ? (
                      <img
                        src={veiculo.imagemUrl}
                        alt={`${veiculo.marca} ${veiculo.modelo}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <CarIcon size={64} />
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <span className="bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-border/50">
                        {cat.nome}
                      </span>
                    </div>

                    <div
                      className={`absolute top-4 right-4 text-white text-[10px] font-bold px-3 py-1 rounded-full ${veiculo.disponivel ? "bg-emerald-500" : "bg-destructive"} shadow-lg`}
                    >
                      {veiculo.disponivel ? "DISPONÍVEL" : "LOCADO"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {veiculo.modelo}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium">
                        {veiculo.marca} • {veiculo.ano}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-secondary/50 text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase border border-border/50">
                        {veiculo.cor}
                      </span>
                      <span className="bg-secondary/50 text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase border border-border/50">
                        {veiculo.placa}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">
                          Diária
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-primary">
                            {formatCurrency(cat.valorDiaria)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <CarIcon
                size={64}
                className="mx-auto text-muted-foreground mb-4 opacity-20"
              />
              <p className="text-xl text-muted-foreground font-medium">
                Nenhum veículo encontrado.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
