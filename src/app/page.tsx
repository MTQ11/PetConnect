import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Kết nối yêu thương 
          <span className="text-blue-600"> thú cưng</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Nền tảng mua bán, trao đổi và nhận nuôi thú cưng uy tín. 
          Tìm người bạn đồng hành hoàn hảo cho gia đình bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={ROUTES.marketplace}>
            <Button size="lg">
              Khám phá Marketplace
            </Button>
          </Link>
          <Link href={ROUTES.pets}>
            <Button variant="outline" size="lg">
              Xem thú cưng
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tại sao chọn PetConnect?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Uy tín & An toàn</h3>
            <p className="text-gray-600">
              Tất cả người dùng đều được xác thực, đảm bảo giao dịch an toàn
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Tìm kiếm dễ dàng</h3>
            <p className="text-gray-600">
              Bộ lọc thông minh giúp bạn tìm thú cưng phù hợp nhanh chóng
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-semibold mb-2">Cộng đồng yêu thương</h3>
            <p className="text-gray-600">
              Kết nối với những người yêu thú cưng trên khắp cả nước
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">1000+</div>
            <div className="text-gray-600">Thú cưng</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600">Người dùng</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">200+</div>
            <div className="text-gray-600">Giao dịch thành công</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">50+</div>
            <div className="text-gray-600">Giống thú cưng</div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
