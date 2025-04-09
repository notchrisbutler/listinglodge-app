import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardFooter } from '@/components/dashboard/footer';
import { TokensWrapper } from '@/components/tokens/tokens-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Listing Lodge Dashboard',
  description: 'Manage your property listings efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full relative overflow-hidden`}>
        {/* Blurred background shapes */}
        <div
          className="absolute -top-20 left-1/5 w-[300px] h-[300px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute top-1/3 right-10 w-[250px] h-[250px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[70px] opacity-25 animate-blob-alt"
          style={{ animationDelay: '-12s' }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-[350px] h-[350px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[90px] opacity-20 animate-blob-alt"
          style={{ animationDelay: '-5s' }}
        ></div>
        <div
          className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[60px] opacity-25 animate-blob"
          style={{ animationDelay: '-15s' }}
        ></div>
        <div
          className="absolute bottom-1/3 -left-10 w-[280px] h-[280px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[75px] opacity-25 animate-blob-alt"
          style={{ animationDelay: '-20s' }}
        ></div>
        <div
          className="absolute top-3/4 right-1/3 w-[220px] h-[220px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[65px] opacity-20 animate-blob"
          style={{ animationDelay: '-8s' }}
        ></div>
        <div
          className="absolute -bottom-10 right-1/5 w-[320px] h-[320px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[85px] opacity-30 animate-blob-alt"
          style={{ animationDelay: '-18s' }}
        ></div>
        <div
          className="absolute top-10 left-1/3 w-[240px] h-[240px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[70px] opacity-20 animate-blob"
          style={{ animationDelay: '-3s' }}
        ></div>

        <div className="relative z-10 h-full bg-background/60">
          <TokensWrapper>
            <div className="min-h-screen flex flex-col">
              <DashboardSidebar />
              <div className="lg:pl-72 flex flex-col flex-1">
                <div className="flex-1 flex flex-col overflow-auto">
                  {children}
                </div>
                <DashboardFooter />
              </div>
            </div>
          </TokensWrapper>
        </div>
      </body>
    </html>
  );
}