import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hook"
import { loginGoogleUser, loginZaloUser } from "@/store/slices/authSlice"

export const useSocialLogin = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleGoogleLogin = async (credentialResponse: any) => {
        const idToken = credentialResponse.credential
        dispatch(loginGoogleUser({ idToken }))
    }

    const handleZaloLogin = async () => {
        // Code verifier là 1 chuỗi bất kỳ, format có đủ chữ hoa, chữ thường, số và dài 43 ký tự.
        const generateCodeVerifier = () => {
            const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            const lower = 'abcdefghijklmnopqrstuvwxyz'
            const digits = '0123456789'
            const allChars = upper + lower + digits

            // Đảm bảo ít nhất một của mỗi loại
            const randomUpper = upper[Math.floor(Math.random() * upper.length)]
            const randomLower = lower[Math.floor(Math.random() * lower.length)]
            const randomDigit = digits[Math.floor(Math.random() * digits.length)]

            // Tạo phần còn lại (40 ký tự) ngẫu nhiên
            let result = randomUpper + randomLower + randomDigit
            for (let i = 3; i < 43; i++) {
                result += allChars[Math.floor(Math.random() * allChars.length)]
            }

            // Xáo trộn để ngẫu nhiên hóa vị trí
            return result.split('').sort(() => Math.random() - 0.5).join('')
        }

        const codeVerifier = generateCodeVerifier()

        localStorage.setItem('zalo_code_verifier', codeVerifier)

        const generateCodeChallenge = async (verifier: string) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(verifier)
            const hash = await crypto.subtle.digest('SHA-256', data)
            const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)))
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
        }

        const codeChallenge = await generateCodeChallenge(codeVerifier)
        router.push(`https://oauth.zaloapp.com/v4/permission?app_id=${process.env.NEXT_PUBLIC_ZALO_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_ZALO_REDIRECT_URI}&state=yes&code_challenge=${codeChallenge}&code_challenge_method=S256`)
    }

    return {
        handleGoogleLogin,
        handleZaloLogin
    }
}