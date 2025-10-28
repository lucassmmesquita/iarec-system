import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Award,
  Clock,
  User,
  ShoppingBag,
  DollarSign
} from 'lucide-react';

const VendedorFeedback = () => {
  const [recomendacoesPendentes, setRecomendacoesPendentes] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      timestamp: '20/10/2025 14:35',
      produtos: [
        { id: 101, nome: 'Notebook Dell Inspiron 15', preco: 3200.00, aceito: null },
        { id: 102, nome: 'Mouse Logitech MX Master 3', preco: 450.00, aceito: null },
        { id: 103, nome: 'SSD Kingston 1TB NVMe', preco: 380.00, aceito: null }
      ],
      feedbackEnviado: false
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      timestamp: '20/10/2025 15:12',
      produtos: [
        { id: 201, nome: 'Teclado Mecânico Redragon K552', preco: 280.00, aceito: null },
        { id: 202, nome: 'Headset HyperX Cloud II', preco: 320.00, aceito: null },
        { id: 203, nome: 'Webcam Logitech C920', preco: 420.00, aceito: null }
      ],
      feedbackEnviado: false
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      timestamp: '20/10/2025 16:20',
      produtos: [
        { id: 301, nome: 'Placa de Vídeo RTX 4060', preco: 2400.00, aceito: null },
        { id: 302, nome: 'Processador AMD Ryzen 7 5800X', preco: 1600.00, aceito: null }
      ],
      feedbackEnviado: false
    }
  ]);

  const [recomendacaoAtual, setRecomendacaoAtual] = useState(null);
  const [comentario, setComentario] = useState('');
  const [avaliacaoGeral, setAvaliacaoGeral] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAvaliarProduto = (recId, prodId, aceito) => {
    setRecomendacoesPendentes(prev =>
      prev.map(rec => {
        if (rec.id === recId) {
          return {
            ...rec,
            produtos: rec.produtos.map(prod =>
              prod.id === prodId ? { ...prod, aceito } : prod
            )
          };
        }
        return rec;
      })
    );
  };

  const handleEnviarFeedback = (recId) => {
    const rec = recomendacoesPendentes.find(r => r.id === recId);
    
    if (!rec) return;

    // Verificar se todos os produtos foram avaliados
    const todosAvaliados = rec.produtos.every(p => p.aceito !== null);
    
    if (!todosAvaliados) {
      alert('⚠️ Por favor, avalie todos os produtos antes de enviar o feedback!');
      return;
    }

    // Marcar feedback como enviado
    setRecomendacoesPendentes(prev =>
      prev.map(r => r.id === recId ? { ...r, feedbackEnviado: true } : r)
    );

    setShowSuccess(true);
    setRecomendacaoAtual(null);
    setComentario('');
    setAvaliacaoGeral(0);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const calcularEstatisticas = () => {
    const totalRecomendacoes = recomendacoesPendentes.filter(r => r.feedbackEnviado).length;
    const totalProdutos = recomendacoesPendentes
      .filter(r => r.feedbackEnviado)
      .reduce((acc, r) => acc + r.produtos.length, 0);
    
    const produtosAceitos = recomendacoesPendentes
      .filter(r => r.feedbackEnviado)
      .reduce((acc, r) => acc + r.produtos.filter(p => p.aceito === true).length, 0);

    const taxaAceitacao = totalProdutos > 0 ? (produtosAceitos / totalProdutos) * 100 : 0;

    return {
      totalRecomendacoes,
      totalProdutos,
      produtosAceitos,
      taxaAceitacao: taxaAceitacao.toFixed(1)
    };
  };

  const stats = calcularEstatisticas();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Feedback de Recomendações
        </h1>
        <p className="text-gray-600">
          Avalie as recomendações para melhorar o modelo de IA
        </p>
      </div>

      {/* Mensagem de Sucesso */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">Feedback Enviado com Sucesso!</p>
            <p className="text-sm text-green-700">O modelo de IA foi atualizado com suas avaliações.</p>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total de Feedbacks</span>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalRecomendacoes}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Produtos Avaliados</span>
            <ShoppingBag className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProdutos}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Aceitos</span>
            <ThumbsUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.produtosAceitos}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Taxa de Aceitação</span>
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.taxaAceitacao}%</p>
        </div>
      </div>

      {/* Lista de Recomendações Pendentes */}
      <div className="space-y-6">
        {recomendacoesPendentes.map((rec) => {
          const isExpanded = recomendacaoAtual === rec.id;
          const todosAvaliados = rec.produtos.every(p => p.aceito !== null);

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all ${
                rec.feedbackEnviado ? 'opacity-60' : ''
              }`}
            >
              {/* Header da Recomendação */}
              <div
                className={`p-6 cursor-pointer ${
                  rec.feedbackEnviado ? 'bg-green-50' : 'bg-white'
                }`}
                onClick={() => !rec.feedbackEnviado && setRecomendacaoAtual(isExpanded ? null : rec.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      rec.feedbackEnviado ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {rec.feedbackEnviado ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{rec.cliente}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {rec.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-4 h-4" />
                          {rec.produtos.length} produtos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {rec.feedbackEnviado ? (
                      <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Feedback Enviado
                      </span>
                    ) : (
                      <>
                        {todosAvaliados ? (
                          <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                            <AlertCircle className="w-5 h-5" />
                            Pronto para Enviar
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium">
                            <AlertCircle className="w-5 h-5" />
                            Avaliação Pendente
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Conteúdo Expandido */}
              {isExpanded && !rec.feedbackEnviado && (
                <div className="p-6 border-t bg-gray-50">
                  {/* Lista de Produtos para Avaliar */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Avalie cada produto recomendado:
                    </h4>
                    <div className="space-y-4">
                      {rec.produtos.map((produto) => (
                        <div
                          key={produto.id}
                          className={`bg-white rounded-lg p-4 border-2 transition-colors ${
                            produto.aceito === true ? 'border-green-500 bg-green-50' :
                            produto.aceito === false ? 'border-red-500 bg-red-50' :
                            'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 mb-1">
                                {produto.nome}
                              </p>
                              <p className="text-sm text-gray-600">
                                R$ {produto.preco.toFixed(2)}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleAvaliarProduto(rec.id, produto.id, true)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                  produto.aceito === true
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                                }`}
                              >
                                <ThumbsUp className="w-5 h-5" />
                                Cliente Aceitou
                              </button>
                              <button
                                onClick={() => handleAvaliarProduto(rec.id, produto.id, false)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                  produto.aceito === false
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                                }`}
                              >
                                <ThumbsDown className="w-5 h-5" />
                                Cliente Recusou
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avaliação Geral com Estrelas */}
                  <div className="mb-6">
                    <label className="block font-semibold text-gray-900 mb-3">
                      Avaliação Geral da Recomendação:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setAvaliacaoGeral(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= avaliacaoGeral
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-gray-600">
                        {avaliacaoGeral > 0 ? `${avaliacaoGeral}/5 estrelas` : 'Não avaliado'}
                      </span>
                    </div>
                  </div>

                  {/* Comentário Opcional */}
                  <div className="mb-6">
                    <label className="block font-semibold text-gray-900 mb-3">
                      Comentários Adicionais (opcional):
                    </label>
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      placeholder="Ex: Cliente preferiu modelo com mais memória RAM, mencionou necessidade de notebook para jogos..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Botão de Envio */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      {todosAvaliados ? (
                        <span className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Todos os produtos foram avaliados
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-orange-600">
                          <AlertCircle className="w-4 h-4" />
                          Avalie todos os produtos antes de enviar
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => handleEnviarFeedback(rec.id)}
                      disabled={!todosAvaliados}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      Enviar Feedback
                    </button>
                  </div>
                </div>
              )}

              {/* Resumo de Feedback Enviado */}
              {rec.feedbackEnviado && (
                <div className="p-6 border-t bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-900 mb-2">Feedback Processado</p>
                      <div className="flex items-center gap-4 text-sm text-green-700">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {rec.produtos.filter(p => p.aceito === true).length} aceitos
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="w-4 h-4" />
                          {rec.produtos.filter(p => p.aceito === false).length} recusados
                        </span>
                      </div>
                    </div>
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há recomendações */}
      {recomendacoesPendentes.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma Recomendação Pendente
          </h3>
          <p className="text-gray-600">
            Gere novas recomendações na aba "Consulta" para fornecer feedback
          </p>
        </div>
      )}

      {/* Informações sobre Feedback */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Por que o Feedback é Importante?
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <p className="font-semibold mb-2">🎯 Melhora a Precisão</p>
            <p className="text-xs">
              Cada feedback ajusta o modelo de IA para recomendar produtos mais relevantes
            </p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <p className="font-semibold mb-2">📊 Dados Valiosos</p>
            <p className="text-xs">
              Suas avaliações geram insights sobre preferências dos clientes
            </p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <p className="font-semibold mb-2">🚀 Melhor Performance</p>
            <p className="text-xs">
              Com feedbacks regulares, sua taxa de conversão aumenta continuamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorFeedback;