import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const RelatoriosPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Dados mockados para demonstração
  const kpiData = {
    totalRecomendacoes: {
      value: 1543,
      change: 12.5,
      trend: 'up'
    },
    taxaConversao: {
      value: 34.8,
      change: 8.2,
      trend: 'up'
    },
    ticketMedio: {
      value: 2847.50,
      change: -3.1,
      trend: 'down'
    },
    receitaGerada: {
      value: 1456823.00,
      change: 15.7,
      trend: 'up'
    }
  };

  const vendedoresData = [
    { id: 1, nome: 'Maria Silva', recomendacoes: 234, conversoes: 89, taxa: 38.0, receita: 254320 },
    { id: 2, nome: 'João Santos', recomendacoes: 198, conversoes: 72, taxa: 36.4, receita: 198450 },
    { id: 3, nome: 'Ana Costa', recomendacoes: 187, conversoes: 65, taxa: 34.8, receita: 187230 },
    { id: 4, nome: 'Carlos Lima', recomendacoes: 156, conversoes: 51, taxa: 32.7, receita: 145670 },
    { id: 5, nome: 'Paula Oliveira', recomendacoes: 143, conversoes: 48, taxa: 33.6, receita: 132890 }
  ];

  const produtosData = [
    { id: 1, nome: 'Notebook Dell XPS 15', categoria: 'Notebooks', recomendacoes: 89, conversoes: 34, taxa: 38.2 },
    { id: 2, nome: 'Mouse Logitech MX Master', categoria: 'Periféricos', recomendacoes: 76, conversoes: 31, taxa: 40.8 },
    { id: 3, nome: 'Monitor LG UltraWide', categoria: 'Monitores', recomendacoes: 67, conversoes: 23, taxa: 34.3 },
    { id: 4, nome: 'Teclado Mecânico Keychron', categoria: 'Periféricos', recomendacoes: 54, conversoes: 19, taxa: 35.2 },
    { id: 5, nome: 'SSD Samsung 1TB', categoria: 'Armazenamento', recomendacoes: 48, conversoes: 21, taxa: 43.8 }
  ];

  const recomendacoesRecentes = [
    { id: 1, data: '16/10/2025 14:32', vendedor: 'Maria Silva', cliente: 'João Pedro', produto: 'Notebook Dell', status: 'convertido' },
    { id: 2, data: '16/10/2025 14:15', vendedor: 'João Santos', cliente: 'Ana Maria', produto: 'Mouse Logitech', status: 'convertido' },
    { id: 3, data: '16/10/2025 13:58', vendedor: 'Ana Costa', cliente: 'Carlos Silva', produto: 'Monitor LG', status: 'pendente' },
    { id: 4, data: '16/10/2025 13:45', vendedor: 'Carlos Lima', cliente: 'Paula Santos', produto: 'Teclado Keychron', status: 'rejeitado' },
    { id: 5, data: '16/10/2025 13:30', vendedor: 'Paula Oliveira', cliente: 'Roberto Costa', produto: 'SSD Samsung', status: 'convertido' }
  ];

  const handleExportPDF = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Relatório exportado em PDF com sucesso!');
    }, 1500);
  };

  const handleExportExcel = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Relatório exportado em Excel com sucesso!');
    }, 1500);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'convertido':
        return 'bg-green-100 text-green-700';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejeitado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'convertido':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendente':
        return <Eye className="w-4 h-4" />;
      case 'rejeitado':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Consultas e Relatórios Estatísticos
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Análise de performance das recomendações e conversões
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportPDF}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="90days">Últimos 90 dias</option>
                <option value="12months">Últimos 12 meses</option>
                <option value="custom">Período customizado</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as categorias</option>
                <option value="notebooks">Notebooks</option>
                <option value="perifericos">Periféricos</option>
                <option value="monitores">Monitores</option>
                <option value="armazenamento">Armazenamento</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setLoading(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              kpiData.totalRecomendacoes.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.totalRecomendacoes.trend === 'up' ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {kpiData.totalRecomendacoes.change}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total de Recomendações</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpiData.totalRecomendacoes.value}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              kpiData.taxaConversao.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.taxaConversao.trend === 'up' ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {kpiData.taxaConversao.change}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Taxa de Conversão</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpiData.taxaConversao.value}%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              kpiData.ticketMedio.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.ticketMedio.trend === 'up' ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(kpiData.ticketMedio.change)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Ticket Médio</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {formatCurrency(kpiData.ticketMedio.value)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              kpiData.receitaGerada.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpiData.receitaGerada.trend === 'up' ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {kpiData.receitaGerada.change}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Receita Gerada</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {formatCurrency(kpiData.receitaGerada.value)}
          </p>
        </div>
      </div>

      {/* Performance por Vendedor */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Performance por Vendedor
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recomendações
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversões
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendedoresData.map((vendedor, index) => (
                <tr key={vendedor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{vendedor.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {vendedor.recomendacoes}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {vendedor.conversoes}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                      {vendedor.taxa}%
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {formatCurrency(vendedor.receita)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Produtos Mais Recomendados */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Produtos Mais Recomendados
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recomendações
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversões
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {produtosData.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <span className="font-medium text-gray-900">{produto.nome}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {produto.recomendacoes}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {produto.conversoes}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${produto.taxa}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-12">
                        {produto.taxa}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recomendações Recentes */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Recomendações Recentes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recomendacoesRecentes.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {rec.data}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.vendedor}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.cliente}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {rec.produto}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(rec.status)}`}>
                      {getStatusIcon(rec.status)}
                      {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;