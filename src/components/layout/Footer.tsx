import { APP_CONFIG } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🐾 PetConnect</h3>
            <p className="text-gray-400">
              Nền tảng kết nối yêu thương cho thú cưng
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/pets" className="hover:text-white">Thú cưng</a></li>
              <li><a href="/marketplace" className="hover:text-white">Marketplace</a></li>
              <li><a href="/about" className="hover:text-white">Về chúng tôi</a></li>
              <li><a href="/contact" className="hover:text-white">Liên hệ</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/help" className="hover:text-white">Trung tâm hỗ trợ</a></li>
              <li><a href="/terms" className="hover:text-white">Điều khoản</a></li>
              <li><a href="/privacy" className="hover:text-white">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-4 text-gray-400">
              <a href={APP_CONFIG.social.facebook} className="hover:text-white">
                Facebook
              </a>
              <a href={APP_CONFIG.social.instagram} className="hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 {APP_CONFIG.name}. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
