"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Check, Smartphone } from "lucide-react"
import { t } from "@/lib/i18n"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Enter email/phone, 2: Enter code, 3: Reset password, 4: Success
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [method, setMethod] = useState<'email' | 'sms' | null>(null)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = t('fieldRequired')
    } else {
      const isEmail = formData.emailOrPhone.includes('@')
      const isPhone = /^[0-9]{10,11}$/.test(formData.emailOrPhone.replace(/\s/g, ''))
      
      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone = "Vui lòng nhập email hoặc số điện thoại hợp lệ"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      newErrors.verificationCode = "Mã xác thực phải có 6 số"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.newPassword) {
      newErrors.newPassword = t('fieldRequired')
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('passwordTooShort')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('fieldRequired')
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordNotMatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep1()) return

    setIsLoading(true)
    
    // Determine method based on input
    const isEmail = formData.emailOrPhone.includes('@')
    setMethod(isEmail ? 'email' : 'sms')
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep(2)
      startCountdown()
    } catch (error) {
      alert("Gửi mã xác thực thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) return

    setIsLoading(true)
    
    // Simulate API call to verify code
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (formData.verificationCode === "123456") { // Mock verification
        setStep(3)
      } else {
        setErrors({ verificationCode: "Mã xác thực không đúng" })
      }
    } catch (error) {
      alert("Xác thực thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep3()) return

    setIsLoading(true)
    
    // Simulate API call to reset password
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep(4)
    } catch (error) {
      alert("Đặt lại mật khẩu thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resendCode = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      startCountdown()
      alert("Mã xác thực đã được gửi lại")
    } catch (error) {
      alert("Gửi lại mã thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 1: Enter email or phone
  if (step === 1) {
    return (
      <Layout maxWidth="sm">
        <div className="min-h-[80vh] flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t('forgotPassword')}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Nhập email hoặc số điện thoại để đặt lại mật khẩu
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone">Email hoặc Số điện thoại *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="emailOrPhone"
                      type="text"
                      placeholder="Nhập email hoặc số điện thoại"
                      value={formData.emailOrPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                      className={`pl-10 ${errors.emailOrPhone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.emailOrPhone && (
                    <p className="text-sm text-red-600">{errors.emailOrPhone}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
                </Button>
              </form>

              <div className="text-center pt-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center text-gray-600 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Step 2: Enter verification code
  if (step === 2) {
    return (
      <Layout maxWidth="sm">
        <div className="min-h-[80vh] flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {method === 'email' ? (
                  <Mail className="w-8 h-8 text-green-600" />
                ) : (
                  <Smartphone className="w-8 h-8 text-green-600" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Nhập mã xác thực
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Mã xác thực đã được gửi đến{" "}
                {method === 'email' ? 'email' : 'số điện thoại'}{" "}
                <span className="font-medium">{formData.emailOrPhone}</span>
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Mã xác thực (6 số) *</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={formData.verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      setFormData(prev => ({ ...prev, verificationCode: value }))
                    }}
                    className={`text-center text-2xl tracking-widest ${errors.verificationCode ? 'border-red-500' : ''}`}
                  />
                  {errors.verificationCode && (
                    <p className="text-sm text-red-600">{errors.verificationCode}</p>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    Mã demo: 123456
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực"}
                </Button>
              </form>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Gửi lại mã sau {countdown}s
                  </p>
                ) : (
                  <button
                    onClick={resendCode}
                    disabled={isLoading}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Gửi lại mã xác thực
                  </button>
                )}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center text-gray-600 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Thay đổi email/số điện thoại
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Step 3: Reset password
  if (step === 3) {
    return (
      <Layout maxWidth="sm">
        <div className="min-h-[80vh] flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Đặt mật khẩu mới
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Tạo mật khẩu mới cho tài khoản của bạn
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={errors.newPassword ? 'border-red-500' : ''}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Step 4: Success
  if (step === 4) {
    return (
      <Layout maxWidth="sm">
        <div className="min-h-[80vh] flex items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Đặt lại mật khẩu thành công!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                >
                  Đăng nhập ngay
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  Về trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return null
}
