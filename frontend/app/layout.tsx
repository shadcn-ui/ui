import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IT Отдел',
  description: 'Внутренняя система заявок и оборудования',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  // НИКАКОГО viewport тут!
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#13151e" />
        {/* favicon и SEO мета можно расширять при необходимости */}
      </head>
      <body
        className={`
          antialiased
          min-h-screen
          bg-gradient-to-br from-[#0a1120] via-[#131b2d] to-[#1a2337]
          text-white
          font-sans
          selection:bg-cyan-300/70
          scroll-smooth
          transition-colors
        `}
      >
        {children}
      </body>
    </html>
  );
}
