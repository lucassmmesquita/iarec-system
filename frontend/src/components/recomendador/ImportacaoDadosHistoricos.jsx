import React, { useState } from 'react';
import { Upload, Database, FileText, CheckCircle, XCircle, AlertCircle, Loader, PlayCircle, Trash2, Download, Eye, RefreshCw, CheckSquare, Settings } from 'lucide-react';

const ImportacaoDadosHistoricos = () => {
  // Estado para importações existentes
  const [importacoes, setImportacoes] = useState([
    {
      id: 1,
      nomeArquivo: 'vendas_2023_q1.csv',
      fonte: 'MySQL Produção',
      dataImportacao: '2025-10-15 14:23:00',
      totalRegistros: 45823,
      registrosValidos: 45621,
      registrosInvalidos: 202,
      status: 'concluido',
      progresso: 100,
      mapeamento: {
        id_venda: 'sale_id',
        data_venda: 'sale_date',
        id_cliente: 'customer_id',
        id_produto: 'product_id',
        quantidade: 'quantity',
        valor_total: 'total_amount'
      }
    },
    {
      id: 2,
      nomeArquivo: 'vendas_2023_q2.xlsx',
      fonte: 'Upload Manual',
      dataImportacao: '2025-10-16 09:15:00',
      totalRegistros: 52341,
      registrosValidos: 52100,
      registrosInvalidos: 241,
      status: 'processando',
      progresso: 67,
      mapeamento: {
        id_venda: 'VendaID',
        data_venda: 'DataCompra',
        id_cliente: 'ClienteID',
        id_produto: 'ProdutoID',
        quantidade: 'Qtd',
        valor_total: 'ValorTotal'
      }
    },
    {
      id: 3,
      nomeArquivo: 'vendas_2023_q3.csv',
      fonte: 'PostgreSQL Analytics',
      dataImportacao: '2025-10-17 08:30:00',
      totalRegistros: 0,
      registrosValidos: 0,
      registrosInvalidos: 0,
      status: 'aguardando',
      progresso: 0,
      mapeamento: null
    }
  ]);

  // Estado para formulário de nova importação
  const [modalAberto, setModalAberto] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(1); // 1: Upload, 2: Mapeamento, 3: Validação
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const [fonteSelecionada, setFonteSelecionada] = useState('upload');
  
  // Estado para mapeamento de campos
  const [camposPadrao] = useState([
    { id: 'id_venda', nome: 'ID da Venda', obrigatorio: true },
    { id: 'data_venda', nome: 'Data da Venda', obrigatorio: true },
    { id: 'id_cliente', nome: 'ID do Cliente', obrigatorio: true },
    { id: 'id_produto', nome: 'ID do Produto', obrigatorio: true },
    { id: 'quantidade', nome: 'Quantidade', obrigatorio: true },
    { id: 'valor_total', nome: 'Valor Total', obrigatorio: true },
    { id: 'desconto', nome: 'Desconto', obrigatorio: false },
    { id: 'vendedor', nome: 'Vendedor', obrigatorio: false }
  ]);

  const [camposArquivo] = useState([
    'sale_id', 'sale_date', 'customer_id', 'product_id', 'quantity', 
    'total_amount', 'discount', 'seller_name', 'store_id', 'payment_method'
  ]);

  const [mapeamento, setMapeamento] = useState({});
  
  // Estado para validação
  const [errosValidacao, setErrosValidacao] = useState([
    { linha: 145, campo: 'valor_total', erro: 'Valor negativo não permitido', valor: '-50.00' },
    { linha: 892, campo: 'data_venda', erro: 'Formato de data inválido', valor: '32/13/2023' },
    { linha: 1523, campo: 'id_cliente', erro: 'Cliente não encontrado no sistema', valor: 'CLI999999' }
  ]);

  // Estado para filtros
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');

  // Estado para detalhes
  const [importacaoDetalhes, setImportacaoDetalhes] = useState(null);

  // Fontes de dados disponíveis
  const fontesDisponiveis = [
    { id: 'upload', nome: 'Upload de Arquivo' },
    { id: 'mysql-prod', nome: 'MySQL Produção' },
    { id: 'postgres-analytics', nome: 'PostgreSQL Analytics' },
    { id: 'sqlserver-erp', nome: 'SQL Server ERP' },
    { id: 'api-rest', nome: 'API REST' }
  ];

  // Funções auxiliares
  const getStatusBadge = (status) => {
    const badges = {
      concluido: { bg: 'bg-green-100', text: 'text-green-700', label: 'Concluído', icon: CheckCircle },
      processando: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processando', icon: Loader },
      aguardando: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Aguardando', icon: AlertCircle },
      erro: { bg: 'bg-red-100', text: 'text-red-700', label: 'Erro', icon: XCircle }
    };
    return badges[status] || badges.aguardando;
  };

  // Handlers
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoSelecionado({
        nome: file.name,
        tamanho: (file.size / 1024 / 1024).toFixed(2), // MB
        tipo: file.type
      });
    }
  };

  const handleProximaEtapa = () => {
    if (etapaAtual === 1 && (arquivoSelecionado || fonteSelecionada !== 'upload')) {
      setEtapaAtual(2);
    } else if (etapaAtual === 2 && Object.keys(mapeamento).length >= 6) {
      setEtapaAtual(3);
    }
  };

  const handleIniciarImportacao = () => {
    const novaImportacao = {
      id: importacoes.length + 1,
      nomeArquivo: arquivoSelecionado?.nome || 'Importação_DB_' + new Date().getTime(),
      fonte: fontesDisponiveis.find(f => f.id === fonteSelecionada)?.nome || 'Upload Manual',
      dataImportacao: new Date().toLocaleString('pt-BR'),
      totalRegistros: Math.floor(Math.random() * 50000) + 10000,
      registrosValidos: 0,
      registrosInvalidos: 0,
      status: 'processando',
      progresso: 0,
      mapeamento: {...mapeamento}
    };

    setImportacoes([novaImportacao, ...importacoes]);
    setModalAberto(false);
    resetarFormulario();

    // Simular progresso
    let progresso = 0;
    const interval = setInterval(() => {
      progresso += Math.random() * 15;
      if (progresso >= 100) {
        progresso = 100;
        clearInterval(interval);
        setImportacoes(prev => prev.map(imp => 
          imp.id === novaImportacao.id 
            ? {
                ...imp,
                status: 'concluido',
                progresso: 100,
                registrosValidos: Math.floor(imp.totalRegistros * 0.98),
                registrosInvalidos: Math.floor(imp.totalRegistros * 0.02)
              }
            : imp
        ));
      } else {
        setImportacoes(prev => prev.map(imp => 
          imp.id === novaImportacao.id ? {...imp, progresso: Math.floor(progresso)} : imp
        ));
      }
    }, 800);
  };

  const resetarFormulario = () => {
    setEtapaAtual(1);
    setArquivoSelecionado(null);
    setFonteSelecionada('upload');
    setMapeamento({});
  };

  const handleExcluirImportacao = (id) => {
    if (window.confirm('Deseja realmente excluir esta importação?')) {
      setImportacoes(importacoes.filter(imp => imp.id !== id));
    }
  };

  const handleReprocessar = (id) => {
    setImportacoes(importacoes.map(imp => 
      imp.id === id ? {...imp, status: 'processando', progresso: 0} : imp
    ));
  };

  // Filtrar importações
  const importacoesFiltradas = importacoes.filter(imp => {
    const matchStatus = filtroStatus === 'todos' || imp.status === filtroStatus;
    const matchBusca = imp.nomeArquivo.toLowerCase().includes(busca.toLowerCase()) ||
                       imp.fonte.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  // Renderizar etapas do modal
  const renderEtapa = () => {
    switch(etapaAtual) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonte de Dados *
              </label>
              <select
                value={fonteSelecionada}
                onChange={(e) => setFonteSelecionada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {fontesDisponiveis.map(fonte => (
                  <option key={fonte.id} value={fonte.id}>{fonte.nome}</option>
                ))}
              </select>
            </div>

            {fonteSelecionada === 'upload' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload de Arquivo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    {arquivoSelecionado ? (
                      <div className="space-y-2">
                        <FileText className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="font-semibold text-gray-900">{arquivoSelecionado.nome}</p>
                        <p className="text-sm text-gray-600">{arquivoSelecionado.tamanho} MB</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setArquivoSelecionado(null);
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                        <p className="text-gray-600">Clique para fazer upload ou arraste o arquivo</p>
                        <p className="text-xs text-gray-500">CSV, XLS ou XLSX (máx. 50MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {fonteSelecionada !== 'upload' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Importação Direta do Banco de Dados</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Os dados serão importados diretamente da fonte: {fontesDisponiveis.find(f => f.id === fonteSelecionada)?.nome}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Mapeamento de Campos</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Associe os campos do arquivo aos campos do sistema. Campos marcados com * são obrigatórios.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3">
              {camposPadrao.map(campo => (
                <div key={campo.id} className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {campo.nome} {campo.obrigatorio && <span className="text-red-500">*</span>}
                    </label>
                  </div>
                  <select
                    value={mapeamento[campo.id] || ''}
                    onChange={(e) => setMapeamento({...mapeamento, [campo.id]: e.target.value})}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      campo.obrigatorio && !mapeamento[campo.id] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {camposArquivo.map(campoArq => (
                      <option key={campoArq} value={campoArq}>{campoArq}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <strong>Mapeados:</strong> {Object.keys(mapeamento).length} de {camposPadrao.filter(c => c.obrigatorio).length} obrigatórios
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckSquare className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Validação dos Dados</p>
                  <p className="text-sm text-green-700 mt-1">
                    Revise os erros encontrados antes de iniciar a importação. Registros com erro serão marcados para revisão manual.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total de Registros</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">52.341</p>
              </div>
              <div className="bg-white border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-600">Válidos</p>
                <p className="text-2xl font-bold text-green-700 mt-1">52.100</p>
              </div>
              <div className="bg-white border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">Com Erros</p>
                <p className="text-2xl font-bold text-red-700 mt-1">241</p>
              </div>
            </div>

            {errosValidacao.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Erros Encontrados (primeiros 3)</h4>
                <div className="space-y-2">
                  {errosValidacao.map((erro, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">
                            Linha {erro.linha} • Campo: {erro.campo}
                          </p>
                          <p className="text-sm text-red-700 mt-1">{erro.erro}</p>
                          <p className="text-xs text-red-600 mt-1 font-mono">Valor: "{erro.valor}"</p>
                        </div>
                        <XCircle className="w-5 h-5 text-red-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ Os registros com erro serão marcados e poderão ser corrigidos manualmente após a importação.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Importação de Dados Históricos</h1>
            <p className="text-sm text-gray-600 mt-1">Upload e processamento de dados de vendas anteriores</p>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium w-fit"
          >
            <Upload className="w-5 h-5" />
            Nova Importação
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Importações</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{importacoes.length}</p>
            </div>
            <Database className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Registros Processados</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {importacoes.reduce((acc, imp) => acc + imp.registrosValidos, 0).toLocaleString()}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Processamento</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {importacoes.filter(i => i.status === 'processando').length}
              </p>
            </div>
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Erros</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {importacoes.reduce((acc, imp) => acc + imp.registrosInvalidos, 0).toLocaleString()}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome do arquivo ou fonte..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroStatus('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroStatus === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroStatus('concluido')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroStatus === 'concluido'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Concluído
            </button>
            <button
              onClick={() => setFiltroStatus('processando')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroStatus === 'processando'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Processando
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Importações */}
      <div className="space-y-4">
        {importacoesFiltradas.map(importacao => {
          const badge = getStatusBadge(importacao.status);
          const IconStatus = badge.icon;

          return (
            <div key={importacao.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-lg">{importacao.nomeArquivo}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                      <IconStatus className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                    <div>
                      <span className="font-medium">Fonte:</span> {importacao.fonte}
                    </div>
                    <div>
                      <span className="font-medium">Data:</span> {importacao.dataImportacao}
                    </div>
                    <div>
                      <span className="font-medium">Registros:</span> {importacao.totalRegistros.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Válidos:</span>{' '}
                      <span className="text-green-600 font-semibold">{importacao.registrosValidos.toLocaleString()}</span>
                      {importacao.registrosInvalidos > 0 && (
                        <span className="text-red-600 font-semibold ml-2">
                          ({importacao.registrosInvalidos} erros)
                        </span>
                      )}
                    </div>
                  </div>

                  {importacao.status === 'processando' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-semibold text-blue-600">{importacao.progresso}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${importacao.progresso}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setImportacaoDetalhes(importacao)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Ver Detalhes"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {importacao.status === 'concluido' && (
                    <>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReprocessar(importacao.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                        title="Reprocessar"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleExcluirImportacao(importacao.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Nova Importação */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Nova Importação de Dados</h2>
              
              {/* Indicador de Etapas */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3].map(etapa => (
                  <React.Fragment key={etapa}>
                    <div className={`flex items-center gap-2 ${etapa <= etapaAtual ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        etapa < etapaAtual ? 'bg-green-500 text-white' :
                        etapa === etapaAtual ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {etapa < etapaAtual ? <CheckCircle className="w-5 h-5" /> : etapa}
                      </div>
                      <span className="text-sm font-medium">
                        {etapa === 1 && 'Upload'}
                        {etapa === 2 && 'Mapeamento'}
                        {etapa === 3 && 'Validação'}
                      </span>
                    </div>
                    {etapa < 3 && (
                      <div className={`flex-1 h-1 ${etapa < etapaAtual ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {renderEtapa()}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => {
                  if (etapaAtual > 1) {
                    setEtapaAtual(etapaAtual - 1);
                  } else {
                    setModalAberto(false);
                    resetarFormulario();
                  }
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                {etapaAtual === 1 ? 'Cancelar' : 'Voltar'}
              </button>

              <button
                onClick={() => {
                  if (etapaAtual < 3) {
                    handleProximaEtapa();
                  } else {
                    handleIniciarImportacao();
                  }
                }}
                disabled={
                  (etapaAtual === 1 && fonteSelecionada === 'upload' && !arquivoSelecionado) ||
                  (etapaAtual === 2 && Object.keys(mapeamento).length < 6)
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {etapaAtual === 3 ? (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Iniciar Importação
                  </>
                ) : (
                  'Próxima Etapa'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {importacaoDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detalhes da Importação</h2>
                <button
                  onClick={() => setImportacaoDetalhes(null)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Informações Gerais */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informações Gerais</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Nome do Arquivo</p>
                      <p className="font-semibold text-gray-900 mt-1">{importacaoDetalhes.nomeArquivo}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Fonte</p>
                      <p className="font-semibold text-gray-900 mt-1">{importacaoDetalhes.fonte}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Data da Importação</p>
                      <p className="font-semibold text-gray-900 mt-1">{importacaoDetalhes.dataImportacao}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Status</p>
                      <p className="font-semibold text-gray-900 mt-1 capitalize">{importacaoDetalhes.status}</p>
                    </div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Estatísticas de Processamento</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600">Total de Registros</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">
                        {importacaoDetalhes.totalRegistros.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-600">Registros Válidos</p>
                      <p className="text-3xl font-bold text-green-900 mt-2">
                        {importacaoDetalhes.registrosValidos.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {((importacaoDetalhes.registrosValidos / importacaoDetalhes.totalRegistros) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-red-600">Registros Inválidos</p>
                      <p className="text-3xl font-bold text-red-900 mt-2">
                        {importacaoDetalhes.registrosInvalidos.toLocaleString()}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {((importacaoDetalhes.registrosInvalidos / importacaoDetalhes.totalRegistros) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mapeamento de Campos */}
                {importacaoDetalhes.mapeamento && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Mapeamento de Campos</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(importacaoDetalhes.mapeamento).map(([campoSistema, campoArquivo]) => (
                          <div key={campoSistema} className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{campoSistema}:</span>
                            <span className="text-gray-600 font-mono text-xs bg-white px-2 py-1 rounded">
                              {campoArquivo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Amostra de Dados */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amostra de Dados Importados</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">ID Venda</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Data</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Cliente</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Produto</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { id: 'V001234', data: '15/10/2025', cliente: 'CLI-4567', produto: 'PRD-8901', valor: 'R$ 1.250,00' },
                          { id: 'V001235', data: '15/10/2025', cliente: 'CLI-4568', produto: 'PRD-8902', valor: 'R$ 890,00' },
                          { id: 'V001236', data: '15/10/2025', cliente: 'CLI-4569', produto: 'PRD-8903', valor: 'R$ 2.340,00' }
                        ].map((registro, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-900">{registro.id}</td>
                            <td className="px-4 py-2 text-gray-600">{registro.data}</td>
                            <td className="px-4 py-2 text-gray-600">{registro.cliente}</td>
                            <td className="px-4 py-2 text-gray-600">{registro.produto}</td>
                            <td className="px-4 py-2 text-gray-900 font-semibold">{registro.valor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setImportacaoDetalhes(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Informações Úteis */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Informações sobre Importação de Dados
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-semibold mb-1">✓ Formatos Suportados</p>
            <ul className="space-y-1 ml-4">
              <li>• CSV (separado por vírgula ou ponto-e-vírgula)</li>
              <li>• Excel (.xlsx, .xls)</li>
              <li>• Conexão direta com bancos de dados</li>
              <li>• APIs REST com autenticação</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Processamento</p>
            <ul className="space-y-1 ml-4">
              <li>• Validação automática de dados</li>
              <li>• Detecção de duplicatas</li>
              <li>• Normalização de formatos</li>
              <li>• Processamento em background</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Mapeamento Inteligente</p>
            <ul className="space-y-1 ml-4">
              <li>• Sugestão automática de campos</li>
              <li>• Transformações customizadas</li>
              <li>• Validação de tipos de dados</li>
              <li>• Campos obrigatórios e opcionais</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Segurança</p>
            <ul className="space-y-1 ml-4">
              <li>• Criptografia de dados sensíveis</li>
              <li>• Auditoria completa de importações</li>
              <li>• Rollback em caso de erro</li>
              <li>• Controle de acesso por usuário</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportacaoDadosHistoricos;