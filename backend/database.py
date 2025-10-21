"""
Configuração do banco de dados PostgreSQL
Gerenciamento de conexões e sessões
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
from typing import Generator

# Importar configuração
from config import settings

# Engine do SQLAlchemy com pool de conexões
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,  # Número de conexões permanentes
    max_overflow=10,  # Conexões adicionais sob demanda
    pool_pre_ping=True,  # Verifica conexões antes de usar
    echo=settings.DEBUG  # Mostra SQL no console se DEBUG=True
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db() -> Generator[Session, None, None]:
    """
    Dependency para obter sessão do banco de dados
    Usar com FastAPI Depends
    
    Exemplo:
        @app.get("/usuarios")
        def listar(db: Session = Depends(get_db)):
            return db.query(Usuario).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@contextmanager
def get_db_context():
    """
    Context manager para usar fora do FastAPI
    
    Exemplo:
        with get_db_context() as db:
            usuario = db.query(Usuario).first()
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

def init_db():
    """
    Inicializa o banco de dados criando todas as tabelas
    """
    from models import Base
    
    print(f"\n🔧 Inicializando banco de dados...")
    print(f"📍 Conectando em: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Banco de dados inicializado com sucesso!")
        print(f"✅ Tabelas criadas: {', '.join(Base.metadata.tables.keys())}")
    except Exception as e:
        print(f"❌ Erro ao inicializar banco: {e}")
        raise

def drop_all_tables():
    """
    Remove todas as tabelas (USE COM CUIDADO!)
    """
    from models import Base
    
    print("\n⚠️  ATENÇÃO: Removendo todas as tabelas...")
    resposta = input("Tem certeza? (digite 'SIM' para confirmar): ")
    
    if resposta == "SIM":
        Base.metadata.drop_all(bind=engine)
        print("✅ Todas as tabelas foram removidas!")
    else:
        print("❌ Operação cancelada")

def test_connection():
    """
    Testa a conexão com o banco de dados
    """
    from sqlalchemy import text
    
    print(f"\n🔍 Testando conexão com banco de dados...")
    print(f"📍 Host: {settings.DB_HOST}")
    print(f"📍 Port: {settings.DB_PORT}")
    print(f"📍 Database: {settings.DB_NAME}")
    print(f"📍 User: {settings.DB_USER}")
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Conexão bem-sucedida!")
            return True
    except Exception as e:
        print(f"❌ Erro na conexão: {e}")
        print("\n💡 Dicas:")
        print("  1. Verifique se PostgreSQL está rodando")
        print("  2. Verifique credenciais no arquivo .env ou config.py")
        print("  3. Verifique se o banco de dados existe")
        print("  4. Para AWS RDS, verifique Security Group")
        return False

if __name__ == "__main__":
    """
    Permite executar comandos diretamente
    """
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "test":
            test_connection()
        elif command == "init":
            init_db()
        elif command == "drop":
            drop_all_tables()
        else:
            print("Comandos disponíveis:")
            print("  python database.py test  - Testa conexão")
            print("  python database.py init  - Cria tabelas")
            print("  python database.py drop  - Remove tabelas")
    else:
        test_connection()