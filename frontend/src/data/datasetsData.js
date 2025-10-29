// datasetsData.js
// Dados compartilhados entre ImportacaoDadosHistoricos, TreinamentoModeloIA e ProcessamentoInformacoes

export const datasetsImportados = [
  {
    id: 1,
    nomeArquivo: 'vendas_2023_q1.csv',
    fonte: 'MySQL Produção',
    dataImportacao: '15/10/2023 14:23',
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
    },
    periodoInicio: '01/01/2023',
    periodoFim: '31/03/2023',
    categorias: ['Notebooks', 'Periféricos', 'Monitores', 'Áudio'],
    clientesUnicos: 15234,
    produtosUnicos: 2341,
    ticketMedio: 487.50
  },
  {
    id: 2,
    nomeArquivo: 'vendas_2023_q2.xlsx',
    fonte: 'Upload Manual',
    dataImportacao: '16/10/2023 09:15',
    totalRegistros: 52341,
    registrosValidos: 52100,
    registrosInvalidos: 241,
    status: 'concluido',
    progresso: 100,
    mapeamento: {
      id_venda: 'VendaID',
      data_venda: 'DataCompra',
      id_cliente: 'ClienteID',
      id_produto: 'ProdutoID',
      quantidade: 'Qtd',
      valor_total: 'ValorTotal'
    },
    periodoInicio: '01/04/2023',
    periodoFim: '30/06/2023',
    categorias: ['Notebooks', 'Monitores', 'Armazenamento', 'Áudio', 'Acessórios'],
    clientesUnicos: 17892,
    produtosUnicos: 2567,
    ticketMedio: 512.30
  },
  {
    id: 3,
    nomeArquivo: 'vendas_2023_q3.csv',
    fonte: 'PostgreSQL Analytics',
    dataImportacao: '18/10/2023 16:45',
    totalRegistros: 58967,
    registrosValidos: 58723,
    registrosInvalidos: 244,
    status: 'concluido',
    progresso: 100,
    mapeamento: {
      id_venda: 'sale_id',
      data_venda: 'sale_date',
      id_cliente: 'customer_id',
      id_produto: 'product_id',
      quantidade: 'quantity',
      valor_total: 'total_amount'
    },
    periodoInicio: '01/07/2023',
    periodoFim: '30/09/2023',
    categorias: ['Notebooks', 'Monitores', 'Periféricos', 'Ergonomia', 'Acessórios'],
    clientesUnicos: 19456,
    produtosUnicos: 2789,
    ticketMedio: 495.80
  },
  {
    id: 4,
    nomeArquivo: 'vendas_2023_q4.xlsx',
    fonte: 'MySQL Produção',
    dataImportacao: '20/11/2023 11:30',
    totalRegistros: 67234,
    registrosValidos: 66987,
    registrosInvalidos: 247,
    status: 'concluido',
    progresso: 100,
    mapeamento: {
      id_venda: 'sale_id',
      data_venda: 'sale_date',
      id_cliente: 'customer_id',
      id_produto: 'product_id',
      quantidade: 'quantity',
      valor_total: 'total_amount'
    },
    periodoInicio: '01/10/2023',
    periodoFim: '31/12/2023',
    categorias: ['Notebooks', 'Monitores', 'Periféricos', 'Áudio', 'Armazenamento', 'Acessórios'],
    clientesUnicos: 21234,
    produtosUnicos: 3102,
    ticketMedio: 542.60
  },
  {
    id: 5,
    nomeArquivo: 'clientes_master_2023.csv',
    fonte: 'PostgreSQL Analytics',
    dataImportacao: '25/11/2023 14:20',
    totalRegistros: 45789,
    registrosValidos: 45789,
    registrosInvalidos: 0,
    status: 'concluido',
    progresso: 100,
    mapeamento: {
      id_cliente: 'customer_id',
      nome: 'name',
      email: 'email',
      telefone: 'phone',
      data_cadastro: 'created_at',
      fidelidade: 'loyalty_tier'
    },
    periodoInicio: '01/01/2023',
    periodoFim: '31/12/2023',
    categorias: ['Cadastros'],
    clientesUnicos: 45789,
    produtosUnicos: 0,
    ticketMedio: 0
  },
  {
    id: 6,
    nomeArquivo: 'produtos_catalogo_2023.xlsx',
    fonte: 'Upload Manual',
    dataImportacao: '28/11/2023 10:15',
    totalRegistros: 8234,
    registrosValidos: 8234,
    registrosInvalidos: 0,
    status: 'concluido',
    progresso: 100,
    mapeamento: {
      id_produto: 'product_id',
      nome: 'product_name',
      categoria: 'category',
      preco: 'price',
      estoque: 'stock',
      descricao: 'description'
    },
    periodoInicio: '01/01/2023',
    periodoFim: '31/12/2023',
    categorias: ['Catálogo'],
    clientesUnicos: 0,
    produtosUnicos: 8234,
    ticketMedio: 0
  },
  {
    id: 7,
    nomeArquivo: 'interacoes_app_2023.csv',
    fonte: 'MongoDB App Vendedor',
    dataImportacao: '01/12/2023 09:00',
    totalRegistros: 156234,
    registrosValidos: 156234,
    registrosInvalidos: 0,
    status: 'concluido',
    progresso: 100,
    mapeamento: {
      id_interacao: 'interaction_id',
      id_vendedor: 'seller_id',
      id_cliente: 'customer_id',
      timestamp: 'timestamp',
      tipo_acao: 'action_type',
      produto_visualizado: 'viewed_product'
    },
    periodoInicio: '01/09/2023',
    periodoFim: '30/11/2023',
    categorias: ['Interações', 'App Vendedor'],
    clientesUnicos: 32145,
    produtosUnicos: 5678,
    ticketMedio: 0
  }
];

// Dataset consolidado para treinamento
export const datasetConsolidado = {
  id: 'consolidated_2023',
  nome: 'Dataset Consolidado 2023',
  descricao: 'Conjunto completo de dados para treinamento do modelo',
  dataConsolidacao: '05/12/2023',
  totalRegistros: 342567, // Soma de vendas + interações relevantes
  datasetsOriginarios: [1, 2, 3, 4, 7], // IDs dos datasets usados
  periodoInicio: '01/01/2023',
  periodoFim: '31/12/2023',
  clientesUnicos: 45789,
  produtosUnicos: 8234,
  transacoes: 224365,
  interacoes: 156234,
  categorias: ['Notebooks', 'Monitores', 'Periféricos', 'Áudio', 'Armazenamento', 'Acessórios', 'Ergonomia'],
  ticketMedio: 487.50,
  qualidadeDados: {
    completude: 98.7,
    consistencia: 99.2,
    acuracia: 97.5,
    validacao: 'Aprovado'
  }
};

// Estatísticas agregadas
export const estatisticasGerais = {
  totalImportacoes: datasetsImportados.length,
  totalRegistros: datasetsImportados.reduce((acc, d) => acc + d.totalRegistros, 0),
  totalRegistrosValidos: datasetsImportados.reduce((acc, d) => acc + d.registrosValidos, 0),
  totalRegistrosInvalidos: datasetsImportados.reduce((acc, d) => acc + d.registrosInvalidos, 0),
  taxaSucesso: ((datasetsImportados.reduce((acc, d) => acc + d.registrosValidos, 0) / 
                 datasetsImportados.reduce((acc, d) => acc + d.totalRegistros, 0)) * 100).toFixed(1),
  ultimaImportacao: datasetsImportados[datasetsImportados.length - 1].dataImportacao
};
