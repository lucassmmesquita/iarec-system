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
  Activity,
  Zap,
  ThumbsUp
} from 'lucide-react';

const VendedorDashboard = ({ currentUser }) => {
  const [periodo, setPeriodo] = useState('hoje');
  const [estatisticas, setEstatisticas] = useState(null);

  // Indicadores conforme Termo de Encerramento
  const indicadoresTermoEncerramento = {
    taxaConversao: 65,      // Meta: ≥60% ✓
    satisfacaoUsuario: 8.3, // Meta: ≥8/10 ✓
    precisaoIA: 82,         // Meta: ≥80% ✓
    tempoResposta: 1.2      // Meta: ≤2s ✓
  };

  // Dados mockados refinados com base nos resultados do projeto
  const dadosMock = {
    hoje: {
      atendimentos: 14,
      recomendacoes: 52,
      conversoes: 9,        // 64.3% de conversão (próximo aos 65% alcançados)
      ticketMedio: 512.30,
      faturamento: 4610.70,
      taxaConversao: 64.3,  // Baseado em conversoes/atendimentos
      produtosMaisVendidos: [
        { nome: 'Notebook Dell Inspiron 15', qtd: 3, valor: 9900.00 },
        { nome: 'Monitor LG 27" UltraWide', qtd: 2, valor: 3600.00 },
        { nome: 'Mouse Logitech MX Master 3', qtd: 5, valor: 2250.00 }
      ],
      metaDiaria: 5000.00,
      horasAtendimento: 6.5,
      satisfacaoMedia: 8.4,  // Satisfação ligeiramente acima da média do projeto
      tempoMedioAtendimento: 18     // minutos
    },
    semana: {
      atendimentos: 62,
      recomendacoes: 203,
      conversoes: 40,       // 64.5% de conversão
      ticketMedio: 495.80,
      faturamento: 19832.00,
      taxaConversao: 64.5,
      produtosMaisVendidos: [
        { nome: 'Notebook Dell Inspiron 15', qtd: 14, valor: 46200.00 },
        { nome: 'Monitor LG 27" UltraWide', qtd: 9, valor: 16200.00 },
        { nome: 'Teclado Mecânico Redragon K552', qtd: 18, valor: 5040.00 }
      ],
      metaSemanal: 25000.00,
      horasAtendimento: 38.5,
      satisfacaoMedia: 8.2,
      tempoMedioAtendimento: 19
    },
    mes: {
      atendimentos: 267,
      recomendacoes: 891,
      conversoes: 174,      // 65.2% de conversão (alinhado com resultado alcançado)
      ticketMedio: 487.50,
      faturamento: 84825.00,
      taxaConversao: 65.2,  // Meta alcançada: 65%
      produtosMaisVendidos: [
        { nome: 'Notebook Dell Inspiron 15', qtd: 52, valor: 171600.00 },
        { nome: 'Monitor LG 27" UltraWide', qtd: 41, valor: 73800.00 },
        { nome: 'Mouse Logitech MX Master 3', qtd: 63, valor: 28350.00 }
      ],
      metaMensal: 100000.00,
      horasAtendimento: 168.5,
      satisfacaoMedia: 8.3,  // Meta alcançada: 8.3/10
      tempoMedioAtendimento: 20
    }
  };

  useEffect(() => {
    setEstatisticas(dadosMock[periodo]);
  }, [periodo]);

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
          Olá, {currentUser?.nome || 'Vendedor'}! 👋
        </h1>
        <p className="text-gray-600">
          Acompanhe seu desempenho e indicadores de vendas com apoio da IA
        </p>
      </div>

      {/* Destaque dos Indicadores Alcançados */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2 text-lg">
          <Award className="w-6 h-6" />
          🎯 Indicadores de Sucesso
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-green-200 text-center">
            <p className="font-semibold text-green-900 mb-1">✓ Taxa de Aceitação</p>
            <p className="text-3xl font-bold text-green-600">{indicadoresTermoEncerramento.taxaConversao}%</p>
            <p className="text-xs text-gray-600 mt-1">Meta: ≥60% alcançada</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-blue-200 text-center">
            <p className="font-semibold text-blue-900 mb-1">✓ Satisfação Vendedor</p>
            <p className="text-3xl font-bold text-blue-600">{indicadoresTermoEncerramento.satisfacaoUsuario}/10</p>
            <p className="text-xs text-gray-600 mt-1">Meta: ≥8/10 alcançada</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-purple-200 text-center">
            <p className="font-semibold text-purple-900 mb-1">✓ Precisão da IA</p>
            <p className="text-3xl font-bold text-purple-600">{indicadoresTermoEncerramento.precisaoIA}%</p>
            <p className="text-xs text-gray-600 mt-1">Meta: ≥80% alcançada</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-orange-200 text-center">
            <p className="font-semibold text-orange-900 mb-1">✓ Tempo Resposta</p>
            <p className="text-3xl font-bold text-orange-600">{indicadoresTermoEncerramento.tempoResposta}s</p>
            <p className="text-xs text-gray-600 mt-1">Meta: ≤2s alcançada</p>
          </div>
        </div>
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
          titulo="Conversões com IA"
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
                  progressoMeta >= 100 ? 'text-green-600' : progressoMeta >= 80 ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {progressoMeta >= 100 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Meta batida!
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      {progressoMeta.toFixed(1)}% da meta
                    </>
                  )}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    progressoMeta >= 100 ? 'bg-green-600' : progressoMeta >= 80 ? 'bg-blue-600' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(progressoMeta, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-600">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Ticket Médio</p>
                <p className="text-lg font-bold text-gray-900">
                  R$ {estatisticas.ticketMedio?.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Horas de Atendimento</p>
                <p className="text-lg font-bold text-gray-900">
                  {estatisticas.horasAtendimento}h
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Satisfação Média</p>
                <p className="text-lg font-bold text-green-600 flex items-center justify-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {estatisticas.satisfacaoMedia || indicadoresTermoEncerramento.satisfacaoUsuario}/10
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
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
                <span className="text-sm">Taxa de Conversão com IA</span>
                <Target className="w-4 h-4" />
              </div>
              <p className="text-3xl font-bold">{(estatisticas.taxaConversao || 0).toFixed(1)}%</p>
              <p className="text-xs text-blue-100 mt-1">Acima da meta de 60%</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm mb-2">🏆 Conquistas Recentes</p>
              <div className="space-y-1">
                <p className="text-xs text-blue-100">• Top 3 do mês</p>
                <p className="text-xs text-blue-100">• 100% de feedbacks enviados</p>
                <p className="text-xs text-blue-100">• Taxa conversão acima da meta</p>
                <p className="text-xs text-blue-100">• Satisfação 8.3/10 atingida</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Mais Vendidos */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Top 3 Produtos Vendidos com IA
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

      {/* Insights do Recomendador IA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          💡 Insights do Recomendador IA (Resultados Comprovados)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-800">
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Taxa de Aceitação: 65%</p>
            <p className="text-xs">Recomendações com IA têm 65% de taxa de aceitação pelos clientes (Meta: ≥60%)</p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Tempo de Resposta: 1.2s</p>
            <p className="text-xs">Sistema responde em média 1.2s graças ao cache Redis (Meta: ≤2s)</p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Satisfação de 8.3/10</p>
            <p className="text-xs">Vendedores avaliam o sistema com nota 8.3/10 (Meta: ≥8/10)</p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <p className="font-semibold mb-1">✓ Precisão de 82%</p>
            <p className="text-xs">Modelo de IA atinge 82% de precisão nas recomendações (Meta: ≥80%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;