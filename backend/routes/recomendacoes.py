"""
Routes de Recomendação de Produtos - IARECOMEND
API REST com FastAPI
Simula IA de recomendação com dados mockados dinâmicos
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import random

router = APIRouter(
    prefix="/api/recomendacoes",
    tags=["Recomendações"]
)

# ============================================
# SCHEMAS PYDANTIC
# ============================================

class ClienteInfo(BaseModel):
    """Informações do cliente para recomendação"""
    id_cliente: str = Field(..., description="ID único do cliente")
    nome: str = Field(..., description="Nome do cliente")
    idade: Optional[int] = Field(None, description="Idade do cliente")
    genero: Optional[str] = Field(None, description="Gênero: M, F, Outro")
    cidade: Optional[str] = Field(None, description="Cidade do cliente")
    historico_categorias: Optional[List[str]] = Field(default=[], description="Categorias já compradas")
    valor_medio_compra: Optional[float] = Field(None, description="Valor médio das compras anteriores")
    frequencia_compra: Optional[str] = Field(None, description="Frequência: Alta, Média, Baixa")

class ProdutoRecomendado(BaseModel):
    """Produto recomendado pela IA"""
    id_produto: str
    nome: str
    categoria: str
    preco: float
    desconto: Optional[float] = 0.0
    preco_final: float
    confianca_ia: float = Field(..., description="Score de confiança da IA (0-100)")
    motivo_recomendacao: str
    estoque_disponivel: int
    url_imagem: Optional[str] = None
    tags: List[str] = []

class RecomendacaoResponse(BaseModel):
    """Resposta completa da recomendação"""
    id_recomendacao: str
    id_cliente: str
    nome_cliente: str
    data_geracao: str
    produtos_recomendados: List[ProdutoRecomendado]
    total_recomendacoes: int
    algoritmo_usado: str
    tempo_processamento_ms: int
    metadados: dict

class FeedbackRequest(BaseModel):
    """Feedback do vendedor sobre a recomendação"""
    id_recomendacao: str
    id_produto: str
    aceito: bool = Field(..., description="Se o cliente aceitou a recomendação")
    comprado: Optional[bool] = False
    motivo_recusa: Optional[str] = None
    observacoes: Optional[str] = None

class FeedbackResponse(BaseModel):
    """Resposta do registro de feedback"""
    success: bool
    message: str
    id_feedback: str
    contribuicao_aprendizado: str

class EstatisticasIA(BaseModel):
    """Estatísticas do modelo de IA"""
    total_recomendacoes_geradas: int
    taxa_aceitacao: float
    taxa_conversao: float
    categorias_mais_recomendadas: List[dict]
    horarios_pico: List[str]
    desempenho_modelo: dict

# ============================================
# DADOS MOCKADOS - PRODUTOS
# ============================================

PRODUTOS_MOCK = [
    # Notebooks
    {"id": "NB001", "nome": "Notebook Dell Inspiron 15", "categoria": "Notebooks", "preco": 3499.00, "estoque": 15, "tags": ["trabalho", "estudo", "i5"]},
    {"id": "NB002", "nome": "Notebook Lenovo IdeaPad Gaming", "categoria": "Notebooks", "preco": 4299.00, "estoque": 8, "tags": ["gaming", "i7", "rtx"]},
    {"id": "NB003", "nome": "MacBook Air M2", "categoria": "Notebooks", "preco": 8999.00, "estoque": 5, "tags": ["premium", "apple", "design"]},
    {"id": "NB004", "nome": "Notebook Acer Aspire 5", "categoria": "Notebooks", "preco": 2899.00, "estoque": 20, "tags": ["custo-beneficio", "estudo"]},
    {"id": "NB005", "nome": "Notebook ASUS TUF Gaming", "categoria": "Notebooks", "preco": 5499.00, "estoque": 12, "tags": ["gaming", "robusto", "rtx3060"]},
    
    # Smartphones
    {"id": "SM001", "nome": "iPhone 14 Pro 128GB", "categoria": "Smartphones", "preco": 6999.00, "estoque": 10, "tags": ["premium", "apple", "camera"]},
    {"id": "SM002", "nome": "Samsung Galaxy S23", "categoria": "Smartphones", "preco": 4299.00, "estoque": 18, "tags": ["android", "flagship", "5g"]},
    {"id": "SM003", "nome": "Xiaomi Redmi Note 12", "categoria": "Smartphones", "preco": 1499.00, "estoque": 30, "tags": ["custo-beneficio", "bateria"]},
    {"id": "SM004", "nome": "Motorola Edge 40", "categoria": "Smartphones", "preco": 2199.00, "estoque": 25, "tags": ["intermediario", "5g"]},
    {"id": "SM005", "nome": "Google Pixel 7", "categoria": "Smartphones", "preco": 3799.00, "estoque": 8, "tags": ["camera", "android-puro", "ia"]},
    
    # Tablets
    {"id": "TB001", "nome": "iPad 10ª Geração", "categoria": "Tablets", "preco": 3299.00, "estoque": 12, "tags": ["apple", "estudo", "produtividade"]},
    {"id": "TB002", "nome": "Samsung Galaxy Tab S8", "categoria": "Tablets", "preco": 2899.00, "estoque": 15, "tags": ["android", "tela-grande", "caneta"]},
    {"id": "TB003", "nome": "Tablet Multilaser M10", "categoria": "Tablets", "preco": 699.00, "estoque": 40, "tags": ["basico", "economico"]},
    
    # Monitores
    {"id": "MN001", "nome": "Monitor LG 24 Full HD", "categoria": "Monitores", "preco": 799.00, "estoque": 22, "tags": ["trabalho", "ips", "24pol"]},
    {"id": "MN002", "nome": "Monitor Gamer AOC 27 144Hz", "categoria": "Monitores", "preco": 1299.00, "estoque": 10, "tags": ["gaming", "144hz", "27pol"]},
    {"id": "MN003", "nome": "Monitor Samsung 32 4K", "categoria": "Monitores", "preco": 2199.00, "estoque": 7, "tags": ["4k", "design", "32pol"]},
    
    # Periféricos
    {"id": "PR001", "nome": "Mouse Logitech MX Master 3", "categoria": "Periféricos", "preco": 549.00, "estoque": 30, "tags": ["ergonomico", "produtividade", "bluetooth"]},
    {"id": "PR002", "nome": "Teclado Mecânico Redragon", "categoria": "Periféricos", "preco": 299.00, "estoque": 25, "tags": ["gaming", "mecanico", "rgb"]},
    {"id": "PR003", "nome": "Headset HyperX Cloud II", "categoria": "Periféricos", "preco": 459.00, "estoque": 18, "tags": ["gaming", "surround", "conforto"]},
    {"id": "PR004", "nome": "Webcam Logitech C920", "categoria": "Periféricos", "preco": 399.00, "estoque": 20, "tags": ["home-office", "streaming", "fullhd"]},
    
    # Armazenamento
    {"id": "AR001", "nome": "SSD Kingston 480GB", "categoria": "Armazenamento", "preco": 299.00, "estoque": 35, "tags": ["upgrade", "rapido", "480gb"]},
    {"id": "AR002", "nome": "HD Externo Seagate 1TB", "categoria": "Armazenamento", "preco": 349.00, "estoque": 28, "tags": ["backup", "portatil", "1tb"]},
    {"id": "AR003", "nome": "SSD NVMe Samsung 1TB", "categoria": "Armazenamento", "preco": 699.00, "estoque": 15, "tags": ["nvme", "velocidade", "1tb"]},
    
    # Acessórios
    {"id": "AC001", "nome": "Carregador USB-C 65W", "categoria": "Acessórios", "preco": 129.00, "estoque": 50, "tags": ["carregador", "usb-c", "rapido"]},
    {"id": "AC002", "nome": "Case para Notebook 15.6", "categoria": "Acessórios", "preco": 79.00, "estoque": 40, "tags": ["protecao", "transporte"]},
    {"id": "AC003", "nome": "Hub USB 7 Portas", "categoria": "Acessórios", "preco": 89.00, "estoque": 30, "tags": ["conectividade", "usb", "hub"]},
]

# ============================================
# HISTÓRICO DE RECOMENDAÇÕES (MOCK)
# ============================================

from datetime import datetime, timedelta
import random

# ============================================
# HISTÓRICO DE RECOMENDAÇÕES (MOCK)
# ============================================

# Função auxiliar para gerar datas passadas
def gerar_data_passada(dias_atras):
    """Gera uma data no passado"""
    data = datetime.now() - timedelta(days=dias_atras, hours=random.randint(0, 23), minutes=random.randint(0, 59))
    return data.isoformat()

# Função auxiliar para gerar ID de recomendação
def gerar_id_recomendacao_mock(dias_atras):
    """Gera ID de recomendação baseado na data"""
    data = datetime.now() - timedelta(days=dias_atras)
    timestamp = data.strftime("%Y%m%d%H%M%S")
    random_suffix = random.randint(1000, 9999)
    return f"REC-{timestamp}-{random_suffix}"

# Histórico de recomendações dos últimos 30 dias
RECOMENDACOES_HISTORICO = [
    # Dia 1 - Cliente VIP Maria Santos
    {
        "id_recomendacao": gerar_id_recomendacao_mock(1),
        "id_cliente": "CLI001",
        "nome_cliente": "Maria Santos",
        "data_geracao": gerar_data_passada(1),
        "produtos_recomendados": [
            {
                "id_produto": "NB002",
                "nome": "Notebook Lenovo IdeaPad Gaming",
                "categoria": "Notebooks",
                "preco": 4299.00,
                "desconto": 12.5,
                "preco_final": 3761.62,
                "confianca_ia": 94.87,
                "motivo_recomendacao": "Você já comprou produtos de Notebooks | Cliente VIP - produto em destaque",
                "estoque_disponivel": 8,
                "url_imagem": "https://api.shopinfo.com/images/NB002.jpg",
                "tags": ["gaming", "i7", "rtx"]
            },
            {
                "id_produto": "MN002",
                "nome": "Monitor Gamer AOC 27 144Hz",
                "categoria": "Monitores",
                "preco": 1299.00,
                "desconto": 10.0,
                "preco_final": 1169.10,
                "confianca_ia": 91.23,
                "motivo_recomendacao": "Complementa seu Notebooks | Produto mais vendido para perfis similares",
                "estoque_disponivel": 10,
                "url_imagem": "https://api.shopinfo.com/images/MN002.jpg",
                "tags": ["gaming", "144hz", "27pol"]
            },
            {
                "id_produto": "PR003",
                "nome": "Headset HyperX Cloud II",
                "categoria": "Periféricos",
                "preco": 459.00,
                "desconto": 8.0,
                "preco_final": 422.28,
                "confianca_ia": 89.56,
                "motivo_recomendacao": "Você já comprou produtos de Periféricos | Melhor custo-benefício da categoria",
                "estoque_disponivel": 18,
                "url_imagem": "https://api.shopinfo.com/images/PR003.jpg",
                "tags": ["gaming", "surround", "conforto"]
            },
            {
                "id_produto": "AR003",
                "nome": "SSD NVMe Samsung 1TB",
                "categoria": "Armazenamento",
                "preco": 699.00,
                "desconto": 5.0,
                "preco_final": 664.05,
                "confianca_ia": 87.12,
                "motivo_recomendacao": "Complementa seu Notebooks | Alta taxa de satisfação entre clientes parecidos",
                "estoque_disponivel": 15,
                "url_imagem": "https://api.shopinfo.com/images/AR003.jpg",
                "tags": ["nvme", "velocidade", "1tb"]
            },
            {
                "id_produto": "PR002",
                "nome": "Teclado Mecânico Redragon",
                "categoria": "Periféricos",
                "preco": 299.00,
                "desconto": 7.0,
                "preco_final": 278.07,
                "confianca_ia": 85.34,
                "motivo_recomendacao": "Você já comprou produtos de Periféricos | Tendência de compra identificada pela IA",
                "estoque_disponivel": 25,
                "url_imagem": "https://api.shopinfo.com/images/PR002.jpg",
                "tags": ["gaming", "mecanico", "rgb"]
            }
        ],
        "total_recomendacoes": 5,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 42,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": ["Notebooks", "Periféricos", "Monitores"],
                "valor_medio": 3500.00,
                "frequencia": "Alta"
            },
            "confianca_media": 89.62,
            "desconto_medio": 8.50,
            "versao_modelo": "v2.3.1"
        }
    },
    
    # Dia 2 - Cliente João Silva (novo)
    {
        "id_recomendacao": gerar_id_recomendacao_mock(2),
        "id_cliente": "CLI002",
        "nome_cliente": "João Silva",
        "data_geracao": gerar_data_passada(2),
        "produtos_recomendados": [
            {
                "id_produto": "SM002",
                "nome": "Samsung Galaxy S23",
                "categoria": "Smartphones",
                "preco": 4299.00,
                "desconto": 5.0,
                "preco_final": 4084.05,
                "confianca_ia": 78.45,
                "motivo_recomendacao": "Promoção exclusiva detectada | Produto mais vendido para perfis similares",
                "estoque_disponivel": 18,
                "url_imagem": "https://api.shopinfo.com/images/SM002.jpg",
                "tags": ["android", "flagship", "5g"]
            },
            {
                "id_produto": "TB002",
                "nome": "Samsung Galaxy Tab S8",
                "categoria": "Tablets",
                "preco": 2899.00,
                "desconto": 6.0,
                "preco_final": 2725.06,
                "confianca_ia": 75.23,
                "motivo_recomendacao": "Alta taxa de satisfação entre clientes parecidos | Excelente custo-benefício para você",
                "estoque_disponivel": 15,
                "url_imagem": "https://api.shopinfo.com/images/TB002.jpg",
                "tags": ["android", "tela-grande", "caneta"]
            },
            {
                "id_produto": "AC001",
                "nome": "Carregador USB-C 65W",
                "categoria": "Acessórios",
                "preco": 129.00,
                "desconto": 3.0,
                "preco_final": 125.13,
                "confianca_ia": 72.89,
                "motivo_recomendacao": "Complementa seu Smartphones | Tendência de compra identificada pela IA",
                "estoque_disponivel": 50,
                "url_imagem": "https://api.shopinfo.com/images/AC001.jpg",
                "tags": ["carregador", "usb-c", "rapido"]
            }
        ],
        "total_recomendacoes": 3,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 38,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": [],
                "valor_medio": None,
                "frequencia": "Média"
            },
            "confianca_media": 75.52,
            "desconto_medio": 4.67,
            "versao_modelo": "v2.3.1"
        }
    },
    
    # Dia 3 - Cliente Ana Costa
    {
        "id_recomendacao": gerar_id_recomendacao_mock(3),
        "id_cliente": "CLI003",
        "nome_cliente": "Ana Costa",
        "data_geracao": gerar_data_passada(3),
        "produtos_recomendados": [
            {
                "id_produto": "SM004",
                "nome": "Motorola Edge 40",
                "categoria": "Smartphones",
                "preco": 2199.00,
                "desconto": 8.0,
                "preco_final": 2023.08,
                "confianca_ia": 92.34,
                "motivo_recomendacao": "Você já comprou produtos de Smartphones | Dentro da sua faixa de preço habitual",
                "estoque_disponivel": 25,
                "url_imagem": "https://api.shopinfo.com/images/SM004.jpg",
                "tags": ["intermediario", "5g"]
            },
            {
                "id_produto": "TB001",
                "nome": "iPad 10ª Geração",
                "categoria": "Tablets",
                "preco": 3299.00,
                "desconto": 10.0,
                "preco_final": 2969.10,
                "confianca_ia": 88.67,
                "motivo_recomendacao": "Você já comprou produtos de Tablets | Produto mais vendido para perfis similares",
                "estoque_disponivel": 12,
                "url_imagem": "https://api.shopinfo.com/images/TB001.jpg",
                "tags": ["apple", "estudo", "produtividade"]
            },
            {
                "id_produto": "AC002",
                "nome": "Case para Notebook 15.6",
                "categoria": "Acessórios",
                "preco": 79.00,
                "desconto": 5.0,
                "preco_final": 75.05,
                "confianca_ia": 85.12,
                "motivo_recomendacao": "Você já comprou produtos de Acessórios | Melhor custo-benefício da categoria",
                "estoque_disponivel": 40,
                "url_imagem": "https://api.shopinfo.com/images/AC002.jpg",
                "tags": ["protecao", "transporte"]
            },
            {
                "id_produto": "PR004",
                "nome": "Webcam Logitech C920",
                "categoria": "Periféricos",
                "preco": 399.00,
                "desconto": 6.0,
                "preco_final": 375.06,
                "confianca_ia": 82.45,
                "motivo_recomendacao": "Tendência de compra identificada pela IA | Alta taxa de satisfação entre clientes parecidos",
                "estoque_disponivel": 20,
                "url_imagem": "https://api.shopinfo.com/images/PR004.jpg",
                "tags": ["home-office", "streaming", "fullhd"]
            },
            {
                "id_produto": "AR002",
                "nome": "HD Externo Seagate 1TB",
                "categoria": "Armazenamento",
                "preco": 349.00,
                "desconto": 4.0,
                "preco_final": 335.04,
                "confianca_ia": 79.23,
                "motivo_recomendacao": "Excelente custo-benefício para você | Estoque limitado - oportunidade única",
                "estoque_disponivel": 28,
                "url_imagem": "https://api.shopinfo.com/images/AR002.jpg",
                "tags": ["backup", "portatil", "1tb"]
            }
        ],
        "total_recomendacoes": 5,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 45,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": ["Smartphones", "Tablets", "Acessórios"],
                "valor_medio": 2000.00,
                "frequencia": "Média"
            },
            "confianca_media": 85.56,
            "desconto_medio": 6.60,
            "versao_modelo": "v2.3.1"
        }
    },
    
    # Dia 5 - Cliente Pedro Oliveira
    {
        "id_recomendacao": gerar_id_recomendacao_mock(5),
        "id_cliente": "CLI004",
        "nome_cliente": "Pedro Oliveira",
        "data_geracao": gerar_data_passada(5),
        "produtos_recomendados": [
            {
                "id_produto": "NB001",
                "nome": "Notebook Dell Inspiron 15",
                "categoria": "Notebooks",
                "preco": 3499.00,
                "desconto": 7.0,
                "preco_final": 3254.07,
                "confianca_ia": 90.12,
                "motivo_recomendacao": "Você já comprou produtos de Notebooks | Dentro da sua faixa de preço habitual",
                "estoque_disponivel": 15,
                "url_imagem": "https://api.shopinfo.com/images/NB001.jpg",
                "tags": ["trabalho", "estudo", "i5"]
            },
            {
                "id_produto": "MN001",
                "nome": "Monitor LG 24 Full HD",
                "categoria": "Monitores",
                "preco": 799.00,
                "desconto": 5.0,
                "preco_final": 759.05,
                "confianca_ia": 87.65,
                "motivo_recomendacao": "Complementa seu Notebooks | Melhor custo-benefício da categoria",
                "estoque_disponivel": 22,
                "url_imagem": "https://api.shopinfo.com/images/MN001.jpg",
                "tags": ["trabalho", "ips", "24pol"]
            },
            {
                "id_produto": "PR001",
                "nome": "Mouse Logitech MX Master 3",
                "categoria": "Periféricos",
                "preco": 549.00,
                "desconto": 6.0,
                "preco_final": 516.06,
                "confianca_ia": 84.23,
                "motivo_recomendacao": "Você já comprou produtos de Periféricos | Alta taxa de satisfação entre clientes parecidos",
                "estoque_disponivel": 30,
                "url_imagem": "https://api.shopinfo.com/images/PR001.jpg",
                "tags": ["ergonomico", "produtividade", "bluetooth"]
            }
        ],
        "total_recomendacoes": 3,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 41,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": ["Notebooks", "Periféricos"],
                "valor_medio": 3200.00,
                "frequencia": "Média"
            },
            "confianca_media": 87.33,
            "desconto_medio": 6.00,
            "versao_modelo": "v2.3.1"
        }
    },
    
    # Dia 7 - Cliente Carlos Mendes
    {
        "id_recomendacao": gerar_id_recomendacao_mock(7),
        "id_cliente": "CLI005",
        "nome_cliente": "Carlos Mendes",
        "data_geracao": gerar_data_passada(7),
        "produtos_recomendados": [
            {
                "id_produto": "NB005",
                "nome": "Notebook ASUS TUF Gaming",
                "categoria": "Notebooks",
                "preco": 5499.00,
                "desconto": 10.0,
                "preco_final": 4949.10,
                "confianca_ia": 95.67,
                "motivo_recomendacao": "Você já comprou produtos de Notebooks | Cliente VIP - produto em destaque",
                "estoque_disponivel": 12,
                "url_imagem": "https://api.shopinfo.com/images/NB005.jpg",
                "tags": ["gaming", "robusto", "rtx3060"]
            },
            {
                "id_produto": "MN003",
                "nome": "Monitor Samsung 32 4K",
                "categoria": "Monitores",
                "preco": 2199.00,
                "desconto": 12.0,
                "preco_final": 1935.12,
                "confianca_ia": 93.45,
                "motivo_recomendacao": "Você já comprou produtos de Monitores | Produto premium recomendado",
                "estoque_disponivel": 7,
                "url_imagem": "https://api.shopinfo.com/images/MN003.jpg",
                "tags": ["4k", "design", "32pol"]
            },
            {
                "id_produto": "PR002",
                "nome": "Teclado Mecânico Redragon",
                "categoria": "Periféricos",
                "preco": 299.00,
                "desconto": 8.0,
                "preco_final": 275.08,
                "confianca_ia": 91.23,
                "motivo_recomendacao": "Complementa seu Notebooks | Tendência de compra identificada pela IA",
                "estoque_disponivel": 25,
                "url_imagem": "https://api.shopinfo.com/images/PR002.jpg",
                "tags": ["gaming", "mecanico", "rgb"]
            },
            {
                "id_produto": "PR003",
                "nome": "Headset HyperX Cloud II",
                "categoria": "Periféricos",
                "preco": 459.00,
                "desconto": 9.0,
                "preco_final": 417.69,
                "confianca_ia": 89.12,
                "motivo_recomendacao": "Complementa seu Notebooks | Produto mais vendido para perfis similares",
                "estoque_disponivel": 18,
                "url_imagem": "https://api.shopinfo.com/images/PR003.jpg",
                "tags": ["gaming", "surround", "conforto"]
            }
        ],
        "total_recomendacoes": 4,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 47,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": ["Notebooks", "Monitores", "Periféricos"],
                "valor_medio": 4800.00,
                "frequencia": "Alta"
            },
            "confianca_media": 92.37,
            "desconto_medio": 9.75,
            "versao_modelo": "v2.3.1"
        }
    },
    
    # Dia 10 - Cliente Juliana Ferreira
    {
        "id_recomendacao": gerar_id_recomendacao_mock(10),
        "id_cliente": "CLI006",
        "nome_cliente": "Juliana Ferreira",
        "data_geracao": gerar_data_passada(10),
        "produtos_recomendados": [
            {
                "id_produto": "SM001",
                "nome": "iPhone 14 Pro 128GB",
                "categoria": "Smartphones",
                "preco": 6999.00,
                "desconto": 8.0,
                "preco_final": 6439.08,
                "confianca_ia": 88.45,
                "motivo_recomendacao": "Produto premium recomendado | Dentro da sua faixa de preço habitual",
                "estoque_disponivel": 10,
                "url_imagem": "https://api.shopinfo.com/images/SM001.jpg",
                "tags": ["premium", "apple", "camera"]
            },
            {
                "id_produto": "TB001",
                "nome": "iPad 10ª Geração",
                "categoria": "Tablets",
                "preco": 3299.00,
                "desconto": 6.0,
                "preco_final": 3101.06,
                "confianca_ia": 85.67,
                "motivo_recomendacao": "Complementa seu Smartphones | Alta taxa de satisfação entre clientes parecidos",
                "estoque_disponivel": 12,
                "url_imagem": "https://api.shopinfo.com/images/TB001.jpg",
                "tags": ["apple", "estudo", "produtividade"]
            },
            {
                "id_produto": "AC001",
                "nome": "Carregador USB-C 65W",
                "categoria": "Acessórios",
                "preco": 129.00,
                "desconto": 5.0,
                "preco_final": 122.55,
                "confianca_ia": 82.34,
                "motivo_recomendacao": "Complementa seu Smartphones | Melhor custo-benefício da categoria",
                "estoque_disponivel": 50,
                "url_imagem": "https://api.shopinfo.com/images/AC001.jpg",
                "tags": ["carregador", "usb-c", "rapido"]
            }
        ],
        "total_recomendacoes": 3,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 39,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": ["Smartphones"],
                "valor_medio": 5500.00,
                "frequencia": "Alta"
            },
            "confianca_media": 85.49,
            "desconto_medio": 6.33,
            "versao_modelo": "v2.3.1"
        }
    },
    
    # Dia 12 - Cliente Roberto Lima (Econômico)
    {
        "id_recomendacao": gerar_id_recomendacao_mock(12),
        "id_cliente": "CLI007",
        "nome_cliente": "Roberto Lima",
        "data_geracao": gerar_data_passada(12),
        "produtos_recomendados": [
            {
                "id_produto": "SM003",
                "nome": "Xiaomi Redmi Note 12",
                "categoria": "Smartphones",
                "preco": 1499.00,
                "desconto": 7.0,
                "preco_final": 1394.07,
                "confianca_ia": 89.23,
                "motivo_recomendacao": "Melhor custo-benefício da categoria | Excelente custo-benefício para você",
                "estoque_disponivel": 30,
                "url_imagem": "https://api.shopinfo.com/images/SM003.jpg",
                "tags": ["custo-beneficio", "bateria"]
            },
            {
                "id_produto": "TB003",
                "nome": "Tablet Multilaser M10",
                "categoria": "Tablets",
                "preco": 699.00,
                "desconto": 5.0,
                "preco_final": 664.05,
                "confianca_ia": 85.67,
                "motivo_recomendacao": "Dentro da sua faixa de preço habitual | Tendência de compra identificada pela IA",
                "estoque_disponivel": 40,
                "url_imagem": "https://api.shopinfo.com/images/TB003.jpg",
                "tags": ["basico", "economico"]
            },
            {
                "id_produto": "AR001",
                "nome": "SSD Kingston 480GB",
                "categoria": "Armazenamento",
                "preco": 299.00,
                "desconto": 4.0,
                "preco_final": 287.04,
                "confianca_ia": 82.45,
                "motivo_recomendacao": "Melhor custo-benefício da categoria | Alta taxa de satisfação entre clientes parecidos",
                "estoque_disponivel": 35,
                "url_imagem": "https://api.shopinfo.com/images/AR001.jpg",
                "tags": ["upgrade", "rapido", "480gb"]
            },
            {
                "id_produto": "AC003",
                "nome": "Hub USB 7 Portas",
                "categoria": "Acessórios",
                "preco": 89.00,
                "desconto": 3.0,
                "preco_final": 86.33,
                "confianca_ia": 78.12,
                "motivo_recomendacao": "Excelente custo-benefício para você | Produto mais vendido para perfis similares",
                "estoque_disponivel": 30,
                "url_imagem": "https://api.shopinfo.com/images/AC003.jpg",
                "tags": ["conectividade", "usb", "hub"]
            }
        ],
        "total_recomendacoes": 4,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 36,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": ["Smartphones", "Tablets"],
                "valor_medio": 1200.00,
                "frequencia": "Baixa"
            },
            "confianca_media": 83.87,
            "desconto_medio": 4.75,
            "versao_modelo": "v2.3.1"
        }
    },
    
    # Dia 15 - Cliente Fernanda Alves
    {
        "id_recomendacao": gerar_id_recomendacao_mock(15),
        "id_cliente": "CLI008",
        "nome_cliente": "Fernanda Alves",
        "data_geracao": gerar_data_passada(15),
        "produtos_recomendados": [
            {
                "id_produto": "NB003",
                "nome": "MacBook Air M2",
                "categoria": "Notebooks",
                "preco": 8999.00,
                "desconto": 5.0,
                "preco_final": 8549.05,
                "confianca_ia": 96.78,
                "motivo_recomendacao": "Produto premium recomendado | Cliente VIP - produto em destaque",
                "estoque_disponivel": 5,
                "url_imagem": "https://api.shopinfo.com/images/NB003.jpg",
                "tags": ["premium", "apple", "design"]
            },
            {
                "id_produto": "SM005",
                "nome": "Google Pixel 7",
                "categoria": "Smartphones",
                "preco": 3799.00,
                "desconto": 7.0,
                "preco_final": 3533.07,
                "confianca_ia": 93.45,
                "motivo_recomendacao": "Tendência de compra identificada pela IA | Alta taxa de satisfação entre clientes parecidos",
                "estoque_disponivel": 8,
                "url_imagem": "https://api.shopinfo.com/images/SM005.jpg",
                "tags": ["camera", "android-puro", "ia"]
            }
        ],
        "total_recomendacoes": 2,
        "algoritmo_usado": "Collaborative Filtering + Content-Based + Neural Network (Simulado)",
        "tempo_processamento_ms": 43,
        "metadados": {
            "perfil_cliente": {
                "historico_categorias": ["Notebooks"],
                "valor_medio": 7500.00,
                "frequencia": "Alta"
            },
            "confianca_media": 95.12,
            "desconto_medio": 6.00,
            "versao_modelo": "v2.3.1"
        }
    }
]

# ============================================
# HISTÓRICO DE FEEDBACKS (MOCK)
# ============================================

FEEDBACKS_HISTORICO = [
    # Feedbacks para Maria Santos (CLI001) - Dia 1
    {
        "id_feedback": "FDB-20251027143522-1234",
        "data_registro": gerar_data_passada(1),
        "id_recomendacao": RECOMENDACOES_HISTORICO[0]["id_recomendacao"],
        "id_produto": "NB002",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Cliente adorou o produto! Compra confirmada na hora."
    },
    {
        "id_feedback": "FDB-20251027143545-1235",
        "data_registro": gerar_data_passada(1),
        "id_recomendacao": RECOMENDACOES_HISTORICO[0]["id_recomendacao"],
        "id_produto": "MN002",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Comprou junto com o notebook. Ótima combinação!"
    },
    {
        "id_feedback": "FDB-20251027143601-1236",
        "data_registro": gerar_data_passada(1),
        "id_recomendacao": RECOMENDACOES_HISTORICO[0]["id_recomendacao"],
        "id_produto": "PR003",
        "aceito": True,
        "comprado": False,
        "motivo_recusa": None,
        "observacoes": "Cliente demonstrou interesse, vai pensar."
    },
    {
        "id_feedback": "FDB-20251027143615-1237",
        "data_registro": gerar_data_passada(1),
        "id_recomendacao": RECOMENDACOES_HISTORICO[0]["id_recomendacao"],
        "id_produto": "AR003",
        "aceito": False,
        "comprado": False,
        "motivo_recusa": "Cliente já possui SSD suficiente",
        "observacoes": None
    },
    
    # Feedbacks para João Silva (CLI002) - Dia 2
    {
        "id_feedback": "FDB-20251026101234-2341",
        "data_registro": gerar_data_passada(2),
        "id_recomendacao": RECOMENDACOES_HISTORICO[1]["id_recomendacao"],
        "id_produto": "SM002",
        "aceito": False,
        "comprado": False,
        "motivo_recusa": "Cliente achou o preço elevado",
        "observacoes": "Preferiu aguardar promoção"
    },
    {
        "id_feedback": "FDB-20251026101301-2342",
        "data_registro": gerar_data_passada(2),
        "id_recomendacao": RECOMENDACOES_HISTORICO[1]["id_recomendacao"],
        "id_produto": "TB002",
        "aceito": True,
        "comprado": False,
        "motivo_recusa": None,
        "observacoes": "Cliente gostou, vai voltar na próxima semana"
    },
    {
        "id_feedback": "FDB-20251026101322-2343",
        "data_registro": gerar_data_passada(2),
        "id_recomendacao": RECOMENDACOES_HISTORICO[1]["id_recomendacao"],
        "id_produto": "AC001",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Produto barato, levou na hora"
    },
    
    # Feedbacks para Ana Costa (CLI003) - Dia 3
    {
        "id_feedback": "FDB-20251025153012-3451",
        "data_registro": gerar_data_passada(3),
        "id_recomendacao": RECOMENDACOES_HISTORICO[2]["id_recomendacao"],
        "id_produto": "SM004",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Excelente recomendação! Cliente muito satisfeito."
    },
    {
        "id_feedback": "FDB-20251025153045-3452",
        "data_registro": gerar_data_passada(3),
        "id_recomendacao": RECOMENDACOES_HISTORICO[2]["id_recomendacao"],
        "id_produto": "TB001",
        "aceito": True,
        "comprado": False,
        "motivo_recusa": None,
        "observacoes": "Cliente interessado, vai pesquisar mais"
    },
    {
        "id_feedback": "FDB-20251025153112-3453",
        "data_registro": gerar_data_passada(3),
        "id_recomendacao": RECOMENDACOES_HISTORICO[2]["id_recomendacao"],
        "id_produto": "AC002",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Compra complementar confirmada"
    },
    {
        "id_feedback": "FDB-20251025153134-3454",
        "data_registro": gerar_data_passada(3),
        "id_recomendacao": RECOMENDACOES_HISTORICO[2]["id_recomendacao"],
        "id_produto": "PR004",
        "aceito": False,
        "comprado": False,
        "motivo_recusa": "Cliente não trabalha home office",
        "observacoes": "Recomendação não se encaixa no perfil"
    },
    
    # Feedbacks para Pedro Oliveira (CLI004) - Dia 5
    {
        "id_feedback": "FDB-20251023093012-4561",
        "data_registro": gerar_data_passada(5),
        "id_recomendacao": RECOMENDACOES_HISTORICO[3]["id_recomendacao"],
        "id_produto": "NB001",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Compra para trabalho. Cliente satisfeito."
    },
    {
        "id_feedback": "FDB-20251023093045-4562",
        "data_registro": gerar_data_passada(5),
        "id_recomendacao": RECOMENDACOES_HISTORICO[3]["id_recomendacao"],
        "id_produto": "MN001",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Levou monitor junto com notebook"
    },
    {
        "id_feedback": "FDB-20251023093112-4563",
        "data_registro": gerar_data_passada(5),
        "id_recomendacao": RECOMENDACOES_HISTORICO[3]["id_recomendacao"],
        "id_produto": "PR001",
        "aceito": False,
        "comprado": False,
        "motivo_recusa": "Achou o mouse muito caro",
        "observacoes": "Cliente pediu alternativas mais baratas"
    },
    
    # Feedbacks para Carlos Mendes (CLI005) - Dia 7
    {
        "id_feedback": "FDB-20251021173522-5671",
        "data_registro": gerar_data_passada(7),
        "id_recomendacao": RECOMENDACOES_HISTORICO[4]["id_recomendacao"],
        "id_produto": "NB005",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Cliente VIP. Setup gamer completo!"
    },
    {
        "id_feedback": "FDB-20251021173545-5672",
        "data_registro": gerar_data_passada(7),
        "id_recomendacao": RECOMENDACOES_HISTORICO[4]["id_recomendacao"],
        "id_produto": "MN003",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Levou o monitor 4K. Excelente venda!"
    },
    {
        "id_feedback": "FDB-20251021173601-5673",
        "data_registro": gerar_data_passada(7),
        "id_recomendacao": RECOMENDACOES_HISTORICO[4]["id_recomendacao"],
        "id_produto": "PR002",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Teclado mecânico comprado também"
    },
    {
        "id_feedback": "FDB-20251021173622-5674",
        "data_registro": gerar_data_passada(7),
        "id_recomendacao": RECOMENDACOES_HISTORICO[4]["id_recomendacao"],
        "id_produto": "PR003",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Setup completo! Cliente gastou mais de R$ 10.000"
    },
    
    # Feedbacks para Juliana Ferreira (CLI006) - Dia 10
    {
        "id_feedback": "FDB-20251018113012-6781",
        "data_registro": gerar_data_passada(10),
        "id_recomendacao": RECOMENDACOES_HISTORICO[5]["id_recomendacao"],
        "id_produto": "SM001",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Cliente Apple fiel. Comprou iPhone."
    },
    {
        "id_feedback": "FDB-20251018113045-6782",
        "data_registro": gerar_data_passada(10),
        "id_recomendacao": RECOMENDACOES_HISTORICO[5]["id_recomendacao"],
        "id_produto": "TB001",
        "aceito": False,
        "comprado": False,
        "motivo_recusa": "Cliente já possui iPad",
        "observacoes": None
    },
    {
        "id_feedback": "FDB-20251018113112-6783",
        "data_registro": gerar_data_passada(10),
        "id_recomendacao": RECOMENDACOES_HISTORICO[5]["id_recomendacao"],
        "id_produto": "AC001",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Carregador adicional. Boa venda complementar."
    },
    
    # Feedbacks para Roberto Lima (CLI007) - Dia 12
    {
        "id_feedback": "FDB-20251016143522-7891",
        "data_registro": gerar_data_passada(12),
        "id_recomendacao": RECOMENDACOES_HISTORICO[6]["id_recomendacao"],
        "id_produto": "SM003",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "Cliente procurava custo-benefício. Perfeito!"
    },
    {
        "id_feedback": "FDB-20251016143545-7892",
        "data_registro": gerar_data_passada(12),
        "id_recomendacao": RECOMENDACOES_HISTORICO[6]["id_recomendacao"],
        "id_produto": "TB003",
        "aceito": True,
        "comprado": False,
        "motivo_recusa": None,
        "observacoes": "Cliente gostou mas não tinha verba no momento"
    },
    {
        "id_feedback": "FDB-20251016143601-7893",
        "data_registro": gerar_data_passada(12),
        "id_recomendacao": RECOMENDACOES_HISTORICO[6]["id_recomendacao"],
        "id_produto": "AR001",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "SSD para upgrade. Ótima venda adicional."
    },
    {
        "id_feedback": "FDB-20251016143622-7894",
        "data_registro": gerar_data_passada(12),
        "id_recomendacao": RECOMENDACOES_HISTORICO[6]["id_recomendacao"],
        "id_produto": "AC003",
        "aceito": False,
        "comprado": False,
        "motivo_recusa": "Cliente não viu necessidade",
        "observacoes": "Produto não era prioridade"
    },
    
    # Feedbacks para Fernanda Alves (CLI008) - Dia 15
    {
        "id_feedback": "FDB-20251013163012-8901",
        "data_registro": gerar_data_passada(15),
        "id_recomendacao": RECOMENDACOES_HISTORICO[7]["id_recomendacao"],
        "id_produto": "NB003",
        "aceito": True,
        "comprado": True,
        "motivo_recusa": None,
        "observacoes": "MacBook Air M2! Venda premium confirmada. Cliente adorou!"
    },
    {
        "id_feedback": "FDB-20251013163045-8902",
        "data_registro": gerar_data_passada(15),
        "id_recomendacao": RECOMENDACOES_HISTORICO[7]["id_recomendacao"],
        "id_produto": "SM005",
        "aceito": True,
        "comprado": False,
        "motivo_recusa": None,
        "observacoes": "Cliente demonstrou interesse. Potencial compra futura."
    }
]

# ============================================
# ESTATÍSTICAS CALCULADAS
# ============================================

# Total de recomendações: 8 clientes
# Total de produtos recomendados: 33
# Total de feedbacks: 29
# Feedbacks positivos (aceito=True): 23 (79.3%)
# Vendas confirmadas (comprado=True): 18 (62.1%)
# Taxa de conversão real: 18/33 = 54.5%


# ============================================
# FUNÇÕES AUXILIARES - SIMULAÇÃO DE IA
# ============================================

def simular_score_ia():
    """Simula score de confiança da IA entre 65-98%"""
    return round(random.uniform(65.0, 98.0), 2)

def gerar_motivo_recomendacao(cliente_info: ClienteInfo, produto: dict) -> str:
    """Gera motivo personalizado baseado no perfil do cliente"""
    motivos = []
    
    # Baseado no histórico de categorias
    if cliente_info.historico_categorias:
        if produto["categoria"] in cliente_info.historico_categorias:
            motivos.append(f"Você já comprou produtos de {produto['categoria']}")
        else:
            categorias_complementares = {
                "Notebooks": ["Periféricos", "Monitores", "Acessórios"],
                "Smartphones": ["Acessórios", "Armazenamento"],
                "Tablets": ["Acessórios", "Periféricos"],
            }
            for cat_comprada in cliente_info.historico_categorias:
                if cat_comprada in categorias_complementares:
                    if produto["categoria"] in categorias_complementares[cat_comprada]:
                        motivos.append(f"Complementa seu {cat_comprada}")
    
    # Baseado no valor médio de compra
    if cliente_info.valor_medio_compra:
        if abs(produto["preco"] - cliente_info.valor_medio_compra) < 1000:
            motivos.append(f"Dentro da sua faixa de preço habitual")
        elif produto["preco"] < cliente_info.valor_medio_compra:
            motivos.append(f"Excelente custo-benefício para você")
    
    # Baseado na frequência
    if cliente_info.frequencia_compra == "Alta":
        motivos.append("Cliente VIP - produto em destaque")
    
    # Baseado nas tags do produto
    if "custo-beneficio" in produto["tags"] and cliente_info.valor_medio_compra and cliente_info.valor_medio_compra < 3000:
        motivos.append("Melhor custo-benefício da categoria")
    
    if "premium" in produto["tags"] and cliente_info.valor_medio_compra and cliente_info.valor_medio_compra > 5000:
        motivos.append("Produto premium recomendado")
    
    # Motivos genéricos da IA
    motivos_genericos = [
        "Tendência de compra identificada pela IA",
        "Produto mais vendido para perfis similares",
        "Alta taxa de satisfação entre clientes parecidos",
        "Promoção exclusiva detectada",
        "Estoque limitado - oportunidade única"
    ]
    
    if not motivos:
        motivos.append(random.choice(motivos_genericos))
    
    return " | ".join(motivos[:2])  # Máximo 2 motivos

def aplicar_desconto_personalizado(preco: float, cliente_info: ClienteInfo) -> float:
    """Aplica desconto personalizado baseado no perfil"""
    desconto = 0.0
    
    # Cliente VIP
    if cliente_info.frequencia_compra == "Alta":
        desconto = random.uniform(5.0, 15.0)
    
    # Primeira compra na categoria
    elif not cliente_info.historico_categorias:
        desconto = random.uniform(3.0, 10.0)
    
    # Desconto aleatório ocasional
    elif random.random() < 0.3:  # 30% de chance
        desconto = random.uniform(2.0, 8.0)
    
    return round(desconto, 2)

def selecionar_produtos_ia(cliente_info: ClienteInfo, quantidade: int = 5) -> List[dict]:
    """
    Algoritmo de IA simulado para selecionar produtos
    Considera: histórico, preço médio, frequência e categorias
    """
    produtos_candidatos = PRODUTOS_MOCK.copy()
    random.shuffle(produtos_candidatos)
    
    # Peso maior para categorias já compradas
    produtos_priorizados = []
    produtos_novos = []
    
    for produto in produtos_candidatos:
        if cliente_info.historico_categorias and produto["categoria"] in cliente_info.historico_categorias:
            produtos_priorizados.append(produto)
        else:
            produtos_novos.append(produto)
    
    # Mix: 60% produtos de categorias conhecidas, 40% novos
    num_priorizados = int(quantidade * 0.6)
    num_novos = quantidade - num_priorizados
    
    selecionados = (
        produtos_priorizados[:num_priorizados] + 
        produtos_novos[:num_novos]
    )
    
    # Garantir que temos a quantidade solicitada
    if len(selecionados) < quantidade:
        selecionados += produtos_candidatos[:quantidade - len(selecionados)]
    
    return selecionados[:quantidade]

def gerar_id_recomendacao() -> str:
    """Gera ID único para recomendação"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = random.randint(1000, 9999)
    return f"REC-{timestamp}-{random_suffix}"

def gerar_id_feedback() -> str:
    """Gera ID único para feedback"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = random.randint(1000, 9999)
    return f"FDB-{timestamp}-{random_suffix}"

# ============================================
# ENDPOINTS DA API
# ============================================

@router.post("/gerar", response_model=RecomendacaoResponse)
def gerar_recomendacao(cliente: ClienteInfo, quantidade: int = Query(default=5, ge=1, le=20)):
    """
    Gera recomendações personalizadas usando IA simulada
    
    - **cliente**: Informações do cliente para personalização
    - **quantidade**: Número de produtos a recomendar (1-20)
    
    Retorna lista de produtos recomendados com scores de confiança
    """
    try:
        inicio = datetime.now()
        
        # Simular processamento da IA
        produtos_selecionados = selecionar_produtos_ia(cliente, quantidade)
        
        # Montar lista de produtos recomendados
        produtos_recomendados = []
        for produto in produtos_selecionados:
            desconto = aplicar_desconto_personalizado(produto["preco"], cliente)
            preco_final = produto["preco"] * (1 - desconto / 100)
            
            produto_rec = ProdutoRecomendado(
                id_produto=produto["id"],
                nome=produto["nome"],
                categoria=produto["categoria"],
                preco=produto["preco"],
                desconto=desconto,
                preco_final=round(preco_final, 2),
                confianca_ia=simular_score_ia(),
                motivo_recomendacao=gerar_motivo_recomendacao(cliente, produto),
                estoque_disponivel=produto["estoque"],
                url_imagem=f"https://api.shopinfo.com/images/{produto['id']}.jpg",
                tags=produto["tags"]
            )
            produtos_recomendados.append(produto_rec)
        
        # Ordenar por confiança da IA
        produtos_recomendados.sort(key=lambda x: x.confianca_ia, reverse=True)
        
        # Calcular tempo de processamento
        fim = datetime.now()
        tempo_ms = int((fim - inicio).total_seconds() * 1000)
        
        # Criar resposta
        id_rec = gerar_id_recomendacao()
        recomendacao = RecomendacaoResponse(
            id_recomendacao=id_rec,
            id_cliente=cliente.id_cliente,
            nome_cliente=cliente.nome,
            data_geracao=datetime.now().isoformat(),
            produtos_recomendados=produtos_recomendados,
            total_recomendacoes=len(produtos_recomendados),
            algoritmo_usado="Collaborative Filtering + Content-Based + Neural Network (Simulado)",
            tempo_processamento_ms=tempo_ms,
            metadados={
                "perfil_cliente": {
                    "historico_categorias": cliente.historico_categorias or [],
                    "valor_medio": cliente.valor_medio_compra,
                    "frequencia": cliente.frequencia_compra
                },
                "confianca_media": round(sum(p.confianca_ia for p in produtos_recomendados) / len(produtos_recomendados), 2),
                "desconto_medio": round(sum(p.desconto for p in produtos_recomendados) / len(produtos_recomendados), 2),
                "versao_modelo": "v2.3.1"
            }
        )
        
        # Salvar no histórico
        RECOMENDACOES_HISTORICO.append(recomendacao.dict())
        
        return recomendacao
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar recomendação: {str(e)}")

@router.get("/cliente/{id_cliente}", response_model=List[RecomendacaoResponse])
def listar_recomendacoes_cliente(
    id_cliente: str,
    limite: int = Query(default=10, ge=1, le=50, description="Máximo de recomendações a retornar"),
    ordem: str = Query(default="recente", regex="^(recente|antiga|confianca)$", description="Ordenação: recente, antiga ou confianca")
):
    """
    Lista todas as recomendações geradas para um cliente específico
    
    **Parâmetros:**
    - `id_cliente`: ID único do cliente (ex: CLI001, CLI002, etc)
    - `limite`: Quantidade máxima de resultados (1-50, padrão: 10)
    - `ordem`: Critério de ordenação
      - `recente`: Mais recentes primeiro (padrão)
      - `antiga`: Mais antigas primeiro
      - `confianca`: Maior confiança da IA primeiro
    
    **Retorna:**
    - Lista de recomendações com produtos e metadados
    - Array vazio se cliente não tiver recomendações
    
    **Exemplos de IDs válidos:**
    - CLI001 (Maria Santos)
    - CLI002 (João Silva)
    - CLI003 (Ana Costa)
    - CLI004 (Pedro Oliveira)
    - CLI005 (Carlos Mendes)
    - CLI006 (Juliana Ferreira)
    - CLI007 (Roberto Lima)
    - CLI008 (Fernanda Alves)
    
    **Exemplo de uso:**
    ```
    GET /api/recomendacoes/cliente/CLI001?limite=5&ordem=recente
    ```
    """
    
    # Filtrar recomendações do histórico para este cliente
    recomendacoes_cliente = [
        rec for rec in RECOMENDACOES_HISTORICO 
        if rec["id_cliente"] == id_cliente
    ]
    
    # Se não encontrou nenhuma recomendação
    if not recomendacoes_cliente:
        # Verificar se é um ID de cliente válido (formato CLIxxx)
        import re
        if not re.match(r'^CLI\d{3}$', id_cliente):
            raise HTTPException(
                status_code=400,
                detail=f"ID de cliente inválido: '{id_cliente}'. Use o formato CLIxxx (ex: CLI001)"
            )
        
        # Cliente válido mas sem recomendações
        raise HTTPException(
            status_code=404,
            detail=f"Nenhuma recomendação encontrada para o cliente '{id_cliente}'. "
                   f"Use o endpoint POST /api/recomendacoes/gerar para criar novas recomendações."
        )
    
    # Aplicar ordenação
    if ordem == "recente":
        # Ordenar por data de geração (mais recente primeiro)
        recomendacoes_cliente.sort(
            key=lambda x: x["data_geracao"], 
            reverse=True
        )
    elif ordem == "antiga":
        # Ordenar por data de geração (mais antiga primeiro)
        recomendacoes_cliente.sort(
            key=lambda x: x["data_geracao"]
        )
    elif ordem == "confianca":
        # Ordenar por confiança média da IA (maior primeiro)
        recomendacoes_cliente.sort(
            key=lambda x: x["metadados"]["confianca_media"],
            reverse=True
        )
    
    # Aplicar limite
    recomendacoes_limitadas = recomendacoes_cliente[:limite]
    
    # Retornar lista de recomendações
    return recomendacoes_limitadas


@router.get("/cliente/{id_cliente}/resumo")
def obter_resumo_cliente(id_cliente: str):
    """
    Retorna resumo estatístico das recomendações de um cliente
    
    **Parâmetros:**
    - `id_cliente`: ID único do cliente
    
    **Retorna:**
    - Total de recomendações geradas
    - Total de produtos recomendados
    - Confiança média da IA
    - Desconto médio aplicado
    - Categorias mais recomendadas
    - Taxa de aceitação (baseada em feedbacks)
    - Última recomendação
    
    **Exemplo:**
    ```
    GET /api/recomendacoes/cliente/CLI001/resumo
    ```
    """
    
    # Filtrar recomendações do cliente
    recomendacoes_cliente = [
        rec for rec in RECOMENDACOES_HISTORICO 
        if rec["id_cliente"] == id_cliente
    ]
    
    if not recomendacoes_cliente:
        raise HTTPException(
            status_code=404,
            detail=f"Cliente '{id_cliente}' não encontrado no histórico de recomendações"
        )
    
    # Calcular estatísticas
    total_recomendacoes = len(recomendacoes_cliente)
    
    # Total de produtos
    total_produtos = sum(
        len(rec["produtos_recomendados"]) 
        for rec in recomendacoes_cliente
    )
    
    # Confiança média
    confiancas = [
        rec["metadados"]["confianca_media"] 
        for rec in recomendacoes_cliente
    ]
    confianca_media = round(sum(confiancas) / len(confiancas), 2)
    
    # Desconto médio
    descontos = [
        rec["metadados"]["desconto_medio"] 
        for rec in recomendacoes_cliente
    ]
    desconto_medio = round(sum(descontos) / len(descontos), 2)
    
    # Categorias mais recomendadas
    categorias_count = {}
    for rec in recomendacoes_cliente:
        for produto in rec["produtos_recomendados"]:
            cat = produto["categoria"]
            categorias_count[cat] = categorias_count.get(cat, 0) + 1
    
    categorias_top = sorted(
        categorias_count.items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:5]
    
    # Feedbacks do cliente
    feedbacks_cliente = [
        fb for fb in FEEDBACKS_HISTORICO
        if any(
            rec["id_recomendacao"] == fb["id_recomendacao"]
            for rec in recomendacoes_cliente
        )
    ]
    
    # Taxa de aceitação
    total_feedbacks = len(feedbacks_cliente)
    feedbacks_aceitos = len([fb for fb in feedbacks_cliente if fb["aceito"]])
    feedbacks_comprados = len([fb for fb in feedbacks_cliente if fb.get("comprado")])
    
    taxa_aceitacao = round((feedbacks_aceitos / total_feedbacks * 100), 1) if total_feedbacks > 0 else 0
    taxa_conversao = round((feedbacks_comprados / total_feedbacks * 100), 1) if total_feedbacks > 0 else 0
    
    # Última recomendação
    ultima_recomendacao = max(
        recomendacoes_cliente, 
        key=lambda x: x["data_geracao"]
    )
    
    # Perfil do cliente (do último registro)
    perfil_cliente = ultima_recomendacao["metadados"]["perfil_cliente"]
    
    return {
        "id_cliente": id_cliente,
        "nome_cliente": ultima_recomendacao["nome_cliente"],
        "resumo": {
            "total_recomendacoes": total_recomendacoes,
            "total_produtos_recomendados": total_produtos,
            "confianca_media_ia": confianca_media,
            "desconto_medio_aplicado": desconto_medio,
            "ultima_recomendacao": ultima_recomendacao["data_geracao"]
        },
        "categorias_favoritas": [
            {"categoria": cat, "quantidade": qtd}
            for cat, qtd in categorias_top
        ],
        "performance": {
            "total_feedbacks": total_feedbacks,
            "feedbacks_positivos": feedbacks_aceitos,
            "compras_realizadas": feedbacks_comprados,
            "taxa_aceitacao_percent": taxa_aceitacao,
            "taxa_conversao_percent": taxa_conversao
        },
        "perfil": perfil_cliente
    }


@router.get("/cliente/{id_cliente}/produtos")
def listar_produtos_recomendados_cliente(
    id_cliente: str,
    categoria: Optional[str] = Query(None, description="Filtrar por categoria"),
    min_confianca: float = Query(0.0, ge=0.0, le=100.0, description="Confiança mínima da IA"),
    limite: int = Query(50, ge=1, le=100)
):
    """
    Lista TODOS os produtos já recomendados para um cliente (consolidado)
    
    **Parâmetros:**
    - `id_cliente`: ID único do cliente
    - `categoria`: Filtrar por categoria específica (opcional)
    - `min_confianca`: Confiança mínima da IA (0-100, padrão: 0)
    - `limite`: Máximo de produtos (1-100, padrão: 50)
    
    **Retorna:**
    - Lista consolidada de todos produtos já recomendados
    - Ordenados por confiança da IA (maior primeiro)
    - Remove duplicatas (mesmo produto recomendado múltiplas vezes)
    
    **Exemplo:**
    ```
    GET /api/recomendacoes/cliente/CLI001/produtos?categoria=Notebooks&min_confianca=85
    ```
    """
    
    # Filtrar recomendações do cliente
    recomendacoes_cliente = [
        rec for rec in RECOMENDACOES_HISTORICO 
        if rec["id_cliente"] == id_cliente
    ]
    
    if not recomendacoes_cliente:
        raise HTTPException(
            status_code=404,
            detail=f"Cliente '{id_cliente}' não possui recomendações"
        )
    
    # Consolidar todos os produtos (usar dict para evitar duplicatas)
    produtos_consolidados = {}
    
    for rec in recomendacoes_cliente:
        for produto in rec["produtos_recomendados"]:
            id_prod = produto["id_produto"]
            
            # Se produto já existe, manter o de maior confiança
            if id_prod not in produtos_consolidados or \
               produto["confianca_ia"] > produtos_consolidados[id_prod]["confianca_ia"]:
                produtos_consolidados[id_prod] = produto
    
    # Converter para lista
    produtos_lista = list(produtos_consolidados.values())
    
    # Aplicar filtro de categoria
    if categoria:
        produtos_lista = [
            p for p in produtos_lista 
            if p["categoria"].lower() == categoria.lower()
        ]
    
    # Aplicar filtro de confiança mínima
    produtos_lista = [
        p for p in produtos_lista 
        if p["confianca_ia"] >= min_confianca
    ]
    
    # Ordenar por confiança (maior primeiro)
    produtos_lista.sort(key=lambda x: x["confianca_ia"], reverse=True)
    
    # Aplicar limite
    produtos_limitados = produtos_lista[:limite]
    
    return {
        "id_cliente": id_cliente,
        "total_produtos_unicos": len(produtos_limitados),
        "filtros_aplicados": {
            "categoria": categoria,
            "confianca_minima": min_confianca,
            "limite": limite
        },
        "produtos": produtos_limitados
    }

@router.post("/feedback", response_model=FeedbackResponse)
def registrar_feedback(feedback: FeedbackRequest):
    """
    Registra feedback do vendedor sobre a recomendação
    Usado para melhorar o modelo de IA
    
    - **feedback**: Dados do feedback (aceito, comprado, motivo de recusa)
    
    Contribui para o aprendizado contínuo do modelo
    """
    try:
        # Validar se a recomendação existe
        recomendacao_existe = any(
            r["id_recomendacao"] == feedback.id_recomendacao 
            for r in RECOMENDACOES_HISTORICO
        )
        
        if not recomendacao_existe:
            raise HTTPException(
                status_code=404, 
                detail=f"Recomendação {feedback.id_recomendacao} não encontrada"
            )
        
        # Gerar ID do feedback
        id_feedback = gerar_id_feedback()
        
        # Determinar contribuição para aprendizado
        if feedback.comprado:
            contribuicao = "CRÍTICO - Reforça padrão de sucesso"
        elif feedback.aceito:
            contribuicao = "ALTO - Valida relevância da recomendação"
        elif feedback.motivo_recusa:
            contribuicao = "MÉDIO - Ajusta pesos do modelo"
        else:
            contribuicao = "BAIXO - Registro estatístico"
        
        # Salvar feedback
        feedback_data = {
            "id_feedback": id_feedback,
            "data_registro": datetime.now().isoformat(),
            **feedback.dict()
        }
        FEEDBACKS_HISTORICO.append(feedback_data)
        
        # Mensagem de retorno
        if feedback.comprado:
            mensagem = "🎉 Feedback registrado! Venda confirmada - modelo será otimizado."
        elif feedback.aceito:
            mensagem = "✅ Feedback registrado! Cliente aceitou a recomendação."
        else:
            mensagem = f"📝 Feedback registrado! Motivo: {feedback.motivo_recusa or 'Não especificado'}"
        
        return FeedbackResponse(
            success=True,
            message=mensagem,
            id_feedback=id_feedback,
            contribuicao_aprendizado=contribuicao
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao registrar feedback: {str(e)}")

@router.get("/historico", response_model=List[RecomendacaoResponse])
def listar_historico(
    limite: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """
    Lista histórico de recomendações geradas
    
    - **limite**: Número máximo de registros (1-100)
    - **offset**: Paginação - quantidade de registros a pular
    """
    historico_ordenado = sorted(
        RECOMENDACOES_HISTORICO, 
        key=lambda x: x["data_geracao"], 
        reverse=True
    )
    
    return historico_ordenado[offset:offset+limite]

@router.get("/historico/{id_recomendacao}", response_model=RecomendacaoResponse)
def buscar_recomendacao(id_recomendacao: str):
    """
    Busca uma recomendação específica pelo ID
    
    - **id_recomendacao**: ID único da recomendação
    """
    recomendacao = next(
        (r for r in RECOMENDACOES_HISTORICO if r["id_recomendacao"] == id_recomendacao),
        None
    )
    
    if not recomendacao:
        raise HTTPException(
            status_code=404,
            detail=f"Recomendação {id_recomendacao} não encontrada"
        )
    
    return recomendacao

@router.get("/estatisticas", response_model=EstatisticasIA)
def obter_estatisticas():
    """
    Retorna estatísticas do modelo de IA e suas recomendações
    
    Inclui métricas de desempenho, taxas de conversão e insights
    """
    total_recomendacoes = len(RECOMENDACOES_HISTORICO)
    
    if total_recomendacoes == 0:
        return EstatisticasIA(
            total_recomendacoes_geradas=0,
            taxa_aceitacao=0.0,
            taxa_conversao=0.0,
            categorias_mais_recomendadas=[],
            horarios_pico=[],
            desempenho_modelo={}
        )
    
    # Calcular taxas de aceitação e conversão
    total_feedbacks = len(FEEDBACKS_HISTORICO)
    aceitos = sum(1 for f in FEEDBACKS_HISTORICO if f["aceito"])
    comprados = sum(1 for f in FEEDBACKS_HISTORICO if f.get("comprado", False))
    
    taxa_aceitacao = (aceitos / total_feedbacks * 100) if total_feedbacks > 0 else 0
    taxa_conversao = (comprados / total_feedbacks * 100) if total_feedbacks > 0 else 0
    
    # Categorias mais recomendadas
    categorias_count = {}
    for rec in RECOMENDACOES_HISTORICO:
        for produto in rec["produtos_recomendados"]:
            cat = produto["categoria"]
            categorias_count[cat] = categorias_count.get(cat, 0) + 1
    
    categorias_top = [
        {"categoria": cat, "quantidade": count}
        for cat, count in sorted(categorias_count.items(), key=lambda x: x[1], reverse=True)[:5]
    ]
    
    # Horários de pico (simulado)
    horarios = ["09:00-12:00", "14:00-17:00", "19:00-21:00"]
    
    return EstatisticasIA(
        total_recomendacoes_geradas=total_recomendacoes,
        taxa_aceitacao=round(taxa_aceitacao, 2),
        taxa_conversao=round(taxa_conversao, 2),
        categorias_mais_recomendadas=categorias_top,
        horarios_pico=horarios,
        desempenho_modelo={
            "acuracia": 87.5,
            "precision": 84.2,
            "recall": 89.1,
            "f1_score": 86.6,
            "ultima_atualizacao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "versao": "v2.3.1",
            "algoritmo": "Hybrid Recommender (CF + CB + DNN)"
        }
    )

@router.delete("/historico/limpar")
def limpar_historico():
    """
    Limpa todo o histórico de recomendações e feedbacks
    ⚠️ Usar apenas em ambiente de desenvolvimento/teste
    """
    RECOMENDACOES_HISTORICO.clear()
    FEEDBACKS_HISTORICO.clear()
    
    return {
        "success": True,
        "message": "Histórico de recomendações e feedbacks limpo com sucesso",
        "timestamp": datetime.now().isoformat()
    }