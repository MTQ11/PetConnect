import Link from "next/link"
import { Search, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/lib/constants"
import { t } from "@/lib/i18n"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🐾</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PetMarket</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{t('favorites')}</span>
            </Button>
            
            <Button variant="ghost" size="sm">
              {t('login')}
            </Button>
            
            <Button size="sm">
              {t('register')}
            </Button>
            
            <Button className="bg-orange-500 hover:bg-orange-600">
              {t('postPet')}
            </Button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center space-x-1 py-3 overflow-x-auto">
          <Badge variant="default" className="bg-gray-900 text-white whitespace-nowrap">
            🐕 {t('allPets')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            🐶 {t('dogs')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            🐱 {t('cats')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            🐦 {t('birds')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            🐠 {t('fish')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            🐰 {t('rabbits')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            🦎 {t('reptiles')}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            🐹 {t('smallPets')}
          </Badge>
        </div>
      </div>
    </header>
  )
}
