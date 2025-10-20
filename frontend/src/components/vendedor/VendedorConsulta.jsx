import React, { useState } from 'react';
import {
  Search,
  User,
  ShoppingBag,
  Star,
  Clock,
  DollarSign,
  Package,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowRight,
  Info,
  Download,
  X
} from 'lucide-react';

const VendedorConsulta = () => {
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [recomendacoes, setRecomendacoes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [orcamento, setOrcamento] = useState([]);
  const [showOrcamento, setShowOrcamento] = useState(false);
  const [feedbackPreparado, setFeedbackPreparado] = useState(null);

  // Base de clientes mockada
  const clientesMock = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(85) 98765-4321',
      cpf: '123.456.789-00',
      ultimaCompra: '15/09/2025',
      totalCompras: 15,
      ticketMedio: 450.00,
      categoriaPreferida: 'Informática',
      fidelidade: 'Ouro'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '(85) 99876-5432',
      cpf: '234.567.890-11',
      ultimaCompra: '02/10/2025',
      totalCompras: 8,
      ticketMedio: 380.00,
      categoriaPreferida: 'Periféricos',
      fidelidade: 'Prata'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      telefone: '(85) 97654-3210',
      cpf: '345.678.901-22',
      ultimaCompra: '18/10/2025',
      totalCompras: 23,
      ticketMedio: 620.00,
      categoriaPreferida: 'Hardware',
      fidelidade: 'Platina'
    },
    {
      id: 4,
      nome: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      telefone: '(85) 96543-2109',
      cpf: '456.789.012-33',
      ultimaCompra: '05/10/2025',
      totalCompras: 5,
      ticketMedio: 290.00,
      categoriaPreferida: 'Acessórios',
      fidelidade: 'Bronze'
    }
  ];

  // Base ampliada de produtos
  const todosProdutos = [
    { nome: 'Notebook Dell Inspiron 15', preco: 3200.00, categoria: 'Notebooks', imagem: '💻' },
    { nome: 'Notebook Lenovo IdeaPad', preco: 2800.00, categoria: 'Notebooks', imagem: '💻' },
    { nome: 'Notebook HP Pavilion', preco: 3500.00, categoria: 'Notebooks', imagem: '💻' },
    { nome: 'Notebook Acer Aspire', preco: 2600.00, categoria: 'Notebooks', imagem: '💻' },
    { nome: 'MacBook Air M2', preco: 8500.00, categoria: 'Notebooks', imagem: '💻' },
    { nome: 'Mouse Logitech MX Master 3', preco: 450.00, categoria: 'Periféricos', imagem: '🖱️' },
    { nome: 'Mouse Razer DeathAdder', preco: 280.00, categoria: 'Periféricos', imagem: '🖱️' },
    { nome: 'Teclado Mecânico Redragon K552', preco: 280.00, categoria: 'Periféricos', imagem: '⌨️' },
    { nome: 'Teclado Logitech MX Keys', preco: 620.00, categoria: 'Periféricos', imagem: '⌨️' },
    { nome: 'Teclado Corsair K95', preco: 890.00, categoria: 'Periféricos', imagem: '⌨️' },
    { nome: 'SSD Kingston 1TB NVMe', preco: 380.00, categoria: 'Hardware', imagem: '💾' },
    { nome: 'SSD Samsung 970 EVO 500GB', preco: 420.00, categoria: 'Hardware', imagem: '💾' },
    { nome: 'HD Seagate 2TB', preco: 320.00, categoria: 'Hardware', imagem: '💾' },
    { nome: 'Memória RAM 16GB DDR4', preco: 350.00, categoria: 'Hardware', imagem: '🧩' },
    { nome: 'Memória RAM 32GB DDR4', preco: 680.00, categoria: 'Hardware', imagem: '🧩' },
    { nome: 'Placa de Vídeo RTX 4060', preco: 2400.00, categoria: 'Hardware', imagem: '🎮' },
    { nome: 'Placa de Vídeo GTX 1660', preco: 1800.00, categoria: 'Hardware', imagem: '🎮' },
    { nome: 'Processador AMD Ryzen 7 5800X', preco: 1600.00, categoria: 'Hardware', imagem: '⚙️' },
    { nome: 'Processador Intel i7 12700K', preco: 2200.00, categoria: 'Hardware', imagem: '⚙️' },
    { nome: 'Monitor LG 27" 4K', preco: 1800.00, categoria: 'Monitores', imagem: '🖥️' },
    { nome: 'Monitor Samsung 24" Full HD', preco: 890.00, categoria: 'Monitores', imagem: '🖥️' },
    { nome: 'Monitor Dell UltraSharp 32"', preco: 2800.00, categoria: 'Monitores', imagem: '🖥️' },
    { nome: 'Headset HyperX Cloud II', preco: 320.00, categoria: 'Áudio', imagem: '🎧' },
    { nome: 'Headset Logitech G Pro X', preco: 680.00, categoria: 'Áudio', imagem: '🎧' },
    { nome: 'Caixa de Som JBL Flip 5', preco: 580.00, categoria: 'Áudio', imagem: '🔊' },
    { nome: 'Webcam Logitech C920', preco: 420.00, categoria: 'Acessórios', imagem: '📷' },
    { nome: 'Webcam Razer Kiyo', preco: 680.00, categoria: 'Acessórios', imagem: '📷' },
    { nome: 'Mouse Pad Gamer RGB', preco: 85.00, categoria: 'Acessórios', imagem: '🎨' },
    { nome: 'Hub USB-C 7 Portas', preco: 120.00, categoria: 'Acessórios', imagem: '🔌' },
    { nome: 'Suporte para Notebook', preco: 95.00, categoria: 'Ergonomia', imagem: '📐' },
    { nome: 'Cadeira Gamer DXRacer', preco: 1800.00, categoria: 'Ergonomia', imagem: '🪑' },
  ];

  const gerarRecomendacoes = (clienteId) => {
    const numProdutos = Math.floor(Math.random() * 4) + 5;
    const produtosEmbaralhados = [...todosProdutos].sort(() => Math.random() - 0.5);
    const produtosSelecionados = produtosEmbaralhados.slice(0, numProdutos);
    
    return produtosSelecionados.map((produto, index) => ({
      id: Date.now() + index,
      nome: produto.nome,
      preco: produto.preco,
      desconto: Math.floor(Math.random() * 3) * 5,
      categoria: produto.categoria,
      imagem: produto.imagem,
      confianca: Math.floor(Math.random() * 25) + 70,
      ranking: index + 1,
      motivo: gerarMotivo(produto.categoria, clienteId),
      estoque: Math.floor(Math.random() * 50) + 10
    }));
  };

  const gerarMotivo = (categoria, clienteId) => {
    const motivos = {
      'Notebooks': [
        'Cliente tem histórico de compra de notebooks',
        'Baseado no perfil de uso profissional',
        'Tendência de upgrade a cada 2 anos',
        'Categoria mais comprada pelo cliente'
      ],
      'Periféricos': [
        'Frequentemente comprado junto com computadores',
        'Cliente demonstrou interesse em ergonomia',
        'Upgrade recomendado para melhor produtividade',
        'Complemento ideal para setup atual'
      ],
      'Hardware': [
        'Upgrade popular entre compradores de notebooks',
        'Performance ideal para perfil do cliente',
        'Melhoria significativa em velocidade',
        'Compatível com equipamentos atuais'
      ],
      'Monitores': [
        'Segundo monitor aumenta produtividade em 42%',
        'Tendência de setup multi-monitor',
        'Ideal para trabalho híbrido',
        'Qualidade premium para uso profissional'
      ],
      'Áudio': [
        'Essencial para reuniões online',
        'Qualidade de som valorizada pelo cliente',
        'Combo popular com computadores',
        'Conforto para longas jornadas'
      ],
      'Acessórios': [
        'Complemento essencial para setup',
        'Melhora organização e produtividade',
        'Preço acessível com alto valor agregado',
        'Facilita conexão de múltiplos dispositivos'
      ],
      'Ergonomia': [
        'Saúde e conforto são prioridades',
        'Investimento em bem-estar',
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
    
    setTimeout(() => {
      const produtosRecomendados = gerarRecomendacoes(clienteSelecionado.id);
      
      setRecomendacoes({
        produtos: produtosRecomendados,
        timestamp: new Date().toLocaleString('pt-BR'),
        versaoModelo: 'v2.4.1',
        tempoProcessamento: `${(Math.random() * 0.5 + 0.2).toFixed(2)}s`
      });
      setLoading(false);
    }, 1500);
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

  const handleIrParaFeedback = () => {
    if (!recomendacoes || !clienteSelecionado) {
      alert('⚠️ Nenhuma recomendação foi gerada ainda!');
      return;
    }

    const dadosFeedback = {
      cliente: clienteSelecionado,
      recomendacao: {
        id: `rec_${Date.now()}`,
        timestamp: recomendacoes.timestamp,
        produtos: recomendacoes.produtos.map(p => ({
          ...p,
          aceito: null
        }))
      }
    };

    setFeedbackPreparado(dadosFeedback);
    alert('✅ Dados preparados para feedback! Você seria redirecionado para a tela de Feedback.');
    console.log('Dados preparados para feedback:', dadosFeedback);
  };

  const handleImprimirLista = () => {
    if (!recomendacoes || !clienteSelecionado) {
      alert('⚠️ Nenhuma recomendação foi gerada ainda!');
      return;
    }

    const conteudoImpressao = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recomendações - ${clienteSelecionado.nome}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .produto { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
          .produto-header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .preco { font-size: 20px; color: #2563eb; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SHOPINFO - Recomendações Personalizadas</h1>
          <p>Gerado em: ${recomendacoes.timestamp}</p>
        </div>
        
        <div class="info">
          <h2>Informações do Cliente</h2>
          <p><strong>Nome:</strong> ${clienteSelecionado.nome}</p>
          <p><strong>Email:</strong> ${clienteSelecionado.email}</p>
          <p><strong>Telefone:</strong> ${clienteSelecionado.telefone}</p>
          <p><strong>Fidelidade:</strong> ${clienteSelecionado.fidelidade}</p>
        </div>

        <h2>Produtos Recomendados (${recomendacoes.produtos.length})</h2>
        
        ${recomendacoes.produtos.map((produto, index) => `
          <div class="produto">
            <div class="produto-header">${index + 1}. ${produto.nome}</div>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p><strong>Confiança da IA:</strong> ${produto.confianca}%</p>
            <p><strong>Motivo:</strong> ${produto.motivo}</p>
            <p><strong>Estoque:</strong> ${produto.estoque} unidades</p>
            ${produto.desconto > 0 ? `
              <p>
                <span style="text-decoration: line-through;">R$ ${produto.preco.toFixed(2)}</span>
                <span class="preco"> R$ ${(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}</span>
                <span style="color: red; font-weight: bold;"> (-${produto.desconto}%)</span>
              </p>
            ` : `
              <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
            `}
          </div>
        `).join('')}

        <div class="footer">
          <p>© 2025 SHOPINFO - Tecnologia e Inovação | Fortaleza, Ceará - Brasil</p>
          <p>Modelo IA: ${recomendacoes.versaoModelo} | Tempo de processamento: ${recomendacoes.tempoProcessamento}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 100);
          }
        </script>
      </body>
      </html>
    `;

    const janelaImpressao = window.open('', '_blank', 'width=800,height=600');
    janelaImpressao.document.write(conteudoImpressao);
    janelaImpressao.document.close();
  };

  const calcularTotalOrcamento = () => {
    return orcamento.reduce((total, produto) => {
      const precoFinal = produto.preco * (1 - produto.desconto / 100);
      return total + (precoFinal * produto.quantidade);
    }, 0);
  };

  const getFidelidadeColor = (nivel) => {
    const colors = {
      'Platina': 'bg-gray-800 text-white',
      'Ouro': 'bg-yellow-500 text-white',
      'Prata': 'bg-gray-400 text-white',
      'Bronze': 'bg-orange-600 text-white'
    };
    return colors[nivel] || 'bg-gray-500 text-white';
  };

  const getConfiancaColor = (confianca) => {
    if (confianca >= 90) return 'text-green-600';
    if (confianca >= 80) return 'text-blue-600';
    if (confianca >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Consulta de Recomendações 🔍
        </h1>
        <p className="text-gray-600">
          Busque o cliente e gere recomendações personalizadas com IA
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Cliente
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onFocus={() => setModalCliente(true)}
                placeholder="Digite nome, e-mail ou CPF..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {clienteSelecionado && (
            <div className="flex items-end">
              <button
                onClick={handleGerarRecomendacoes}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Gerar Recomendações
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {modalCliente && busca && (
          <div className="mt-4 border border-gray-200 rounded-lg bg-gray-50 max-h-80 overflow-y-auto">
            {clientesFiltrados.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <div
                    key={cliente.id}
                    onClick={() => handleSelecionarCliente(cliente)}
                    className="p-4 hover:bg-white cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{cliente.nome}</p>
                          <p className="text-sm text-gray-600">{cliente.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFidelidadeColor(cliente.fidelidade)}`}>
                        {cliente.fidelidade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        )}
      </div>

      {clienteSelecionado && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cliente Selecionado</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFidelidadeColor(clienteSelecionado.fidelidade)}`}>
              {clienteSelecionado.fidelidade}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Nome</span>
              </div>
              <p className="font-semibold text-gray-900">{clienteSelecionado.nome}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Total de Compras</span>
              </div>
              <p className="font-semibold text-gray-900">{clienteSelecionado.totalCompras}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Ticket Médio</span>
              </div>
              <p className="font-semibold text-gray-900">
                R$ {clienteSelecionado.ticketMedio.toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Última Compra</span>
              </div>
              <p className="font-semibold text-gray-900">{clienteSelecionado.ultimaCompra}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Gerando Recomendações...
          </h3>
          <p className="text-gray-600">
            A IA está processando o histórico do cliente para criar recomendações personalizadas
          </p>
        </div>
      )}

      {recomendacoes && !loading && (
        <div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Recomendações Geradas
                </h3>
                <p className="text-blue-100">
                  {recomendacoes.produtos.length} produtos recomendados • 
                  Processado em {recomendacoes.tempoProcessamento}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Modelo IA</p>
                <p className="text-lg font-semibold">{recomendacoes.versaoModelo}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recomendacoes.produtos.map((produto, index) => (
              <div
                key={produto.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                    <span className="text-7xl">{produto.imagem}</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-bold
                      ${index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        'bg-orange-500 text-white'}
                    `}>
                      #{index + 1} Recomendado
                    </span>
                  </div>
                  {produto.desconto > 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{produto.desconto}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      {produto.nome}
                    </h4>
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {produto.categoria}
                    </span>
                  </div>

                  <div className="mb-4">
                    {produto.desconto > 0 ? (
                      <div>
                        <p className="text-sm text-gray-500 line-through">
                          R$ {produto.preco.toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Confiança da IA</span>
                      <span className={`text-sm font-bold ${getConfiancaColor(produto.confianca)}`}>
                        {produto.confianca}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          produto.confianca >= 90 ? 'bg-green-500' :
                          produto.confianca >= 80 ? 'bg-blue-500' :
                          produto.confianca >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${produto.confianca}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-purple-800">{produto.motivo}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {produto.estoque} em estoque
                      </span>
                    </div>
                    {produto.estoque < 20 && (
                      <span className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Estoque baixo
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => handleAdicionarAoOrcamento(produto)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Adicionar ao Orçamento
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Recomendações Prontas
                  </p>
                  <p className="text-sm text-gray-600">
                    Total estimado: R$ {recomendacoes.produtos.reduce((acc, p) => 
                      acc + (p.preco * (1 - p.desconto / 100)), 0
                    ).toFixed(2)} • {orcamento.length} no orçamento
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleImprimirLista}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Imprimir Lista
                </button>
                {orcamento.length > 0 && (
                  <button
                    onClick={() => setShowOrcamento(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Ver Orçamento ({orcamento.length})
                  </button>
                )}
                <button
                  onClick={handleIrParaFeedback}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  Ir para Feedback
                </button>
              </div>
            </div>
          </div>

          {showOrcamento && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Orçamento</h2>
                  <button
                    onClick={() => setShowOrcamento(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {orcamento.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum produto no orçamento</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orcamento.map((produto) => (
                        <div key={produto.id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                            {produto.imagem}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{produto.nome}</h3>
                            <p className="text-sm text-gray-600">{produto.categoria}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {produto.desconto > 0 ? (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    R$ {produto.preco.toFixed(2)}
                                  </span>
                                  <span className="text-lg font-bold text-green-600">
                                    R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                                  </span>
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                    -{produto.desconto}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  R$ {produto.preco.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoverDoOrcamento(produto.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {orcamento.length > 0 && (
                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        R$ {calcularTotalOrcamento().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleImprimirLista}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Imprimir Orçamento
                      </button>
                      <button
                        onClick={() => {
                          alert('✅ Orçamento enviado para o cliente!');
                          setShowOrcamento(false);
                        }}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Enviar Orçamento
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!clienteSelecionado && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Search className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Como funciona?
          </h3>
          <div className="max-w-2xl mx-auto space-y-2 text-sm text-blue-800">
            <p>1️⃣ <strong>Busque o cliente</strong> usando nome, e-mail ou CPF</p>
            <p>2️⃣ <strong>Clique em "Gerar Recomendações"</strong> para processar com IA</p>
            <p>3️⃣ <strong>Visualize 5-8 produtos</strong> ranqueados por relevância (sempre diferentes!)</p>
            <p>4️⃣ <strong>Adicione ao orçamento</strong> os produtos de interesse</p>
            <p>5️⃣ <strong>Imprima a lista</strong> ou <strong>vá para Feedback</strong> após o atendimento</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorConsulta;