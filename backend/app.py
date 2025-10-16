import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)

# Configurar CORS para aceitar requisições do frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "https://seu-frontend.herokuapp.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configurações
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('FLASK_ENV') != 'production'

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
    }
]

PRODUTOS_MOCK = [
    {"id": 1, "nome": "Notebook Dell Inspiron 15", "categoria": "Notebooks", "preco": 3499.00},
    {"id": 2, "nome": "Mouse Logitech MX Master 3", "categoria": "Periféricos", "preco": 549.00},
    {"id": 3, "nome": "Teclado Mecânico Keychron K2", "categoria": "Periféricos", "preco": 799.00},
    {"id": 4, "nome": "Monitor LG 27\" 4K", "categoria": "Monitores", "preco": 2199.00},
    {"id": 5, "nome": "SSD Samsung 1TB NVMe", "categoria": "Armazenamento", "preco": 649.00}
]

CLIENTES_MOCK = [
    {"id": 1, "nome": "João Silva", "email": "joao@email.com", "telefone": "(85) 98765-4321"},
    {"id": 2, "nome": "Ana Costa", "email": "ana@email.com", "telefone": "(85) 99876-5432"}
]

# ===============================
# ROTAS - HEALTH CHECK
# ===============================

@app.route('/')
def index():
    return jsonify({
        'servico': 'IARECOMEND API',
        'versao': '1.0.0',
        'status': 'online',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# ===============================
# ROTAS - AUTENTICAÇÃO
# ===============================

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    
    usuario = next((u for u in USUARIOS_MOCK if u['email'] == email and u['senha'] == senha), None)
    
    if usuario:
        # Remover senha antes de retornar
        usuario_safe = {k: v for k, v in usuario.items() if k != 'senha'}
        return jsonify({
            'sucesso': True,
            'usuario': usuario_safe,
            'token': f'mock-token-{usuario["id"]}'
        })
    
    return jsonify({'sucesso': False, 'mensagem': 'Credenciais inválidas'}), 401

# ===============================
# ROTAS - USUÁRIOS
# ===============================

@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios_safe = [{k: v for k, v in u.items() if k != 'senha'} for u in USUARIOS_MOCK]
    return jsonify(usuarios_safe)

@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    novo_usuario = request.get_json()
    novo_usuario['id'] = max([u['id'] for u in USUARIOS_MOCK]) + 1
    USUARIOS_MOCK.append(novo_usuario)
    return jsonify(novo_usuario), 201

# ===============================
# ROTAS - RECOMENDAÇÕES (IA MOCKADA)
# ===============================

@app.route('/api/recomendacoes', methods=['POST'])
def gerar_recomendacoes():
    """
    Simula a geração de recomendações por IA
    Recebe: cliente_id, historico_compras
    Retorna: lista de produtos recomendados
    """
    data = request.get_json()
    cliente_id = data.get('cliente_id')
    
    # Simular análise de IA (na produção, aqui entra o modelo treinado)
    produtos_recomendados = random.sample(PRODUTOS_MOCK, 3)
    
    # Adicionar score de confiança simulado
    for produto in produtos_recomendados:
        produto['score_confianca'] = round(random.uniform(0.75, 0.98), 2)
        produto['motivo'] = random.choice([
            'Baseado em compras anteriores',
            'Produtos similares frequentemente comprados juntos',
            'Tendência de mercado para seu perfil'
        ])
    
    return jsonify({
        'cliente_id': cliente_id,
        'recomendacoes': produtos_recomendados,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/recomendacoes/feedback', methods=['POST'])
def registrar_feedback():
    """Registra feedback do vendedor sobre a recomendação"""
    data = request.get_json()
    return jsonify({
        'mensagem': 'Feedback registrado com sucesso',
        'feedback_id': random.randint(1000, 9999)
    }), 201

# ===============================
# ROTAS - PRODUTOS
# ===============================

@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    return jsonify(PRODUTOS_MOCK)

# ===============================
# ROTAS - CLIENTES
# ===============================

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    return jsonify(CLIENTES_MOCK)

@app.route('/api/clientes/<int:cliente_id>', methods=['GET'])
def buscar_cliente(cliente_id):
    cliente = next((c for c in CLIENTES_MOCK if c['id'] == cliente_id), None)
    if cliente:
        return jsonify(cliente)
    return jsonify({'erro': 'Cliente não encontrado'}), 404

# ===============================
# ROTAS - RELATÓRIOS
# ===============================

@app.route('/api/relatorios/dashboard', methods=['GET'])
def dashboard():
    """Retorna estatísticas gerais do sistema"""
    return jsonify({
        'total_recomendacoes': 1247,
        'taxa_conversao': 34.5,
        'ticket_medio': 2850.00,
        'produtos_mais_recomendados': [
            {'produto': 'Notebook Dell', 'vezes': 245},
            {'produto': 'Monitor LG', 'vezes': 198},
            {'produto': 'SSD Samsung', 'vezes': 176}
        ]
    })

# ===============================
# TRATAMENTO DE ERROS
# ===============================

@app.errorhandler(404)
def nao_encontrado(e):
    return jsonify({'erro': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def erro_interno(e):
    return jsonify({'erro': 'Erro interno do servidor'}), 500

# ===============================
# INICIALIZAÇÃO
# ===============================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])