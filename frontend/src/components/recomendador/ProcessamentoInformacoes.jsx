import React, { useState } from 'react';
import { Cpu, Play, Pause, Square, AlertCircle, CheckCircle, Loader, Settings, TrendingUp, Database, Filter, Zap, GitBranch, Activity, BarChart3, Eye, Trash2, RefreshCw, Download } from 'lucide-react';

const ProcessamentoInformacoes = () => {
  // Estado para pipelines
  const [pipelines, setPipelines] = useState([
    {
      id: 1,
      nome: 'Pipeline Principal - Vendas 2023',
      status: 'executando',
      progresso: 73,
      etapaAtual: 'Feature Engineering',
      dataInicio: '2025-10-17 08:15:00',
      tempoDecorrido: '00:45:23',
      tempoEstimado: '00:17:00',
      registrosProcessados: 89234,
      registrosTotal: 122000,
      etapas: [
        { id: 1, nome: 'Limpeza de Dados', status: 'concluido', duracao: '12min', registros: 122000 },
        { id: 2, nome: 'Normalização', status: 'concluido', duracao: '8min', registros: 120500 },
        { id: 3, nome: 'Feature Engineering', status: 'executando', duracao: '-', registros: 89234 },
        { id: 4, nome: 'Agregação', status: 'aguardando', duracao: '-', registros: 0 },
        { id: 5, nome: 'Validação Final', status: 'aguardando', duracao: '-', registros: 0 }
      ],
      transformacoes: [
        'Remoção de duplicatas',
        'Tratamento de valores nulos',
        'Normalização de datas',
        'Encoding de categorias',
        'Criação de features temporais'
      ]
    },
    {
      id: 2,
      nome: 'Pipeline Agregação Multi-Fontes',
      status: 'pausado',
      progresso: 45,
      etapaAtual: 'Agregação de Fontes',
      dataInicio: '2025-10-17 07:30:00',
      tempoDecorrido: '01:15:00',
      tempoEstimado: '01:30:00',
      registrosProcessados: 54700,
      registrosTotal: 95000,
      etapas: [
        { id: 1, nome: 'Limpeza de Dados', status: 'concluido', duracao: '15min', registros: 95000 },
        { id: 2, nome: 'Normalização', status: 'concluido', duracao: '10min', registros: 93200 },
        { id: 3, nome: 'Feature Engineering', status: 'concluido', duracao: '18min', registros: 93200 },
        { id: 4, nome: 'Agregação', status: 'pausado', duracao: '-', registros: 54700 },
        { id: 5, nome: 'Validação Final', status: 'aguardando', duracao: '-', registros: 0 }
      ],
      transformacoes: [
        'Merge de 3 fontes de dados',
        'Resolução de conflitos',
        'Agregação por cliente',
        'Cálculo de métricas RFM'
      ]
    },
    {
      id: 3,
      nome: 'Pipeline Customizado - Promo 2025',
      status: 'concluido',
      progresso: 100,
      etapaAtual: 'Finalizado',
      dataInicio: '2025-10-16 14:20:00',
      tempoDecorrido: '02:34:12',
      tempoEstimado: '00:00:00',
      registrosProcessados: 67500,
      registrosTotal: 67500,
      etapas: [
        { id: 1, nome: 'Limpeza de Dados', status: 'concluido', duracao: '10min', registros: 67500 },
        { id: 2, nome: 'Normalização', status: 'concluido', duracao: '7min', registros: 67100 },
        { id: 3, nome: 'Feature Engineering', status: 'concluido', duracao: '25min', registros: 67100 },
        { id: 4, nome: 'Transformações Custom', status: 'concluido', duracao: '45min', registros: 67100 },
        { id: 5, nome: 'Validação Final', status: 'concluido', duracao: '8min', registros: 67100 }
      ],
      transformacoes: [
        'Segmentação por categoria',
        'Cálculo de desconto efetivo',
        'Features de sazonalidade',
        'Análise de conversão'
      ]
    }
  ]);

  // Estado para transformações customizadas
  const [transformacoesCustomizadas] = useState([
    { id: 1, nome: 'Cálculo de RFM Score', tipo: 'Agregação', ativo: true, uso: 156 },
    { id: 2, nome: 'Normalização Min-Max', tipo: 'Normalização', ativo: true, uso: 342 },
    { id: 3, nome: 'Encoding One-Hot', tipo: 'Feature Engineering', ativo: true, uso: 289 },
    { id: 4, nome: 'Detecção de Outliers', tipo: 'Limpeza', ativo: true, uso: 124 },
    { id: 5, nome: 'Agregação por Período', tipo: 'Agregação', ativo: false, uso: 67 }
  ]);

  // Estado para monitoramento
  const [metricas] = useState({
    pipelinesAtivos: 2,
    taxaSucesso: 94.7,
    tempoMedioExecucao: '1h 23min',
    registrosProcessadosHoje: 342567,
    errosUltimas24h: 18,
    economiaRecursos: 23.4
  });

  // Estados do componente
  const [modalNovaTransformacao, setModalNovaTransformacao] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [pipelineSelecionado, setPipelineSelecionado] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Funções auxiliares
  const getStatusBadge = (status) => {
    const badges = {
      executando: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Executando', icon: Loader },
      pausado: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pausado', icon: Pause },
      concluido: { bg: 'bg-green-100', text: 'text-green-700', label: 'Concluído', icon: CheckCircle },
      aguardando: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Aguardando', icon: AlertCircle },
      erro: { bg: 'bg-red-100', text: 'text-red-700', label: 'Erro', icon: AlertCircle }
    };
    return badges[status] || badges.aguardando;
  };

  const getEtapaStatusIcon = (status) => {
    switch(status) {
      case 'concluido':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'executando':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'pausado':
        return <Pause className="w-5 h-5 text-yellow-600" />;
      case 'erro':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    }
  };

  // Handlers
  const handlePlayPause = (id) => {
    setPipelines(pipelines.map(p => {
      if (p.id === id) {
        if (p.status === 'executando') {
          return { ...p, status: 'pausado' };
        } else if (p.status === 'pausado') {
          return { ...p, status: 'executando' };
        }
      }
      return p;
    }));
  };

  const handleStop = (id) => {
    if (window.confirm('Deseja realmente parar este pipeline? O progresso será perdido.')) {
      setPipelines(pipelines.map(p => 
        p.id === id ? { ...p, status: 'aguardando', progresso: 0, registrosProcessados: 0 } : p
      ));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir este pipeline?')) {
      setPipelines(pipelines.filter(p => p.id !== id));
    }
  };

  const handleVerDetalhes = (pipeline) => {
    setPipelineSelecionado(pipeline);
    setModalDetalhes(true);
  };

  // Filtrar pipelines
  const pipelinesFiltrados = pipelines.filter(p => {
    if (filtroStatus === 'todos') return true;
    return p.status === filtroStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Processamento de Informações</h1>
            <p className="text-sm text-gray-600 mt-1">Pipeline de ETL e preparação de dados</p>
          </div>
          <button
            onClick={() => setModalNovaTransformacao(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium w-fit"
          >
            <Settings className="w-5 h-5" />
            Nova Transformação
          </button>
        </div>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Ativos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metricas.pipelinesAtivos}</p>
          <p className="text-xs text-gray-600 mt-1">Pipelines</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Sucesso</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metricas.taxaSucesso}%</p>
          <p className="text-xs text-gray-600 mt-1">Taxa</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Tempo</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{metricas.tempoMedioExecucao}</p>
          <p className="text-xs text-gray-600 mt-1">Média</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Hoje</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{metricas.registrosProcessadosHoje.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">Registros</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-gray-500">24h</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metricas.errosUltimas24h}</p>
          <p className="text-xs text-gray-600 mt-1">Erros</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-gray-500">Economia</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metricas.economiaRecursos}%</p>
          <p className="text-xs text-gray-600 mt-1">Recursos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filtroStatus === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({pipelines.length})
          </button>
          <button
            onClick={() => setFiltroStatus('executando')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filtroStatus === 'executando'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Executando ({pipelines.filter(p => p.status === 'executando').length})
          </button>
          <button
            onClick={() => setFiltroStatus('pausado')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filtroStatus === 'pausado'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pausado ({pipelines.filter(p => p.status === 'pausado').length})
          </button>
          <button
            onClick={() => setFiltroStatus('concluido')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filtroStatus === 'concluido'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Concluído ({pipelines.filter(p => p.status === 'concluido').length})
          </button>
        </div>
      </div>

      {/* Lista de Pipelines */}
      <div className="space-y-4 mb-6">
        {pipelinesFiltrados.map(pipeline => {
          const badge = getStatusBadge(pipeline.status);
          const IconStatus = badge.icon;

          return (
            <div key={pipeline.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Cpu className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-lg">{pipeline.nome}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                      <IconStatus className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Etapa:</span> {pipeline.etapaAtual}
                    </div>
                    <div>
                      <span className="font-medium">Início:</span> {pipeline.dataInicio}
                    </div>
                    <div>
                      <span className="font-medium">Decorrido:</span> {pipeline.tempoDecorrido}
                    </div>
                    <div>
                      <span className="font-medium">Estimado:</span> {pipeline.tempoEstimado}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {pipeline.status !== 'concluido' && (
                    <>
                      <button
                        onClick={() => handlePlayPause(pipeline.id)}
                        className={`p-2 rounded-lg transition ${
                          pipeline.status === 'executando'
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={pipeline.status === 'executando' ? 'Pausar' : 'Continuar'}
                      >
                        {pipeline.status === 'executando' ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleStop(pipeline.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Parar"
                      >
                        <Square className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleVerDetalhes(pipeline)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Ver Detalhes"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {pipeline.status === 'concluido' && (
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(pipeline.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progresso Geral */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progresso Geral</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600">{pipeline.progresso}%</span>
                    <span className="text-gray-500">
                      ({pipeline.registrosProcessados.toLocaleString()} / {pipeline.registrosTotal.toLocaleString()} registros)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      pipeline.status === 'executando' ? 'bg-blue-600' :
                      pipeline.status === 'pausado' ? 'bg-yellow-600' :
                      pipeline.status === 'concluido' ? 'bg-green-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${pipeline.progresso}%` }}
                  />
                </div>
              </div>

              {/* Etapas do Pipeline */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Etapas do Pipeline</h4>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {pipeline.etapas.map((etapa, idx) => (
                    <React.Fragment key={etapa.id}>
                      <div className="flex flex-col items-center min-w-[120px]">
                        <div className="flex items-center justify-center mb-2">
                          {getEtapaStatusIcon(etapa.status)}
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">{etapa.nome}</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {etapa.status === 'concluido' ? etapa.duracao : '-'}
                        </span>
                        {etapa.registros > 0 && (
                          <span className="text-xs text-gray-500">{etapa.registros.toLocaleString()} reg.</span>
                        )}
                      </div>
                      {idx < pipeline.etapas.length - 1 && (
                        <div className={`flex-1 h-1 min-w-[30px] ${
                          etapa.status === 'concluido' ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transformações Customizadas */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Transformações Customizadas Disponíveis
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Uso</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transformacoesCustomizadas.map(transformacao => (
                <tr key={transformacao.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{transformacao.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {transformacao.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {transformacao.ativo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <Pause className="w-3 h-3" />
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{transformacao.uso}x</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Editar">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {modalDetalhes && pipelineSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detalhes do Pipeline</h2>
                <button
                  onClick={() => setModalDetalhes(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informações Gerais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Nome do Pipeline</p>
                      <p className="font-semibold text-gray-900 mt-1">{pipelineSelecionado.nome}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-gray-900 mt-1 capitalize">{pipelineSelecionado.status}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Data de Início</p>
                      <p className="font-semibold text-gray-900 mt-1">{pipelineSelecionado.dataInicio}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Tempo Decorrido</p>
                      <p className="font-semibold text-gray-900 mt-1">{pipelineSelecionado.tempoDecorrido}</p>
                    </div>
                  </div>
                </div>

                {/* Transformações Aplicadas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Transformações Aplicadas</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {pipelineSelecionado.transformacoes.map((trans, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-blue-900">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          {trans}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Detalhamento das Etapas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Detalhamento das Etapas</h3>
                  <div className="space-y-3">
                    {pipelineSelecionado.etapas.map(etapa => (
                      <div key={etapa.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getEtapaStatusIcon(etapa.status)}
                            <span className="font-semibold text-gray-900">{etapa.nome}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            etapa.status === 'concluido' ? 'bg-green-100 text-green-700' :
                            etapa.status === 'executando' ? 'bg-blue-100 text-blue-700' :
                            etapa.status === 'pausado' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {etapa.status === 'concluido' ? 'Concluído' :
                             etapa.status === 'executando' ? 'Em Execução' :
                             etapa.status === 'pausado' ? 'Pausado' : 'Aguardando'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Duração:</span> {etapa.duracao}
                          </div>
                          <div>
                            <span className="font-medium">Registros:</span> {etapa.registros.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logs Recentes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Logs Recentes</h3>
                  <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                    <div className="space-y-1">
                      <p>[2025-10-17 08:45:23] INFO: Iniciando etapa de Feature Engineering</p>
                      <p>[2025-10-17 08:45:25] INFO: Carregando 122.000 registros</p>
                      <p>[2025-10-17 08:46:12] INFO: Aplicando transformação: Encoding One-Hot</p>
                      <p>[2025-10-17 08:47:34] INFO: Criando features temporais (dia_semana, mes, trimestre)</p>
                      <p>[2025-10-17 08:48:56] INFO: Calculando agregações por cliente</p>
                      <p>[2025-10-17 08:50:23] INFO: Processados 89.234 de 122.000 registros (73%)</p>
                      <p>[2025-10-17 08:51:45] INFO: Aplicando normalização Min-Max</p>
                      <p>[2025-10-17 08:52:10] WARNING: 156 registros com valores faltantes detectados</p>
                      <p>[2025-10-17 08:52:15] INFO: Aplicando estratégia de imputação (mediana)</p>
                      <p>[2025-10-17 08:53:00] INFO: Etapa em andamento... ETA: 17 minutos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setModalDetalhes(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Fechar
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exportar Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Transformação */}
      {modalNovaTransformacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Nova Transformação Customizada</h2>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Transformação *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cálculo de Lifetime Value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Transformação *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Selecione...</option>
                    <option value="limpeza">Limpeza de Dados</option>
                    <option value="normalizacao">Normalização</option>
                    <option value="feature">Feature Engineering</option>
                    <option value="agregacao">Agregação</option>
                    <option value="custom">Customizada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Descreva o que esta transformação faz..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Python (Função)
                  </label>
                  <textarea
                    rows="6"
                    placeholder="def transformacao(df):&#10;    # Seu código aqui&#10;    return df"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ativar"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="ativar" className="text-sm text-gray-700">
                    Ativar transformação imediatamente
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setModalNovaTransformacao(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Transformação criada com sucesso!');
                  setModalNovaTransformacao(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Criar Transformação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Informações sobre ETL */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Pipeline de ETL - Extract, Transform, Load
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-semibold mb-1">✓ Limpeza e Normalização</p>
            <ul className="space-y-1 ml-4">
              <li>• Remoção de duplicatas</li>
              <li>• Tratamento de valores nulos</li>
              <li>• Normalização de formatos</li>
              <li>• Detecção de outliers</li>
              <li>• Validação de integridade</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Feature Engineering</p>
            <ul className="space-y-1 ml-4">
              <li>• Criação de features temporais</li>
              <li>• Encoding de variáveis categóricas</li>
              <li>• Agregações estatísticas</li>
              <li>• Cálculo de métricas RFM</li>
              <li>• Features de interação</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Agregação Multi-Fontes</p>
            <ul className="space-y-1 ml-4">
              <li>• Merge de bases de dados</li>
              <li>• Resolução de conflitos</li>
              <li>• Deduplicação inteligente</li>
              <li>• Consolidação de histórico</li>
              <li>• Sincronização temporal</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Monitoramento</p>
            <ul className="space-y-1 ml-4">
              <li>• Logs detalhados em tempo real</li>
              <li>• Métricas de performance</li>
              <li>• Alertas de erro automáticos</li>
              <li>• Dashboard de status</li>
              <li>• Auditoria completa</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-semibold mb-2">🎯 Boas Práticas de Pipeline:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Idempotência:</strong> Pipelines podem ser executados múltiplas vezes sem efeitos colaterais</li>
            <li>• <strong>Rastreabilidade:</strong> Cada transformação é logada e auditável</li>
            <li>• <strong>Escalabilidade:</strong> Processamento otimizado para grandes volumes de dados</li>
            <li>• <strong>Modularidade:</strong> Transformações reutilizáveis em diferentes pipelines</li>
            <li>• <strong>Resiliência:</strong> Sistema de retry automático em caso de falhas temporárias</li>
          </ul>
        </div>
      </div>

      {/* Gráfico de Monitoramento (Placeholder) */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Monitoramento de Performance
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Taxa de Sucesso (7 dias)</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Segunda</span>
                <span>96.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '96.2%' }} />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>Terça</span>
                <span>94.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.8%' }} />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>Quarta</span>
                <span>97.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '97.1%' }} />
              </div>

              <div className="flex justify-between text-xs text-gray-600">
                <span>Quinta</span>
                <span>93.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '93.5%' }} />
              </div>

              <div className="flex justify-between text-xs text-gray-600">
                <span>Sexta</span>
                <span>94.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.7%' }} />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tempo Médio (horas)</span>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              {[
                { etapa: 'Limpeza', tempo: 0.5 },
                { etapa: 'Normalização', tempo: 0.3 },
                { etapa: 'Feature Eng.', tempo: 1.2 },
                { etapa: 'Agregação', tempo: 0.8 },
                { etapa: 'Validação', tempo: 0.2 }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{item.etapa}</span>
                    <span>{item.tempo}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.tempo / 1.5) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Registros Processados</span>
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">342.5K</p>
                <p className="text-xs text-gray-600 mt-1">Últimas 24 horas</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-lg font-bold text-blue-900">2.1M</p>
                  <p className="text-xs text-blue-600">Esta semana</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-lg font-bold text-purple-900">8.7M</p>
                  <p className="text-xs text-purple-600">Este mês</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessamentoInformacoes;