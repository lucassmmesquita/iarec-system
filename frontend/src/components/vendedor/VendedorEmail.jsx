import React, { useState } from 'react';
import {
  Mail,
  Send,
  User,
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Copy,
  Smartphone,
  AlertCircle,
  Loader,
  Package,
  DollarSign,
  Tag,
  Star
} from 'lucide-react';

const VendedorEmail = () => {
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [recomendacaoSelecionada, setRecomendacaoSelecionada] = useState(null);
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [incluirPrecos, setIncluirPrecos] = useState(true);
  const [incluirDesconto, setIncluirDesconto] = useState(true);
  const [sending, setSending] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Dados mockados de clientes com recomendações
  const clientesComRecomendacoes = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(85) 98765-4321',
      ultimaConsulta: '20/10/2025 14:35',
      produtos: [
        { 
          nome: 'Notebook Dell Inspiron 15', 
          preco: 3200.00, 
          desconto: 10,
          categoria: 'Notebooks',
          imagem: '💻'
        },
        { 
          nome: 'Mouse Logitech MX Master 3', 
          preco: 450.00, 
          desconto: 5,
          categoria: 'Periféricos',
          imagem: '🖱️'
        },
        { 
          nome: 'SSD Kingston 1TB NVMe', 
          preco: 380.00, 
          desconto: 0,
          categoria: 'Hardware',
          imagem: '💾'
        }
      ]
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '(85) 99876-5432',
      ultimaConsulta: '20/10/2025 15:12',
      produtos: [
        { 
          nome: 'Teclado Mecânico Redragon K552', 
          preco: 280.00, 
          desconto: 15,
          categoria: 'Periféricos',
          imagem: '⌨️'
        },
        { 
          nome: 'Headset HyperX Cloud II', 
          preco: 320.00, 
          desconto: 10,
          categoria: 'Áudio',
          imagem: '🎧'
        }
      ]
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      telefone: '(85) 97654-3210',
      ultimaConsulta: '20/10/2025 16:20',
      produtos: [
        { 
          nome: 'Placa de Vídeo RTX 4060', 
          preco: 2400.00, 
          desconto: 5,
          categoria: 'Hardware',
          imagem: '🎮'
        },
        { 
          nome: 'Processador AMD Ryzen 7 5800X', 
          preco: 1600.00, 
          desconto: 8,
          categoria: 'Hardware',
          imagem: '⚙️'
        }
      ]
    }
  ];

  const [emailsEnviados, setEmailsEnviados] = useState([
    {
      id: 101,
      cliente: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      dataEnvio: '19/10/2025 10:30',
      status: 'Lido',
      produtos: 3,
      valorTotal: 850.00
    },
    {
      id: 102,
      cliente: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      dataEnvio: '18/10/2025 14:15',
      status: 'Enviado',
      produtos: 2,
      valorTotal: 1200.00
    }
  ]);

  const handleSelecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setRecomendacaoSelecionada(cliente);
    setAssunto(`Recomendações Personalizadas para ${cliente.nome} - SHOPINFO`);
    setMensagem(
      `Olá ${cliente.nome.split(' ')[0]},\n\n` +
      `Obrigado por visitar a SHOPINFO! Com base no seu perfil e preferências, selecionamos alguns produtos especiais que podem interessar a você.\n\n` +
      `Confira as recomendações abaixo e aproveite as condições exclusivas!\n\n` +
      `Qualquer dúvida, estou à disposição.\n\n` +
      `Atenciosamente,\nEquipe SHOPINFO`
    );
  };

  const handleEnviarEmail = () => {
    if (!clienteSelecionado || !assunto || !mensagem) {
      alert('⚠️ Preencha todos os campos obrigatórios!');
      return;
    }

    setSending(true);

    // Simular envio de email
    setTimeout(() => {
      const novoEmail = {
        id: Date.now(),
        cliente: clienteSelecionado.nome,
        email: clienteSelecionado.email,
        dataEnvio: new Date().toLocaleString('pt-BR'),
        status: 'Enviado',
        produtos: clienteSelecionado.produtos.length,
        valorTotal: clienteSelecionado.produtos.reduce((acc, p) => 
          acc + (p.preco * (1 - p.desconto / 100)), 0
        )
      };

      setEmailsEnviados(prev => [novoEmail, ...prev]);
      setSending(false);
      setEmailEnviado(true);

      // Resetar formulário
      setTimeout(() => {
        setClienteSelecionado(null);
        setRecomendacaoSelecionada(null);
        setAssunto('');
        setMensagem('');
        setEmailEnviado(false);
        setPreviewMode(false);
      }, 3000);
    }, 2000);
  };

  const calcularTotal = (produtos) => {
    return produtos.reduce((acc, p) => 
      acc + (p.preco * (1 - p.desconto / 100)), 0
    );
  };

  const calcularEconomia = (produtos) => {
    return produtos.reduce((acc, p) => 
      acc + (p.preco * p.desconto / 100), 0
    );
  };

  const EmailPreview = () => (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Header do Email */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">SHOPINFO</h1>
        <p className="text-blue-100">Suas Recomendações Personalizadas</p>
      </div>

      {/* Corpo do Email */}
      <div className="p-8">
        {/* Mensagem Personalizada */}
        <div className="mb-8 whitespace-pre-line text-gray-700 leading-relaxed">
          {mensagem}
        </div>

        {/* Produtos Recomendados */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produtos Selecionados Especialmente para Você
          </h2>

          <div className="space-y-4">
            {recomendacaoSelecionada?.produtos.map((produto, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-6">
                  {/* Imagem do Produto */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                    {produto.imagem}
                  </div>

                  {/* Informações do Produto */}
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full mb-2">
                      {produto.categoria}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {produto.nome}
                    </h3>
                    
                    {incluirPrecos && (
                      <div className="flex items-center gap-3">
                        {produto.desconto > 0 && incluirDesconto ? (
                          <>
                            <span className="text-gray-500 line-through text-sm">
                              R$ {produto.preco.toFixed(2)}
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                            </span>
                            <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded">
                              -{produto.desconto}%
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            R$ {produto.preco.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo do Pedido */}
        {incluirPrecos && recomendacaoSelecionada && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  R$ {recomendacaoSelecionada.produtos.reduce((acc, p) => acc + p.preco, 0).toFixed(2)}
                </span>
              </div>
              {incluirDesconto && calcularEconomia(recomendacaoSelecionada.produtos) > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Economia:</span>
                  <span className="font-semibold">
                    - R$ {calcularEconomia(recomendacaoSelecionada.produtos).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                <span>Total:</span>
                <span>R$ {calcularTotal(recomendacaoSelecionada.produtos).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg mb-4">
            Entre em Contato e Garanta Já!
          </div>
          <p className="text-gray-600">
            📞 {clienteSelecionado?.telefone} | 📧 contato@shopinfo.com
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-6 text-center text-sm text-gray-600">
        <p className="mb-2">© 2025 SHOPINFO - Tecnologia e Inovação</p>
        <p>Fortaleza, Ceará - Brasil</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Envio de Recomendações por E-mail 📧
        </h1>
        <p className="text-gray-600">
          Compartilhe recomendações personalizadas com seus clientes
        </p>
      </div>

      {/* Mensagem de Sucesso */}
      {emailEnviado && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">E-mail Enviado com Sucesso!</p>
            <p className="text-sm text-green-700">
              As recomendações foram enviadas para {clienteSelecionado?.email}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Formulário */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção de Cliente */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Selecionar Cliente
            </h3>

            <div className="space-y-3">
              {clientesComRecomendacoes.map((cliente) => (
                <div
                  key={cliente.id}
                  onClick={() => handleSelecionarCliente(cliente)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    clienteSelecionado?.id === cliente.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{cliente.produtos.length} produtos</p>
                      <p className="text-xs text-gray-500">{cliente.ultimaConsulta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário de Email */}
          {clienteSelecionado && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Compor E-mail
              </h3>

              <div className="space-y-4">
                {/* Assunto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem Personalizada *
                  </label>
                  <textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Opções */}
                <div className="space-y-3 pt-4 border-t">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={incluirPrecos}
                      onChange={(e) => setIncluirPrecos(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Incluir preços dos produtos</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={incluirDesconto}
                      onChange={(e) => setIncluirDesconto(e.target.checked)}
                      disabled={!incluirPrecos}
                      className="w-5 h-5 text-blue-600 rounded disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">Mostrar descontos e economia</span>
                  </label>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    {previewMode ? 'Ocultar' : 'Visualizar'} Preview
                  </button>
                  <button
                    onClick={handleEnviarEmail}
                    disabled={sending || !assunto || !mensagem}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar E-mail
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview do Email */}
          {previewMode && clienteSelecionado && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview do E-mail
              </h3>
              <EmailPreview />
            </div>
          )}
        </div>

        {/* Coluna Direita - Histórico e Estatísticas */}
        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="font-semibold text-lg mb-4">Estatísticas de Envio</h3>
            <div className="space-y-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">E-mails Enviados</span>
                  <Mail className="w-4 h-4" />
                </div>
                <p className="text-3xl font-bold">{emailsEnviados.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Taxa de Leitura</span>
                  <Eye className="w-4 h-4" />
                </div>
                <p className="text-3xl font-bold">
                  {((emailsEnviados.filter(e => e.status === 'Lido').length / emailsEnviados.length) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Histórico de Envios */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Últimos Envios
            </h3>

            <div className="space-y-3">
              {emailsEnviados.map((email) => (
                <div
                  key={email.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {email.cliente}
                      </p>
                      <p className="text-xs text-gray-600">{email.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      email.status === 'Lido'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {email.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{email.dataEnvio}</span>
                    <span>{email.produtos} produtos • R$ {email.valorTotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" />
              💡 Dicas para E-mails Eficazes
            </h3>
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Personalize a mensagem com o nome do cliente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Destaque os benefícios e descontos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Inclua um call-to-action claro</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Envie em horários de maior engajamento</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorEmail;