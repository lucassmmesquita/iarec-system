import React, { useState } from 'react';
import {
  CheckSquare,
  XCircle,
  Edit2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Download,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Package,
  Calendar,
  Settings,
  Save,
  RotateCcw,
  Trash2,
  History,
  Plus
} from 'lucide-react';

const ValidacaoRecomendacoesPage = () => {
  const [selectedTab, setSelectedTab] = useState('amostragem');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNovaRegraModal, setShowNovaRegraModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHistoricoAcao, setFilterHistoricoAcao] = useState('all');
  const [filterHistoricoUsuario, setFilterHistoricoUsuario] = useState('all');
  const [searchHistorico, setSearchHistorico] = useState('');
  const [novaRegra, setNovaRegra] = useState({
    nome: '',
    descricao: '',
    tipo: 'preco',
    ativa: true
  });

  const [recomendacoes, setRecomendacoes] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      vendedor: 'Maria Santos',
      produtoOriginal: 'Notebook Dell Inspiron',
      produtoRecomendado: 'Notebook Dell XPS 15',
      confianca: 87.5,
      status: 'pendente',
      data: '17/10/2025 09:30',
      categoria: 'Notebooks',
      preco: 7899.00,
      motivo: 'Cliente procura por melhor performance'
    },
    {
      id: 2,
      cliente: 'Ana Costa',
      vendedor: 'Carlos Lima',
      produtoOriginal: 'Mouse básico',
      produtoRecomendado: 'Mouse Logitech MX Master 3',
      confianca: 92.3,
      status: 'pendente',
      data: '17/10/2025 10:15',
      categoria: 'Periféricos',
      preco: 549.90,
      motivo: 'Upgrade baseado em histórico de compras'
    },
    {
      id: 3,
      cliente: 'Pedro Oliveira',
      vendedor: 'Ana Costa',
      produtoOriginal: 'HD 1TB',
      produtoRecomendado: 'SSD Samsung 1TB',
      confianca: 95.8,
      status: 'aprovado',
      data: '17/10/2025 08:45',
      categoria: 'Armazenamento',
      preco: 489.00,
      motivo: 'Melhor performance e velocidade'
    },
    {
      id: 4,
      cliente: 'Mariana Santos',
      vendedor: 'João Santos',
      produtoOriginal: 'Teclado comum',
      produtoRecomendado: 'Teclado Mecânico Keychron K2',
      confianca: 78.2,
      status: 'rejeitado',
      data: '17/10/2025 11:20',
      categoria: 'Periféricos',
      preco: 799.00,
      motivo: 'Cliente trabalha com design'
    },
    {
      id: 5,
      cliente: 'Roberto Lima',
      vendedor: 'Paula Oliveira',
      produtoOriginal: 'Monitor 21"',
      produtoRecomendado: 'Monitor LG UltraWide 29"',
      confianca: 88.9,
      status: 'pendente',
      data: '17/10/2025 14:00',
      categoria: 'Monitores',
      preco: 1299.00,
      motivo: 'Produtividade para trabalho remoto'
    }
  ]);

  const [regras, setRegras] = useState([
    {
      id: 1,
      nome: 'Diferença de Preço Máxima',
      descricao: 'Recomendação não pode ter diferença maior que 50% do preço original',
      ativa: true,
      tipo: 'preco'
    },
    {
      id: 2,
      nome: 'Confiança Mínima',
      descricao: 'Recomendações devem ter no mínimo 80% de confiança',
      ativa: true,
      tipo: 'confianca'
    },
    {
      id: 3,
      nome: 'Mesma Categoria',
      descricao: 'Produto recomendado deve ser da mesma categoria',
      ativa: false,
      tipo: 'categoria'
    },
    {
      id: 4,
      nome: 'Estoque Disponível',
      descricao: 'Apenas recomendar produtos com estoque acima de 5 unidades',
      ativa: true,
      tipo: 'estoque'
    }
  ]);

  const historico = [
    {
      id: 1,
      acao: 'Aprovação',
      usuario: 'Admin Sistema',
      recomendacao: 'SSD Samsung 1TB para Pedro Oliveira',
      data: '17/10/2025 08:50',
      detalhes: 'Aprovado automaticamente - confiança > 95%'
    },
    {
      id: 2,
      acao: 'Rejeição',
      usuario: 'Maria Santos',
      recomendacao: 'Teclado Mecânico para Mariana Santos',
      data: '17/10/2025 11:25',
      detalhes: 'Produto fora da faixa de preço do cliente'
    },
    {
      id: 3,
      acao: 'Edição',
      usuario: 'Carlos Lima',
      recomendacao: 'Mouse Logitech MX Master 3 para Ana Costa',
      data: '17/10/2025 10:20',
      detalhes: 'Alterado produto de MX Master 2 para MX Master 3'
    },
    {
      id: 4,
      acao: 'Aprovação em Lote',
      usuario: 'Admin Sistema',
      recomendacao: '15 recomendações categoria Notebooks',
      data: '16/10/2025 18:30',
      detalhes: 'Aprovação em lote de recomendações com confiança > 90%'
    }
  ];

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filteredIds = filteredRecomendacoes.map(r => r.id);
    if (selectedItems.length === filteredIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredIds);
    }
  };

  const handleAprovar = (id) => {
    setRecomendacoes(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'aprovado' } : r)
    );
    setSelectedItems(prev => prev.filter(item => item !== id));
  };

  const handleRejeitar = (id) => {
    setRecomendacoes(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'rejeitado' } : r)
    );
    setSelectedItems(prev => prev.filter(item => item !== id));
  };

  const handleAprovarLote = () => {
    if (selectedItems.length === 0) {
      alert('Selecione pelo menos uma recomendação');
      return;
    }
    setRecomendacoes(prev => 
      prev.map(r => selectedItems.includes(r.id) ? { ...r, status: 'aprovado' } : r)
    );
    setSelectedItems([]);
    alert(`${selectedItems.length} recomendações aprovadas com sucesso!`);
  };

  const handleRejeitarLote = () => {
    if (selectedItems.length === 0) {
      alert('Selecione pelo menos uma recomendação');
      return;
    }
    if (window.confirm(`Deseja realmente rejeitar ${selectedItems.length} recomendações?`)) {
      setRecomendacoes(prev => 
        prev.map(r => selectedItems.includes(r.id) ? { ...r, status: 'rejeitado' } : r)
      );
      setSelectedItems([]);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setRecomendacoes(prev => 
      prev.map(r => r.id === editingItem.id ? editingItem : r)
    );
    setShowEditModal(false);
    setEditingItem(null);
  };

  const toggleRegra = (id) => {
    setRegras(prev => 
      prev.map(r => r.id === id ? { ...r, ativa: !r.ativa } : r)
    );
  };

  const handleDeleteRegra = (id) => {
    if (window.confirm('Deseja realmente excluir esta regra?')) {
      setRegras(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleNovaRegra = () => {
    console.log('Abrindo modal de nova regra');
    setNovaRegra({
      nome: '',
      descricao: '',
      tipo: 'preco',
      ativa: true
    });
    setShowNovaRegraModal(true);
  };

  const handleSaveNovaRegra = () => {
    console.log('Salvando nova regra:', novaRegra);
    
    if (!novaRegra.nome || !novaRegra.descricao) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newRegra = {
      id: Date.now(),
      ...novaRegra
    };

    console.log('Nova regra criada:', newRegra);
    setRegras(prev => [...prev, newRegra]);
    setShowNovaRegraModal(false);
    setNovaRegra({
      nome: '',
      descricao: '',
      tipo: 'preco',
      ativa: true
    });
    alert('Regra criada com sucesso!');
  };

  const filteredRecomendacoes = recomendacoes.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = 
      r.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.produtoRecomendado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredHistorico = historico.filter(item => {
    const matchAcao = filterHistoricoAcao === 'all' || item.acao === filterHistoricoAcao;
    const matchUsuario = filterHistoricoUsuario === 'all' || item.usuario === filterHistoricoUsuario;
    const matchSearch = 
      item.recomendacao.toLowerCase().includes(searchHistorico.toLowerCase()) ||
      item.usuario.toLowerCase().includes(searchHistorico.toLowerCase()) ||
      item.detalhes.toLowerCase().includes(searchHistorico.toLowerCase());
    return matchAcao && matchUsuario && matchSearch;
  });

  const usuariosHistorico = [...new Set(historico.map(item => item.usuario))];
  const acoesHistorico = [...new Set(historico.map(item => item.acao))];

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejeitado':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejeitado':
        return <XCircle className="w-4 h-4" />;
      case 'pendente':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getConfiancaColor = (confianca) => {
    if (confianca >= 90) return 'text-green-600';
    if (confianca >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Validação e Edição de Recomendações
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Curadoria manual das recomendações geradas pela IA
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setSelectedTab('amostragem')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedTab === 'amostragem'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Amostragem e Validação
            </button>
            <button
              onClick={() => setSelectedTab('regras')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedTab === 'regras'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Regras de Negócio
            </button>
            <button
              onClick={() => setSelectedTab('historico')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedTab === 'historico'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              Histórico de Alterações
            </button>
          </nav>
        </div>
      </div>

      {selectedTab === 'amostragem' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, produto ou vendedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="w-full lg:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pendente">Pendentes</option>
                  <option value="aprovado">Aprovados</option>
                  <option value="rejeitado">Rejeitados</option>
                </select>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleAprovarLote}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Aprovar ({selectedItems.length})
                  </button>
                  <button
                    onClick={handleRejeitarLote}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Rejeitar ({selectedItems.length})
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {recomendacoes.filter(r => r.status === 'pendente').length}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aprovados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {recomendacoes.filter(r => r.status === 'aprovado').length}
                  </p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejeitados</p>
                  <p className="text-3xl font-bold text-red-600">
                    {recomendacoes.filter(r => r.status === 'rejeitado').length}
                  </p>
                </div>
                <XCircle className="w-12 h-12 text-red-600 opacity-20" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredRecomendacoes.length && filteredRecomendacoes.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <h3 className="font-semibold text-gray-900">
                  Recomendações para Validação ({filteredRecomendacoes.length})
                </h3>
              </div>
            </div>

            <div className="divide-y">
              {filteredRecomendacoes.map((rec) => (
                <div key={rec.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(rec.id)}
                      onChange={() => handleSelectItem(rec.id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(rec.status)}`}>
                            {getStatusIcon(rec.status)}
                            {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {rec.data}
                          </span>
                          <span className={`text-sm font-semibold ${getConfiancaColor(rec.confianca)}`}>
                            {rec.confianca}% confiança
                          </span>
                        </div>

                        {rec.status === 'pendente' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(rec)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAprovar(rec.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Aprovar"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejeitar(rec.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Rejeitar"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            <strong>Cliente:</strong> {rec.cliente}
                          </p>
                          <p className="text-gray-600">
                            <User className="w-4 h-4 inline mr-1" />
                            <strong>Vendedor:</strong> {rec.vendedor}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">
                            <Package className="w-4 h-4 inline mr-1" />
                            <strong>Categoria:</strong> {rec.categoria}
                          </p>
                          <p className="text-gray-600">
                            <strong>Preço:</strong> {formatCurrency(rec.preco)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Produto Original:</strong> {rec.produtoOriginal}
                        </p>
                        <p className="text-sm text-blue-700 font-medium mb-2">
                          <strong>→ Recomendado:</strong> {rec.produtoRecomendado}
                        </p>
                        <p className="text-xs text-gray-600">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          <strong>Motivo:</strong> {rec.motivo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRecomendacoes.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Nenhuma recomendação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'regras' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Regras Customizadas</h2>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Botão Nova Regra clicado');
                  handleNovaRegra();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Regra
              </button>
            </div>

            <div className="space-y-4">
              {regras.map((regra) => (
                <div
                  key={regra.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={regra.ativa}
                      onChange={() => toggleRegra(regra.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{regra.nome}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        regra.ativa 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {regra.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{regra.descricao}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDeleteRegra(regra.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Como funcionam as regras
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Regras ativas são aplicadas automaticamente a todas as recomendações</li>
              <li>• Recomendações que não atendem às regras são sinalizadas para revisão</li>
              <li>• Você pode criar regras customizadas baseadas em diferentes critérios</li>
              <li>• Regras podem ser temporariamente desativadas sem serem excluídas</li>
            </ul>
          </div>
        </div>
      )}

      {selectedTab === 'historico' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar no histórico..."
                    value={searchHistorico}
                    onChange={(e) => setSearchHistorico(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="w-full lg:w-48">
                <select
                  value={filterHistoricoAcao}
                  onChange={(e) => setFilterHistoricoAcao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas as Ações</option>
                  {acoesHistorico.map((acao) => (
                    <option key={acao} value={acao}>{acao}</option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-48">
                <select
                  value={filterHistoricoUsuario}
                  onChange={(e) => setFilterHistoricoUsuario(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os Usuários</option>
                  {usuariosHistorico.map((usuario) => (
                    <option key={usuario} value={usuario}>{usuario}</option>
                  ))}
                </select>
              </div>

              {(filterHistoricoAcao !== 'all' || filterHistoricoUsuario !== 'all' || searchHistorico) && (
                <button
                  onClick={() => {
                    setFilterHistoricoAcao('all');
                    setFilterHistoricoUsuario('all');
                    setSearchHistorico('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpar
                </button>
              )}
            </div>

            {filteredHistorico.length !== historico.length && (
              <div className="mt-3 text-sm text-gray-600">
                Mostrando <strong>{filteredHistorico.length}</strong> de <strong>{historico.length}</strong> registros
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Histórico de Alterações</h2>
            </div>

            <div className="divide-y">
              {filteredHistorico.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      item.acao === 'Aprovação' || item.acao === 'Aprovação em Lote'
                        ? 'bg-green-100'
                        : item.acao === 'Rejeição'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                    }`}>
                      {item.acao === 'Aprovação' || item.acao === 'Aprovação em Lote' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : item.acao === 'Rejeição' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Edit2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{item.acao}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{item.data}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Usuário:</strong> {item.usuario}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Recomendação:</strong> {item.recomendacao}
                      </p>
                      <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                        {item.detalhes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredHistorico.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <History className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium mb-2">Nenhum registro encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros ou limpar a busca</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Editar Recomendação</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                <input
                  type="text"
                  value={editingItem.cliente}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produto Original</label>
                <input
                  type="text"
                  value={editingItem.produtoOriginal}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produto Recomendado *</label>
                <input
                  type="text"
                  value={editingItem.produtoRecomendado}
                  onChange={(e) => setEditingItem({...editingItem, produtoRecomendado: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={editingItem.categoria}
                    onChange={(e) => setEditingItem({...editingItem, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Notebooks">Notebooks</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Monitores">Monitores</option>
                    <option value="Armazenamento">Armazenamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.preco}
                    onChange={(e) => setEditingItem({...editingItem, preco: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da Recomendação</label>
                <textarea
                  value={editingItem.motivo}
                  onChange={(e) => setEditingItem({...editingItem, motivo: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showNovaRegraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Nova Regra de Negócio</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Regra *</label>
                <input
                  type="text"
                  value={novaRegra.nome}
                  onChange={(e) => setNovaRegra({...novaRegra, nome: e.target.value})}
                  placeholder="Ex: Margem Mínima de Lucro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                <textarea
                  value={novaRegra.descricao}
                  onChange={(e) => setNovaRegra({...novaRegra, descricao: e.target.value})}
                  placeholder="Descreva como esta regra será aplicada..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Regra</label>
                <select
                  value={novaRegra.tipo}
                  onChange={(e) => setNovaRegra({...novaRegra, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="preco">Preço</option>
                  <option value="confianca">Confiança</option>
                  <option value="categoria">Categoria</option>
                  <option value="estoque">Estoque</option>
                  <option value="margem">Margem</option>
                  <option value="cliente">Cliente</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="custom">Customizada</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="regraAtiva"
                  checked={novaRegra.ativa}
                  onChange={(e) => setNovaRegra({...novaRegra, ativa: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="regraAtiva" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Ativar esta regra imediatamente
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Dica
                </h3>
                <p className="text-sm text-blue-800">
                  Regras ativas serão aplicadas automaticamente a todas as novas recomendações. 
                  Você pode desativar temporariamente uma regra sem excluí-la.
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={handleSaveNovaRegra}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Criar Regra
              </button>
              <button
                onClick={() => {
                  setShowNovaRegraModal(false);
                  setNovaRegra({
                    nome: '',
                    descricao: '',
                    tipo: 'preco',
                    ativa: true
                  });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidacaoRecomendacoesPage;