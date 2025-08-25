"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { PostCard } from "@/components/features/PostCard"
import { CreatePost } from "@/components/features/CreatePost"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Heart } from "lucide-react"
import { Post, Species, PetGender, HealthStatus } from "@/types"
import { t } from "@/lib/i18n"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { getAllPost } from "@/store/slices/newfeedSlice"
import { useMyPetsData } from "@/lib/hooks/useMyPetsData"
import api from "@/lib/api/axios"

// Mock data cho posts
const mockPosts: Post[] = [
  // {
  //   id: "1",
  //   userId: "user1",
  //   user: {
  //     id: "user1",
  //     name: "Nguyễn Minh An",
  //     avatar: "/api/placeholder/40/40",
  //     verified: true
  //   },
  //   content: "Hôm nay Max của mình đã tập được lệnh ngồi rồi! 🐕 Cảm ơn các bạn đã góp ý về cách huấn luyện. Ai có kinh nghiệm huấn luyện Golden Retriever thì chia sẻ thêm nhé!",
  //   images: [
  //     "/api/placeholder/600/400",
  //     "/api/placeholder/600/400"
  //   ],
  //   attachedPets: [
  //     {
  //       id: "1",
  //       name: "Max",
  //       species: Species.DOG,
  //       breed: "Golden Retriever",
  //       age: 24,
  //       gender: PetGender.MALE,
  //       color: "Golden",
  //       weight: 30,
  //       healthStatus: HealthStatus.EXCELLENT,
  //       description: "Chó Golden Retriever thân thiện",
  //       images: ["/api/placeholder/300/200"],
  //       ownerId: "user1",
  //       isAvailable: true,
  //       price: 1200,
  //       view: 156,
  //       location: "Hà Nội",
  //       isVerified: true,
  //       isFeatured: false,
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     }
  //   ],
  //   likes: 24,
  //   comments: 8,
  //   shares: 3,
  //   isLiked: false,
  //   createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  //   updatedAt: new Date()
  // },
  // {
  //   id: "2", 
  //   userId: "user2",
  //   user: {
  //     id: "user2",
  //     name: "Trần Thị Lan",
  //     avatar: "/api/placeholder/40/40",
  //     verified: false
  //   },
  //   content: "Gia đình mình đang tìm nhà mới cho 2 bé mèo Persian này. Cả 2 đều rất ngoan và thân thiện với trẻ em. Có ai quan tâm không ạ? 🐱💕",
  //   images: ["/api/placeholder/600/400"],
  //   attachedPets: [
  //     {
  //       id: "2",
  //       name: "Luna",
  //       species: Species.CAT,
  //       breed: "Persian",
  //       age: 18,
  //       gender: PetGender.FEMALE,
  //       color: "White",
  //       weight: 4,
  //       healthStatus: HealthStatus.EXCELLENT,
  //       description: "Mèo Persian xinh đẹp",
  //       images: ["/api/placeholder/300/200"],
  //       ownerId: "user2",
  //       isAvailable: true,
  //       price: 800,
  //       view: 89,
  //       location: "TP. Hồ Chí Minh",
  //       isVerified: false,
  //       isFeatured: false,
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     },
  //     {
  //       id: "3",
  //       name: "Mimi",
  //       species: Species.CAT,
  //       breed: "Persian",
  //       age: 20,
  //       gender: PetGender.FEMALE,
  //       color: "Gray",
  //       weight: 3.5,
  //       healthStatus: HealthStatus.GOOD,
  //       description: "Mèo Persian dễ thương",
  //       images: ["/api/placeholder/300/200"],
  //       ownerId: "user2",
  //       isAvailable: true,
  //       price: 750,
  //       view: 67,
  //       location: "TP. Hồ Chí Minh",
  //       isVerified: false,
  //       isFeatured: false,
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     }
  //   ],
  //   likes: 18,
  //   comments: 12,
  //   shares: 5,
  //   isLiked: true,
  //   createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  //   updatedAt: new Date()
  // },
  // {
  //   id: "3",
  //   userId: "user3", 
  //   user: {
  //     id: "user3",
  //     name: "Phạm Văn Đức",
  //     avatar: "/api/placeholder/40/40",
  //     verified: true
  //   },
  //   content: "Những chú chim Budgie nhỏ của mình đã có con rồi! 🐣 Ai có kinh nghiệm chăm sóc chim con thì hướng dẫn mình với ạ. Cảm ơn cộng đồng rất nhiều!",
  //   images: [
  //     "/api/placeholder/600/400",
  //     "/api/placeholder/600/400",
  //     "/api/placeholder/600/400"
  //   ],
  //   attachedPets: [],
  //   likes: 35,
  //   comments: 15,
  //   shares: 7,
  //   isLiked: false,
  //   createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  //   updatedAt: new Date()
  // }
]

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { posts, status, error: errorPosts } = useAppSelector(state => state.newfeed)

  const { myPets, loading, error: errorMyPets } = useMyPetsData();

  const [activeTab, setActiveTab] = useState("forYou")

  useEffect(() => {
    dispatch(getAllPost())
  }, [dispatch])

  return (
    <Layout maxWidth="lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Categories & Quick Actions */}
        {/* <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-3">{t('petCommunity')}</h3>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('trending')}
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                {t('following')}
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Heart className="w-4 h-4 mr-2" />
                {t('favorites')}
              </Button>
            </div>
          </div>
        </div> */}

        {/* Main Content - Newsfeed */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forYou">{t('forYou')}</TabsTrigger>
              <TabsTrigger value="following">{t('following')}</TabsTrigger>
            </TabsList>

            <TabsContent value="forYou" className="space-y-0">
              {/* Create Post */}
              <CreatePost myPets={myPets} />

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} isDetail={false} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="following" className="space-y-0">
              <CreatePost myPets={myPets} />

              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có bài đăng từ người bạn theo dõi
                </h3>
                <p className="text-gray-500 mb-4">
                  Hãy theo dõi thêm người dùng để xem bài đăng của họ tại đây
                </p>
                <Button variant="outline">
                  Khám phá người dùng
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
