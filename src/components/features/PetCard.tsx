import Link from "next/link"
import { Heart, MapPin, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Pet } from "@/types"
import { t } from "@/lib/i18n"
import api from "@/lib/api/axios"
import { useAppDispatch } from "@/store/hook"
import { updatePetLike } from "@/store/slices/marketplaceSlice"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"

interface PetCardProps {
    pet: Pet
    onLikeChange?: (petId: string, isLiked: boolean) => void
}

export function PetCard({ pet, onLikeChange }: PetCardProps) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price)
    }

    const handleOwnerClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(ROUTES.userProfile(pet.owner.id))
    }

    const likePet = async (petId: string, isLiked: boolean) => {
        try {
            dispatch(updatePetLike({ petId, isLiked }))
            if (isLiked) {
                await api.delete(`/favorite-pets/dislike/${petId}`)
            }
            else {
                await api.post(`/favorite-pets/like/${petId}`)
            }
            if (onLikeChange) {
                onLikeChange(petId, !isLiked)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // const formatAge = (ageInMonths: number) => {
    //     if (ageInMonths < 12) {
    //         return `${ageInMonths} ${t('months')}`
    //     }
    //     const years = Math.floor(ageInMonths / 12)
    //     const months = ageInMonths % 12
    //     if (months === 0) {
    //         return `${years} ${t('years')}`
    //     }
    //     return `${years} ${t('years')} ${months} ${t('months')}`
    // }

    return (
        <div className="overflow-hidden rounded-xl hover:shadow-lg transition-shadow duration-200 relative group cursor-pointer">
            {/* Heart Icon */}
            <button
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/60 hover:bg-white transition-colors"
                onClick={(e) => { 
                    e.preventDefault(); 
                    likePet(pet.id, pet.isLiked); 
                }}
            >
                <Heart
                    className={`w-4 h-4 transition-colors ${pet.isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                    fill={pet.isLiked ? "currentColor" : "none"}
                />
            </button>
            {/* Status Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                {pet.isVerified && (
                    <Badge className="bg-blue-500 text-white text-xs px-2 py-1">
                        {t('verified')}
                    </Badge>
                )}
                {/* {pet.isFeatured && (
                <Badge className="bg-green-500 text-white text-xs">
                    {t('featured')}
                </Badge>
            )} */}
            </div>
            <Link href={`/pets/${pet.id}`} className="block">
                {/* Pet Image with overlay */}
                <div className="aspect-square relative overflow-hidden">
                    <img
                        src={pet.images[0] || "/placeholder-pet.jpg"}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Dark gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* View badge on image */}
                    <div className="absolute top-3 left-3 z-10">
                        <Badge variant="secondary" className="bg-black/40 text-white text-xs px-2 py-1">
                            <Eye className="w-3 h-3 mr-1"></Eye>{pet.view}
                        </Badge>
                    </div>
                    
                    {/* Pet Info on image overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-1 z-10">
                        <h3 className="font-semibold text-base text-white drop-shadow-sm">{pet.name}</h3>
                        <p className="text-xs text-white/90 drop-shadow-sm">{pet.breed.name_vi} / {pet.age} {pet.ageUnit}</p>
                        <p className="text-xs text-white/80 line-clamp-2 drop-shadow-sm">{pet.description}</p>
                    </div>
                </div>
                <CardContent className="p-2">
                    {/* Owner Info */}
                    <div className="flex items-center gap-2 mb-1">
                        <img
                            src={pet.owner.avatar || "/api/placeholder/24/24"}
                            alt={pet.owner.name}
                            className="w-6 h-6 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                            onClick={handleOwnerClick}
                        />
                        <span 
                            className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors truncate flex-1"
                            onClick={handleOwnerClick}
                        >
                            {pet.owner.name}
                        </span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center text-[8px] text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="">{pet.owner.address || "Chưa cập nhật"}</span>
                    </div>
                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                            {formatPrice(pet.price)}{t('currency')}
                        </div>
                        {/* <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-xs px-2 py-1 h-6">
                            {t('viewDetails')}
                        </Button> */}
                    </div>
                </CardContent>
            </Link>
        </div>
    )
}
