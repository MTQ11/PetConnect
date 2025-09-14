"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, Heart } from "lucide-react"
import { t } from "@/lib/i18n"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { loginUser, loginZaloUser } from "@/store/slices/authSlice"
import { GoogleLogin } from "@react-oauth/google"
import { useSocialLogin } from "@/lib/hooks/useSocialLogin";

export default function LoginPage() {
    const dispatch = useAppDispatch()
    const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth)
    const router = useRouter()
    const { handleGoogleLogin, handleZaloLogin } = useSocialLogin()

    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
        rememberMe: false
    })

    const [zaloAuthorizationCode, setZaloAuthorizationCode] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const code = new URLSearchParams(window.location.search).get('code');
            setZaloAuthorizationCode(code);
        }
    }, []);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.emailOrPhone) {
            newErrors.emailOrPhone = t('fieldRequired')
        } else {
            const isEmail = formData.emailOrPhone.includes('@')
            const isPhone = /^[0-9]{10,11}$/.test(formData.emailOrPhone.replace(/\s/g, ''))

            if (!isEmail && !isPhone) {
                newErrors.emailOrPhone = "Vui lòng nhập email hoặc số điện thoại hợp lệ"
            }
        }

        if (!formData.password) {
            newErrors.password = t('fieldRequired')
        } else if (formData.password.length < 6) {
            newErrors.password = t('passwordTooShort')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        dispatch(loginUser({
            username: formData.emailOrPhone,
            password: formData.password,
            rememberMe: formData.rememberMe
        }))
    }

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/")
        }
    }, [isAuthenticated, router])

    useEffect(() => {
        const zaloVerifierCode = localStorage.getItem('zalo_code_verifier');

        if (zaloVerifierCode && zaloAuthorizationCode) {
            dispatch(loginZaloUser({ verifierCode: zaloVerifierCode, authorizationCode: zaloAuthorizationCode }));
        }
    }, [zaloAuthorizationCode])

    return (
        <Layout maxWidth="sm">
            <div className="min-h-[80vh] flex items-center justify-center py-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center pb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            {t('welcomeBack')}
                        </CardTitle>
                        <p className="text-gray-600 mt-2">
                            Đăng nhập để tiếp tục với PetConnect
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Google Login Button */}
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => { console.log("Google Login Failed"); }}
                            theme="filled_blue" // filled_blue | outline | filled_black
                            size="large"        // small | medium | large
                            shape="rectangular" // rectangular | pill | circle | square
                            text="signin_with"  // signin_with | signup_with | continue_with | signin
                        />

                        {/* Zalo Login Button */}
                        <button
                            className="relative w-full h-10 bg-[#1a73e8] text-white rounded-[3px] hover:bg-[#5194ee]"
                            onClick={handleZaloLogin}
                            disabled={isLoading}
                        >
                            <div className="absolute left-0 top-0 w-10 h-10 rounded-l-[3px] border-2 border-[#1a73e8] flex items-center justify-center mr-3 bg-white">
                                <img className="w-6 h-6" src="/zalo_icon.png" alt="Zalo Icon" />
                            </div>
                            <p className="pl-4">{t('loginWithZalo')}</p>
                        </button>

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

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email or Phone */}
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

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <Label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                                        {t('rememberMe')}
                                    </Label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {t('forgotPassword')}
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang đăng nhập..." : t('login')}
                            </Button>
                        </form>

                        {/* Register Link */}
                        <div className="text-center pt-4">
                            <span className="text-gray-600">{t('dontHaveAccount')} </span>
                            <Link
                                href="/register"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {t('register')}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}
