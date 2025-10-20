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
  X
} from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState('usuarios');
  const [expandedSections, setExpandedSections] = useState({
    admin: true,
    recomendador: true
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
          //badge: '12',
          description: 'Controle de acessos e permissões'
        },
        {
          id: 'fontes',
          label: 'Gestão de Fontes de Dados',
          icon: Database,
          //badge: 'NOVO',
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
    }
  ];

  const renderPageContent = () => {
    // Páginas implementadas - chamam componentes externos
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
        return <ValidacaoComponent />;  // ← ADICIONADO
    }
    if (currentPage === 'importacao' && ImportacaoComponent) {
      return <ImportacaoComponent />;
    }
    if (currentPage === 'processamento' && ProcessamentoComponent) {
        return <ProcessamentoComponent />;
    }
    if (currentPage === 'treinamento' && TreinamentoComponent) {
        return <TreinamentoComponent />;
    }

    // Páginas em desenvolvimento - mostram placeholder
    const pageInfo = {
     
      
    };

    const info = pageInfo[currentPage];
    if (!info) return null;
    
    const IconComponent = info.icon;

    return (
      <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{info.title}</h1>
            <span className="text-xs md:text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 w-fit">
              🚧 Em desenvolvimento
            </span>
          </div>
          <p className="text-sm md:text-base text-gray-600">{info.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
          <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-12">
            <IconComponent className="w-16 md:w-20 h-16 md:h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
              Módulo em Desenvolvimento
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">{info.description}</p>
            
            <div className="max-w-md mx-auto bg-gray-50 p-4 md:p-6 rounded-lg text-left">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                📋 Funcionalidades Planejadas:
              </p>
              <ul className="space-y-2">
                {info.features.map((feature, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-600" />
              <div>
                <h2 className="font-bold text-base">IARecomend</h2>
                <p className="text-xs text-gray-500">SHOPINFO</p>
              </div>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Overlay para mobile */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !mobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile && sidebarOpen ? 'w-72' : !isMobile ? 'w-20' : 'w-72'}
          bg-gray-900 text-white transition-all duration-300 flex flex-col
          ${isMobile ? 'shadow-2xl' : ''}
        `}
      >
        {/* Header Desktop */}
        {!isMobile && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <div>
                      <h2 className="font-bold text-lg">IARecomend</h2>
                      <p className="text-xs text-gray-400">SHOPINFO</p>
                    </div>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button onClick={() => setSidebarOpen(true)} className="mx-auto">
                  <Menu className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Header Mobile */}
        {isMobile && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="font-bold text-lg">IARecomend</h2>
                <p className="text-xs text-gray-400">SHOPINFO</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {menuSections.map((section) => (
            <div key={section.id} className="mb-4">
              {(sidebarOpen || isMobile) && (
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-2 flex items-center justify-between text-gray-400 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{section.title}</span>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}

              {((sidebarOpen || isMobile) ? expandedSections[section.id] : true) && (
                <div className="mt-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                      title={!sidebarOpen && !isMobile ? item.label : ''}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {(sidebarOpen || isMobile) && (
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                item.badgeColor === 'green'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-700 text-gray-300'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          {(sidebarOpen || isMobile) ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentUser?.name || 'Administrador'}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser?.role || 'Administrador'}</p>
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