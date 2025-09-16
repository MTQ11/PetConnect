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

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { posts, status, error: errorPosts } = useAppSelector(state => state.newfeed)
  const { myPets, loading, error: errorMyPets } = useMyPetsData();

  const [activeTab, setActiveTab] = useState("forYou")

  useEffect(() => {
    dispatch(getAllPost())
  }, [isAuthenticated, dispatch])

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
