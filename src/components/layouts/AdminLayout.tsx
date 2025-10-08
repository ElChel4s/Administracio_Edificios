import { ReactNode } from 'react';
import BaseLayout from './BaseLayout';
import { Home, User, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  currentView: string;
  onViewChange: (v: string) => void;
  user?: Record<string, unknown> | null;
  signOut: () => Promise<void> | void;
}

export const AdminLayout = ({ children, currentView, onViewChange, user, signOut }: Props) => {
  const navigation = [
    { id: 'dashboard', name: 'Inicio', icon: Home },
    { id: 'usuarios', name: 'Usuarios', icon: User },
    { id: 'propiedades', name: 'Propiedades', icon: Home },
    { id: 'reservas', name: 'Reservas', icon: Calendar },
    { id: 'finanzas', name: 'Finanzas', icon: DollarSign },
    { id: 'incidentes', name: 'Incidentes', icon: AlertTriangle },
  ];

  return (
    <BaseLayout currentView={currentView} onViewChange={onViewChange} navigation={navigation} user={user} signOut={signOut}>
      {children}
    </BaseLayout>
  );
};

export default AdminLayout;
