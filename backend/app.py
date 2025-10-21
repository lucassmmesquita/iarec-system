"""
Aplicação principal FastAPI - IARECOMEND
Backend de recomendação de produtos
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Importações locais
from config import settings
from database import init_db, engine

# IMPORTANTE: Importar as rotas dos módulos
from routes.usuarios import router as usuarios_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerencia o ciclo de vida da aplicação
    Inicializa o banco de dados na inicialização
    """
    print("🚀 Iniciando IARECOMEND API...")
    init_db()
    print("✅ API pronta para uso!")
    yield
    print("👋 Encerrando IARECOMEND API...")

# Inicializa FastAPI
app = FastAPI(
    title="IARECOMEND API",
    description="API de Recomendação de Produtos com IA - SHOPINFO",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False  # Evita 307 redirects
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# REGISTRAR ROUTERS (IMPORTANTE!)
# ============================================
# Cada módulo tem seu próprio router em routes/
app.include_router(usuarios_router)  # Endpoints de usuários

# Futuros routers (quando criar os arquivos):
# from routes.fontes import router as fontes_router
# from routes.recomendacoes import router as recomendacoes_router
# app.include_router(fontes_router)
# app.include_router(recomendacoes_router)

# ============================================
# ENDPOINTS BÁSICOS (só health check aqui!)
# ============================================

@app.get("/")
def root():
    """Endpoint raiz com informações da API"""
    return {
        "message": "IARECOMEND API",
        "version": "1.0.0",
        "status": "online",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    """
    Endpoint de health check
    Verifica conexão com banco de dados
    """
    try:
        # Testa conexão com banco
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "database": "connected",
            "environment": settings.ENVIRONMENT
        }
    except Exception as e:
        raise HTTPException(
            status_code=503, 
            detail=f"Database error: {str(e)}"
        )

# ============================================
# INICIALIZAÇÃO
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG  # Auto-reload em desenvolvimento
    )