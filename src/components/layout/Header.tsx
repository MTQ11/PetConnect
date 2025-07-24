import Link from "next/link"
import { Search, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/lib/constants"
import { t } from "@/lib/i18n"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🐾</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PetMarket</span>
          </Link>

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
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="hidden md:inline">{t('favorites')}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden sm:inline-block">
              {t('login')}
            </Button>
            
            <Button size="sm" className="hidden sm:inline-block">
              {t('register')}
            </Button>
            
            <Link href={ROUTES.post}>
              <Button className="bg-orange-500 hover:bg-orange-600 text-sm">
                <span className="hidden sm:inline">+ </span>{t('postPet')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center space-x-1 py-3 overflow-x-auto scrollbar-hide">
          <Badge variant="default" className="bg-gray-900 text-white whitespace-nowrap flex-shrink-0">
            🐕 {t('allPets')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap flex-shrink-0">
            🐶 {t('dogs')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap flex-shrink-0">
            🐱 {t('cats')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap flex-shrink-0">
            🐦 {t('birds')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap flex-shrink-0">
            🐠 {t('fish')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap flex-shrink-0">
            🐰 {t('rabbits')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap flex-shrink-0">
            🦎 {t('reptiles')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap flex-shrink-0">
            🐹 {t('smallPets')}
          </Badge>
        </div>
      </div>
    </header>
  )
}
