// Serviço de persistência de dados
// Como não temos acesso ao sistema de arquivos real no navegador,
// usaremos localStorage como simulação de persistência

const STORAGE_KEYS = {
  USERS: 'iarec_users',
  DATA_SOURCES: 'iarec_data_sources',
  RECOMMENDATIONS: 'iarec_recommendations',
  REPORTS: 'iarec_reports'
};

class StorageService {
  // Inicializar dados padrão se não existirem
  async initialize() {
    if (!this.getUsers()) {
      const defaultUsers = [
        {
          id: 1,
          name: "Admin Sistema",
          email: "admin@shopinfo.com",
          password: "admin123",
          role: "Administrador",
          status: "Ativo",
          lastAccess: "14/10/2025 09:30"
        },
        {
          id: 2,
          name: "Maria Santos",
          email: "maria.santos@shopinfo.com",
          password: "123456",
          role: "Vendedor",
          status: "Ativo",
          lastAccess: "14/10/2025 08:15"
        },
        {
          id: 3,
          name: "Pedro Costa",
          email: "pedro.costa@shopinfo.com",
          password: "123456",
          role: "Vendedor",
          status: "Ativo",
          lastAccess: "13/10/2025 17:45"
        },
        {
          id: 4,
          name: "Ana Oliveira",
          email: "ana.oliveira@shopinfo.com",
          password: "123456",
          role: "Supervisor",
          status: "Ativo",
          lastAccess: "14/10/2025 10:00"
        },
        {
          id: 5,
          name: "Carlos Mendes",
          email: "carlos.mendes@shopinfo.com",
          password: "123456",
          role: "Vendedor",
          status: "Inativo",
          lastAccess: "10/10/2025 16:20"
        },{
           id: 6,
           name: "Teste do Teste",
           email: "teste@teste.com",
           password: "123",
           role: "Administrador",
           status: "Ativo",
           lastAccess: "10/10/2025 16:20"
        }
      ];
      this.saveUsers(defaultUsers);
    }
  }

  // Métodos para Usuários
  getUsers() {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : null;
  }

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  addUser(user) {
    const users = this.getUsers() || [];
    users.push(user);
    this.saveUsers(users);
    return user;
  }

  updateUser(userId, userData) {
    const users = this.getUsers() || [];
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      this.saveUsers(users);
      return users[index];
    }
    return null;
  }

  deleteUser(userId) {
    const users = this.getUsers() || [];
    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);
    return true;
  }

  // Métodos para Fontes de Dados
  getDataSources() {
    const data = localStorage.getItem(STORAGE_KEYS.DATA_SOURCES);
    return data ? JSON.parse(data) : [];
  }

  saveDataSources(sources) {
    localStorage.setItem(STORAGE_KEYS.DATA_SOURCES, JSON.stringify(sources));
  }

  // Métodos para Recomendações
  getRecommendations() {
    const data = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return data ? JSON.parse(data) : [];
  }

  saveRecommendations(recommendations) {
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  }

  // Métodos para Relatórios
  getReports() {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  }

  saveReports(reports) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }

  // Limpar todos os dados
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export default new StorageService();