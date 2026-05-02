import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, Filter, Car as CarIcon } from 'lucide-react';

const Home = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        const response = await api.get('/veiculos');
        // Filter only active vehicles
        const activeVeiculos = response.data.filter(v => v.ativo);
        setVeiculos(activeVeiculos);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVeiculos();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">Nossa Frota</h1>
        <p className="text-muted-foreground text-lg">Encontre o veículo ideal para sua próxima viagem.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border h-80 animate-pulse" />
          ))
        ) : veiculos.length > 0 ? (
          veiculos.map((veiculo) => (
            <div key={veiculo.placa} className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary transition-all duration-300">
              <div className="h-48 bg-muted relative overflow-hidden">
                {veiculo.imagemUrl ? (
                  <img 
                    src={veiculo.imagemUrl} 
                    alt={`${veiculo.marca} ${veiculo.modelo}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <CarIcon size={48} />
                  </div>
                )}
                <div className={`absolute top-4 right-4 text-primary-foreground text-xs font-bold px-2 py-1 rounded ${veiculo.disponivel ? 'bg-primary' : 'bg-destructive'}`}>
                  {veiculo.disponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{veiculo.modelo}</h3>
                    <p className="text-sm text-muted-foreground">{veiculo.marca} - {veiculo.ano}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span className="bg-secondary px-2 py-1 rounded text-foreground">{veiculo.cor}</span>
                  <span className="bg-secondary px-2 py-1 rounded text-foreground uppercase">{veiculo.placa}</span>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <CarIcon size={64} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-xl text-muted-foreground">Nenhum veículo encontrado no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
