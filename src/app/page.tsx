"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { PostCard } from "@/components/features/PostCard"
import { CreatePost } from "@/components/features/CreatePost"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Heart, Loader2 } from "lucide-react"
import { Post, Species, PetGender, HealthStatus } from "@/types"
import { t } from "@/lib/i18n"
import { useAppSelector } from "@/store/hook"
import { useMyPetsData } from "@/lib/hooks/useMyPetsData"
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll"
import { PostSkeletonList } from "@/components/ui/PostSkeleton"

export default function HomePage() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { myPets, loading, error: errorMyPets } = useMyPetsData();
  const { 
    posts, 
    status, 
    error: errorPosts, 
    hasMore, 
    loadingMore, 
    loadInitialPosts,
    setLastPostRef
  } = useInfiniteScroll();

  const [activeTab, setActiveTab] = useState("forYou")

  useEffect(() => {
    if (status === 'idle') {
      loadInitialPosts()
    }
  }, [status, loadInitialPosts])

  const renderPostsWithInfiniteScroll = (postsToRender: any[]) => {
    return (
      <>
        {postsToRender.map((post, index) => {
          const isLastPost = index === postsToRender.length - 1;
          return (
            <div
              key={post.id}
              ref={isLastPost ? setLastPostRef : null}
            >
              <PostCard post={post} isDetail={false} />
            </div>
          );
        })}
        {/* Loading indicator for infinite scroll */}
        {loadingMore && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Đang tải thêm bài viết...</span>
          </div>
        )}
        {/* End of posts indicator */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Bạn đã xem hết tất cả bài viết</p>
          </div>
        )}
      </>
    );
  };

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
                {status === 'loading' && posts.length === 0 ? (
                  <PostSkeletonList count={5} />
                ) : status === 'failed' ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải bài đăng</p>
                    <Button onClick={loadInitialPosts} variant="outline">
                      Thử lại
                    </Button>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có bài đăng nào
                    </h3>
                    <p className="text-gray-500">
                      Hãy là người đầu tiên chia sẻ về thú cưng của bạn!
                    </p>
                  </div>
                ) : (
                  renderPostsWithInfiniteScroll(posts)
                )}
              </div>
            </TabsContent>

            <TabsContent value="following" className="space-y-0">
              <CreatePost myPets={myPets} />

              {status === 'loading' ? (
                <PostSkeletonList count={3} />
              ) : (
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
