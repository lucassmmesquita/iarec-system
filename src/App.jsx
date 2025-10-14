import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login.jsx';
import Dashboard from './components/auth/Dashboard.jsx';
import UserManagement from './components/admin/UserManagement.jsx';
import authService from './services/authService';
import storageService from './services/storageService';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Inicializar storage
    storageService.initialize();

    // Verificar se já existe usuário logado
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.role === 'Administrador') {
        setCurrentView('admin');
      } else {
        setCurrentView('dashboard');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'Administrador') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('login');
  };

  // Renderizar baseado na view atual
  if (currentView === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentView === 'admin') {
    return <UserManagement currentUser={currentUser} onLogout={handleLogout} />;
  }

  return null;
}

export default App;