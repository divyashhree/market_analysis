import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import ChatBot from '@/components/chat/ChatBot'
import MarketTicker from '@/components/social/MarketTicker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Global Market Analyzer - Real-time Economic Data & Social Insights',
  description: 'Compare economic indicators across 35+ countries with real-time data, social features, and AI-powered insights. Track inflation, stock markets, and currency exchange rates.',
  keywords: ['economic analysis', 'global markets', 'inflation', 'stock market', 'currency', 'NIFTY 50', 'S&P 500', 'AI insights', 'real-time data', 'social trading'],
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
            <MarketTicker />
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
