'use client';
import { usePathname } from 'next/navigation';
import Menu from '@/components/admin/Menu';
import AdminIcon from '@/components/admin/AdminIcon';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="flex">
      {!isLoginPage && <Menu/>}
      <main className="flex-1">
        {!isLoginPage && <AdminIcon/>}
        {children}
      </main>
    </div>
  );
}