"use client"

import Link from "next/link"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Eye, MoreHorizontal, Star } from "lucide-react"
import { ROUTES } from "@/lib/constants"
import { t } from "@/lib/i18n"

// Mock data
const mockPets = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    age: "2 years",
    price: 1200,
    image: "/api/placeholder/80/80",
    postedTime: "2 days ago",
    views: 156,
    favorites: 12,
    messages: 8,
    status: "active"
  },
  {
    id: "2", 
    name: "Luna",
    breed: "Persian Cat",
    age: "1 year",
    price: 800,
    image: "/api/placeholder/80/80",
    postedTime: "1 week ago",
    views: 89,
    favorites: 7,
    messages: 3,
    status: "active"
  },
  {
    id: "3",
    name: "Charlie",
    breed: "French Bulldog", 
    age: "6 months",
    price: 2500,
    image: "/api/placeholder/80/80",
    postedTime: "2 weeks ago",
    views: 234,
    favorites: 18,
    messages: 15,
    status: "sold"
  },
  {
    id: "4",
    name: "Buddy",
    breed: "Labrador Mix",
    age: "3 years", 
    price: 600,
    image: "/api/placeholder/80/80",
    postedTime: "1 month ago",
    views: 178,
    favorites: 9,
    messages: 6,
    status: "sold"
  }
]

const favoritePets = [
  {
    id: "1",
    name: "Bella",
    breed: "Husky",
    age: "2 years",
    price: 1500,
    location: "Brooklyn, NY",
    image: "/api/placeholder/120/120",
    favorited: "3 days ago"
  },
  {
    id: "2",
    name: "Oscar", 
    breed: "Ragdoll",
    age: "1 year",
    price: 900,
    location: "Queens, NY",
    image: "/api/placeholder/120/120",
    favorited: "1 week ago"
  },
  {
    id: "3",
    name: "Ruby",
    breed: "Beagle",
    age: "4 months", 
    price: 1000,
    location: "Manhattan, NY",
    image: "/api/placeholder/120/120",
    favorited: "2 weeks ago"
  }
]

const messages = [
  {
    id: "1",
    senderName: "John Smith",
    senderAvatar: "/api/placeholder/40/40",
    petName: "Max",
    message: "I'm very interested.",
    time: "2 hours ago",
    unread: true
  },
  {
    id: "2", 
    senderName: "Emily Davis",
    senderAvatar: "/api/placeholder/40/40",
    petName: "Luna",
    message: "Thank you for the additional photos!",
    time: "1 day ago",
    unread: false
  },
  {
    id: "3",
    senderName: "Michael Brown", 
    senderAvatar: "/api/placeholder/40/40",
    petName: "Max",
    message: "Can we schedule a meetup this weekend?",
    time: "2 days ago",
    unread: false
  }
]

export default function ProfilePage() {
  return (
    <Layout maxWidth="xl">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl">SJ</span>
              </div>
              <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2">
                {t('verifiedUser')}
              </Badge>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <h1 className="text-xl font-semibold">Sarah Johnson</h1>
              <div className="text-gray-600 text-sm space-y-1">
                <p>📧 sarah.johnson@gmail.com</p>
                <p>📞 (555) 123-4567</p>
                <p>📍 New York, NY</p>
                <p>📅 {t('memberSince')} March 2019</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span><strong>4.8</strong> (23 {t('reviews')})</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm max-w-md mt-2">
                Passionate pet lover and responsible breeder. I've been helping pets find loving homes for over 5 years. All my pets are well-cared for and come with complete health records.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col lg:items-end gap-4">
            <div className="flex justify-center lg:justify-end gap-8 text-center">
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">{t('totalPets')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">3</p>
                <p className="text-sm text-gray-600">{t('activePets')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-500">5</p>
                <p className="text-sm text-gray-600">{t('soldPets')}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <Link href={ROUTES.post}>
                <Button className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                  + {t('postNewPet')}
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto">
                ✏️ {t('editProfile')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="listings" className="text-center">
            {t('myListings')} (4)
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-center">
            {t('favoritesTab')} (3)
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-center">
            {t('messages')} (1)
          </TabsTrigger>
        </TabsList>

        {/* My Listings Tab */}
        <TabsContent value="listings">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold">My Pet Listings</h2>
              <Link href={ROUTES.post}>
                <Button className="bg-gray-900">+ {t('addNewPet')}</Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {mockPets.map((pet) => (
                <div key={pet.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={pet.image} 
                      alt={pet.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
                      <p className="text-lg font-bold">${pet.price.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <div className="text-sm text-gray-500">
                      <span>{t('postedAgo')} {pet.postedTime}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{pet.views} {t('views')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{pet.favorites} {t('favorites_count')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{pet.messages} {t('messages_count')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={pet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {pet.status === 'active' ? t('active') : t('sold')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Favorite Pets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="relative">
                    <img 
                      src={pet.image} 
                      alt={pet.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{pet.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{pet.breed} • {pet.age}</p>
                    <p className="text-lg font-bold mb-2">${pet.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mb-3">📍 {pet.location}</p>
                    <p className="text-xs text-gray-500">Favorited {pet.favorited}</p>
                    <div className="flex justify-between items-center mt-3">
                      <Button variant="outline" size="sm">
                        {t('remove')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <img 
                        src={message.senderAvatar} 
                        alt={message.senderName}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{message.senderName}</h4>
                          {message.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">• {t('about')} {message.petName}</span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      {t('reply')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}