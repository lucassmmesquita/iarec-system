"""
Script para Popular Banco de Dados - Fontes de Dados
CRIAR ARQUIVO: backend/seed_fontes.py

Popula o banco com dados realistas de fontes de dados para demonstração
Uso: python seed_fontes.py
"""
import sys
import os
from datetime import datetime, timedelta
import random

# Adiciona o diretório backend ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import get_db_context
from models import FonteDados, TipoFonte, StatusFonte
import base64

def criptografar_senha(senha: str) -> str:
    """Criptografia simples para demonstração"""
    if not senha:
        return None
    return base64.b64encode(senha.encode()).decode()

def limpar_fontes():
    """Remove todas as fontes existentes"""
    with get_db_context() as db:
        fontes = db.query(FonteDados).all()
        for fonte in fontes:
            db.delete(fonte)
        print(f"🗑️  Removidas {len(fontes)} fontes existentes")

def criar_fontes_teste():
    """Cria fontes de dados realistas para demonstração"""
    
    fontes_mockadas = [
        # ===== BANCOS DE DADOS MYSQL =====
        {
            "nome": "MySQL - Vendas Principal",
            "tipo": TipoFonte.MYSQL,
            "status": StatusFonte.ATIVA,
            "host": "db-vendas-01.shopinfo.local",
            "port": 3306,
            "database": "vendas_producao",
            "username": "iarecomend_reader",
            "senha": "VendasSecure@2024",
            "frequencia_sync_horas": 6,
            "total_registros_importados": 127458,
            "total_erros": 0,
            "tempo_ultima_sync_segundos": 45.8,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=2),
            "parametros_adicionais": {
                "charset": "utf8mb4",
                "max_connections": 5,
                "timeout": 30
            }
        },
        {
            "nome": "MySQL - Histórico Clientes",
            "tipo": TipoFonte.MYSQL,
            "status": StatusFonte.ATIVA,
            "host": "db-clientes.shopinfo.local",
            "port": 3306,
            "database": "clientes_historico",
            "username": "clientes_ro",
            "senha": "ClientesRead@123",
            "frequencia_sync_horas": 12,
            "total_registros_importados": 89234,
            "total_erros": 3,
            "tempo_ultima_sync_segundos": 62.3,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=5),
            "mensagem_ultimo_erro": "3 registros com CPF inválido foram descartados",
            "parametros_adicionais": {
                "ssl_mode": "required",
                "charset": "utf8mb4"
            }
        },
        
        # ===== POSTGRESQL =====
        {
            "nome": "PostgreSQL - Estoque Central",
            "tipo": TipoFonte.POSTGRESQL,
            "status": StatusFonte.ATIVA,
            "host": "pg-estoque.aws.shopinfo.com",
            "port": 5432,
            "database": "estoque_db",
            "username": "estoque_sync",
            "senha": "EstoqueSecure#456",
            "frequencia_sync_horas": 4,
            "total_registros_importados": 45820,
            "total_erros": 0,
            "tempo_ultima_sync_segundos": 28.5,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=1),
            "parametros_adicionais": {
                "sslmode": "require",
                "application_name": "iarecomend"
            }
        },
        {
            "nome": "PostgreSQL - Analytics DW",
            "tipo": TipoFonte.POSTGRESQL,
            "status": StatusFonte.ATIVA,
            "host": "pg-analytics.shopinfo.com",
            "port": 5432,
            "database": "analytics_warehouse",
            "username": "analytics_reader",
            "senha": "Analytics@789",
            "frequencia_sync_horas": 24,
            "total_registros_importados": 234567,
            "total_erros": 12,
            "tempo_ultima_sync_segundos": 156.7,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=18),
            "mensagem_ultimo_erro": "12 registros duplicados foram mesclados",
            "parametros_adicionais": {
                "schema": "public",
                "query_timeout": 60
            }
        },
        
        # ===== SQL SERVER =====
        {
            "nome": "SQL Server - ERP Totvs",
            "tipo": TipoFonte.SQLSERVER,
            "status": StatusFonte.ATIVA,
            "host": "sqlserver-erp.shopinfo.local",
            "port": 1433,
            "database": "TOTVS_PROTHEUS",
            "username": "sa_readonly",
            "senha": "TotvsERP@2024",
            "frequencia_sync_horas": 8,
            "total_registros_importados": 98432,
            "total_erros": 5,
            "tempo_ultima_sync_segundos": 87.2,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=6),
            "mensagem_ultimo_erro": "5 pedidos sem data foram ignorados",
            "parametros_adicionais": {
                "driver": "ODBC Driver 17 for SQL Server",
                "encrypt": "yes",
                "trust_server_certificate": "yes"
            }
        },
        
        # ===== MONGODB =====
        {
            "nome": "MongoDB - Logs de Sistema",
            "tipo": TipoFonte.MONGODB,
            "status": StatusFonte.INATIVA,
            "host": "mongo-logs.shopinfo.com",
            "port": 27017,
            "database": "system_logs",
            "username": "logs_reader",
            "senha": "MongoLogs@123",
            "frequencia_sync_horas": 168,
            "total_registros_importados": 0,
            "total_erros": 0,
            "parametros_adicionais": {
                "authSource": "admin",
                "retryWrites": True
            }
        },
        
        # ===== APIS REST =====
        {
            "nome": "API - CRM Salesforce",
            "tipo": TipoFonte.API,
            "status": StatusFonte.ATIVA,
            "url_api": "https://shopinfo.my.salesforce.com/services/data/v58.0/query",
            "api_key": "Bearer 00D5g000008xY1Z!AQcAQH0dMm...",
            "frequencia_sync_horas": 12,
            "total_registros_importados": 12456,
            "total_erros": 2,
            "tempo_ultima_sync_segundos": 34.6,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=8),
            "mensagem_ultimo_erro": "2 leads sem email foram descartados",
            "headers_json": {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            "parametros_adicionais": {
                "endpoint": "leads",
                "fields": "Id,Name,Email,Status,CreatedDate",
                "rate_limit": 100
            }
        },
        {
            "nome": "API - E-commerce Vtex",
            "tipo": TipoFonte.API,
            "status": StatusFonte.ATIVA,
            "url_api": "https://shopinfo.vtexcommercestable.com.br/api/orders",
            "api_key": "vtex-appkey-shopinfo-ABCD1234",
            "frequencia_sync_horas": 6,
            "total_registros_importados": 34567,
            "total_erros": 0,
            "tempo_ultima_sync_segundos": 52.3,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=3),
            "headers_json": {
                "X-VTEX-API-AppKey": "vtex-appkey-shopinfo-ABCD1234",
                "X-VTEX-API-AppToken": "vtex-apptoken-ABC123XYZ789",
                "Content-Type": "application/json"
            },
            "parametros_adicionais": {
                "per_page": 100,
                "order_by": "createdDate,desc"
            }
        },
        {
            "nome": "API - Marketplace Mercado Livre",
            "tipo": TipoFonte.API,
            "status": StatusFonte.ERRO,
            "url_api": "https://api.mercadolibre.com/orders/search",
            "api_key": "APP_USR-1234567890-110824-abc123xyz",
            "frequencia_sync_horas": 24,
            "total_registros_importados": 8932,
            "total_erros": 47,
            "tempo_ultima_sync_segundos": 128.9,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(hours=26),
            "mensagem_ultimo_erro": "Token de acesso expirado. Renovar autenticação.",
            "headers_json": {
                "Authorization": "Bearer APP_USR-1234567890",
                "Content-Type": "application/json"
            },
            "parametros_adicionais": {
                "seller_id": "123456789",
                "status": "paid,confirmed"
            }
        },
        
        # ===== ARQUIVOS CSV =====
        {
            "nome": "CSV - Histórico Vendas 2023",
            "tipo": TipoFonte.CSV,
            "status": StatusFonte.ATIVA,
            "caminho_arquivo": "/data/historico/vendas_2023_completo.csv",
            "encoding": "utf-8",
            "delimiter": ",",
            "frequencia_sync_horas": 168,
            "total_registros_importados": 245678,
            "total_erros": 23,
            "tempo_ultima_sync_segundos": 234.5,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(days=5),
            "mensagem_ultimo_erro": "23 linhas com formato de data inválido",
            "parametros_adicionais": {
                "skip_rows": 1,
                "has_header": True,
                "date_format": "%Y-%m-%d",
                "decimal_separator": "."
            }
        },
        {
            "nome": "CSV - Catálogo Produtos Fornecedor",
            "tipo": TipoFonte.CSV,
            "status": StatusFonte.PENDENTE,
            "caminho_arquivo": "/imports/catalogo_fornecedor_abril.csv",
            "encoding": "iso-8859-1",
            "delimiter": ";",
            "frequencia_sync_horas": 24,
            "total_registros_importados": 0,
            "total_erros": 0,
            "parametros_adicionais": {
                "has_header": True,
                "decimal_separator": ","
            }
        },
        
        # ===== ARQUIVOS EXCEL =====
        {
            "nome": "Excel - Campanhas Marketing 2024",
            "tipo": TipoFonte.EXCEL,
            "status": StatusFonte.ATIVA,
            "caminho_arquivo": "/data/marketing/campanhas_q1_2024.xlsx",
            "frequencia_sync_horas": 48,
            "total_registros_importados": 4567,
            "total_erros": 0,
            "tempo_ultima_sync_segundos": 15.3,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(days=1),
            "parametros_adicionais": {
                "sheet_name": "Dados",
                "skip_rows": 2,
                "use_cols": "A:J"
            }
        },
        {
            "nome": "Excel - Orçamento Anual Filiais",
            "tipo": TipoFonte.EXCEL,
            "status": StatusFonte.INATIVA,
            "caminho_arquivo": "/data/financeiro/orcamento_2024_filiais.xlsx",
            "frequencia_sync_horas": 720,
            "total_registros_importados": 1234,
            "total_erros": 0,
            "tempo_ultima_sync_segundos": 8.7,
            "ultima_sincronizacao": datetime.utcnow() - timedelta(days=25),
            "parametros_adicionais": {
                "sheet_name": ["Filial SP", "Filial RJ", "Filial CE"],
                "merge_sheets": True
            }
        }
    ]
    
    print(f"\n🌱 Criando {len(fontes_mockadas)} fontes de dados...")
    
    with get_db_context() as db:
        for i, fonte_data in enumerate(fontes_mockadas, 1):
            # Criptografa senha se presente
            if 'senha' in fonte_data:
                fonte_data['senha_criptografada'] = criptografar_senha(fonte_data.pop('senha'))
            
            # Calcula próxima sincronização
            if fonte_data.get('ultima_sincronizacao'):
                fonte_data['proxima_sincronizacao'] = (
                    fonte_data['ultima_sincronizacao'] + 
                    timedelta(hours=fonte_data['frequencia_sync_horas'])
                )
            
            # Cria fonte
            fonte = FonteDados(**fonte_data)
            db.add(fonte)
            
            print(f"  {i}. ✅ {fonte.nome} ({fonte.tipo.value}) - Status: {fonte.status.value}")
    
    print(f"\n✅ {len(fontes_mockadas)} fontes criadas com sucesso!")

def exibir_resumo():
    """Exibe resumo das fontes criadas"""
    with get_db_context() as db:
        fontes = db.query(FonteDados).all()
        
        print("\n" + "="*80)
        print("📊 RESUMO DAS FONTES DE DADOS")
        print("="*80)
        
        # Contadores
        total = len(fontes)
        ativas = len([f for f in fontes if f.status == StatusFonte.ATIVA])
        inativas = len([f for f in fontes if f.status == StatusFonte.INATIVA])
        erro = len([f for f in fontes if f.status == StatusFonte.ERRO])
        pendentes = len([f for f in fontes if f.status == StatusFonte.PENDENTE])
        
        print(f"\n📈 ESTATÍSTICAS:")
        print(f"  • Total de fontes: {total}")
        print(f"  • Ativas: {ativas} 🟢")
        print(f"  • Inativas: {inativas} 🔵")
        print(f"  • Com erro: {erro} 🔴")
        print(f"  • Pendentes: {pendentes} 🟡")
        
        # Por tipo
        print(f"\n🗂️  POR TIPO:")
        tipos = {}
        for fonte in fontes:
            tipo = fonte.tipo.value
            tipos[tipo] = tipos.get(tipo, 0) + 1
        
        for tipo, count in sorted(tipos.items()):
            print(f"  • {tipo.upper()}: {count}")
        
        # Total de registros
        total_registros = sum(f.total_registros_importados for f in fontes)
        print(f"\n📦 REGISTROS IMPORTADOS:")
        print(f"  • Total acumulado: {total_registros:,} registros")
        
        # Fontes mais recentes
        print(f"\n🕐 ÚLTIMAS SINCRONIZAÇÕES:")
        fontes_sync = [f for f in fontes if f.ultima_sincronizacao]
        fontes_sync_ordenadas = sorted(fontes_sync, key=lambda x: x.ultima_sincronizacao, reverse=True)[:5]
        
        for fonte in fontes_sync_ordenadas:
            tempo_atras = datetime.utcnow() - fonte.ultima_sincronizacao
            horas = int(tempo_atras.total_seconds() / 3600)
            print(f"  • {fonte.nome}: há {horas}h ({fonte.total_registros_importados:,} registros)")
        
        print("\n" + "="*80)
        print("✅ Banco de dados populado e pronto para uso!")
        print("="*80)

def main():
    """Função principal"""
    print("\n" + "="*80)
    print("🚀 SCRIPT DE POPULAÇÃO - FONTES DE DADOS")
    print("="*80)
    
    try:
        # 1. Limpa fontes existentes
        print("\n📋 Passo 1: Limpando fontes existentes...")
        limpar_fontes()
        
        # 2. Cria novas fontes
        print("\n📋 Passo 2: Criando fontes de teste...")
        criar_fontes_teste()
        
        # 3. Exibe resumo
        print("\n📋 Passo 3: Gerando resumo...")
        exibir_resumo()
        
        print("\n\n🎉 Sucesso! Teste os endpoints:")
        print("  • GET  http://localhost:8000/api/fontes/")
        print("  • GET  http://localhost:8000/api/fontes/stats")
        print("  • Docs http://localhost:8000/docs")
        
    except Exception as e:
        print(f"\n❌ Erro ao popular banco: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())