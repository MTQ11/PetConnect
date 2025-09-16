import { Globe, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { logoutUser } from "@/store/slices/authSlice"
import { useUserData } from "@/lib/hooks/useUserData"

export const ProfileDropDown = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { user } = useAppSelector(state => state.auth)

    const handleLogout = async () => {
        await dispatch(logoutUser())
        router.push("/login");
    }

    return(
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <Link href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                <User className="w-4 h-4 mr-3"/>
                Trang cá nhân
            </Link>
            <Link href={`/${user?.id}`} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                <Globe className="w-4 h-4 mr-3"/>
                Truy cập website
            </Link>
            <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            >
                <LogOut className="w-4 h-4 mr-3"/>
                Đăng xuất
            </button>
        </div>
    )
}