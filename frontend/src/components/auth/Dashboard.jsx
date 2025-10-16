import React from 'react';
import { Shield, User, LogOut } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IARecomend</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center animate-fade-in">
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-gray-600 mb-2">
            Você está logado como <span className="font-semibold text-blue-600">{user?.role}</span>
          </p>
          <p className="text-gray-500">Dashboard em desenvolvimento...</p>
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Funcionalidades em Breve:</h3>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li>• Visualização de métricas de vendas</li>
              <li>• Histórico de recomendações</li>
              <li>• Performance individual</li>
              <li>• Notificações e alertas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;