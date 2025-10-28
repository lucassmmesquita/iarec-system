IARECOMEND - Sistema de Recomendação Inteligente de Produtos

📋 Sobre o Projeto
O IARECOMEND é uma solução completa de inteligência artificial desenvolvida para a SHOPINFO, focada em personalizar recomendações de produtos e aumentar a taxa de conversão de vendas.
Módulos do Sistema
🖥️ Módulo de Administração (Web)

Gestão de usuários e controle de acessos
Cadastro e configuração de fontes de dados
Curadoria de recomendações por amostragem
Relatórios estatísticos de performance e conversão

🤖 Módulo Recomendador (Backend)

Importação automatizada de dados históricos
Processamento com algoritmos de machine learning não supervisionado
Treinamento e refinamento contínuo do modelo
API REST para consulta de recomendações em tempo real

📱 App do Vendedor (Mobile)

Captura de informações do cliente no ponto de venda
Consulta instantânea de recomendações personalizadas
Sistema de feedback para melhoria do modelo
Envio de recomendações por e-mail

Objetivos

✅ Personalizar recomendações baseadas em histórico e perfil
✅ Aumentar ticket médio e taxa de conversão
✅ Otimizar gestão de estoque e campanhas de marketing
✅ Empoderar vendedores com insights de IA


🚀 Tecnologias Envolvidas
Frontend

React 18+ - Framework JavaScript para interfaces
Tailwind CSS - Framework CSS utility-first
Lucide React - Biblioteca de ícones moderna
Vite - Build tool e servidor de desenvolvimento
JavaScript ES6+ - Linguagem de programação

Backend

Python 3.8+ - Linguagem principal
FastAPI - Framework web assíncrono e performático
SQLAlchemy - ORM para mapeamento objeto-relacional
Pandas - Manipulação e análise de dados
Scikit-learn - Algoritmos de machine learning
Uvicorn - Servidor ASGI de alta performance

Banco de Dados

PostgreSQL - Banco relacional para produção
SQLite - Banco local para desenvolvimento

Machine Learning

Collaborative Filtering - Filtragem colaborativa
Content-Based Filtering - Filtragem baseada em conteúdo
K-Means / DBSCAN - Algoritmos de clustering


💻 Passo a Passo para Rodar o Frontend
Pré-requisitos

Node.js 16+ instalado (Download)
npm ou yarn

Instalação e Execução
bash# 1. Clone o repositório
git clone https://github.com/shopinfo/iarecomend.git
cd iarecomend

# 2. Navegue até a pasta do frontend
cd frontend

# 3. Instale as dependências
npm install
# ou
yarn install

# 4. Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev

# 5. Acesse no navegador
# http://localhost:5173
Credenciais Padrão (Desenvolvimento)

Usuário: admin@shopinfo.com
Senha: admin123

Scripts Disponíveis
bash# Desenvolvimento com hot-reload
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Lint do código
npm run lint

🔧 Passo a Passo para Rodar o Backend
Pré-requisitos

Python 3.8+ instalado (Download)
pip (gerenciador de pacotes Python)

Instalação e Execução
bash# 1. Navegue até a pasta do backend
cd backend

# 2. Crie um ambiente virtual
python -m venv venv

# 3. Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Instale as dependências
pip install -r requirements.txt

# 5. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 6. Execute as migrações do banco de dados
python manage.py migrate

# 7. (Opcional) Carregue dados de exemplo
python manage.py seed_data

# 8. Inicie o servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 9. Acesse a documentação da API
# http://localhost:8000/docs (Swagger UI)
# http://localhost:8000/redoc (ReDoc)
```

### Estrutura do Backend
```
backend/
├── app/
│   ├── models/          # Modelos do banco de dados
│   ├── routes/          # Endpoints da API
│   ├── services/        # Lógica de negócio e ML
│   ├── schemas/         # Validação de dados (Pydantic)
│   └── core/            # Configurações e segurança
├── ml/                  # Módulos de machine learning
├── migrations/          # Migrações do banco de dados
├── requirements.txt     # Dependências Python
└── main.py             # Ponto de entrada da aplicação

🗄️ Passo a Passo para Subir o Banco de Dados
Opção 1: SQLite (Desenvolvimento)
bash# SQLite é criado automaticamente ao executar as migrações
# Nenhuma configuração adicional necessária

# O arquivo do banco será criado em:
# backend/database.db
Opção 2: PostgreSQL (Produção)
Usando Docker (Recomendado)
bash# 1. Certifique-se de ter o Docker instalado
docker --version

# 2. Suba o container do PostgreSQL
docker-compose up -d postgres

# 3. Verifique se o container está rodando
docker ps

# 4. O banco estará disponível em:
# Host: localhost
# Porta: 5432
# Database: iarecomend
# User: postgres
# Password: postgres123
Instalação Manual do PostgreSQL
bash# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Inicie o serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Acesse o PostgreSQL
sudo -u postgres psql

# Crie o banco de dados
CREATE DATABASE iarecomend;
CREATE USER iarecomend_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE iarecomend TO iarecomend_user;
\q
Configuração no Backend
bash# Edite o arquivo .env
DATABASE_URL=postgresql://iarecomend_user:senha_segura@localhost:5432/iarecomend

# Execute as migrações
cd backend
python manage.py migrate
Opção 3: Docker Compose Completo
bash# Suba todos os serviços (Backend + Banco + Frontend)
docker-compose up -d

# Serviços disponíveis:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8000
# - PostgreSQL: localhost:5432
# - Adminer (Gerenciador DB): http://localhost:8080
Backup e Restore do Banco
bash# Backup
docker exec -t iarecomend-postgres pg_dump -U postgres iarecomend > backup.sql

# Restore
docker exec -i iarecomend-postgres psql -U postgres iarecomend < backup.sql

📱 App Mobile (React Native - Futuro)
O desenvolvimento do aplicativo mobile está planejado para a próxima fase do projeto.
Tecnologias Previstas:

React Native / Expo
React Navigation
Axios para consumo da API
AsyncStorage para cache local


📚 Documentação Adicional

API Docs: http://localhost:8000/docs
Postman Collection: docs/postman_collection.json
Diagramas de Arquitetura: docs/architecture/
Guia de Contribuição: CONTRIBUTING.md