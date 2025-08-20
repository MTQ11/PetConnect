import Link from "next/link"
import { Heart, MapPin, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Pet } from "@/types"
import { t } from "@/lib/i18n"

interface PetCardProps {
    pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price)
    }

    const formatAge = (ageInMonths: number) => {
        if (ageInMonths < 12) {
            return `${ageInMonths} ${t('months')}`
        }
        const years = Math.floor(ageInMonths / 12)
        const months = ageInMonths % 12
        if (months === 0) {
            return `${years} ${t('years')}`
        }
        return `${years} ${t('years')} ${months} ${t('months')}`
    }

    return (
        <Link href={`/pets/${pet.id}`} className="block">
            <div className="overflow-hidden rounded-xl hover:shadow-lg transition-shadow duration-200 relative group cursor-pointer">
                {/* Heart Icon */}
                <button 
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Handle favorite functionality here
                    }}
                >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

            {/* Status Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {pet.isVerified && (
                    <Badge className="bg-blue-500 text-white text-xs">
                        {t('verified')}
                    </Badge>
                )}
                {/* {pet.isFeatured && (
                    <Badge className="bg-green-500 text-white text-xs">
                        {t('featured')}
                    </Badge>
                )} */}
            </div>

            {/* Pet Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
                <img
                    src={pet.images[0] || "/placeholder-pet.jpg"}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Age badge on image */}
                <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black/30 text-white text-xs">
                        <Eye className="w-3 h-3 mr-1"></Eye>{pet.view}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-3">
                {/* Pet Info */}
                <div className="mb-2">
                    <h3 className="font-semibold text-base mb-1">{pet.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{pet.breed.name_vi} / {formatAge(pet.age)}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{pet.description}</p>
                </div>

                {/* Location */}
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{pet.owner.address}</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                        {formatPrice(pet.price)}{t('currency')}
                    </div>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-xs px-3 py-1">
                        {t('viewDetails')}
                    </Button>
                </div>
            </CardContent>
            </div>
        </Link>
    )
}
