"use client"

import { useState, useEffect, useRef } from "react"
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
  ChevronRight,
  Check,
  Edit,
  Trash2
} from "lucide-react"
import { Post } from "@/types"
import { DetailPostModal } from "./DetailPostModal"
import { EditPostModal } from "./EditPostModal"
import { t } from "@/lib/i18n"
import api from "@/lib/api/axios"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { deletePost } from "@/store/slices/newfeedSlice"

interface PostCardProps {
  post: Post,
  isDetail: boolean
}

export function PostCard({ post, isDetail = false }: PostCardProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector(state => state.auth)
  
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showFullContent, setShowFullContent] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if current user owns this post
  const isOwner = currentUser && currentUser.id === post.userId

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikeCount(prev => prev + 1)
    }

    const payload = { postId: post.id }
    await api.post('likes/toggle', payload)
  }

  const handleUserClick = () => {
    router.push(ROUTES.userProfile(post.user.id))
  }

  const handleEdit = () => {
    setShowDropdown(false)
    setOpenEditModal(true)
  }

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await dispatch(deletePost(post.id)).unwrap()
        
        setShowDropdown(false)
      } catch (error) {
        console.error('Failed to delete post:', error)
        alert('Có lỗi xảy ra khi xóa bài viết')
      }
    }
    setShowDropdown(false)
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
    <>
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src={post.user.avatar || "/api/placeholder/40/40"}
                alt={post.user.name}
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={handleUserClick}
              />
              <div>
                <div className="flex items-center gap-1">
                  <h3 
                    className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleUserClick}
                  >
                    {post.user.name}
                  </h3>
                  {/* chưa phát triển tính năng bài viết có tích xanh */}
                  {/* {post.user.verified && (
                    <Verified className="w-3 h-3 text-blue-500" />
                  )} */}
                </div>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Dropdown Menu - Only show for post owner */}
            {isOwner && (
              <div className="relative" ref={dropdownRef}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
                
                {showDropdown && (
                  <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border z-10 min-w-[120px]">
                    <button
                      onClick={handleEdit}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            )}
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
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                {/* Container cho tất cả ảnh */}
                <div
                  className="flex transition-transform duration-300 ease-in-out h-full"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {post.images.map((image, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Image Navigation */}
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === post.images.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {post.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                            ? 'bg-white scale-110'
                            : 'bg-white/60 hover:bg-white/80'
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
          {post.pets.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                {t('attachedPets')}:
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {post.pets.map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/pets/${pet.id}`}
                    className="flex-shrink-0 group relative"
                  >
                    <div className="bg-gray-50 rounded-md p-2 min-w-[90px] hover:bg-gray-100 transition-colors">
                      <img
                        src={(pet.images && pet.images[0]) || "/api/placeholder/80/80"}
                        alt={pet.name}
                        className="w-12 h-12 rounded-md object-cover mx-auto mb-1"
                      />
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {pet.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {pet.breed_vi}
                        </p>
                        {pet.price !== undefined && pet.price !== null && pet.price > 0 && (
                          <p className="text-xs font-medium text-green-600 mt-0.5">
                            {pet.price.toLocaleString('vi-VN')}đ
                          </p>
                        )}
                      </div>
                      {/* {pet.isVerified && (
                        <Badge className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-xs px-1">
                          ✓
                        </Badge>
                      )} */}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Post Actions */}
          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs px-2 py-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
                <span>{t('like')}</span>
              </Button>

              {
                !isDetail &&
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-xs px-2 py-1"
                  onClick={() => setOpenDetailModal(true)}
                  disabled={isDetail}
                >
                  <MessageCircle className="w-3 h-3" />
                  {t('comment')}
                </Button>
              }

              <Button
                variant="ghost"
                size="sm"
                className="relative flex items-center gap-1 text-xs px-2 py-1"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  } catch (err) {
                    setCopied(false)
                  }
                }}
              >
                {copied && <Check className="absolute -left-2 w-3 h-3 text-green-600" />}
                <Share2 className="w-3 h-3" />
                {t('share')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Modal chi tiết bài viết + bình luận */}
      <DetailPostModal open={openDetailModal} onOpenChange={setOpenDetailModal} post={post} />
      
      {/* Modal chỉnh sửa bài viết - chỉ hiển thị cho owner */}
      {isOwner && (
        <EditPostModal 
          post={post} 
          isOpen={openEditModal} 
          onClose={() => setOpenEditModal(false)} 
        />
      )}
    </>
  )
}
