import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Plus, CheckCircle, CalendarDays, Loader2, X, User, Car as CarIcon, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';

const Locacoes = () => {
  const [locacoes, setLocacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    placaVeiculo: '',
    dataRetirada: new Date().toISOString().slice(0, 16),
    dataPrevDevol: ''
  });

  const fetchData = async () => {
    try {
      const [resLoc, resCli, resVeiTodos, resVeiDisp] = await Promise.all([
        api.get('/veiculoalocado'),
        api.get('/clientes'),
        api.get('/veiculos'),
        api.get('/veiculos/disponivel')
      ]);
      setLocacoes(resLoc.data);
      setClientes(resCli.data);
      setVeiculos(resVeiTodos.data);
      setVeiculosDisponiveis(resVeiDisp.data);
    } catch (error) {
      console.error('Erro ao buscar dados de locação:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDarBaixa = async (id) => {
    try {
      await api.put(`/veiculoalocado/darbaixa?id=${id}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao dar baixa na locação:', error);
      const errorMsg = error.response?.data?.mensagem || "Erro ao dar baixa na locação.";
      alert(errorMsg);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta locação?")) return;
    try {
      await api.put(`/veiculoalocado/cancelar?id=${id}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao cancelar locação:', error);
      const errorMsg = error.response?.data?.mensagem || "Erro ao cancelar locação. Verifique se a data de retirada já passou.";
      alert(errorMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/veiculoalocado/add', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao registrar locação:', error);
      const errorMsg = error.response?.data?.mensagem || "Erro ao registrar locação.";
      alert(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Locações</h2>
          <p className="text-muted-foreground">Registre novas retiradas e gerencie devoluções.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Nova Locação
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-muted-foreground font-medium">Carregando locações...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm">Cliente</th>
                  <th className="px-6 py-4 font-bold text-sm">Veículo</th>
                  <th className="px-6 py-4 font-bold text-sm">Retirada</th>
                  <th className="px-6 py-4 font-bold text-sm">Prev. Devolução</th>
                  <th className="px-6 py-4 font-bold text-sm">Devolvido em / Valor</th>
                  <th className="px-6 py-4 font-bold text-sm text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {locacoes.map((loc) => (
                  <tr key={loc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-primary" />
                          <span className="text-sm font-bold">
                            {clientes.find((c) => c.id === loc.clienteId)
                              ?.nome || loc.nomeCliente || "Cliente não encontrado"}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-5 font-medium">
                          {clientes.find((c) => c.id === loc.clienteId)?.cpf || "---"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <CarIcon size={14} className="text-muted-foreground" />
                          <span className="text-sm font-bold uppercase font-mono">
                            {loc.placaVeiculo}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-5 font-medium">
                          {(() => {
                            const v = veiculos.find((v) => v.placa === loc.placaVeiculo);
                            return v ? `${v.marca} ${v.modelo}` : "Veículo não identificado";
                          })()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {formatDateTime(loc.dataRetirada)}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {formatDateTime(loc.dataPrevDevol)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {loc.status === 1 && (
                          <>
                            <span className="text-xs font-bold text-green-600">
                              {formatDateTime(loc.dataDevolução)}
                            </span>
                            <span className="text-[10px] font-bold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full w-fit">
                              {formatCurrency(loc.valorTotal)}
                            </span>
                          </>
                        )}
                        {loc.status === 0 && (
                          <span className="text-xs text-muted-foreground italic">
                            Aguardando...
                          </span>
                        )}
                        
                        {loc.status === 0 && (
                          <span className="text-[9px] font-bold text-blue-500 uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            Em andamento
                          </span>
                        )}
                        {loc.status === 1 && (
                          <span className="text-[9px] font-bold text-green-500 uppercase flex items-center gap-1">
                            <CheckCircle size={10} />
                            Concluída
                          </span>
                        )}
                        {loc.status === 2 && (
                          <span className="text-[9px] font-bold text-destructive uppercase">
                            Cancelada
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {loc.status === 0 && (
                          <>
                            <button 
                              onClick={() => handleCancelar(loc.id)}
                              className="text-[10px] bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 rounded-full font-bold hover:bg-destructive hover:text-white transition-all flex items-center gap-1"
                            >
                              <X size={12} />
                              CANCELAR
                            </button>
                            <button 
                              onClick={() => handleDarBaixa(loc.id)}
                              className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full font-bold hover:bg-green-500 hover:text-white transition-all flex items-center gap-1"
                            >
                              <CheckCircle size={12} />
                              CONCLUIR
                            </button>
                          </>
                        )}
                        {loc.status !== 0 && (
                          <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                            loc.status === 1 ? 'bg-muted text-muted-foreground' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {loc.status === 1 ? 'FINALIZADA' : 'CANCELADA'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">Registrar Nova Locação</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Cliente</label>
                <select 
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary appearance-none"
                  value={formData.clienteId}
                  onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} ({c.cpf})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Veículo Disponível</label>
                <select 
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary appearance-none"
                  value={formData.placaVeiculo}
                  onChange={(e) => setFormData({...formData, placaVeiculo: e.target.value})}
                >
                  <option value="">Selecione um veículo...</option>
                  {veiculosDisponiveis.map(v => <option key={v.placa} value={v.placa}>{v.modelo} - {v.placa}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Data de Retirada</label>
                  <input 
                    type="datetime-local" required
                    className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary text-xs"
                    value={formData.dataRetirada}
                    onChange={(e) => setFormData({...formData, dataRetirada: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Prev. Devolução</label>
                  <input 
                    type="datetime-local" required
                    className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary text-xs"
                    value={formData.dataPrevDevol}
                    onChange={(e) => setFormData({...formData, dataPrevDevol: e.target.value})}
                  />
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4 text-xs mt-4">
                <CalendarDays className="text-primary" size={24} />
                <p className="text-muted-foreground italic">
                  Certifique-se de validar os documentos do cliente antes de confirmar a retirada do veículo.
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold hover:bg-muted rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                  Confirmar Locação
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locacoes;
