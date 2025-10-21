"""
Script para popular o banco de dados com dados iniciais
Útil para testes e demonstrações
"""
from datetime import datetime, timedelta
import random
from database import get_db_context
from models import Usuario, TipoUsuario, StatusUsuario
import hashlib

def hash_senha(senha: str) -> str:
    """Hash simples para senha"""
    return hashlib.sha256(senha.encode()).hexdigest()

def seed_usuarios():
    """Cria usuários de exemplo"""
    
    usuarios_exemplo = [
        {
            'nome': 'Admin Sistema',
            'email': 'admin@shopinfo.com',
            'senha': 'admin123',
            'tipo': TipoUsuario.ADMIN,
            'status': StatusUsuario.ATIVO,
            'departamento': 'TI',
            'telefone': '(85) 3333-1111',
            'ultimo_acesso': datetime.utcnow() - timedelta(hours=2)
        },
        {
            'nome': 'Maria Silva',
            'email': 'maria.silva@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.GESTOR,
            'status': StatusUsuario.ATIVO,
            'departamento': 'Vendas',
            'telefone': '(85) 98888-2222',
            'ultimo_acesso': datetime.utcnow() - timedelta(days=1)
        },
        {
            'nome': 'João Santos',
            'email': 'joao.santos@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.VENDEDOR,
            'status': StatusUsuario.ATIVO,
            'departamento': 'Vendas',
            'telefone': '(85) 99999-3333',
            'ultimo_acesso': datetime.utcnow() - timedelta(hours=5)
        },
        {
            'nome': 'Ana Costa',
            'email': 'ana.costa@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.VENDEDOR,
            'status': StatusUsuario.ATIVO,
            'departamento': 'Vendas',
            'telefone': '(85) 97777-4444',
            'ultimo_acesso': datetime.utcnow() - timedelta(hours=12)
        },
        {
            'nome': 'Carlos Oliveira',
            'email': 'carlos.oliveira@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.GESTOR,
            'status': StatusUsuario.ATIVO,
            'departamento': 'Marketing',
            'telefone': '(85) 96666-5555',
            'ultimo_acesso': datetime.utcnow() - timedelta(days=2)
        },
        {
            'nome': 'Paula Mendes',
            'email': 'paula.mendes@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.VENDEDOR,
            'status': StatusUsuario.ATIVO,
            'departamento': 'Vendas',
            'telefone': '(85) 95555-6666',
            'ultimo_acesso': datetime.utcnow() - timedelta(hours=24)
        },
        {
            'nome': 'Ricardo Alves',
            'email': 'ricardo.alves@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.VENDEDOR,
            'status': StatusUsuario.INATIVO,
            'departamento': 'Vendas',
            'telefone': '(85) 94444-7777',
            'ultimo_acesso': datetime.utcnow() - timedelta(days=30)
        },
        {
            'nome': 'Fernanda Lima',
            'email': 'fernanda.lima@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.VENDEDOR,
            'status': StatusUsuario.ATIVO,
            'departamento': 'E-commerce',
            'telefone': '(85) 93333-8888',
            'ultimo_acesso': datetime.utcnow() - timedelta(hours=3)
        },
        {
            'nome': 'Roberto Souza',
            'email': 'roberto.souza@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.GESTOR,
            'status': StatusUsuario.ATIVO,
            'departamento': 'TI',
            'telefone': '(85) 92222-9999',
            'ultimo_acesso': datetime.utcnow() - timedelta(hours=8)
        },
        {
            'nome': 'Juliana Rocha',
            'email': 'juliana.rocha@shopinfo.com',
            'senha': 'senha123',
            'tipo': TipoUsuario.VENDEDOR,
            'status': StatusUsuario.BLOQUEADO,
            'departamento': 'Vendas',
            'telefone': '(85) 91111-0000',
            'ultimo_acesso': datetime.utcnow() - timedelta(days=15)
        }
    ]
    
    with get_db_context() as db:
        # Verifica se já existem usuários
        count = db.query(Usuario).count()
        if count > 0:
            print(f"⚠️  Banco já possui {count} usuário(s). Deseja limpar? (s/n)")
            resposta = input().lower()
            if resposta == 's':
                db.query(Usuario).delete()
                db.commit()
                print("✅ Usuários anteriores removidos")
            else:
                print("❌ Operação cancelada")
                return
        
        # Criar usuários
        print("\n📝 Criando usuários de exemplo...")
        for dados in usuarios_exemplo:
            usuario = Usuario(
                nome=dados['nome'],
                email=dados['email'],
                senha_hash=hash_senha(dados['senha']),
                tipo=dados['tipo'],
                status=dados['status'],
                departamento=dados['departamento'],
                telefone=dados['telefone'],
                ultimo_acesso=dados['ultimo_acesso']
            )
            db.add(usuario)
            print(f"  ✓ {dados['nome']} ({dados['email']})")
        
        db.commit()
        print(f"\n✅ {len(usuarios_exemplo)} usuários criados com sucesso!")
        print("\n📊 Resumo:")
        print(f"  • Admins: {sum(1 for u in usuarios_exemplo if u['tipo'] == TipoUsuario.ADMIN)}")
        print(f"  • Gestores: {sum(1 for u in usuarios_exemplo if u['tipo'] == TipoUsuario.GESTOR)}")
        print(f"  • Vendedores: {sum(1 for u in usuarios_exemplo if u['tipo'] == TipoUsuario.VENDEDOR)}")
        print(f"  • Ativos: {sum(1 for u in usuarios_exemplo if u['status'] == StatusUsuario.ATIVO)}")
        print(f"  • Inativos: {sum(1 for u in usuarios_exemplo if u['status'] == StatusUsuario.INATIVO)}")
        print(f"  • Bloqueados: {sum(1 for u in usuarios_exemplo if u['status'] == StatusUsuario.BLOQUEADO)}")
        print("\n🔐 Senha padrão para todos: senha123")
        print("   Admin: admin@shopinfo.com / admin123")

def main():
    """Função principal"""
    print("=" * 60)
    print("🌱 IARECOMEND - Seed Database")
    print("=" * 60)
    print("\nEste script irá popular o banco com dados de exemplo.")
    print("\n⚠️  ATENÇÃO: Todos os dados anteriores serão removidos!")
    print("\nDeseja continuar? (s/n)")
    
    resposta = input().lower()
    if resposta != 's':
        print("❌ Operação cancelada")
        return
    
    try:
        seed_usuarios()
        print("\n✅ Banco de dados populado com sucesso!")
        print("\n🚀 Agora você pode iniciar o backend e testar:")
        print("   python app.py")
        print("\n📱 Acesse o frontend em: http://localhost:5173")
        print("📚 Documentação da API: http://localhost:8000/docs")
    except Exception as e:
        print(f"\n❌ Erro ao popular banco: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()