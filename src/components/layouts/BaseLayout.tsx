import { ReactNode, useState } from 'react';
import {
  Home,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Building2,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  icon: any;
}

interface BaseLayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  navigation: NavItem[];
  user?: Record<string, unknown> | null;
  signOut: () => Promise<void> | void;
}

export const BaseLayout = ({ children, currentView, onViewChange, navigation, user, signOut }: BaseLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-slate-900" />
            <span className="font-bold text-slate-900">Edificio Inteligente</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Edificio Inteligente</h1>
              <p className="text-xs text-slate-600">Sistema de Administración</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-900">{String(user?.nombre ?? '')}</p>
            <p className="text-xs text-slate-600">{String(user?.email ?? '')}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-slate-900 text-white text-xs rounded">
              {String(user?.tipo_usuario ?? user?.rol ?? '')}
            </span>
          </div>
        </div>

        <nav className="p-4 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition mb-1 ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default BaseLayout;
