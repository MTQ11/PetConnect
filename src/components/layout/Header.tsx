"use client"

import Link from "next/link"
import { Search, User } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/lib/constants"
import { t } from "@/lib/i18n"
import { useAppSelector } from "@/store/hook"
import { useRouter } from "next/navigation"
import { useState } from "react"

// MarketplaceLink: Nút dẫn tới marketplace với hiệu ứng chuyển đổi giao diện
function MarketplaceLink() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      router.push(ROUTES.marketplace);
    }, 600); // thời gian hiệu ứng
  };

  return (
    <a
      href={ROUTES.marketplace}
      onClick={handleClick}
      className={`relative px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 shadow-lg transition-all duration-500 overflow-hidden ${isAnimating ? 'animate-marketplace' : ''}`}
      style={{
        boxShadow: isAnimating ? '0 0 40px 10px #f59e42, 0 0 80px 20px #f472b6' : undefined,
        transform: isAnimating ? 'scale(1.08) rotate(-2deg)' : undefined,
      }}
    >
      <span className="relative z-10">
        {t('marketplace')}
      </span>
      {isAnimating && (
        <span className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-40"></span>
      )}
    </a>
  );
}

export function Header() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo + Main Navigation */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            <Link href={ROUTES.home} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🐾</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PetMarket</span>
            </Link>
            {/* Main navigation links */}
            <nav className="hidden sm:flex items-center space-x-4">
              <MarketplaceLink />
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={t('search')}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {
              !isAuthenticated ? (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="hidden sm:inline-block">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="hidden sm:inline-block">
                      {t('register')}
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href={ROUTES.profile}>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="hidden md:inline">{user?.name || t('profile')}</span>
                  </Button>
                </Link>
              )
            }

            <Link href={ROUTES.createpet}>
              <Button className="bg-orange-500 hover:bg-orange-600 text-sm">
                <span className="hidden sm:inline">+ </span>{t('postPet')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
