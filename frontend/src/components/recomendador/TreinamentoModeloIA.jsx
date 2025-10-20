import React, { useState } from 'react';
import { Brain, Play, Pause, Square, TrendingUp, Target, Zap, GitBranch, Activity, BarChart3, Settings, Download, Eye, Trash2, CheckCircle, AlertCircle, Loader, Award, Clock, Database, Layers, RefreshCw } from 'lucide-react';

const TreinamentoModeloIA = () => {
  const [modelos, setModelos] = useState([
    {
      id: 1,
      nome: 'Collaborative Filtering v3.2',
      versao: '3.2.0',
      algoritmo: 'Collaborative Filtering (User-Based)',
      status: 'producao',
      dataTreinamento: '2025-10-15 14:30:00',
      duracaoTreinamento: '2h 34min',
      dataset: {
        registros: 122000,
        clientes: 8450,
        produtos: 1234,
        transacoes: 45823
      },
      metricas: {
        precision: 0.847,
        recall: 0.821,
        f1Score: 0.834,
        accuracy: 0.892,
        mae: 0.23,
        rmse: 0.34
      },
      hiperparametros: {
        k_neighbors: 50,
        min_support: 0.02,
        similarity: 'cosine',
        normalization: 'z-score',
        train_test_split: '80/20'
      },
      validacaoCruzada: {
        folds: 5,
        scoreMedia: 0.834,
        desvio: 0.012
      },
      performance: {
        tempoResposta: '45ms',
        throughput: '2200 req/s',
        memoria: '1.2GB'
      }
    },
    {
      id: 2,
      nome: 'Matrix Factorization v2.1',
      versao: '2.1.0',
      algoritmo: 'Matrix Factorization (SVD)',
      status: 'treinando',
      dataTreinamento: '2025-10-17 09:00:00',
      duracaoTreinamento: '1h 15min (em andamento)',
      progresso: 68,
      dataset: {
        registros: 95000,
        clientes: 7200,
        produtos: 1150,
        transacoes: 38900
      },
      metricas: {
        precision: 0.0,
        recall: 0.0,
        f1Score: 0.0,
        accuracy: 0.0,
        mae: 0.0,
        rmse: 0.0
      },
      hiperparametros: {
        n_factors: 100,
        n_epochs: 50,
        learning_rate: 0.005,
        regularization: 0.02,
        train_test_split: '80/20'
      },
      validacaoCruzada: {
        folds: 5,
        scoreMedia: 0.0,
        desvio: 0.0
      },
      performance: {
        tempoResposta: '-',
        throughput: '-',
        memoria: '-'
      }
    }
  ]);

  const [modalNovoTreinamento, setModalNovoTreinamento] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);

  const getStatusBadge = (status) => {
    const badges = {
      producao: { bg: 'bg-green-100', text: 'text-green-700', label: 'Em Produção', icon: CheckCircle },
      treinando: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Treinando', icon: Loader }
    };
    return badges[status] || badges.producao;
  };

  const formatMetrica = (valor) => {
    if (valor === 0) return '-';
    return (valor * 100).toFixed(1) + '%';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
             
              Treinamento de Modelo de IA
            </h1>
            <p className="text-sm text-gray-600 mt-1">Modelo de recomendação inteligente da SHOPINFO</p>
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-6 h-6" />
            <Award className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Modelos Treinados</p>
          <p className="text-3xl font-bold mt-1">{modelos.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Em Produção</p>
          <p className="text-xl font-bold mt-1">CF v3.2</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6" />
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Melhor Precisão</p>
          <p className="text-3xl font-bold mt-1">84.7%</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6" />
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Tempo Médio</p>
          <p className="text-xl font-bold mt-1">2h 20min</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-6 h-6" />
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Registros</p>
          <p className="text-2xl font-bold mt-1">217K</p>
        </div>
      </div>

      <div className="space-y-4">
        {modelos.map(modelo => {
          const badge = getStatusBadge(modelo.status);
          const IconStatus = badge.icon;

          return (
            <div key={modelo.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{modelo.nome}</h3>
                      <p className="text-sm text-gray-600">{modelo.algoritmo}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                      <IconStatus className={`w-3 h-3 ${modelo.status === 'treinando' ? 'animate-spin' : ''}`} />
                      {badge.label}
                    </span>
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

                <div className="flex gap-2">
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
              </div>

              {modelo.status === 'treinando' && (
                <div className="mb-4">
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

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 border-t pt-4">
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
                  <p className={`text-lg font-bold ${modelo.metricas.f1Score > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                    {formatMetrica(modelo.metricas.f1Score)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Accuracy</p>
                  <p className={`text-lg font-bold ${modelo.metricas.accuracy > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {formatMetrica(modelo.metricas.accuracy)}
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
              </div>
            </div>
          );
        })}
      </div>

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
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-yellow-600 mb-1">Transações</p>
                      <p className="text-2xl font-bold text-yellow-900">{modeloSelecionado.dataset.transacoes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Exemplo de Recomendação</h3>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Cliente: João Silva</p>
                    <p className="text-sm text-gray-600 mb-3">Histórico: Notebook, Mouse, Teclado</p>
                    <div className="space-y-2">
                      {[
                        { nome: 'Monitor LG 27" 4K', score: 0.94 },
                        { nome: 'Webcam Logitech C920', score: 0.89 },
                        { nome: 'Headset HyperX', score: 0.87 }
                      ].map((rec, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded">
                          <span className="text-sm font-semibold">{rec.nome}</span>
                          <span className="text-sm font-bold text-purple-600">{(rec.score * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
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
                        placeholder="Ex: Modelo Recomendação Q4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dataset</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option>Vendas 2023 Completo - 122K registros</option>
                        <option>Vendas 2023 Q4 - 34K registros</option>
                        <option>Histórico 5 Anos - 456K registros</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Algoritmo</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'cf', nome: 'Collaborative Filtering', desc: 'Recomenda baseado em similaridade entre usuários' },
                      { id: 'mf', nome: 'Matrix Factorization', desc: 'Decomposição matricial para fatores latentes' },
                      { id: 'hybrid', nome: 'Hybrid Recommender', desc: 'Combina múltiplas técnicas' }
                    ].map(alg => (
                      <div key={alg.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <input type="radio" name="algoritmo" className="mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{alg.nome}</h4>
                            <p className="text-sm text-gray-600">{alg.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiperparâmetros</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">K-Neighbors: 50</label>
                      <input type="range" min="10" max="100" defaultValue="50" className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Train/Test Split: 80/20</label>
                      <input type="range" min="60" max="90" defaultValue="80" className="w-full" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                    <div>
                      <p className="font-semibold text-gray-900">Ativar Auto-Tuning</p>
                      <p className="text-sm text-gray-600">Busca automática dos melhores hiperparâmetros</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-purple-900">Tempo Estimado</p>
                      <p className="text-sm text-purple-700">Aproximadamente 1h 30min - 3h 00min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => setModalNovoTreinamento(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Treinamento iniciado! O modelo aparecerá na lista com status "Treinando"');
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

      <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3">Sobre Machine Learning para Recomendação</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-semibold mb-2">Algoritmos Disponíveis</p>
            <ul className="space-y-1 ml-4">
              <li>• Collaborative Filtering (User & Item Based)</li>
              <li>• Matrix Factorization (SVD)</li>
              <li>• Hybrid Recommender Systems</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Métricas de Avaliação</p>
            <ul className="space-y-1 ml-4">
              <li>• Precision, Recall, F1-Score</li>
              <li>• MAE e RMSE para erro de predição</li>
              <li>• Validação Cruzada (K-Folds)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreinamentoModeloIA;