import React, { useState } from 'react';
import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  ShoppingCart,
  Clock,
  TrendingUp,
  Eye,
  Plus,
  Printer,
  MessageSquare,
  Star,
  Zap,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const VendedorConsulta = () => {
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [recomendacoes, setRecomendacoes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [modalCliente, setModalCliente] = useState(false);
  const [orcamento, setOrcamento] = useState([]);
  const [showOrcamento, setShowOrcamento] = useState(false);

  // Indicadores do Termo de Encerramento
  const indicadoresIA = {
    precisao: 82,        // Meta: ≥80% ✓
    tempoResposta: 1.2,  // Meta: ≤2s ✓
    taxaAceitacao: 65,   // Meta: ≥60% ✓
    cacheHitRate: 68     // Cache Redis
  };

  // Clientes mockados
  const clientesMock = [
    {
      id: 1,
      nome: 'João Silva Santos',
      email: 'joao.silva@email.com',
      telefone: '(85) 98765-4321',
      cpf: '123.456.789-00',
      endereco: 'Fortaleza, CE',
      fidelidade: 'Gold',
      comprasAnteriores: 15,
      ticketMedio: 487.50,
      ultimaCompra: '10/12/2023',
      categoriasFavoritas: ['Notebooks', 'Periféricos']
    },
    {
      id: 2,
      nome: 'Maria Oliveira Costa',
      email: 'maria.oliveira@email.com',
      telefone: '(85) 99876-5432',
      cpf: '987.654.321-00',
      endereco: 'Fortaleza, CE',
      fidelidade: 'Platinum',
      comprasAnteriores: 28,
      ticketMedio: 625.80,
      ultimaCompra: '05/12/2023',
      categoriasFavoritas: ['Monitores', 'Áudio']
    },
    {
      id: 3,
      nome: 'Carlos Eduardo Mendes',
      email: 'carlos.mendes@email.com',
      telefone: '(85) 97654-3210',
      cpf: '456.789.123-00',
      endereco: 'Fortaleza, CE',
      fidelidade: 'Silver',
      comprasAnteriores: 8,
      ticketMedio: 312.40,
      ultimaCompra: '18/11/2023',
      categoriasFavoritas: ['Acessórios', 'Armazenamento']
    }
  ];

  // Produtos mockados para recomendação
  const produtosMock = [
    { id: 1, nome: 'Notebook Dell Inspiron 15 i5 11ª Gen 8GB 256GB SSD', preco: 3299.99, categoria: 'Notebooks', estoque: 12, desconto: 0 },
    { id: 2, nome: 'Monitor LG 27" UltraWide Full HD IPS 75Hz', preco: 1799.99, categoria: 'Monitores', estoque: 8, desconto: 10 },
    { id: 3, nome: 'Mouse Logitech MX Master 3 Wireless', preco: 449.99, categoria: 'Periféricos', estoque: 25, desconto: 0 },
    { id: 4, nome: 'Teclado Mecânico Redragon K552 RGB', preco: 279.99, categoria: 'Periféricos', estoque: 18, desconto: 15 },
    { id: 5, nome: 'Webcam Logitech C920 Full HD 1080p', preco: 419.99, categoria: 'Áudio', estoque: 15, desconto: 0 },
    { id: 6, nome: 'SSD Kingston NV2 500GB M.2 NVMe', preco: 289.99, categoria: 'Armazenamento', estoque: 30, desconto: 0 },
    { id: 7, nome: 'Headset HyperX Cloud II Gaming 7.1', preco: 549.99, categoria: 'Áudio', estoque: 10, desconto: 20 },
    { id: 8, nome: 'Hub USB-C 7 em 1 com HDMI e Ethernet', preco: 159.99, categoria: 'Acessórios', estoque: 22, desconto: 0 },
    { id: 9, nome: 'Suporte Ergonômico para Monitor Articulado', preco: 189.99, categoria: 'Ergonomia', estoque: 14, desconto: 0 },
    { id: 10, nome: 'Mousepad Gamer Grande 90x40cm', preco: 79.99, categoria: 'Acessórios', estoque: 35, desconto: 0 },
    { id: 11, nome: 'Notebook Lenovo IdeaPad 3 i7 16GB 512GB', preco: 4199.99, categoria: 'Notebooks', estoque: 6, desconto: 0 },
    { id: 12, nome: 'Monitor Samsung 24" Curvo Full HD 75Hz', preco: 899.99, categoria: 'Monitores', estoque: 11, desconto: 0 }
  ];

  // Função para gerar recomendações baseadas no perfil do cliente (simulando IA com 82% de precisão)
  const gerarRecomendacoes = (clienteId) => {
    const cliente = clientesMock.find(c => c.id === clienteId);
    
    // Simula o algoritmo de IA considerando categorias favoritas e histórico
    let produtosFiltrados = [...produtosMock];
    
    // Prioriza categorias favoritas do cliente
    if (cliente.categoriasFavoritas && cliente.categoriasFavoritas.length > 0) {
      produtosFiltrados = produtosFiltrados.sort((a, b) => {
        const aFavorito = cliente.categoriasFavoritas.includes(a.categoria);
        const bFavorito = cliente.categoriasFavoritas.includes(b.categoria);
        if (aFavorito && !bFavorito) return -1;
        if (!aFavorito && bFavorito) return 1;
        return 0;
      });
    }

    // Adiciona variação aleatória para simular diferentes recomendações
    produtosFiltrados = produtosFiltrados
      .sort(() => Math.random() - 0.5)
      .slice(0, 6 + Math.floor(Math.random() * 3)); // Entre 6 e 8 produtos

    // Calcula confiança baseada na precisão de 82% do modelo
    const confianciaBase = 82; // Precisão alcançada no projeto
    
    return produtosFiltrados.map((produto, index) => {
      const variacaoConfianca = (Math.random() * 15) - 7.5; // Variação de ±7.5%
      const confianca = Math.min(95, Math.max(70, confianciaBase + variacaoConfianca));
      
      return {
        ...produto,
        posicao: index + 1,
        confianca: confianca.toFixed(1),
        motivo: gerarMotivo(produto.categoria, cliente),
        score: (100 - index * 5) + Math.random() * 10
      };
    }).sort((a, b) => b.score - a.score);
  };

  const gerarMotivo = (categoria, cliente) => {
    const motivos = {
      'Notebooks': [
        `Cliente ${cliente.fidelidade} com histórico em notebooks - Alta probabilidade de upgrade`,
        'Baseado nas últimas 3 compras em tecnologia do cliente',
        'Tendência de renovação de equipamento a cada 2 anos',
        'Perfil de uso profissional intensivo identificado'
      ],
      'Monitores': [
        'Setup multi-monitor aumenta produtividade em 42%',
        'Clientes com notebook costumam adquirir monitor externo',
        'Tendência crescente de trabalho híbrido',
        'Compatível com equipamentos já adquiridos'
      ],
      'Periféricos': [
        'Complemento natural para setup de trabalho/gaming',
        'Alto índice de satisfação nesta categoria',
        'Acessório essencial para produtividade',
        'Frequentemente adquirido junto com computadores'
      ],
      'Áudio': [
        'Essencial para reuniões online e entretenimento',
        'Qualidade de áudio valorizada pelo perfil do cliente',
        'Combo popular com computadores',
        'Investimento em conforto sonoro'
      ],
      'Acessórios': [
        'Complemento de alto valor agregado',
        'Melhora organização e produtividade',
        'Preço acessível com alta utilidade',
        'Facilita conexão de múltiplos dispositivos'
      ],
      'Armazenamento': [
        'Upgrade de performance comprovado',
        'Necessidade identificada no perfil de uso',
        'Solução para limitação de espaço',
        'ROI imediato em velocidade'
      ],
      'Ergonomia': [
        'Saúde e conforto são prioridades',
        'Investimento em bem-estar no trabalho',
        'Reduz fadiga em longas jornadas',
        'Recomendado por especialistas'
      ]
    };
    
    const motivosCategoria = motivos[categoria] || motivos['Acessórios'];
    return motivosCategoria[Math.floor(Math.random() * motivosCategoria.length)];
  };

  const clientesFiltrados = clientesMock.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.email.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpf.includes(busca)
  );

  const handleSelecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setModalCliente(false);
    setRecomendacoes(null);
  };

  const handleGerarRecomendacoes = () => {
    if (!clienteSelecionado) return;

    setLoading(true);
    
    // Simula o tempo de resposta alcançado: 1.2s (Meta: ≤2s)
    const tempoResposta = 1.2 + (Math.random() * 0.3); // Entre 1.2s e 1.5s
    
    setTimeout(() => {
      const produtosRecomendados = gerarRecomendacoes(clienteSelecionado.id);
      
      setRecomendacoes({
        produtos: produtosRecomendados,
        timestamp: new Date().toLocaleString('pt-BR'),
        versaoModelo: 'CF v3.2',
        tempoProcessamento: `${tempoResposta.toFixed(2)}s`,
        precisaoModelo: indicadoresIA.precisao,
        cacheStatus: Math.random() > 0.32 ? 'HIT' : 'MISS' // 68% cache hit rate
      });
      setLoading(false);
    }, tempoResposta * 1000);
  };

  const handleAdicionarAoOrcamento = (produto) => {
    const produtoExistente = orcamento.find(p => p.id === produto.id);
    
    if (produtoExistente) {
      alert('⚠️ Este produto já está no orçamento!');
      return;
    }
    
    setOrcamento(prev => [...prev, { ...produto, quantidade: 1 }]);
    alert(`✅ ${produto.nome} adicionado ao orçamento!`);
  };

  const handleRemoverDoOrcamento = (produtoId) => {
    setOrcamento(prev => prev.filter(p => p.id !== produtoId));
  };

  const calcularTotalOrcamento = () => {
    return orcamento.reduce((total, item) => {
      const precoComDesconto = item.preco * (1 - item.desconto / 100);
      return total + (precoComDesconto * item.quantidade);
    }, 0);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Consulta de Recomendações 🎯
        </h1>
        <p className="text-gray-600">
          Busque um cliente e gere recomendações personalizadas com IA em {indicadoresIA.tempoResposta}s
        </p>
      </div>

      {/* Indicadores IA - Destaque */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          ✨ Indicadores de Desempenho da IA 
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Precisão do Modelo</p>
            <p className="text-3xl font-bold text-green-600">{indicadoresIA.precisao}%</p>
            <p className="text-xs text-gray-500 mt-1">Meta: ≥80% ✓</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Tempo de Resposta</p>
            <p className="text-3xl font-bold text-blue-600">{indicadoresIA.tempoResposta}s</p>
            <p className="text-xs text-gray-500 mt-1">Meta: ≤2s ✓</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Taxa de Aceitação</p>
            <p className="text-3xl font-bold text-purple-600">{indicadoresIA.taxaAceitacao}%</p>
            <p className="text-xs text-gray-500 mt-1">Meta: ≥60% ✓</p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">Cache Hit Rate</p>
            <p className="text-3xl font-bold text-orange-600">{indicadoresIA.cacheHitRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Redis Cache</p>
          </div>
        </div>
      </div>

      {/* Busca de Cliente */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Selecione o Cliente</h3>
        
        {!clienteSelecionado ? (
          <button
            onClick={() => setModalCliente(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Search className="w-5 h-5" />
            Buscar Cliente
          </button>
        ) : (
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{clienteSelecionado.nome}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {clienteSelecionado.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {clienteSelecionado.telefone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      clienteSelecionado.fidelidade === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                      clienteSelecionado.fidelidade === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <Award className="w-3 h-3 inline mr-1" />
                      {clienteSelecionado.fidelidade}
                    </span>
                    <span className="text-xs text-gray-600">
                      {clienteSelecionado.comprasAnteriores} compras | 
                      Ticket médio: R$ {clienteSelecionado.ticketMedio.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setClienteSelecionado(null);
                  setRecomendacoes(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Trocar Cliente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gerar Recomendações */}
      {clienteSelecionado && !recomendacoes && !loading && (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Gerar Recomendações com IA</h3>
          <button
            onClick={handleGerarRecomendacoes}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-medium"
          >
            <Zap className="w-5 h-5" />
            Processar com IA (Tempo: ~{indicadoresIA.tempoResposta}s)
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Modelo: Collaborative Filtering v3.2 | Precisão: {indicadoresIA.precisao}%
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Processando Recomendações com IA...
          </h3>
          <p className="text-sm text-gray-600">
            Analisando histórico do cliente, preferências e tendências de mercado
          </p>
          <div className="mt-4 space-y-2 text-xs text-gray-500">
            <p>⚡ Algoritmo: Collaborative Filtering v3.2</p>
            <p>🎯 Precisão esperada: {indicadoresIA.precisao}%</p>
            <p>⏱️ Tempo estimado: ~{indicadoresIA.tempoResposta}s</p>
          </div>
        </div>
      )}

      {/* Recomendações */}
      {recomendacoes && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Recomendações Geradas ({recomendacoes.produtos.length} produtos)
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Processado em: <strong>{recomendacoes.tempoProcessamento}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Precisão: <strong>{recomendacoes.precisaoModelo}%</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    {recomendacoes.cacheStatus === 'HIT' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    )}
                    Cache: <strong>{recomendacoes.cacheStatus}</strong>
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOrcamento(!showOrcamento)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Orçamento ({orcamento.length})
                </button>
              </div>
            </div>

            {/* Lista de Produtos Recomendados */}
            <div className="space-y-4">
              {recomendacoes.produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg">
                          {produto.posicao}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{produto.nome}</h4>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                              {produto.categoria}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Target className="w-4 h-4" />
                              Confiança: <strong className="text-purple-600">{produto.confianca}%</strong>
                            </span>
                            <span className="text-gray-600">
                              Estoque: <strong>{produto.estoque}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-purple-900">
                          <strong>💡 Por que recomendar:</strong> {produto.motivo}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          {produto.desconto > 0 && (
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold mt-1">
                              {produto.desconto}% OFF
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAdicionarAoOrcamento(produto)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          <Plus className="w-5 h-5" />
                          Adicionar ao Orçamento
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Orçamento */}
            {showOrcamento && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-green-600 to-blue-600">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Orçamento ({orcamento.length} itens)</h2>
                      <button
                        onClick={() => setShowOrcamento(false)}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"
                      >
                        <span className="text-2xl">&times;</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {orcamento.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhum produto no orçamento</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orcamento.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{item.nome}</p>
                              <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                            </div>
                            <div className="text-right mr-4">
                              <p className="text-lg font-bold text-gray-900">
                                R$ {(item.preco * (1 - item.desconto / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoverDoOrcamento(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <span className="text-xl">&times;</span>
                            </button>
                          </div>
                        ))}

                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span className="text-green-600">
                              R$ {calcularTotalOrcamento().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {orcamento.length > 0 && (
                    <div className="p-6 border-t bg-gray-50 flex gap-3">
                      <button
                        onClick={() => {
                          alert('🖨️ Funcionalidade de impressão em desenvolvimento');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                      >
                        <Printer className="w-5 h-5" />
                        Imprimir
                      </button>
                      <button
                        onClick={() => {
                          alert('✅ Orçamento enviado! Redirecionando para feedback...');
                          setShowOrcamento(false);
                        }}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Enviar Orçamento
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Busca de Cliente */}
      {modalCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Buscar Cliente</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou CPF..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {clientesFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum cliente encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientesFiltrados.map((cliente) => (
                    <div
                      key={cliente.id}
                      onClick={() => handleSelecionarCliente(cliente)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900">{cliente.nome}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span>{cliente.email}</span>
                            <span>•</span>
                            <span>{cliente.telefone}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cliente.fidelidade === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                          cliente.fidelidade === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {cliente.fidelidade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setModalCliente(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Informações */}
      {!clienteSelecionado && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Search className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Como funciona o Sistema de Recomendação com IA?
          </h3>
          <div className="max-w-2xl mx-auto space-y-2 text-sm text-blue-800">
            <p>1️⃣ <strong>Busque o cliente</strong> usando nome, e-mail ou CPF</p>
            <p>2️⃣ <strong>Clique em "Processar com IA"</strong> para gerar recomendações em ~{indicadoresIA.tempoResposta}s</p>
            <p>3️⃣ <strong>Visualize 6-8 produtos</strong> ranqueados por relevância com {indicadoresIA.precisao}% de precisão</p>
            <p>4️⃣ <strong>Adicione ao orçamento</strong> os produtos de interesse</p>
            <p>5️⃣ <strong>Imprima a lista</strong> ou <strong>vá para Feedback</strong> após o atendimento</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorConsulta;