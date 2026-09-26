import "./globals.css";
import { Barlow_Condensed } from 'next/font/google';
import ClientLayout from "../../components/ClientLayout";
import SystemDetector from "../components/SystemDetector";

const barlowCondensed = Barlow_Condensed({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-barlow',
  display: 'swap',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={barlowCondensed.variable}>
      <body className="min-h-full min-w-full flex flex-col ">
        <ClientLayout>
          <SystemDetector />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}