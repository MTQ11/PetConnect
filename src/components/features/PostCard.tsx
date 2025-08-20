"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Verified,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Post } from "@/types"
import { t } from "@/lib/i18n"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showFullContent, setShowFullContent] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
    }
  }

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: vi })
  }

  const nextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const shouldTruncateContent = post.content.length > 200
  const displayContent = shouldTruncateContent && !showFullContent 
    ? post.content.slice(0, 200) + "..."
    : post.content

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img
              src={post.user.avatar || "/api/placeholder/40/40"}
              alt={post.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-medium text-gray-900 text-sm">{post.user.name}</h3>
                {post.user.verified && (
                  <Verified className="w-3 h-3 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <p className="text-gray-900 whitespace-pre-wrap text-sm">
            {displayContent}
          </p>
          {shouldTruncateContent && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
            >
              {showFullContent ? t('seeLess') : t('seeMore')}
            </button>
          )}
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-3 relative">
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
              <img
                src={post.images[currentImageIndex]}
                alt="Post image"
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full disabled:opacity-50"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === post.images.length - 1}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full disabled:opacity-50"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {post.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Attached Pets */}
        {post.attachedPets.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              {t('attachedPets')}:
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {post.attachedPets.map((pet) => (
                <Link
                  key={pet.id}
                  href={`/pets/${pet.id}`}
                  className="flex-shrink-0 group relative"
                >
                  <div className="bg-gray-50 rounded-md p-2 min-w-[90px] hover:bg-gray-100 transition-colors">
                    <img
                      src={pet.images[0] || "/api/placeholder/80/80"}
                      alt={pet.name}
                      className="w-12 h-12 rounded-md object-cover mx-auto mb-1"
                    />
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {pet.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {pet.breed}
                      </p>
                      {pet.price && (
                        <p className="text-xs font-medium text-green-600 mt-0.5">
                          {pet.price.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                    {pet.isVerified && (
                      <Badge className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-xs px-1">
                        ✓
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="border-t pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{likeCount} {t('likes')}</span>
            <div className="flex gap-3">
              <span>{post.comments} {t('comments')}</span>
              <span>{post.shares} {t('shares')}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs px-2 py-1 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              {t('like')}
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs px-2 py-1">
              <MessageCircle className="w-3 h-3" />
              {t('comment')}
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs px-2 py-1">
              <Share2 className="w-3 h-3" />
              {t('share')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
