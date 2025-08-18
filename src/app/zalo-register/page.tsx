"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, MapPin, Check, ArrowLeft } from "lucide-react"
import { t } from "@/lib/i18n"
import Link from "next/link"

export default function ZaloRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Loading, 2: Complete Profile, 3: Success
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A", // Simulated data from Zalo
    phone: "0987654321", // Simulated data from Zalo
    address: "",
    avatar: "/api/placeholder/80/80" // Simulated avatar from Zalo
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate Zalo authentication process
    const timer = setTimeout(() => {
      setStep(2)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call to complete registration
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep(3)
    } catch (error) {
      alert("Đăng ký thất bại, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = () => {
    router.push('/')
  }

  if (step === 1) {
    return (
      <Layout maxWidth="sm">
        <div className="min-h-[80vh] flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">Z</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Đang kết nối với Zalo...
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
                </div>
                <p className="text-sm text-gray-600">
                  Đang lấy thông tin từ tài khoản Zalo của bạn
                </p>
              </div>

              <Link href="/register">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng ký thường
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  if (step === 2) {
    return (
      <Layout maxWidth="sm">
        <div className="min-h-[80vh] flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Hoàn thiện thông tin
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Bổ sung một số thông tin để hoàn tất đăng ký
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Zalo Profile Preview */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatar}
                    alt="Zalo Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{formData.fullName}</p>
                    <p className="text-sm text-gray-600">Từ tài khoản Zalo</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Z</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (from Zalo) */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="pl-10 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500">Thông tin này được lấy từ Zalo</p>
                </div>

                {/* Phone (from Zalo) */}
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500">Thông tin này được lấy từ Zalo</p>
                </div>

                {/* Address (additional info) */}
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ (tùy chọn)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Nhập địa chỉ của bạn"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang hoàn tất..." : "Hoàn tất đăng ký"}
                </Button>
              </form>

              {/* Back to normal registration */}
              <div className="text-center pt-4">
                <Link 
                  href="/register"
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  Đăng ký bằng email thay vì Zalo
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  if (step === 3) {
    return (
      <Layout maxWidth="sm">
        <div className="min-h-[80vh] flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Chào mừng đến với PetConnect!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Tài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu khám phá cộng đồng thú cưng ngay bây giờ.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleFinish}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                >
                  Bắt đầu khám phá
                </Button>
                
                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    Chỉnh sửa hồ sơ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return null
}
