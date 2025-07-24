"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PetCard } from "@/components/features/PetCard"
import { 
  Heart, 
  Share2, 
  Flag, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react"
import { Pet, PetType, PetGender, HealthStatus } from "@/types"
import { t } from "@/lib/i18n"

// Mock data for the pet detail
const mockPetDetail: Pet = {
  id: "1",
  name: "Max",
  type: PetType.DOG,
  breed: "Golden Retriever",
  age: 24, // 2 years in months
  gender: PetGender.MALE,
  color: "Golden",
  weight: 30,
  healthStatus: HealthStatus.EXCELLENT,
  description: "Max is a beautiful and friendly Golden Retriever who's been part of our family since he was a tiny puppy. He has been raised with love, receiving the best care and training. Max is very social, gets along great with children, and loves playing in the yard. He's up to date on all his vaccinations and has been neutered.\n\nThis sweet boy has been professionally trained and knows basic commands like sit, stay, heel, and fetch. He's housebroken and walks well on a leash. Max loves swimming and playing fetch - he's the perfect companion for an active family.\n\nHealth records and vaccination history are all available. Max comes with his favorite toys, bed, leash, and food. We want to make sure he goes to a loving home where he'll be treated as part of the family.",
  images: [
    "/api/placeholder/600/400",
    "/api/placeholder/600/400", 
    "/api/placeholder/600/400",
    "/api/placeholder/600/400",
    "/api/placeholder/600/400"
  ],
  ownerId: "user1",
  isAvailable: true,
  price: 1200,
  view: 156,
  location: "New York, NY",
  isVerified: true,
  isFeatured: false,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10')
}

// Mock seller data
const mockSeller = {
  id: "user1",
  name: "Sarah Johnson",
  avatar: "/api/placeholder/60/60",
  phone: "(555) 123-4567",
  email: "sarah.johnson@gmail.com",
  location: "New York, NY",
  memberSince: "March 2019",
  rating: 4.8,
  reviewCount: 23,
  verified: true,
  responseTime: "Usually responds within 2 hours"
}

// Mock similar pets
const mockSimilarPets: Pet[] = [
  {
    id: "2",
    name: "Buddy",
    type: PetType.DOG,
    breed: "Golden Retriever",
    age: 18,
    gender: PetGender.MALE,
    color: "Golden",
    weight: 28,
    healthStatus: HealthStatus.EXCELLENT,
    description: "Friendly Golden Retriever",
    images: ["/api/placeholder/300/200"],
    ownerId: "user2",
    isAvailable: true,
    price: 1100,
    view: 89,
    location: "Brooklyn, NY",
    isVerified: false,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3", 
    name: "Lucy",
    type: PetType.DOG,
    breed: "Labrador",
    age: 30,
    gender: PetGender.FEMALE,
    color: "Yellow",
    weight: 25,
    healthStatus: HealthStatus.GOOD,
    description: "Sweet Labrador",
    images: ["/api/placeholder/300/200"],
    ownerId: "user3",
    isAvailable: true,
    price: 900,
    view: 67,
    location: "Queens, NY",
    isVerified: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Charlie",
    type: PetType.DOG,
    breed: "Golden Retriever",
    age: 36,
    gender: PetGender.MALE,
    color: "Golden",
    weight: 32,
    healthStatus: HealthStatus.EXCELLENT,
    description: "Well-trained Golden Retriever",
    images: ["/api/placeholder/300/200"],
    ownerId: "user4",
    isAvailable: true,
    price: 1300,
    view: 112,
    location: "Manhattan, NY",
    isVerified: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    name: "Bella",
    type: PetType.DOG,
    breed: "Golden Retriever", 
    age: 12,
    gender: PetGender.FEMALE,
    color: "Light Golden",
    weight: 26,
    healthStatus: HealthStatus.EXCELLENT,
    description: "Young and energetic",
    images: ["/api/placeholder/300/200"],
    ownerId: "user5",
    isAvailable: true,
    price: 1400,
    view: 134,
    location: "Staten Island, NY",
    isVerified: false,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function PetDetailPage() {
  const params = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockPetDetail.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockPetDetail.images.length - 1 : prev - 1
    )
  }

  return (
    <Layout maxWidth="xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {/* Main Image */}
              <div className="relative aspect-[4/3]">
                <img
                  src={mockPetDetail.images[currentImageIndex]}
                  alt={`${mockPetDetail.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {mockPetDetail.images.length}
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {mockPetDetail.isVerified && (
                    <Badge className="bg-blue-500 text-white">
                      {t('verified')}
                    </Badge>
                  )}
                  {mockPetDetail.isFeatured && (
                    <Badge className="bg-green-500 text-white">
                      {t('featured')}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {mockPetDetail.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {mockPetDetail.name}
                    </h1>
                    <p className="text-xl text-gray-600">
                      {mockPetDetail.breed} • {formatAge(mockPetDetail.age)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {formatPrice(mockPetDetail.price)}{t('currency')}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      {mockPetDetail.view} {t('views')}
                    </div>
                  </div>
                </div>

                {/* Pet Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{t('petAge')}</p>
                    <p className="font-semibold">{formatAge(mockPetDetail.age)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{t('petSize')}</p>
                    <p className="font-semibold">{t('large')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{t('trained')}</p>
                    <p className="font-semibold">{t('yes')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{t('vaccinated')}</p>
                    <p className="font-semibold">{t('yes')}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{mockPetDetail.location}</span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('detailDescription')}</h3>
                  <div className="text-gray-700 space-y-3">
                    {mockPetDetail.description.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Seller Info and Actions */}
          <div className="space-y-6">
            {/* Seller Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('sellerInformation')}</h3>
                
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={mockSeller.avatar}
                    alt={mockSeller.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{mockSeller.name}</h4>
                      {mockSeller.verified && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          {t('verifiedSeller')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{mockSeller.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({mockSeller.reviewCount} {t('reviews')})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t('memberSince')} {mockSeller.memberSince}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{mockSeller.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{mockSeller.phone}</span>
                  </div>
                  <p className="text-green-600 font-medium">
                    {mockSeller.responseTime}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('sendMessage')}
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    {t('call')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorited ? t('favorites') : t('addToFavorites')}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('shareListing')}
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Flag className="w-4 h-4 mr-2" />
                    {t('reportListing')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Pets Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t('similarPetsYouMightLike')}</h2>
          <p className="text-gray-600 mb-6">{t('offerGoldenRetrievers')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockSimilarPets.map((pet) => (
              <Link key={pet.id} href={`/pets/${pet.id}`}>
                <PetCard pet={pet} />
              </Link>
            ))}
          </div>
        </div>
    </Layout>
  )
}
