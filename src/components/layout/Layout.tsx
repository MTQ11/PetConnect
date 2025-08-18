"use client"

import { Footer } from "./Footer"
import { Header } from "./Header"

interface LayoutProps {
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  className?: string
}

export function Layout({ children, maxWidth = "full", className = "" }: LayoutProps) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case "sm": return "max-w-2xl"
      case "md": return "max-w-4xl" 
      case "lg": return "max-w-6xl"
      case "xl": return "max-w-7xl"
      case "2xl": return "max-w-8xl"
      case "full": return "max-w-7xl" // Default max width
      default: return "max-w-7xl"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className={`flex-1 ${getMaxWidthClass()} mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
