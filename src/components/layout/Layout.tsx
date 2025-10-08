import { ReactNode } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import ResidentLayout from '../layouts/ResidentLayout';
import VisitorLayout from '../layouts/VisitorLayout';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Layout = ({ children, currentView, onViewChange }: LayoutProps) => {
  const { user, signOut } = useAuth();

  type UserLike = { tipo_usuario?: string; rol?: string };
  const u = user as UserLike | undefined;
  const roleRaw = (u && (u.tipo_usuario || u.rol)) ? String(u.tipo_usuario || u.rol) : '';
  const role = roleRaw.toLowerCase();

  // robust mapping: accept variants like 'admin', 'administrador', 'role_admin', 'superadmin'
  const isAdmin = role.includes('admin') || role.includes('administr');
  const isResident = role.includes('resid') || role.includes('resident') || role.includes('user');

  if (isAdmin) {
    return (
      <AdminLayout currentView={currentView} onViewChange={onViewChange} user={user} signOut={signOut}>
        {children}
      </AdminLayout>
    );
  }
  if (isResident) {
    return (
      <ResidentLayout currentView={currentView} onViewChange={onViewChange} user={user} signOut={signOut}>
        {children}
      </ResidentLayout>
    );
  }

  // default: visitor
  return (
    <VisitorLayout currentView={currentView} onViewChange={onViewChange} user={user} signOut={signOut}>
      {children}
    </VisitorLayout>
  );
};
