"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import {AuthProvider} from '@/app/context/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SidebarProvider>
        <AuthProvider>

          {children}
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
