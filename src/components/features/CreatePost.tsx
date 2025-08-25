"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Smile, MapPin, Tag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { t } from "@/lib/i18n"
import { Pet } from "@/types"
import api from "@/lib/api/axios"
import { imageUploadToCloudinary } from "@/lib/utils/fetchCloudinary"

interface CreatePostProps {
  myPets: Pet[];
}

export function CreatePost({ myPets }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [openAttachPets, setOpenAttachPets] = useState(false)
  const [selectedPets, setSelectedPets] = useState<Pet[]>([])
  const [images, setImages] = useState<File[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setImages(prev => [...prev, ...filesArray])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitPost = async () => {
    try {

      const uploadedUrls = await Promise.all(images.map(file => imageUploadToCloudinary(file)));

      const payload = {
        content,
        petId: selectedPets.map(pet => pet.id),
        images: uploadedUrls,
        location: null // Tạm thời để null, có thể mở rộng sau
      }

      await api.post('/posts', payload)

      // Reset form sau khi đăng thành công
      setContent("")
      setSelectedPets([])
      setImages([])
    } catch (error) {
      console.log(error)
    }
  }

  // Xử lý chọn/bỏ chọn thú cưng
  const handleTogglePet = (pet: any) => {
    setSelectedPets((prev) => {
      const exists = prev.find((p) => p.id === pet.id)
      if (exists) {
        return prev.filter((p) => p.id !== pet.id)
      } else {
        return [...prev, pet]
      }
    })
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <img
            src="/api/placeholder/40/40"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />

          <div className="flex-1">
            <Textarea
              placeholder={t('whatsOnYourMind')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[60px] border-none shadow-none resize-none text-sm placeholder:text-gray-400"
              style={{ height: 'auto', overflow: 'hidden', maxHeight: '300px', overflowY: 'auto' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                const newHeight = Math.min(target.scrollHeight, 300);
                target.style.height = newHeight + 'px';
              }}
            />

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    id="image-upload"
                  />
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 text-xs px-2 py-1" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                      <Camera className="w-4 h-4 mr-1" />
                      {t('photo')}
                    </label>
                  </Button>
                </div>

                <Dialog open={openAttachPets} onOpenChange={setOpenAttachPets}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 text-xs px-2 py-1" onClick={() => setOpenAttachPets(true)}>
                      <Tag className="w-4 h-4 mr-1" />
                      {t('attachPets')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Chọn thú cưng để đính kèm</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-2">
                      {myPets.map(pet => {
                        const isSelected = selectedPets.some((p) => p.id === pet.id)
                        return (
                          <div key={pet.id} className={`flex items-center gap-3 p-2 rounded-lg transition cursor-pointer ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-100'}`} onClick={() => handleTogglePet(pet)}>
                            <img src={pet.images[0]} alt={pet.name} className="w-10 h-10 rounded-full object-cover border" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{pet.name}</div>
                              <div className="text-xs text-gray-500">{pet.species.name_vi}</div>
                            </div>
                            <Button variant={isSelected ? "default" : "outline"} size="sm">{isSelected ? "Đã chọn" : "Chọn"}</Button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="default" size="sm" onClick={() => setOpenAttachPets(false)}>Xác nhận</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-yellow-600 text-xs px-2 py-1">
                  <Smile className="w-4 h-4 mr-1" />
                  {t('emotion')}
                </Button>

                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 text-xs px-2 py-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {t('locationTag')}
                </Button>
              </div>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
                disabled={!content.trim()}
                onClick={handleSubmitPost}
              >
                {t('publish')}
              </Button>
            </div>
            {/* Danh sách thú cưng đã chọn nằm ngang */}
            {selectedPets.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {selectedPets.map(pet => (
                  <div key={pet.id} className="flex flex-col items-center">
                    <img src={pet.images[0]} alt={pet.name} className="w-8 h-8 rounded-full object-cover border" />
                    <span className="text-xs text-gray-700 mt-1">{pet.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Hiển thị ảnh đã chọn */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 w-6 h-6 p-0 bg-black/50 hover:bg-black/70 text-white rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
