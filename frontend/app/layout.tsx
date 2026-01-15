import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import ChatBot from '@/components/chat/ChatBot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Global Market Analyzer - Economic Data Dashboard',
  description: 'Compare economic indicators across 35+ countries - Inflation rates, stock market indices, GDP growth, and currency exchange rates with AI-powered insights.',
  keywords: ['economic analysis', 'global markets', 'inflation', 'stock market', 'currency', 'NIFTY 50', 'S&P 500', 'AI insights'],
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ChatBot />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
