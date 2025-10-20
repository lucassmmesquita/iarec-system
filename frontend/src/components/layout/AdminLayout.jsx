import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Database, 
  BarChart3, 
  CheckSquare, 
  Upload, 
  Cpu, 
  Brain,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  Search,
  MessageSquare,
  Mail
} from 'lucide-react';

// Importar componentes do App do Vendedor
import VendedorDashboard from '../vendedor/VendedorDashboard';
import VendedorConsulta from '../vendedor/VendedorConsulta';
import VendedorFeedback from '../vendedor/VendedorFeedback';
import VendedorEmail from '../vendedor/VendedorEmail';

const AdminLayout = ({ 
  currentUser, 
  onLogout, 
  UserManagementComponent, 
  DataSourceManagerComponent,
  RelatoriosComponent,
  ValidacaoComponent,
  ImportacaoComponent,
  ProcessamentoComponent,
  TreinamentoComponent
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    admin: true,
    recomendador: true,
    vendedor: true
  });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Definir página inicial baseada no perfil
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Vendedor') {
        setCurrentPage('vendedor-home');
      } else if (currentUser.role === 'Supervisor') {
        setCurrentPage('fontes');
      } else {
        setCurrentPage('usuarios');
      }
    }
  }, [currentUser]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMenuItemClick = (pageId) => {
    setCurrentPage(pageId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // ============================================
  // REGRAS DE CONTROLE DE ACESSO POR PERFIL
  // ============================================
  
  const hasAccess = (menuId) => {
    if (!currentUser) return false;

    const userRole = currentUser.role;

    // 1. Administrador: acesso TOTAL a todos os módulos
    if (userRole === 'Administrador') {
      return true;
    }

    // 2. Supervisor: acesso aos módulos Admin (exceto Usuários) + Recomendador
    if (userRole === 'Supervisor') {
      const supervisorMenus = [
        // Módulo de Administração (SEM Gestão de Usuários)
        'fontes',           // Gestão de Fontes de Dados
        'relatorios',       // Consultas e Relatórios
        'validacao',        // Validação de Recomendações
        // Módulo Recomendador
        'importacao',       // Importação de Dados
        'processamento',    // Processamento de Dados
        'treinamento'       // Treinamento do Modelo
      ];
      return supervisorMenus.includes(menuId);
    }

    // 3. Vendedor: acesso SOMENTE ao App do Vendedor
    if (userRole === 'Vendedor') {
      const vendedorMenus = [
        'vendedor-home',      // Home com Dashboard e Indicadores
        'vendedor-consulta',  // Consulta e resultados do Recomendador
        'vendedor-feedback',  // Feedback da recomendação gerada
        'vendedor-email'      // Envio por email da recomendação gerada
      ];
      return vendedorMenus.includes(menuId);
    }

    return false;
  };

  const canAccessSection = (sectionId) => {
    if (!currentUser) return false;

    const userRole = currentUser.role;

    if (userRole === 'Administrador') {
      return true;
    }

    if (userRole === 'Supervisor') {
      return sectionId === 'admin' || sectionId === 'recomendador';
    }

    if (userRole === 'Vendedor') {
      return sectionId === 'vendedor';
    }

    return false;
  };

  // ============================================
  // ESTRUTURA DE MENUS
  // ============================================

  const menuSections = [
    {
      id: 'admin',
      title: 'Módulo de Administração',
      icon: Shield,
      items: [
        {
          id: 'usuarios',
          label: 'Gestão de Usuários',
          icon: Users,
          description: 'Controle de acessos e permissões'
        },
        {
          id: 'fontes',
          label: 'Gestão de Fontes de Dados',
          icon: Database,
          badgeColor: 'green',
          description: 'Cadastro e conexões com bases de dados'
        },
        {
          id: 'relatorios',
          label: 'Consultas e Relatórios',
          icon: BarChart3,
          description: 'Estatísticas e análises de desempenho'
        },
        {
          id: 'validacao',
          label: 'Validação de Recomendações',
          icon: CheckSquare,
          description: 'Curadoria e edição de recomendações'
        }
      ]
    },
    {
      id: 'recomendador',
      title: 'Módulo Recomendador',
      icon: Brain,
      items: [
        {
          id: 'importacao',
          label: 'Importação de Dados',
          icon: Upload,
          description: 'Upload de histórico de vendas'
        },
        {
          id: 'processamento',
          label: 'Processamento de Dados',
          icon: Cpu,
          description: 'Pipeline de processamento com ML'
        },
        {
          id: 'treinamento',
          label: 'Treinamento do Modelo',
          icon: Brain,
          description: 'IA e aprendizado de máquina'
        }
      ]
    },
    {
      id: 'vendedor',
      title: 'App do Vendedor',
      icon: Users,
      items: [
        {
          id: 'vendedor-home',
          label: 'Dashboard',
          icon: Home,
          description: 'Indicadores e métricas principais'
        },
        {
          id: 'vendedor-consulta',
          label: 'Consulta de Recomendações',
          icon: Search,
          description: 'Buscar produtos recomendados'
        },
        {
          id: 'vendedor-feedback',
          label: 'Feedback de Recomendações',
          icon: MessageSquare,
          description: 'Avaliar resultados do recomendador'
        },
        {
          id: 'vendedor-email',
          label: 'Envio por E-mail',
          icon: Mail,
          description: 'Compartilhar recomendações com clientes'
        }
      ]
    }
  ];

  // Filtrar seções e itens baseado no perfil
  const filteredMenuSections = menuSections
    .filter(section => canAccessSection(section.id))
    .map(section => ({
      ...section,
      items: section.items.filter(item => hasAccess(item.id))
    }))
    .filter(section => section.items.length > 0);

  const renderPageContent = () => {
    // Verificar acesso antes de renderizar
    if (!hasAccess(currentPage)) {
      return (
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">Acesso Negado</h2>
            <p className="text-red-700">
              Você não tem permissão para acessar esta página.
            </p>
            <p className="text-sm text-red-600 mt-2">
              Perfil atual: <strong>{currentUser?.role}</strong>
            </p>
          </div>
        </div>
      );
    }

    // ========== PÁGINAS DO MÓDULO ADMINISTRAÇÃO ==========
    if (currentPage === 'usuarios' && UserManagementComponent) {
      return <UserManagementComponent currentUser={currentUser} onLogout={onLogout} />;
    }
    
    if (currentPage === 'fontes' && DataSourceManagerComponent) {
      return <DataSourceManagerComponent />;
    }
    
    if (currentPage === 'relatorios' && RelatoriosComponent) {
      return <RelatoriosComponent />;
    }
    
    if (currentPage === 'validacao' && ValidacaoComponent) {
      return <ValidacaoComponent />;
    }

    // ========== PÁGINAS DO MÓDULO RECOMENDADOR ==========
    if (currentPage === 'importacao' && ImportacaoComponent) {
      return <ImportacaoComponent />;
    }
    
    if (currentPage === 'processamento' && ProcessamentoComponent) {
      return <ProcessamentoComponent />;
    }
    
    if (currentPage === 'treinamento' && TreinamentoComponent) {
      return <TreinamentoComponent />;
    }

    // ========== PÁGINAS DO APP DO VENDEDOR ==========
    if (currentPage === 'vendedor-home') {
      return <VendedorDashboard currentUser={currentUser} />;
    }

    if (currentPage === 'vendedor-consulta') {
      return <VendedorConsulta />;
    }

    if (currentPage === 'vendedor-feedback') {
      return <VendedorFeedback />;
    }

    if (currentPage === 'vendedor-email') {
      return <VendedorEmail />;
    }

    // Página padrão
    return (
      <div className="p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selecione uma opção do menu
          </h2>
          <p className="text-gray-600">
            Navegue pelo menu lateral para acessar as funcionalidades.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white h-16 flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg">IARECOMEND</span>
          </div>
          <button onClick={toggleMobileMenu} className="text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
          ${isMobile && !mobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          ${sidebarOpen ? 'w-72' : 'w-20'}
          bg-gray-900 text-white transition-all duration-300 ease-in-out
          flex flex-col
        `}
      >
        {/* Logo */}
        {!isMobile && (
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">IARECOMEND</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {filteredMenuSections.map((section) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections[section.id];

            return (
              <div key={section.id} className="mb-4">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mb-2"
                >
                  <div className="flex items-center gap-3">
                    <SectionIcon className="w-5 h-5" />
                    {sidebarOpen && (
                      <span className="text-sm font-semibold">{section.title}</span>
                    )}
                  </div>
                  {sidebarOpen &&
                    (isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {/* Menu Items */}
                {isExpanded && (
                  <div className="space-y-1 ml-2">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = currentPage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleMenuItemClick(item.id)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                            ${isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }
                          `}
                        >
                          <ItemIcon className="w-4 h-4 flex-shrink-0" />
                          {sidebarOpen && (
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          )}
                          {sidebarOpen && item.badge && (
                            <span
                              className={`
                                px-2 py-0.5 text-xs font-medium rounded
                                ${item.badgeColor === 'green'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-blue-500 text-white'
                                }
                              `}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentUser?.role || 'Sem perfil'}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <button onClick={onLogout} className="mx-auto block text-gray-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'pt-16' : ''}`}>
        {renderPageContent()}
      </div>
    </div>
  );
};

export default AdminLayout;