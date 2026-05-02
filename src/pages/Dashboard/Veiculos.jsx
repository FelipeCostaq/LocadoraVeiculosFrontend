import React, { useState, useEffect } from "react";
import api from "../../api/client";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Car as CarIcon,
  Loader2,
  X,
} from "lucide-react";

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVeiculo, setCurrentVeiculo] = useState(null);
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    ano: new Date().getFullYear(),
    cor: "",
    categoriaId: "",
    imagemUrl: "",
    disponivel: true,
    ativo: true,
  });

  const fetchData = async () => {
    try {
      const [resVei, resCat] = await Promise.all([
        api.get("/veiculos"),
        api.get("/categoria"),
      ]);
      setVeiculos(resVei.data);
      setCategorias(resCat.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPlaca = (value) => {
    return value
      .replace(/[^A-Za-z0-9]/g, "") // Remove símbolos e espaços
      .toUpperCase()
      .slice(0, 7); // Placas brasileiras têm 7 caracteres
  };

  const handlePlacaChange = (e) => {
    const formatted = formatPlaca(e.target.value);
    setFormData({ ...formData, placa: formatted });
  };

  const handleOpenModal = (veiculo = null) => {
    if (veiculo) {
      setCurrentVeiculo(veiculo);
      setFormData({
        ...veiculo,
        // Ensure numeric fields are numbers
        ano: parseInt(veiculo.ano),
      });
    } else {
      setCurrentVeiculo(null);
      setFormData({
        placa: "",
        marca: "",
        modelo: "",
        ano: new Date().getFullYear(),
        cor: "",
        categoriaId: categorias[0]?.id || "",
        imagemUrl: "",
        disponivel: true,
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload matches RequestAdicionarVeiculoDTO and RequestEditarVeiculoDTO
    const payload = {
      placa: formData.placa, // Re-including because the backend validation requires it
      marca: formData.marca,
      modelo: formData.modelo,
      ano: parseInt(formData.ano),
      cor: formData.cor,
      categoriaId: formData.categoriaId,
      imagemUrl: formData.imagemUrl,
      disponivel: formData.disponivel,
      ativo: formData.ativo,
    };

    try {
      if (currentVeiculo) {
        // Based on the user's Swagger info, the 'placa' is expected as a query parameter named 'id'
        const targetId = String(currentVeiculo.id || currentVeiculo.placa);
        console.log(
          "Atualizando veículo. URL Final:",
          `/veiculos?placa=${targetId}`,
        );

        // Use a direct string URL to ensure the '?' is present as required by the backend
        await api.put(`/veiculos?placa=${targetId}`, payload);
      } else {
        await api.post("/veiculos", payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data);
      const errorMsg = error.response?.data?.mensagem || "Erro ao salvar veículo.";
      alert(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Veículos</h2>
          <p className="text-muted-foreground">
            Gerencie a frota da sua locadora.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Novo Veículo
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-muted-foreground font-medium">
              Carregando frota...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm">Veículo</th>
                  <th className="px-6 py-4 font-bold text-sm">Placa</th>
                  <th className="px-6 py-4 font-bold text-sm">Categoria</th>
                  <th className="px-6 py-4 font-bold text-sm">Cor</th>
                  <th className="px-6 py-4 font-bold text-sm">Status</th>
                  <th className="px-6 py-4 font-bold text-sm text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {veiculos.map((veiculo) => (
                  <tr
                    key={veiculo.placa}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          {veiculo.imagemUrl ? (
                            <img
                              src={veiculo.imagemUrl}
                              alt={veiculo.modelo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CarIcon
                              size={20}
                              className="text-muted-foreground"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{veiculo.modelo}</p>
                          <p className="text-xs text-muted-foreground">
                            {veiculo.marca} - {veiculo.ano}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary px-2 py-1 rounded text-xs font-mono font-bold uppercase">
                        {veiculo.placa}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {categorias.find((c) => c.id === veiculo.categoriaId)
                        ?.nome || "Sem Categoria"}
                    </td>
                    <td className="px-6 py-4 text-sm">{veiculo.cor}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold w-fit ${
                            veiculo.ativo
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {veiculo.ativo ? "NA FROTA" : "DESATIVADO"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold w-fit ${
                            veiculo.disponivel
                              ? "bg-green-500/10 text-green-500"
                              : "bg-orange-500/10 text-orange-500"
                          }`}
                        >
                          {veiculo.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(veiculo)}
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

      {/* Modal - Could be a separate component but for simplicity kept here */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">
                {currentVeiculo ? "Editar Veículo" : "Novo Veículo"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Modelo
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.modelo}
                  onChange={(e) =>
                    setFormData({ ...formData, modelo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Marca
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.marca}
                  onChange={(e) =>
                    setFormData({ ...formData, marca: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Placa
                </label>
                <input
                  type="text"
                  required
                  placeholder="AAA0A00"
                  disabled={!!currentVeiculo}
                  className={`w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary font-mono ${currentVeiculo ? "opacity-50 cursor-not-allowed" : ""}`}
                  value={formData.placa}
                  onChange={handlePlacaChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Ano
                </label>
                <input
                  type="number"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.ano}
                  onChange={(e) =>
                    setFormData({ ...formData, ano: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Cor
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.cor}
                  onChange={(e) =>
                    setFormData({ ...formData, cor: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Categoria
                </label>
                <select
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary appearance-none"
                  value={formData.categoriaId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoriaId: e.target.value })
                  }
                >
                  <option value="">Selecione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  URL da Imagem
                </label>
                <input
                  type="text"
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.imagemUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imagemUrl: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 flex items-center gap-6 pt-4 border-t border-border mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-input"
                  />
                  <span className="text-sm font-medium">
                    Veículo Ativo na Frota
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.disponivel}
                    onChange={(e) =>
                      setFormData({ ...formData, disponivel: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-input"
                  />
                  <span className="text-sm font-medium">
                    Disponível para locação
                  </span>
                </label>
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold hover:bg-muted rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all"
                >
                  Salvar Veículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Veiculos;
