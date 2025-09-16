"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hook'

interface AuthGuardLayoutProps {
  children: React.ReactNode
  redirectTo?: string // Trang để redirect khi chưa đăng nhập, mặc định là /login
}

export const AuthGuardLayout = ({ 
  children, 
  redirectTo = '/login' 
}: AuthGuardLayoutProps) => {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth)
  const router = useRouter()
  console.log(isAuthenticated);

  useEffect(() => {
    // Chỉ redirect khi đã load xong auth status và chưa đăng nhập
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  // Hiển thị loading khi đang kiểm tra auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Chỉ render children khi đã đăng nhập
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Hiển thị loading khi đang redirect (tránh flash content)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}
