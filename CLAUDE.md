# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IARecomend is an AI-powered recommendation system for retail environments. It consists of:
- **Backend**: Flask API (Python) providing mock recommendation endpoints
- **Frontend**: React + Vite SPA with Tailwind CSS for admin and recommendation management

## Architecture

### Monorepo Structure
```
iarec-system/
├── backend/          # Flask API
│   ├── app.py       # Main Flask application with all routes
│   ├── models/      # (Empty - mock data used instead)
│   └── services/    # (Empty - mock data used instead)
└── frontend/        # React SPA
    └── src/
        ├── components/
        │   ├── admin/           # User & data source management
        │   ├── auth/            # Login components
        │   ├── layout/          # AdminLayout wrapper
        │   ├── pages/           # Main page components
        │   └── recomendador/    # AI recommendation features
        └── services/
            ├── authService.js      # Authentication logic
            └── storageService.js   # localStorage persistence layer
```

### Data Flow
1. Frontend uses `storageService.js` for **mock localStorage persistence** (no real backend calls for user management)
2. Backend (`app.py`) serves **mock data** for products, clients, and AI recommendations
3. Authentication happens client-side via `authService.js` with localStorage
4. All recommendation logic is **simulated** with random data (lines 284-331 in app.py)

### Key Design Patterns
- **Single-file backend**: All routes defined in `app.py` (no routing modules)
- **Component-based frontend**: Each feature area has its own folder under `components/`
- **Service layer**: Centralized auth and storage logic in `services/`
- **Mock data approach**: System uses in-memory arrays and localStorage instead of a database

## Development Commands

### Backend
```bash
cd backend

# Install dependencies
pip3 install -r requirements.txt

# Run locally (port 8000)
python app.py

# Deploy to AWS Elastic Beanstalk
eb deploy

# View logs
eb logs

# Check status
eb status
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run dev server (uses Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Script
The root `deploy.sh` script handles AWS deployments:
```bash
./deploy.sh all        # Deploy both backend and frontend
./deploy.sh backend    # Deploy Flask API to Elastic Beanstalk
./deploy.sh frontend   # Build and upload to S3
./deploy.sh status     # Check deployment status
./deploy.sh logs       # View backend logs
./deploy.sh rollback   # Rollback backend to previous version
```

**Important**: The deploy script is Mac-specific and requires:
- AWS CLI (`brew install awscli`)
- EB CLI (`pip3 install awsebcli`)
- Node.js (`brew install node`)

## Backend Implementation Notes

### Flask App Structure
- All routes are in `app.py` (lines 94-403)
- Mock data arrays defined at top: `USUARIOS_MOCK`, `PRODUTOS_MOCK`, `CLIENTES_MOCK`
- CORS enabled for all `/api/*` endpoints with wildcard origins
- No database - all data is in-memory (resets on restart)

### Key API Endpoints
- `GET /` and `GET /health` - Health checks (required for Elastic Beanstalk)
- `POST /api/auth/login` - Authentication with mock users (lines 124-160)
- `GET /api/produtos` - List products
- `GET /api/clientes` - List clients
- `POST /api/recomendacoes` - Generate AI recommendations (simulated with `random.sample()`)
- `POST /api/recomendacoes/feedback` - Register recommendation feedback
- `GET /api/relatorios/dashboard` - Dashboard statistics

### AWS Deployment Config
- `.ebextensions/` contains Elastic Beanstalk configuration
- Health check endpoint: `/health` (returns 200 OK)
- Uses Gunicorn in production (see `Procfile`)
- Port configured via environment variable `PORT` (default 8000)

## Frontend Implementation Notes

### React App Structure
- **Entry point**: `App.jsx` manages authentication state and view routing
- **View logic**: Simple string-based view switching (`login` → `admin`)
- **Layout**: `AdminLayout.jsx` is the main wrapper with sidebar navigation
- **State management**: Uses React `useState` - no Redux/Context
- **Styling**: Tailwind CSS with default configuration

### Authentication Flow
1. User logs in via `Login.jsx` → calls `authService.login()`
2. `authService.js` checks credentials against localStorage users
3. Valid user stored in `sessionStorage` as `currentUser`
4. `App.jsx` updates state to `currentView: 'admin'`
5. `AdminLayout` renders with sidebar navigation

### Services Layer
- **authService.js**: Client-side auth with role hierarchy (Administrador > Supervisor > Consultor > Vendedor)
- **storageService.js**: Mock persistence using localStorage with keys like `iarec_users`, `iarec_data_sources`
- Initializes default users on first load (including `admin@shopinfo.com / admin123`)

### Component Organization
- `components/admin/` - User management, data source configuration
- `components/auth/` - Login, dashboard
- `components/recomendador/` - AI features (data import, processing, training)
- `components/pages/` - Full page views (reports, validation)
- `components/common/` - Shared UI components (if any)

### Build & Deploy
- Vite builds to `frontend/dist/`
- Deploy script creates `.env.production` with `VITE_API_URL` pointing to backend
- Frontend deployed to S3 static website hosting
- Assets cached for 1 year, `index.html` has no-cache headers

## Testing Credentials
```
Admin: admin@shopinfo.com / admin123
User:  maria@shopinfo.com / 123456
```

## Common Tasks

### Adding a New API Endpoint
1. Add route function in `backend/app.py`
2. Follow naming convention: `/api/<resource>/<action>`
3. Return JSON with proper status codes
4. Update health check route list if it's a major endpoint

### Adding a New Frontend Component
1. Create component file in appropriate `components/` subfolder
2. Import in `App.jsx` if it's a top-level page
3. Add to `AdminLayout.jsx` navigation if needed
4. Use Tailwind classes for styling

### Working with Mock Data
- Backend: Edit arrays in `app.py` (lines 28-88)
- Frontend: Modify `storageService.initialize()` default data (lines 16-72)
- Remember: Backend data resets on restart, frontend data persists in localStorage

## Important Constraints

1. **No Real Database**: All data is mock/in-memory. Changes reset on backend restart.
2. **No Real AI Model**: Recommendations use `random.sample()` with fake confidence scores.
3. **Client-side Auth**: Authentication is entirely in the browser via localStorage/sessionStorage.
4. **AWS-specific Deployment**: System is configured for AWS Elastic Beanstalk + S3.
5. **Portuguese Language**: UI and comments are in Portuguese (Brazil).
