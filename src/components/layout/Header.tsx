import Link from "next/link"
import { ROUTES } from "@/lib/constants"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.home} className="text-2xl font-bold text-blue-600">
            🐾 PetConnect
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href={ROUTES.home} className="text-gray-700 hover:text-blue-600">
              Trang chủ
            </Link>
            <Link href={ROUTES.pets} className="text-gray-700 hover:text-blue-600">
              Thú cưng
            </Link>
            <Link href={ROUTES.marketplace} className="text-gray-700 hover:text-blue-600">
              Marketplace
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href={ROUTES.auth.login}
              className="text-gray-700 hover:text-blue-600"
            >
              Đăng nhập
            </Link>
            <Link
              href={ROUTES.auth.register}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
