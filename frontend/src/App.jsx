import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import UserManagement from './components/admin/UserManagement.jsx';
import DataSourceManager from './components/admin/DataSourceManager.jsx';
import RelatoriosPage from './components/pages/RelatoriosPage.jsx';
import ValidacaoRecomendacoesPage from './components/pages/ValidacaoRecomendacoesPage.jsx'; // ← ADICIONAR
import authService from './services/authService';
import storageService from './services/storageService';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    storageService.initialize();
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentView('admin');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('login');
  };

  if (currentView === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'admin') {
    return (
      <AdminLayout 
        currentUser={currentUser} 
        onLogout={handleLogout}
        UserManagementComponent={UserManagement}
        DataSourceManagerComponent={DataSourceManager}
        RelatoriosComponent={RelatoriosPage}
        ValidacaoComponent={ValidacaoRecomendacoesPage}  
      />
    );
  }

  return null;
}

export default App;