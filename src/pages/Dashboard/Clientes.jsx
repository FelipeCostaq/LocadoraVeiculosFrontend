import React, { useState, useEffect, useMemo } from "react";
import api from "../../api/client";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Loader2,
  X,
  Phone,
  Mail,
  MapPin,
  Search,
} from "lucide-react";
import { formatDate } from "../../utils/format";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNasc: "",
    endereco: "",
    ativo: true,
  });

  const fetchClientes = async () => {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = useMemo(() => {
    return clientes.filter((cliente) => {
      const search = searchTerm.toLowerCase();
      return (
        cliente.nome.toLowerCase().includes(search) ||
        cliente.id.toLowerCase().includes(search)
      );
    });
  }, [clientes, searchTerm]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
      )
    )
      return;
    try {
      await api.delete("/clientes", { params: { id } });
      fetchClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      const errorMsg =
        error.response?.data?.mensagem ||
        "Não foi possível excluir o cliente. Verifique se ele possui locações vinculadas.";
      alert(errorMsg);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const response = await api.get("/clientes");
        if (isMounted) {
          setClientes(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setCurrentCliente(cliente);
      // Format date for text input dd/mm/yyyy
      const formattedDate = formatDate(cliente.dataNasc);
      setFormData({
        ...cliente,
        dataNasc: formattedDate === '---' ? '' : formattedDate,
        telefone: formatTelefone(cliente.telefone || ""),
      });
    } else {
      setCurrentCliente(null);
      setFormData({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        dataNasc: "",
        endereco: "",
        ativo: true,
      });
    }
    setIsModalOpen(true);
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, "") // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os 3 primeiros dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os 6 primeiros dígitos
      .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca hífen após os 9 primeiros dígitos
      .replace(/(-\d{2})\d+?$/, "$1"); // Impede que mais de 11 dígitos sejam digitados
  };

  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const formatDataNascInput = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})\d+?$/, "$1");
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
  };

  const handleDataNascChange = (e) => {
    const formatted = formatDataNascInput(e.target.value);
    setFormData({ ...formData, dataNasc: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert dd/mm/yyyy to yyyy-mm-dd for API
    const [day, month, year] = formData.dataNasc.split('/');
    const apiDate = `${year}-${month}-${day}`;

    // RequestAdicionarClienteDTO / RequestEditarClienteDTO
    const payload = {
      nome: formData.nome,
      cpf: formData.cpf.replace(/\D/g, ""), // Enviar apenas números para o back
      email: formData.email,
      telefone: formData.telefone.replace(/\D/g, ""), // Enviar apenas números para o back
      dataNasc: apiDate, // format: date (yyyy-mm-dd)
      endereco: formData.endereco,
      ativo: formData.ativo,
    };

    try {
      if (currentCliente) {
        // PUT /clientes/edit?id={uuid}
        await api.put("/clientes/edit", payload, {
          params: { id: currentCliente.id },
        });
      } else {
        // POST /clientes/add
        await api.post("/clientes/add", payload);
      }
      setIsModalOpen(false);
      fetchClientes();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      const errorMsg =
        error.response?.data?.mensagem ||
        "Erro ao salvar cliente. Verifique se o CPF é único e os dados estão corretos.";
      alert(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por ID ou Nome..."
            className="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-muted-foreground font-medium">
              Carregando clientes...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm">Cliente</th>
                  <th className="px-6 py-4 font-bold text-sm">CPF</th>
                  <th className="px-6 py-4 font-bold text-sm text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Users size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{cliente.nome}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">
                              ID: {cliente.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">
                        {cliente.cpf}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(cliente.dataNasc)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Mail size={12} /> {cliente.email}
                          </p>
                          <p className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Phone size={12} />{" "}
                            {formatTelefone(cliente.telefone || "")}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            cliente.ativo
                              ? "bg-green-500/10 text-green-500"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {cliente.ativo ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(cliente)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                            title="Editar Cliente"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                            title="Excluir Cliente"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-20 text-center text-muted-foreground"
                    >
                      {searchTerm 
                        ? `Nenhum cliente encontrado para "${searchTerm}".`
                        : "Nenhum cliente cadastrado até o momento."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">
                {currentCliente ? "Editar Cliente" : "Novo Cliente"}
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
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  CPF
                </label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary font-mono"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  required
                  placeholder="dd/mm/yyyy"
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.dataNasc}
                  onChange={handleDataNascChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Telefone
                </label>
                <input
                  type="text"
                  required
                  placeholder="(XX) XXXXX-XXXX"
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.telefone}
                  onChange={handleTelefoneChange}
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Endereço
                </label>
                <input
                  type="text"
                  className="w-full bg-input border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                />
              </div>
              {currentCliente && (
                <div className="col-span-2 flex items-center gap-4 pt-4 border-t border-border mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) =>
                        setFormData({ ...formData, ativo: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-input"
                    />
                    <span className="text-sm font-medium">Cliente Ativo</span>
                  </label>
                </div>
              )}
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
