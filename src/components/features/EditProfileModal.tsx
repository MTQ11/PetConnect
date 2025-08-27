"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/textarea"
import { User } from "@/types"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { updateUserInfo } from "@/store/slices/authSlice"
import { Camera, X } from "lucide-react"
import { t } from "@/lib/i18n"
import { imageUploadToCloudinary } from "@/lib/utils/fetchCloudinary"
import api from "@/lib/api/axios"

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    user: User
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
    const dispatch = useAppDispatch()
    const { isLoading } = useAppSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
        description: user.description || ""
    })

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string>("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                avatar: user.avatar || "",
                description: user.description || ""
            })
            setAvatarPreview(user.avatar || "")
        }
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({
                    ...prev,
                    avatar: "Kích thước file không được vượt quá 5MB"
                }))
                return
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    avatar: "Vui lòng chọn file hình ảnh"
                }))
                return
            }

            setAvatarFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)

            // Clear avatar error
            setErrors(prev => ({
                ...prev,
                avatar: ""
            }))
        }
    }

    const removeAvatar = () => {
        setAvatarFile(null)
        setAvatarPreview("")
        setFormData(prev => ({
            ...prev,
            avatar: ""
        }))
    }

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.name.trim()) {
            newErrors.name = "Tên không được để trống"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            let avatarUrl = formData.avatar;

            avatarFile && (avatarUrl = await imageUploadToCloudinary(avatarFile));

            const response = await api.put("/users", {
                ...formData,
                avatar: avatarUrl
            })

            if (response.status >= 200 && response.status < 300)
                await dispatch(updateUserInfo(formData as any)).unwrap()
            onClose()
        } catch (error: any) {
            setErrors(prev => ({
                ...prev,
                submit: error.message || "Có lỗi xảy ra khi cập nhật thông tin"
            }))
        }
    }

    const handleClose = () => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            avatar: user.avatar || "",
            description: user.description || ""
        })
        setAvatarFile(null)
        setAvatarPreview(user.avatar || "")
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('editProfile')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Avatar Upload */}
                    <div className="space-y-2">
                        <Label>Ảnh đại diện</Label>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Camera className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                {avatarPreview && (
                                    <button
                                        type="button"
                                        onClick={removeAvatar}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <Label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Chọn ảnh
                                </Label>
                            </div>
                        </div>
                        {errors.avatar && (
                            <p className="text-sm text-red-600">{errors.avatar}</p>
                        )}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên hiển thị *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên hiển thị"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Nhập email"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả"
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Nhập địa chỉ"
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-600">{errors.address}</p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
