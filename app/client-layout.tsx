"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login";

  return (
    <div className="relative flex flex-col h-screen">
      {!hideNavbar && <Navbar />}
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3" />
    </div>
  );
}
