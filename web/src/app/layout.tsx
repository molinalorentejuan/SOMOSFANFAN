import './globals.css';
import Link from 'next/link';
import { AuthStatus } from './parts/AuthStatus';
import '@/lib/init-db'; // Inicializar DB al arrancar

export const metadata = { title: 'FANFAN' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header y main comentados porque FanFanSystem tiene su propio header y footer */}
        {/* <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-card-border">
          <div className="container h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">FANFAN</Link>
            <AuthStatus />
          </div>
        </header>
        <main className="container py-6">{children}</main> */}
        {children}
      </body>
    </html>
  );
}
