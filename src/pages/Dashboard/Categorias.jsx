import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Plus, Edit, Layers, Loader2, X, DollarSign } from 'lucide-react';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valorDiaria: 0,
    ativo: true
  });

  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categoria');
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleOpenModal = (categoria = null) => {
    if (categoria) {
      setCurrentCategoria(categoria);
      setFormData(categoria);
    } else {
      setCurrentCategoria(null);
      setFormData({ nome: '', descricao: '', valorDiaria: 0, ativo: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // RequestAdicionarCategoriaVeiculoDTO / RequestEditarCategoriaVeiculoDTO
    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      valorDiaria: parseFloat(formData.valorDiaria),
      ativo: formData.ativo
    };

    try {
      if (currentCategoria) {
        // PUT /categoria?id={uuid}
        await api.put('/categoria', payload, {
          params: { id: currentCategoria.id }
        });
      } else {
        // POST /categoria
        await api.post('/categoria', payload);
      }
      setIsModalOpen(false);
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Verifique os dados.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Categorias</h2>
          <p className="text-muted-foreground">Defina os tipos de veículos e preços de diária.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Nova Categoria
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-muted-foreground font-medium">Carregando categorias...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm">Nome</th>
                  <th className="px-6 py-4 font-bold text-sm">Descrição</th>
                  <th className="px-6 py-4 font-bold text-sm">Valor Diária</th>
                  <th className="px-6 py-4 font-bold text-sm">Status</th>
                  <th className="px-6 py-4 font-bold text-sm text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categorias.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{cat.nome}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{cat.descricao}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-bold text-primary">R$ {cat.valorDiaria?.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        cat.ativo ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {cat.ativo ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                      >
                        <Edit size={18} />
                      </button>
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
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">{currentCategoria ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Nome</label>
                <input 
                  type="text" required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Descrição</label>
                <textarea 
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary h-24"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Valor da Diária (R$)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <input 
                    type="number" step="0.01" required
                    className="w-full bg-input border border-border rounded-lg p-2.5 pl-10 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.valorDiaria}
                    onChange={(e) => setFormData({...formData, valorDiaria: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold hover:bg-muted rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;
