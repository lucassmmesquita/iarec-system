import storageService from './storageService';

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  // Login
  login(email, password) {
    const users = storageService.getUsers() || [];
    const user = users.find(
      u => u.email === email && 
           u.password === password && 
           u.status === 'Ativo'
    );

    if (user) {
      // Atualizar último acesso
      const updatedUser = {
        ...user,
        lastAccess: new Date().toLocaleString('pt-BR')
      };
      storageService.updateUser(user.id, updatedUser);
      
      // Armazenar usuário logado
      this.currentUser = updatedUser;
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    }

    return { 
      success: false, 
      error: 'Email ou senha incorretos, ou usuário inativo' 
    };
  }

  // Logout
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('currentUser');
  }

  // Obter usuário logado
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }

    return null;
  }

  // Verificar se está logado
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  // Verificar se é administrador
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'Administrador';
  }

  // Verificar permissão
  hasPermission(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      'Administrador': 4,
      'Supervisor': 3,
      'Consultor': 2,
      'Vendedor': 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}

export default new AuthService();