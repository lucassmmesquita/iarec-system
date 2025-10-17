import React, { useState } from 'react';
import { Database, Plus, Trash2, Edit2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

const DataSourceManager = () => {
  const [dataSources, setDataSources] = useState([
    {
      id: 1,
      name: 'MySQL Produção',
      type: 'mysql',
      host: 'prod-db.shopinfo.com.br',
      port: 3306,
      database: 'shopinfo_prod',
      username: 'readonly_user',
      password: '***encrypted***',
      status: 'active',
      lastSync: '2025-10-16 08:30:00'
    },
    {
      id: 2,
      name: 'PostgreSQL Analytics',
      type: 'postgresql',
      host: 'analytics.shopinfo.com.br',
      port: 5432,
      database: 'analytics_db',
      username: 'analytics_user',
      password: '***encrypted***',
      status: 'active',
      lastSync: '2025-10-16 09:15:00'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'mysql',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    additionalParams: ''
  });

  const connectionTypes = [
    { value: 'mysql', label: 'MySQL', defaultPort: 3306 },
    { value: 'postgresql', label: 'PostgreSQL', defaultPort: 5432 },
    { value: 'sqlserver', label: 'SQL Server', defaultPort: 1433 },
    { value: 'mongodb', label: 'MongoDB', defaultPort: 27017 },
    { value: 'api', label: 'API REST', defaultPort: 443 },
    { value: 'csv', label: 'Arquivo CSV', defaultPort: null },
    { value: 'excel', label: 'Arquivo Excel', defaultPort: null }
  ];

  const handleTypeChange = (type) => {
    const selectedType = connectionTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      type,
      port: selectedType.defaultPort || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setDataSources(dataSources.map(ds => 
        ds.id === editingId 
          ? { ...ds, ...formData, status: 'active', lastSync: 'Nunca sincronizado' }
          : ds
      ));
    } else {
      const newSource = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        lastSync: 'Nunca sincronizado'
      };
      setDataSources([...dataSources, newSource]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'mysql',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      additionalParams: ''
    });
    setShowForm(false);
    setEditingId(null);
    setShowPassword(false);
  };

  const handleEdit = (source) => {
    setFormData({
      name: source.name,
      type: source.type,
      host: source.host,
      port: source.port,
      database: source.database,
      username: source.username,
      password: '',
      additionalParams: ''
    });
    setEditingId(source.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Deseja realmente excluir esta fonte de dados?')) {
      setDataSources(dataSources.filter(ds => ds.id !== id));
    }
  };

  const testConnection = (id) => {
    const source = dataSources.find(ds => ds.id === id);
    alert(`Testando conexão com ${source.name}...\n\nSimulação: Conexão estabelecida com sucesso!`);
    setDataSources(dataSources.map(ds => 
      ds.id === id ? { ...ds, status: 'active', lastSync: new Date().toLocaleString('pt-BR') } : ds
    ));
  };

  const requiresFileUpload = ['csv', 'excel'].includes(formData.type);
  const requiresUrl = formData.type === 'api';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fontes de Dados</h1>
                <p className="text-gray-600">Gerencie conexões e bases de dados do sistema</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Nova Fonte
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Editar Fonte de Dados' : 'Nova Fonte de Dados'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Fonte *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: MySQL Produção"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Conexão *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {connectionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!requiresFileUpload && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {requiresUrl ? 'URL da API *' : 'Host/Servidor *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.host}
                        onChange={(e) => setFormData({...formData, host: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={requiresUrl ? "https://api.shopinfo.com.br" : "db.shopinfo.com.br"}
                      />
                    </div>

                    {!requiresUrl && formData.port && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Porta
                        </label>
                        <input
                          type="number"
                          value={formData.port}
                          onChange={(e) => setFormData({...formData, port: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {!requiresUrl && formData.type !== 'mongodb' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Banco de Dados *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.database}
                        onChange={(e) => setFormData({...formData, database: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="shopinfo_prod"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {requiresUrl ? 'API Key / Token' : 'Usuário *'}
                      </label>
                      <input
                        type="text"
                        required={!requiresUrl}
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={requiresUrl ? "sk_live_..." : "usuario_db"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha {!requiresUrl && '*'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required={!requiresUrl}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {requiresFileUpload && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload de Arquivo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                    <input type="file" accept={formData.type === 'csv' ? '.csv' : '.xlsx,.xls'} className="hidden" id="fileUpload" />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Database className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Clique para fazer upload ou arraste o arquivo</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.type === 'csv' ? 'Arquivos CSV' : 'Arquivos Excel (XLS, XLSX)'}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parâmetros Adicionais (opcional)
                </label>
                <textarea
                  value={formData.additionalParams}
                  onChange={(e) => setFormData({...formData, additionalParams: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="charset=utf8mb4&timeout=30"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingId ? 'Atualizar' : 'Cadastrar'} Fonte
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Fontes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-900">Fontes Cadastradas ({dataSources.length})</h3>
          </div>
          
          <div className="divide-y">
            {dataSources.map((source) => (
              <div key={source.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">{source.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        source.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {source.status === 'active' ? 'Ativo' : 'Pendente'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Tipo:</span> {connectionTypes.find(t => t.value === source.type)?.label}
                      </div>
                      <div>
                        <span className="font-medium">Host:</span> {source.host}:{source.port}
                      </div>
                      <div>
                        <span className="font-medium">Banco:</span> {source.database}
                      </div>
                      <div>
                        <span className="font-medium">Última Sincronização:</span> {source.lastSync}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => testConnection(source.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Testar Conexão"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(source)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações Técnicas */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informações Técnicas</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• As senhas são criptografadas antes de serem armazenadas</li>
            <li>• Conexões podem ser testadas antes da sincronização</li>
            <li>• Suporte para múltiplos tipos de bancos e APIs REST</li>
            <li>• Upload de arquivos CSV/Excel para processamento batch</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataSourceManager;