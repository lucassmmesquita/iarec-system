// ========================================
// STORAGE SERVICE - IARecomend
// Serviço de persistência de dados mockados
// ========================================

const STORAGE_KEYS = {
  USERS: 'iarec_users',
  DATA_SOURCES: 'iarec_data_sources',
  RECOMMENDATIONS: 'iarec_recommendations',
  REPORTS: 'iarec_reports'
};

class StorageService {
  
  // ========================================
  // INICIALIZAÇÃO DO BANCO DE DADOS MOCKADO
  // ========================================
  
  async initialize() {
    console.log('🔄 Inicializando banco de dados mockado...');
    
    // FORÇA A REINICIALIZAÇÃO se não houver usuários ou se houver problema
    const existingUsers = this.getUsers();
    
    if (!existingUsers || existingUsers.length === 0) {
      console.log('⚠️  Nenhum usuário encontrado. Criando base inicial...');
      this._createDefaultUsers();
    } else {
      console.log(`✅ ${existingUsers.length} usuários encontrados no sistema`);
      // Listar usuários para debug
      console.table(existingUsers.map(u => ({
        ID: u.id,
        Nome: u.name,
        Email: u.email,
        Perfil: u.role,
        Status: u.status
      })));
    }
  }

  // Criar usuários padrão
  _createDefaultUsers() {
    const defaultUsers = [
      {
        id: 1,
        name: "Admin Sistema",
        email: "admin@shopinfo.com",
        password: "admin123",
        role: "Administrador",
        status: "Ativo",
        lastAccess: "29/10/2025 10:00",
        createdAt: "01/01/2025"
      },
      {
        id: 2,
        name: "Maria Santos",
        email: "maria.santos@shopinfo.com",
        password: "vendedor123",
        role: "Vendedor",
        status: "Ativo",
        lastAccess: "29/10/2025 08:15",
        createdAt: "05/01/2025"
      },
      {
        id: 3,
        name: "Pedro Costa",
        email: "pedro.costa@shopinfo.com",
        password: "vendedor123",
        role: "Vendedor",
        status: "Ativo",
        lastAccess: "28/10/2025 17:45",
        createdAt: "05/01/2025"
      },
      {
        id: 4,
        name: "Ana Oliveira",
        email: "ana.oliveira@shopinfo.com",
        password: "supervisor123",
        role: "Supervisor",
        status: "Ativo",
        lastAccess: "29/10/2025 09:30",
        createdAt: "03/01/2025"
      },
      {
        id: 5,
        name: "Carlos Mendes",
        email: "carlos.mendes@shopinfo.com",
        password: "vendedor123",
        role: "Vendedor",
        status: "Inativo",
        lastAccess: "10/10/2025 16:20",
        createdAt: "08/01/2025"
      },
      {
        id: 6,
        name: "João Silva",
        email: "joao.silva@shopinfo.com",
        password: "supervisor123",
        role: "Supervisor",
        status: "Ativo",
        lastAccess: "29/10/2025 07:45",
        createdAt: "10/01/2025"
      }
    ];
    
    this.saveUsers(defaultUsers);
    console.log('✅ Usuários padrão criados com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 CREDENCIAIS DE ACESSO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 ADMINISTRADOR:');
    console.log('   Email: admin@shopinfo.com');
    console.log('   Senha: admin123');
    console.log('');
    console.log('👤 SUPERVISOR:');
    console.log('   Email: ana.oliveira@shopinfo.com');
    console.log('   Senha: supervisor123');
    console.log('   OU');
    console.log('   Email: joao.silva@shopinfo.com');
    console.log('   Senha: supervisor123');
    console.log('');
    console.log('👤 VENDEDOR:');
    console.log('   Email: maria.santos@shopinfo.com');
    console.log('   Senha: vendedor123');
    console.log('   OU');
    console.log('   Email: pedro.costa@shopinfo.com');
    console.log('   Senha: vendedor123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  // ========================================
  // MÉTODOS PARA USUÁRIOS
  // ========================================
  
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

  // ========================================
  // MÉTODOS PARA FONTES DE DADOS
  // ========================================
  
  getDataSources() {
    const data = localStorage.getItem(STORAGE_KEYS.DATA_SOURCES);
    return data ? JSON.parse(data) : [];
  }

  saveDataSources(sources) {
    localStorage.setItem(STORAGE_KEYS.DATA_SOURCES, JSON.stringify(sources));
  }

  // ========================================
  // MÉTODOS PARA RECOMENDAÇÕES
  // ========================================
  
  getRecommendations() {
    const data = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    return data ? JSON.parse(data) : [];
  }

  saveRecommendations(recommendations) {
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  }

  // ========================================
  // MÉTODOS PARA RELATÓRIOS
  // ========================================
  
  getReports() {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  }

  saveReports(reports) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }

  // ========================================
  // UTILITÁRIOS
  // ========================================
  
  // Limpar todos os dados
  clearAll() {
    console.log('🗑️  Limpando todos os dados...');
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('✅ Dados limpos com sucesso!');
  }

  // Forçar reinicialização (útil para debug)
  forceReset() {
    console.log('⚠️  RESET FORÇADO INICIADO');
    this.clearAll();
    this._createDefaultUsers();
    console.log('✅ Reset concluído!');
  }
}

export default new StorageService();