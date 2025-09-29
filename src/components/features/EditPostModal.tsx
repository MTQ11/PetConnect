"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Post } from "@/types"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { updatePost } from "@/store/slices/newfeedSlice"
import { X, Camera } from "lucide-react"
import { imageUploadToCloudinary } from "@/lib/utils/fetchCloudinary"

interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPostModal({ post, isOpen, onClose }: EditPostModalProps) {
  const dispatch = useAppDispatch()
  const { updateStatus } = useAppSelector(state => state.newfeed)
  
  const [content, setContent] = useState(post.content || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")

  // Initialize form data when post changes
  useEffect(() => {
    setContent(post.content || "")
    setCurrentImageUrl(post.images?.[0] || "")
  }, [post])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
      // Preview the new image
      const reader = new FileReader()
      reader.onload = () => {
        setCurrentImageUrl(reader.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setCurrentImageUrl("")
  }

  const handleSubmit = async () => {
    try {
      let imageUrl = currentImageUrl

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await imageUploadToCloudinary(imageFile)
      }

      const updateData: any = {
        content: content.trim()
      }

      if (imageUrl !== (post.images?.[0] || "")) {
        updateData.imageUrl = imageUrl
      }

      await dispatch(updatePost({ 
        id: post.id, 
        data: updateData 
      })).unwrap()

      onClose()
    } catch (error) {
      console.error("Failed to update post:", error)
    }
  }

  const isLoading = updateStatus === "loading"
  const hasChanges = 
    content !== (post.content || "") || 
    imageFile !== null ||
    currentImageUrl !== (post.images?.[0] || "")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          <DialogClose />
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Content */}
          <div>
            <Textarea
              placeholder="Bạn đang nghĩ gì?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="text-sm text-gray-500 text-right mt-1">
              {content.length}/1000
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-gray-500" />
              <label htmlFor="image-upload" className="text-sm font-medium cursor-pointer text-blue-600 hover:text-blue-800">
                {currentImageUrl ? "Thay đổi ảnh" : "Thêm ảnh"}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            
            {currentImageUrl && (
              <div className="relative">
                <img 
                  src={currentImageUrl} 
                  alt="Post image" 
                  className="w-full max-h-80 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !content.trim() || !hasChanges}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}