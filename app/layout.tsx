import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ToastProvider } from "@/components/toast-provider"
import { FamiliaAtivaProvider } from "@/components/familia-ativa-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { PWAInstaller } from "@/components/pwa-installer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Financeiro v3.0 | Controle Financeiro Familiar",
  description: "Sistema completo de controle financeiro com Supabase, soft delete e muito mais",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Financeiro",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#007AFF",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <ToastProvider />
              <FamiliaAtivaProvider>
                <LayoutWrapper>{children}</LayoutWrapper>
                <PWAInstaller />
              </FamiliaAtivaProvider>
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

