"use client"

import { MyPetCard } from '@/components/features/MyPetCard'
import Link from "next/link"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Eye, MoreHorizontal, Star, ArrowLeft } from "lucide-react"
import { ROUTES } from "@/lib/constants"
import { t } from "@/lib/i18n"
import { useEffect, useState } from "react"
import api from "@/lib/api/axios"
import { AgeUnit, Pet, Post } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { PetCard } from "@/components/features/PetCard"
import { useMyPetsData } from "@/lib/hooks/useMyPetsData"
import { PostCard } from "@/components/features/PostCard"
import { EditProfileModal } from "@/components/features/EditProfileModal"
import { useAppSelector } from "@/store/hook"
import { AuthGuardLayout } from '@/components/layout/AuthGuardLayout'
import { useRouter } from 'next/navigation'

// Mock data
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
  const router = useRouter()

  const { user } = useAppSelector((state) => state.auth)
  const { myPets, loading, error } = useMyPetsData();
  const [myFavoritePets, setMyFavoritePets] = useState<Pet[]>([])
  const [myPostList, setMyPostList] = useState<Post[]>([])
  const [selectedTab, setSelectedTab] = useState("myPostList")
  const [showEditModal, setShowEditModal] = useState(false)

  const handleLikeChangeOnProfile = (petId: string, isLiked: boolean) => {
    setMyFavoritePets((prevFavorites) =>
      prevFavorites.map(pet =>
        pet.id === petId ? { ...pet, isLiked } : pet
      )
    )
  }

  const handleEditPet = (petId: string) => {
    // Navigate to edit pet page
    console.log('Edit pet:', petId)
  }

  const handleDeletePet = (petId: string) => {
    // Show confirmation dialog and delete pet
    if (window.confirm('Are you sure you want to delete this pet?')) {
      console.log('Delete pet:', petId)
      // Implement delete logic here
      // You can call API to delete pet
    }
  }

  const handleTogglePetStatus = (petId: string) => {
    // Toggle pet availability status
    console.log('Toggle pet status:', petId)
    // Implement toggle status logic here
    // You can call API to update pet status
  }

  const handleViewPetDetails = (petId: string) => {
    // Navigate to pet details page
    console.log('View pet details:', petId)
  }

  useEffect(() => {
    if (!user) return

    switch (selectedTab) {
      case "myPostList":
        const fetchPostListings = async () => {
          const response = await api.get(`/posts/user/${user.id}`)
          setMyPostList(response.data)
        }
        fetchPostListings()
        break
      case "mypets":
        // My Pets data is already fetched by useMyPetsData hook
        break
      case "favorites":
        const fetchMyFavorites = async () => {
          const response = await api.get('/pets/favorite')
          setMyFavoritePets(response.data)
        }
        fetchMyFavorites()
        break
      default:
        break
    }
  }, [selectedTab, user])

  return (
    <AuthGuardLayout>
      <Layout maxWidth="xl">
        {!user ?
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h2>
              <p className="text-gray-600 mb-4">{error || "Người dùng này không tồn tại hoặc đã bị xóa"}</p>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </div>
          :
          <div>
            {/* Profile Header */}
            <div className="bg-white rounded-lg p-6 sm:p-8 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.avatar || "/api/placeholder/80/80"}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    {user.verified && (
                      <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2">
                        {t('verifiedUser')}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <h1 className="text-xl font-semibold">{user.name}</h1>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>📧 {user.email}</p>
                      {user.phone && <p>📞 {user.phone}</p>}
                      {user.address && <p>📍 {user.address}</p>}
                      <p>📅 {t('memberSince')} {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span><strong>{user.rating || 0}</strong> (Chưa có đánh giá)</span>
                      </div>
                    </div>
                    <div>{user.description}</div>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end gap-4">
                  <div className="flex justify-center lg:justify-end gap-8 text-center">
                    <div>
                      <p className="text-2xl font-bold">{user.postCount || myPostList.length}</p>
                      <p className="text-sm text-gray-600">Bài đăng</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{user.petCount || myPets.length}</p>
                      <p className="text-sm text-gray-600">{t('activePets')}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-500">{user.totalPetsSold || 0}</p>
                      <p className="text-sm text-gray-600">{t('soldPets')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    <Link href={ROUTES.createpet}>
                      <Button className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                        + {t('postNewPet')}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setShowEditModal(true)}
                    >
                      ✏️ {t('editProfile')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="myPostList"
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="myPostList" className="text-center">
                  {t('myListings')}
                </TabsTrigger>
                <TabsTrigger value="mypets" className="text-center">
                  {t('myPetList')}
                </TabsTrigger>
                <TabsTrigger value="favorites" className="text-center">
                  {t('favoritesTab')}
                </TabsTrigger>
                <TabsTrigger value="messages" className="text-center">
                  {t('messages')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="myPostList">
                <div className="space-y-4">
                  {myPostList.map((post) => (
                    <PostCard key={post.id} post={post} isDetail={false} />
                  ))}
                </div>
              </TabsContent>
              {/* My Pet Listings Tab */}
              <TabsContent value="mypets">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-semibold">My Pet Listings</h2>
                    <Link href={ROUTES.createpet}>
                      <Button className="bg-gray-900">+ {t('addNewPet')}</Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {myPets.map((pet) => (
                      <MyPetCard
                        key={pet.id}
                        pet={pet}
                        onEdit={handleEditPet}
                        onDelete={handleDeletePet}
                        onToggleStatus={handleTogglePetStatus}
                        onViewDetails={handleViewPetDetails}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Favorite Pets</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myFavoritePets.map((pet) => (
                      <PetCard key={pet.id} pet={pet} onLikeChange={(petId, isLiked) => handleLikeChangeOnProfile(petId, isLiked)} />
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

            {/* Edit Profile Modal */}
            <EditProfileModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              user={user}
            />
          </div>
        }
      </Layout>
    </AuthGuardLayout>
  )
}