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

export const ResidentLayout = ({ children, currentView, onViewChange, user, signOut }: Props) => {
  const navigation = [
    { id: 'dashboard', name: 'Inicio', icon: Home },
    { id: 'profile', name: 'Mi Perfil', icon: User },
    { id: 'reservations', name: 'Reservas', icon: Calendar },
    { id: 'billing', name: 'Pagos', icon: DollarSign },
    { id: 'incidents', name: 'Incidentes', icon: AlertTriangle },
  ];

  return (
    <BaseLayout currentView={currentView} onViewChange={onViewChange} navigation={navigation} user={user} signOut={signOut}>
      {children}
    </BaseLayout>
  );
};

export default ResidentLayout;
