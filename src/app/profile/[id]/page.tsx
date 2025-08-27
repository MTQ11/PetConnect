"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Eye, MoreHorizontal, Star, ArrowLeft } from "lucide-react"
import { t } from "@/lib/i18n"
import api from "@/lib/api/axios"
import { AgeUnit, Pet, Post, User } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { PetCard } from "@/components/features/PetCard"
import { PostCard } from "@/components/features/PostCard"
import { useUserData } from "@/lib/hooks/useUserData"
import Link from "next/link"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const { user, loading, error } = useUserData(userId)
  const [userPets, setUserPets] = useState<Pet[]>([])
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [selectedTab, setSelectedTab] = useState("posts")

  useEffect(() => {
    if (!user) return

    const fetchTabData = async () => {
      try {
        switch (selectedTab) {
          case "posts":
            const postsResponse = await api.get(`/posts/user/${userId}`)
            setUserPosts(postsResponse.data)
            break
          case "pets":
            const petsResponse = await api.get(`/pets/user/${userId}`)
            setUserPets(petsResponse.data)
            break
          default:
            break
        }
      } catch (error) {
        console.error("Error fetching tab data:", error)
      }
    }

    fetchTabData()
  }, [selectedTab, user, userId])

  const handleContactUser = () => {
    // Logic to open chat or contact modal
    console.log("Contact user:", user?.id)
  }

  const handleReportUser = () => {
    // Logic to report user
    console.log("Report user:", user?.id)
  }

  if (loading) {
    return (
      <Layout maxWidth="xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    )
  }

  if (error || !user) {
    return (
      <Layout maxWidth="xl">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h2>
          <p className="text-gray-600 mb-4">{error || "Người dùng này không tồn tại hoặc đã bị xóa"}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout maxWidth="xl">
      {/* Back Button */}
      <div className="mb-4">
        <Button onClick={() => router.back()} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

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
                <p className="text-2xl font-bold">{user.postCount || 0}</p>
                <p className="text-sm text-gray-600">Bài đăng</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{user.petCount || 0}</p>
                <p className="text-sm text-gray-600">Thú cưng</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-500">{user.totalPetsSold || 0}</p>
                <p className="text-sm text-gray-600">Đã bán</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleContactUser} className="bg-blue-600 hover:bg-blue-700">
                💬 Nhắn tin
              </Button>
              <Button onClick={handleReportUser} variant="outline">
                🚩 Báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="posts"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="posts" className="text-center">
            Bài đăng
          </TabsTrigger>
          <TabsTrigger value="pets" className="text-center">
            Thú cưng
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Bài đăng của {user.name}</h2>
            {userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} isDetail={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Người dùng này chưa có bài đăng nào</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Pets Tab */}
        <TabsContent value="pets">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Thú cưng của {user.name}</h2>
            {userPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPets.map((pet) => (
                  <PetCard 
                    key={pet.id} 
                    pet={pet} 
                    onLikeChange={(petId, isLiked) => {
                      // Update pet like status
                      setUserPets(prev => 
                        prev.map(p => p.id === petId ? { ...p, isLiked } : p)
                      )
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Người dùng này chưa có thú cưng nào</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}
