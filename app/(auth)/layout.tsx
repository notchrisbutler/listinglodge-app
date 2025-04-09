import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DashboardFooter } from '@/components/dashboard/footer';
import Link from 'next/link';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Listing Lodge Authentication',
  description: 'Login or Sign up for Listing Lodge',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
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

      <div className="relative z-10 h-full bg-background/20">
        {/* Logo Section */}
        <header className="absolute top-0 left-0 right-0 pt-8 z-20">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-baseline gap-1">
                <h1 className="text-2xl font-bold text-foreground">ListingLodge</h1>
                <span className="text-primary font-semibold">AI</span>
              </div>
            </Link>
          </div>
        </header>
        
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-col flex-1">
            <main className="flex-1 flex flex-col overflow-auto">
              {children}
            </main>
            <DashboardFooter />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}