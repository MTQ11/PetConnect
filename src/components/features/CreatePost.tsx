"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Smile, MapPin, Tag } from "lucide-react"
import { t } from "@/lib/i18n"

export function CreatePost() {
  const [content, setContent] = useState("")

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
            />
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 text-xs px-2 py-1">
                  <Camera className="w-4 h-4 mr-1" />
                  {t('photo')}
                </Button>
                
                <Link href="/post">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 text-xs px-2 py-1">
                    <Tag className="w-4 h-4 mr-1" />
                    {t('attachPets')}
                  </Button>
                </Link>
                
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
              >
                {t('publish')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
