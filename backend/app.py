import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random

# Criar aplicação Flask
app = Flask(__name__)

# Configurar CORS para aceitar requisições do frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configurações
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = False
app.config['JSON_AS_ASCII'] = False

# ===============================
# DADOS MOCKADOS (Simulação de BD)
# ===============================

USUARIOS_MOCK = [
    {
        "id": 1,
        "nome": "Admin Sistema",
        "email": "admin@shopinfo.com",
        "senha": "admin123",
        "perfil": "Administrador",
        "status": "Ativo"
    },
    {
        "id": 2,
        "nome": "Maria Vendedora",
        "email": "maria@shopinfo.com",
        "senha": "123456",
        "perfil": "Vendedor",
        "status": "Ativo"
    },
    {
        "id": 3,
        "nome": "João Gerente",
        "email": "joao@shopinfo.com",
        "senha": "123456",
        "perfil": "Gerente",
        "status": "Ativo"
    }
]

PRODUTOS_MOCK = [
    {"id": 1, "nome": "Notebook Dell Inspiron 15", "categoria": "Notebooks", "preco": 3499.00},
    {"id": 2, "nome": "Mouse Logitech MX Master 3", "categoria": "Periféricos", "preco": 549.00},
    {"id": 3, "nome": "Teclado Mecânico Keychron K2", "categoria": "Periféricos", "preco": 799.00},
    {"id": 4, "nome": "Monitor LG 27\" 4K", "categoria": "Monitores", "preco": 2199.00},
    {"id": 5, "nome": "SSD Samsung 1TB NVMe", "categoria": "Armazenamento", "preco": 649.00},
    {"id": 6, "nome": "Webcam Logitech C920", "categoria": "Periféricos", "preco": 459.00},
    {"id": 7, "nome": "Headset HyperX Cloud", "categoria": "Áudio", "preco": 399.00},
    {"id": 8, "nome": "MacBook Pro M3", "categoria": "Notebooks", "preco": 12999.00}
]

CLIENTES_MOCK = [
    {
        "id": 1,
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "(85) 98765-4321",
        "cpf": "123.456.789-00"
    },
    {
        "id": 2,
        "nome": "Ana Costa",
        "email": "ana@email.com",
        "telefone": "(85) 99876-5432",
        "cpf": "987.654.321-00"
    },
    {
        "id": 3,
        "nome": "Carlos Mendes",
        "email": "carlos@email.com",
        "telefone": "(85) 97654-3210",
        "cpf": "456.789.123-00"
    }
]

# ===============================
# ROTAS - HEALTH CHECK (OBRIGATÓRIO)
# ===============================

@app.route('/')
def index():
    """Rota raiz - Health check básico"""
    return jsonify({
        'status': 'online',
        'service': 'IARECOMEND API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            'health': '/health',
            'auth': '/api/auth/login',
            'produtos': '/api/produtos',
            'clientes': '/api/clientes',
            'recomendacoes': '/api/recomendacoes',
            'relatorios': '/api/relatorios/dashboard'
        }
    })

@app.route('/health')
def health():
    """Health check para Elastic Beanstalk"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    }), 200

# ===============================
# ROTAS - AUTENTICAÇÃO
# ===============================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login de usuários"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'sucesso': False, 'mensagem': 'Dados não fornecidos'}), 400
        
        email = data.get('email')
        senha = data.get('senha')
        
        if not email or not senha:
            return jsonify({'sucesso': False, 'mensagem': 'Email e senha são obrigatórios'}), 400
        
        # Buscar usuário
        usuario = next((u for u in USUARIOS_MOCK if u['email'] == email and u['senha'] == senha), None)
        
        if usuario:
            # Remover senha antes de retornar
            usuario_safe = {k: v for k, v in usuario.items() if k != 'senha'}
            return jsonify({
                'sucesso': True,
                'usuario': usuario_safe,
                'token': f'mock-token-{usuario["id"]}-{datetime.now().timestamp()}'
            }), 200
        
        return jsonify({
            'sucesso': False,
            'mensagem': 'Credenciais inválidas'
        }), 401
        
    except Exception as e:
        return jsonify({
            'sucesso': False,
            'mensagem': f'Erro no servidor: {str(e)}'
        }), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout de usuários"""
    return jsonify({'sucesso': True, 'mensagem': 'Logout realizado com sucesso'}), 200

# ===============================
# ROTAS - USUÁRIOS
# ===============================

@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios():
    """Lista todos os usuários (sem senha)"""
    usuarios_safe = [{k: v for k, v in u.items() if k != 'senha'} for u in USUARIOS_MOCK]
    return jsonify(usuarios_safe), 200

@app.route('/api/usuarios/<int:usuario_id>', methods=['GET'])
def buscar_usuario(usuario_id):
    """Busca usuário por ID"""
    usuario = next((u for u in USUARIOS_MOCK if u['id'] == usuario_id), None)
    
    if usuario:
        usuario_safe = {k: v for k, v in usuario.items() if k != 'senha'}
        return jsonify(usuario_safe), 200
    
    return jsonify({'erro': 'Usuário não encontrado'}), 404

@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    """Cria novo usuário"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('email') or not data.get('senha'):
            return jsonify({'erro': 'Email e senha são obrigatórios'}), 400
        
        # Verificar se email já existe
        if any(u['email'] == data.get('email') for u in USUARIOS_MOCK):
            return jsonify({'erro': 'Email já cadastrado'}), 400
        
        # Criar novo usuário
        novo_usuario = {
            'id': max([u['id'] for u in USUARIOS_MOCK]) + 1,
            'nome': data.get('nome', 'Novo Usuário'),
            'email': data.get('email'),
            'senha': data.get('senha'),
            'perfil': data.get('perfil', 'Vendedor'),
            'status': 'Ativo'
        }
        
        USUARIOS_MOCK.append(novo_usuario)
        
        # Retornar sem senha
        usuario_safe = {k: v for k, v in novo_usuario.items() if k != 'senha'}
        return jsonify(usuario_safe), 201
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao criar usuário: {str(e)}'}), 500

# ===============================
# ROTAS - PRODUTOS
# ===============================

@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    """Lista todos os produtos"""
    return jsonify(PRODUTOS_MOCK), 200

@app.route('/api/produtos/<int:produto_id>', methods=['GET'])
def buscar_produto(produto_id):
    """Busca produto por ID"""
    produto = next((p for p in PRODUTOS_MOCK if p['id'] == produto_id), None)
    
    if produto:
        return jsonify(produto), 200
    
    return jsonify({'erro': 'Produto não encontrado'}), 404

@app.route('/api/produtos/categorias', methods=['GET'])
def listar_categorias():
    """Lista categorias únicas de produtos"""
    categorias = list(set(p['categoria'] for p in PRODUTOS_MOCK))
    return jsonify(categorias), 200

# ===============================
# ROTAS - CLIENTES
# ===============================

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    """Lista todos os clientes"""
    return jsonify(CLIENTES_MOCK), 200

@app.route('/api/clientes/<int:cliente_id>', methods=['GET'])
def buscar_cliente(cliente_id):
    """Busca cliente por ID"""
    cliente = next((c for c in CLIENTES_MOCK if c['id'] == cliente_id), None)
    
    if cliente:
        return jsonify(cliente), 200
    
    return jsonify({'erro': 'Cliente não encontrado'}), 404

@app.route('/api/clientes/buscar', methods=['GET'])
def buscar_cliente_por_nome():
    """Busca cliente por nome ou email"""
    query = request.args.get('q', '').lower()
    
    if not query:
        return jsonify({'erro': 'Parâmetro de busca não fornecido'}), 400
    
    resultados = [
        c for c in CLIENTES_MOCK
        if query in c['nome'].lower() or query in c['email'].lower()
    ]
    
    return jsonify(resultados), 200

# ===============================
# ROTAS - RECOMENDAÇÕES (IA MOCKADA)
# ===============================

@app.route('/api/recomendacoes', methods=['POST'])
def gerar_recomendacoes():
    """
    Simula a geração de recomendações por IA
    Recebe: cliente_id, historico_compras (opcional)
    Retorna: lista de produtos recomendados
    """
    try:
        data = request.get_json()
        cliente_id = data.get('cliente_id')
        
        if not cliente_id:
            return jsonify({'erro': 'cliente_id é obrigatório'}), 400
        
        # Verificar se cliente existe
        cliente = next((c for c in CLIENTES_MOCK if c['id'] == cliente_id), None)
        
        if not cliente:
            return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        # Simular análise de IA (na produção, aqui entra o modelo treinado)
        num_recomendacoes = data.get('quantidade', 3)
        produtos_recomendados = random.sample(PRODUTOS_MOCK, min(num_recomendacoes, len(PRODUTOS_MOCK)))
        
        # Adicionar score de confiança e motivo simulados
        for produto in produtos_recomendados:
            produto['score_confianca'] = round(random.uniform(0.75, 0.98), 2)
            produto['motivo'] = random.choice([
                'Baseado em compras anteriores',
                'Produtos similares frequentemente comprados juntos',
                'Tendência de mercado para seu perfil',
                'Alta demanda entre clientes similares',
                'Promoção especial para este perfil'
            ])
        
        # Ordenar por score
        produtos_recomendados.sort(key=lambda x: x['score_confianca'], reverse=True)
        
        return jsonify({
            'cliente_id': cliente_id,
            'cliente_nome': cliente['nome'],
            'recomendacoes': produtos_recomendados,
            'total_recomendacoes': len(produtos_recomendados),
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao gerar recomendações: {str(e)}'}), 500

@app.route('/api/recomendacoes/feedback', methods=['POST'])
def registrar_feedback():
    """Registra feedback do vendedor sobre a recomendação"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        # Validar campos obrigatórios
        campos_obrigatorios = ['cliente_id', 'produto_id', 'feedback']
        for campo in campos_obrigatorios:
            if campo not in data:
                return jsonify({'erro': f'Campo obrigatório ausente: {campo}'}), 400
        
        # Simular registro de feedback
        feedback_id = random.randint(1000, 9999)
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Feedback registrado com sucesso',
            'feedback_id': feedback_id,
            'timestamp': datetime.now().isoformat()
        }), 201
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao registrar feedback: {str(e)}'}), 500

# ===============================
# ROTAS - RELATÓRIOS
# ===============================

@app.route('/api/relatorios/dashboard', methods=['GET'])
def dashboard():
    """Retorna estatísticas gerais do sistema"""
    return jsonify({
        'total_recomendacoes': 1247,
        'total_clientes': len(CLIENTES_MOCK),
        'total_produtos': len(PRODUTOS_MOCK),
        'taxa_conversao': 34.5,
        'ticket_medio': 2850.00,
        'produtos_mais_recomendados': [
            {'produto': 'Notebook Dell Inspiron 15', 'categoria': 'Notebooks', 'vezes': 245},
            {'produto': 'Monitor LG 27" 4K', 'categoria': 'Monitores', 'vezes': 198},
            {'produto': 'SSD Samsung 1TB NVMe', 'categoria': 'Armazenamento', 'vezes': 176},
            {'produto': 'Mouse Logitech MX Master 3', 'categoria': 'Periféricos', 'vezes': 154}
        ],
        'vendas_por_categoria': [
            {'categoria': 'Notebooks', 'total': 450, 'valor': 1234500.00},
            {'categoria': 'Periféricos', 'total': 380, 'valor': 234800.00},
            {'categoria': 'Monitores', 'total': 290, 'valor': 637710.00},
            {'categoria': 'Armazenamento', 'total': 127, 'valor': 82423.00}
        ],
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/relatorios/conversao', methods=['GET'])
def relatorio_conversao():
    """Relatório de conversão de recomendações"""
    periodo = request.args.get('periodo', '30dias')
    
    return jsonify({
        'periodo': periodo,
        'total_recomendacoes': 1247,
        'recomendacoes_aceitas': 430,
        'recomendacoes_rejeitadas': 817,
        'taxa_conversao': 34.5,
        'valor_total_vendido': 1225350.00,
        'ticket_medio': 2850.00,
        'timestamp': datetime.now().isoformat()
    }), 200

# ===============================
# TRATAMENTO DE ERROS
# ===============================

@app.errorhandler(404)
def nao_encontrado(e):
    return jsonify({
        'erro': 'Endpoint não encontrado',
        'status': 404,
        'timestamp': datetime.now().isoformat()
    }), 404

@app.errorhandler(500)
def erro_interno(e):
    return jsonify({
        'erro': 'Erro interno do servidor',
        'status': 500,
        'timestamp': datetime.now().isoformat()
    }), 500

@app.errorhandler(405)
def metodo_nao_permitido(e):
    return jsonify({
        'erro': 'Método HTTP não permitido para este endpoint',
        'status': 405,
        'timestamp': datetime.now().isoformat()
    }), 405

# ===============================
# INICIALIZAÇÃO
# ===============================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)