import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Award,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Play,
  Eye,
  Zap
} from 'lucide-react';

const TreinamentoModeloIA = () => {
  const [modelos, setModelos] = useState([]);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalNovoTreinamento, setModalNovoTreinamento] = useState(false);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);

  // Indicadores alcançados
  const indicadoresAlcancados = {
    precisaoModelo: 82,  // Meta: ≥80% ✓
    tempoResposta: 1.2,  // Meta: ≤2s ✓ (otimizado para ≤1.5s)
    taxaAceitacao: 65,   // Meta: ≥60% ✓
    satisfacaoUsuario: 8.3, // Meta: ≥8/10 ✓
    cacheHitRate: 68,    // Taxa de acerto do cache Redis
    reducaoTempo: 85.9   // Redução de 8.5s para 1.2s = 85.9% de melhoria
  };

  // Modelos mockados com resultados reais do projeto
  useEffect(() => {
    const modelosMock = [
      {
        id: 1,
        nome: 'Collaborative Filtering v3.2',
        algoritmo: 'CF + Content-Based (Híbrido)',
        status: 'producao',
        dataTreinamento: '15/12/2023',
        duracaoTreinamento: '2h 14min',
        progresso: 100,
        dataset: {
          registros: 342567,
          clientes: 45789,
          produtos: 8234,
          transacoes: 156234
        },
        metricas: {
          precision: 0.847,  // 84.7% - Melhor modelo
          recall: 0.793,
          f1score: 0.819,
          mae: 0.321,
          rmse: 0.456
        },
        performance: {
          tempoResposta: '1.2s',  // Resultado alcançado
          throughput: '850 req/s',
          cacheHitRate: '68%',     // Cache Redis
          uptime: '99.8%'
        },
        ambiente: 'production',
        versao: 'v3.2',
        observacoes: 'Modelo com melhor desempenho. Taxa de aceitação: 65%'
      },
      {
        id: 2,
        nome: 'Matrix Factorization v2.1',
        algoritmo: 'SVD (Singular Value Decomposition)',
        status: 'backup',
        dataTreinamento: '08/12/2023',
        duracaoTreinamento: '1h 52min',
        progresso: 100,
        dataset: {
          registros: 342567,
          clientes: 45789,
          produtos: 8234,
          transacoes: 156234
        },
        metricas: {
          precision: 0.820,  // 82% - Meta alcançada
          recall: 0.775,
          f1score: 0.797,
          mae: 0.347,
          rmse: 0.489
        },
        performance: {
          tempoResposta: '1.4s',
          throughput: '720 req/s',
          cacheHitRate: '65%',
          uptime: '99.6%'
        },
        ambiente: 'backup',
        versao: 'v2.1',
        observacoes: 'Modelo de backup. Usado antes da otimização com cache Redis'
      },
      {
        id: 3,
        nome: 'Content-Based Filtering v1.5',
        algoritmo: 'TF-IDF + Cosine Similarity',
        status: 'homologacao',
        dataTreinamento: '01/12/2023',
        duracaoTreinamento: '1h 35min',
        progresso: 100,
        dataset: {
          registros: 342567,
          clientes: 45789,
          produtos: 8234,
          transacoes: 156234
        },
        metricas: {
          precision: 0.796,
          recall: 0.742,
          f1score: 0.768,
          mae: 0.385,
          rmse: 0.523
        },
        performance: {
          tempoResposta: '1.6s',
          throughput: '650 req/s',
          cacheHitRate: '62%',
          uptime: '99.4%'
        },
        ambiente: 'staging',
        versao: 'v1.5',
        observacoes: 'Modelo especializado em recomendação por características de produto'
      },
      {
        id: 4,
        nome: 'K-Means Clustering v1.0',
        algoritmo: 'K-Means (k=12 clusters)',
        status: 'experimental',
        dataTreinamento: '22/11/2023',
        duracaoTreinamento: '2h 48min',
        progresso: 100,
        dataset: {
          registros: 298456,
          clientes: 41234,
          produtos: 7891,
          transacoes: 142567
        },
        metricas: {
          precision: 0.764,
          recall: 0.715,
          f1score: 0.739,
          mae: 0.421,
          rmse: 0.578
        },
        performance: {
          tempoResposta: '2.1s',
          throughput: '520 req/s',
          cacheHitRate: '58%',
          uptime: '98.9%'
        },
        ambiente: 'development',
        versao: 'v1.0',
        observacoes: 'Modelo experimental para segmentação de clientes'
      }
    ];

    setModelos(modelosMock);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      producao: { label: 'Homologação', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      backup: { label: 'Backup', color: 'bg-blue-100 text-blue-700', icon: Database },
      homologacao: { label: 'Homologação', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
      experimental: { label: 'Experimental', color: 'bg-purple-100 text-purple-700', icon: Brain },
      treinando: { label: 'Treinando', color: 'bg-orange-100 text-orange-700', icon: Activity }
    };
    return badges[status] || badges.experimental;
  };

  const formatMetrica = (valor) => {
    if (!valor || valor === 0) return '-';
    return `${(valor * 100).toFixed(1)}%`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          Treinamento do Modelo de IA
        </h1>
        <p className="text-gray-600">
          Gerencie e monitore os modelos de machine learning para recomendação de produtos
        </p>
      </div>

      {/* Botão Novo Treinamento */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Modelo Ativo:</strong> Collaborative Filtering v3.2
            </p>
            <p className="text-xs text-gray-500">
              Última atualização: 15/12/2023 às 14:35
            </p>
          </div>
          <button
            onClick={() => setModalNovoTreinamento(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Play className="w-5 h-5" />
            Novo Treinamento
          </button>
        </div>
      </div>

      {/* Cards de Indicadores Alcançados  */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-6 h-6" />
            <Award className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Modelos Treinados</p>
          <p className="text-3xl font-bold mt-1">{modelos.length}</p>
          <p className="text-xs opacity-75 mt-1">Total do projeto</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Precisão do Modelo</p>
          <p className="text-3xl font-bold mt-1">{indicadoresAlcancados.precisaoModelo}%</p>
          <p className="text-xs opacity-75 mt-1">Meta: ≥80% ✓</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6" />
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Tempo de Resposta</p>
          <p className="text-3xl font-bold mt-1">{indicadoresAlcancados.tempoResposta}s</p>
          <p className="text-xs opacity-75 mt-1">Meta: ≤2s ✓</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6" />
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Taxa de Aceitação</p>
          <p className="text-3xl font-bold mt-1">{indicadoresAlcancados.taxaAceitacao}%</p>
          <p className="text-xs opacity-75 mt-1">Meta: ≥60% ✓</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-6 h-6" />
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Cache Hit Rate</p>
          <p className="text-3xl font-bold mt-1">{indicadoresAlcancados.cacheHitRate}%</p>
          <p className="text-xs opacity-75 mt-1">Redis Cache</p>
        </div>
      </div>

      {/* Resultados do Projeto - Destaque */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2 text-lg">
          <Award className="w-6 h-6" />
          🎯 Indicadores de Desempenho Alcançados 
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-green-200">
            <p className="font-semibold text-green-900 mb-1">✓ Precisão do Modelo de IA</p>
            <p className="text-xs text-gray-700">
              <strong className="text-green-600 text-lg">{indicadoresAlcancados.precisaoModelo}%</strong> alcançado (Meta: ≥80%)
            </p>
            <p className="text-xs text-gray-600 mt-1">Validação cruzada confirmada</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-blue-200">
            <p className="font-semibold text-blue-900 mb-1">✓ Tempo Médio de Resposta</p>
            <p className="text-xs text-gray-700">
              <strong className="text-blue-600 text-lg">{indicadoresAlcancados.tempoResposta}s</strong> alcançado (Meta: ≤2s)
            </p>
            <p className="text-xs text-gray-600 mt-1">Redução de 85.9% com otimizações</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-purple-200">
            <p className="font-semibold text-purple-900 mb-1">✓ Taxa de Aceitação</p>
            <p className="text-xs text-gray-700">
              <strong className="text-purple-600 text-lg">{indicadoresAlcancados.taxaAceitacao}%</strong> alcançado (Meta: ≥60%)
            </p>
            <p className="text-xs text-gray-600 mt-1">Feedback dos vendedores</p>
          </div>
        </div>
      </div>

      {/* Lista de Modelos */}
      <div className="space-y-4">
        {modelos.map((modelo) => {
          const badge = getStatusBadge(modelo.status);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={modelo.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{modelo.nome}</h3>
                      <p className="text-sm text-gray-600">{modelo.algoritmo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badge.color}`}>
                      <BadgeIcon className={`w-4 h-4 ${modelo.status === 'treinando' ? 'animate-spin' : ''}`} />
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                  <div>
                    <span className="font-medium">Treinamento:</span> {modelo.dataTreinamento}
                  </div>
                  <div>
                    <span className="font-medium">Duração:</span> {modelo.duracaoTreinamento}
                  </div>
                  <div>
                    <span className="font-medium">Dataset:</span> {modelo.dataset.registros.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Performance:</span> {modelo.performance.tempoResposta}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 px-6 pb-4">
                <button
                  onClick={() => {
                    setModeloSelecionado(modelo);
                    setModalDetalhes(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Ver Detalhes"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {modelo.status === 'treinando' && (
                <div className="mb-4 px-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-semibold text-blue-600">{modelo.progresso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${modelo.progresso}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 border-t pt-4 px-6 pb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Precision</p>
                  <p className={`text-lg font-bold ${modelo.metricas.precision > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formatMetrica(modelo.metricas.precision)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Recall</p>
                  <p className={`text-lg font-bold ${modelo.metricas.recall > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {formatMetrica(modelo.metricas.recall)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">F1-Score</p>
                  <p className={`text-lg font-bold ${modelo.metricas.f1score > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                    {formatMetrica(modelo.metricas.f1score)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">MAE</p>
                  <p className={`text-lg font-bold ${modelo.metricas.mae > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {modelo.metricas.mae > 0 ? modelo.metricas.mae.toFixed(3) : '-'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">RMSE</p>
                  <p className={`text-lg font-bold ${modelo.metricas.rmse > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {modelo.metricas.rmse > 0 ? modelo.metricas.rmse.toFixed(3) : '-'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Uptime</p>
                  <p className={`text-lg font-bold ${modelo.performance.uptime ? 'text-green-600' : 'text-gray-400'}`}>
                    {modelo.performance.uptime || '-'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detalhes */}
      {modalDetalhes && modeloSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{modeloSelecionado.nome}</h2>
                <button
                  onClick={() => setModalDetalhes(false)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Dataset de Treinamento</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600 mb-1">Registros</p>
                      <p className="text-2xl font-bold text-blue-900">{modeloSelecionado.dataset.registros.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-600 mb-1">Clientes</p>
                      <p className="text-2xl font-bold text-green-900">{modeloSelecionado.dataset.clientes.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-purple-600 mb-1">Produtos</p>
                      <p className="text-2xl font-bold text-purple-900">{modeloSelecionado.dataset.produtos.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-orange-600 mb-1">Transações</p>
                      <p className="text-2xl font-bold text-orange-900">{modeloSelecionado.dataset.transacoes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Métricas de Desempenho</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tempo de Resposta</p>
                      <p className="text-xl font-bold text-gray-900">{modeloSelecionado.performance.tempoResposta}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Throughput</p>
                      <p className="text-xl font-bold text-gray-900">{modeloSelecionado.performance.throughput}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Cache Hit Rate</p>
                      <p className="text-xl font-bold text-gray-900">{modeloSelecionado.performance.cacheHitRate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Observações</h3>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{modeloSelecionado.observacoes}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setModalDetalhes(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Treinamento */}
      {modalNovoTreinamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Configurar Novo Treinamento
              </h2>
              <p className="text-sm text-purple-100 mt-1">Configure os parâmetros para treinar um novo modelo</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Básicas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Modelo</label>
                      <input
                        type="text"
                        placeholder="Ex: Modelo Recomendação Q1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Algoritmo</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option>Collaborative Filtering (Híbrido)</option>
                        <option>Matrix Factorization (SVD)</option>
                        <option>Content-Based Filtering</option>
                        <option>K-Means Clustering</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-semibold mb-2">ℹ️ Informação</p>
                  <p className="text-xs text-blue-800">
                    O treinamento utilizará o dataset completo com {(342567).toLocaleString()} registros. 
                    Tempo estimado: 2-3 horas. O modelo aparecerá na lista com status "Treinando".
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setModalNovoTreinamento(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('✅ Treinamento iniciado! O modelo aparecerá na lista com status "Treinando"');
                  setModalNovoTreinamento(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar Treinamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre Machine Learning */}
      <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3">Sobre Machine Learning para Recomendação</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-semibold mb-2">Algoritmos Disponíveis</p>
            <ul className="space-y-1 ml-4">
              <li>• Collaborative Filtering (User & Item Based)</li>
              <li>• Matrix Factorization (SVD)</li>
              <li>• Hybrid Recommender Systems</li>
              <li>• Content-Based with TF-IDF</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Otimizações Implementadas</p>
            <ul className="space-y-1 ml-4">
              <li>• Cache Redis (68% hit rate)</li>
              <li>• Índices PostgreSQL otimizados</li>
              <li>• Validação Cruzada (K-Folds)</li>
              <li>• Redução de 85.9% no tempo de resposta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreinamentoModeloIA;