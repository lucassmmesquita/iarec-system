import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Target,
  Award,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const VendedorDashboard = ({ currentUser }) => {
  const [periodo, setPeriodo] = useState('hoje');
  const [estatisticas, setEstatisticas] = useState(null);

  // Dados mockados com estatísticas do vendedor
  const dadosMock = {
    hoje: {
      atendimentos: 12,
      recomendacoes: 45,
      conversoes: 8,
      ticketMedio: 487.50,
      faturamento: 3900.00,
      taxaConversao: 66.7,
      produtosMaisVendidos: [
        { nome: 'Notebook Dell Inspiron', qtd: 3, valor: 9600.00 },
        { nome: 'Mouse Logitech MX Master', qtd: 5, valor: 2250.00 },
        { nome: 'Teclado Mecânico Redragon', qtd: 4, valor: 1120.00 }
      ],
      metaDiaria: 5000.00,
      horasAtendimento: 6.5
    },
    semana: {
      atendimentos: 58,
      recomendacoes: 187,
      conversoes: 42,
      ticketMedio: 512.30,
      faturamento: 21516.60,
      taxaConversao: 72.4,
      produtosMaisVendidos: [
        { nome: 'Notebook Dell Inspiron', qtd: 12, valor: 38400.00 },
        { nome: 'Monitor LG 27"', qtd: 8, valor: 14400.00 },
        { nome: 'Webcam Logitech C920', qtd: 15, valor: 6300.00 }
      ],
      metaSemanal: 25000.00,
      horasAtendimento: 38.5
    },
    mes: {
      atendimentos: 247,
      recomendacoes: 824,
      conversoes: 189,
      ticketMedio: 495.80,
      faturamento: 93706.20,
      taxaConversao: 76.5,
      produtosMaisVendidos: [
        { nome: 'Notebook Dell Inspiron', qtd: 45, valor: 144000.00 },
        { nome: 'Monitor LG 27"', qtd: 38, valor: 68400.00 },
        { nome: 'Mouse Logitech MX Master', qtd: 52, valor: 23400.00 }
      ],
      metaMensal: 100000.00,
      horasAtendimento: 168.5
    }
  };

  useEffect(() => {
    setEstatisticas(dadosMock[periodo]);
  }, [periodo]);

  // Proteção contra undefined
  if (!estatisticas) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Função auxiliar para obter a meta correta
  const getMeta = () => {
    if (periodo === 'hoje') return estatisticas.metaDiaria || 0;
    if (periodo === 'semana') return estatisticas.metaSemanal || 0;
    return estatisticas.metaMensal || 0;
  };

  const meta = getMeta();
  const progressoMeta = meta > 0 ? (estatisticas.faturamento / meta) * 100 : 0;

  const StatusCard = ({ titulo, valor, icone: Icon, trend, trendValue, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{titulo}</span>
        <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: color }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{valor}</p>
      {trend && (
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500">vs período anterior</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {currentUser?.name || 'Vendedor'}! 👋
        </h1>
        <p className="text-gray-600">
          Acompanhe seu desempenho e indicadores de vendas
        </p>
      </div>

      {/* Filtro de Período */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {['hoje', 'semana', 'mes'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  periodo === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p === 'hoje' ? 'Hoje' : p === 'semana' ? 'Esta Semana' : 'Este Mês'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatusCard
          titulo="Atendimentos"
          valor={estatisticas.atendimentos || 0}
          icone={Users}
          trend="up"
          trendValue="+12%"
          color="#3b82f6"
        />
        <StatusCard
          titulo="Recomendações Geradas"
          valor={estatisticas.recomendacoes || 0}
          icone={Package}
          trend="up"
          trendValue="+8%"
          color="#8b5cf6"
        />
        <StatusCard
          titulo="Conversões"
          valor={estatisticas.conversoes || 0}
          icone={ShoppingCart}
          trend="up"
          trendValue="+15%"
          color="#10b981"
        />
        <StatusCard
          titulo="Taxa de Conversão"
          valor={`${(estatisticas.taxaConversao || 0).toFixed(1)}%`}
          icone={Target}
          trend="up"
          trendValue="+5.2%"
          color="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Faturamento */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Faturamento</h3>
                <p className="text-sm text-gray-500">
                  Meta: R$ {meta.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  R$ {(estatisticas.faturamento || 0).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  progressoMeta >= 100 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  {progressoMeta.toFixed(1)}% da meta
                </span>
              </div>
              
              {/* Barra de Progresso */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressoMeta >= 100 ? 'bg-green-500' : 
                    progressoMeta >= 70 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(progressoMeta, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {(estatisticas.ticketMedio || 0).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Horas de Atendimento</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  {(estatisticas.horasAtendimento || 0).toFixed(1)}h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Sua Performance</h3>
              <p className="text-sm text-blue-100">Ranking do período</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Posição no Ranking</span>
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-3xl font-bold">#2</p>
              <p className="text-xs text-blue-100 mt-1">de 47 vendedores</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Pontuação de IA</span>
                <Target className="w-4 h-4" />
              </div>
              <p className="text-3xl font-bold">94.5</p>
              <p className="text-xs text-blue-100 mt-1">Precisão das recomendações</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm mb-2">🏆 Conquistas Recentes</p>
              <div className="space-y-1">
                <p className="text-xs text-blue-100">• Top 3 do mês</p>
                <p className="text-xs text-blue-100">• 100% de feedbacks</p>
                <p className="text-xs text-blue-100">• Meta semanal batida</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Mais Vendidos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Top 3 Produtos Vendidos
          </h3>
          <Package className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {(estatisticas.produtosMaisVendidos || []).map((produto, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
                ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  'bg-orange-100 text-orange-700'}
              `}>
                {index + 1}º
              </div>
              
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{produto.nome}</p>
                <p className="text-sm text-gray-600">
                  {produto.qtd} {produto.qtd === 1 ? 'unidade vendida' : 'unidades vendidas'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  R$ {(produto.valor || 0).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-xs text-gray-500">Faturamento total</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas e Insights */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          💡 Insights do Recomendador IA
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-800">
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Melhor Horário de Vendas</p>
            <p className="text-xs">Das 14h às 17h você tem 35% mais conversões</p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Combo Recomendado</p>
            <p className="text-xs">Notebook + Mouse: 85% de aceitação quando oferecidos juntos</p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Perfil de Cliente Ideal</p>
            <p className="text-xs">Clientes entre 25-35 anos têm maior ticket médio (R$ 620)</p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Oportunidade de Upsell</p>
            <p className="text-xs">Ofereça garantia estendida: 42% de conversão adicional</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;