'use client';
import "./globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith('/admin');
  const hideFooter = pathname.startsWith('/admin');

  return (
    <html>
      <body className="min-h-full flex flex-col">
        {!hideHeader && <Header />}
        <main className={!hideHeader ? 'pt-16' : ''}>
          {children}
        </main>
        {!hideFooter && <Footer />}
      </body>
    </html>
  );
}
