'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Hide navbar and footer on all admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        <main className="flex-grow">{children}</main>
      </div>
    );
  }
  
  if (isAdminPage) {
    return (
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        <main className="flex-grow">{children}</main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}

