import { ReactNode } from 'react';
import BaseLayout from './BaseLayout';
import { Home, Calendar, User } from 'lucide-react';

interface Props {
  children: ReactNode;
  currentView: string;
  onViewChange: (v: string) => void;
  user?: Record<string, unknown> | null;
  signOut: () => Promise<void> | void;
}

export const VisitorLayout = ({ children, currentView, onViewChange, user, signOut }: Props) => {
  const navigation = [
    { id: 'home', name: 'Inicio', icon: Home },
    { id: 'reservas', name: 'Reservar', icon: Calendar },
    { id: 'registro', name: 'Registro', icon: User },
  ];

  return (
    <BaseLayout currentView={currentView} onViewChange={onViewChange} navigation={navigation} user={user} signOut={signOut}>
      {children}
    </BaseLayout>
  );
};

export default VisitorLayout;
