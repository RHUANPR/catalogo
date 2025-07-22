
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { Dashboard } from '../components/admin/Dashboard';
import { ProductManager } from '../components/admin/ProductManager';
import { ThemeEditor } from '../components/admin/ThemeEditor';
import { LayoutDashboard, Package, Palette, LogOut, ArrowLeft, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminTab = 'dashboard' | 'products' | 'theme';

const AdminLayout: React.FC = () => {
    const { logout } = useAppContext();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'products', label: 'Produtos', icon: <Package size={20} /> },
        { id: 'theme', label: 'Aparência', icon: <Palette size={20} /> },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'products': return <ProductManager />;
            case 'theme': return <ThemeEditor />;
            default: return <Dashboard />;
        }
    }

    return (
        <div className="flex min-h-screen bg-base-200">
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary text-white flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <div className="p-6 text-2xl font-bold border-b border-slate-500">
                    Admin
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id)
                                setIsSidebarOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                                activeTab === tab.id ? 'bg-primary' : 'hover:bg-slate-700'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-500 space-y-2">
                     <Link to="/" className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors hover:bg-slate-700">
                        <ArrowLeft size={20} />
                        Voltar à Loja
                    </Link>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors text-red-300 hover:bg-red-500 hover:text-white"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                 <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-secondary">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-secondary">{tabs.find(t => t.id === activeTab)?.label}</h1>
                    <Link to="/" className="text-primary hover:text-primary/80">
                        <ArrowLeft size={24} />
                    </Link>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}

export const AdminPage: React.FC = () => {
  const { isAdmin, login } = useAppContext();

  if (!isAdmin) {
    return <AdminLogin onLogin={login} />;
  }

  return <AdminLayout />;
};
