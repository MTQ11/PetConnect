"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, Phone, Heart } from "lucide-react"
import { t } from "@/lib/i18n"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('fieldRequired')
    }

    if (!formData.email) {
      newErrors.email = t('fieldRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail')
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('fieldRequired')
    }

    if (!formData.password) {
      newErrors.password = t('fieldRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordTooShort')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('fieldRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordNotMatch')
    }

    if (!agreeTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(t('registerSuccess'))
      router.push('/login')
    } catch (error) {
      alert(t('registerFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleZaloRegister = () => {
    setIsLoading(true)
    // Simulate Zalo register
    setTimeout(() => {
      alert("Đăng ký với Zalo thành công!")
      router.push('/')
    }, 2000)
  }

  return (
    <Layout maxWidth="sm">
      <div className="min-h-[80vh] flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('createAccount')}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {t('joinPetCommunity')}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Zalo Register Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={handleZaloRegister}
              disabled={isLoading}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                <img src="/zalo_icon.png" alt="Zalo Icon" />
              </div>
              {t('quickRegisterWithZalo')}
            </Button>

            {/* Goolge Register Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-red-600 text-red-600 hover:bg-red-50"
              // onClick={handleZaloRegister}
              disabled={isLoading}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
                <img src="/google_icon.png" alt="Google Icon" />
              </div>
              {t('quickRegisterWithGoogle')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('fullName')} *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('fullNamePlaceholder')}
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')} *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')} *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('passwordPlaceholder')}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')} *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <Label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                    {t('byRegisteringYouAgree')}{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                      {t('termsOfService')}
                    </Link>{" "}
                    {t('and')}{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                      {t('privacyPolicy')}
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng ký..." : t('register')}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4">
              <span className="text-gray-600">{t('alreadyHaveAccount')} </span>
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('login')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
