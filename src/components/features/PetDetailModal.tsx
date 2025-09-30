"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  Star, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Eye,
  Clock,
  Weight,
  Stethoscope,
  Banknote,
  User,
  Badge as BadgeIcon
} from 'lucide-react'
import { petApi, PetDetailResponse } from '@/lib/api/petApi'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { t } from '@/lib/i18n'

interface PetDetailModalProps {
  isOpen: boolean
  onClose: () => void
  petId: string | null
}

export function PetDetailModal({ isOpen, onClose, petId }: PetDetailModalProps) {
  const [petDetail, setPetDetail] = useState<PetDetailResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (isOpen && petId) {
      fetchPetDetail()
    }
  }, [isOpen, petId])

  const fetchPetDetail = async () => {
    if (!petId) return
    
    try {
      setLoading(true)
      const detail = await petApi.getPetDetail(petId)
      setPetDetail(detail)
      setCurrentImageIndex(0)
    } catch (error) {
      console.error('Failed to fetch pet detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'Đực' : 'Cái'
  }

  const getAgeText = (age: number, unit: string) => {
    const unitText = unit === 'year' ? 'tuổi' : unit === 'month' ? 'tháng' : 'tuần'
    return `${age} ${unitText}`
  }

  const getTransactionTypeText = (type: string) => {
    const types: Record<string, string> = {
      'sell': 'Bán',
      'adopt': 'Nhận nuôi',
      'exchange': 'Trao đổi',
      'not_sell': 'Không bán',
      'lost': 'Thất lạc',
      'found': 'Tìm thấy'
    }
    return types[type] || type
  }

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'sell': 'bg-green-100 text-green-800',
      'adopt': 'bg-blue-100 text-blue-800',
      'exchange': 'bg-purple-100 text-purple-800',
      'not_sell': 'bg-gray-100 text-gray-800',
      'lost': 'bg-red-100 text-red-800',
      'found': 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">{t('petDetailTitle')}</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-100px)] overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : petDetail ? (
            <div className="space-y-6">
              {/* Pet Images */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={petDetail.images[currentImageIndex] || "/api/placeholder/400/300"}
                      alt={petDetail.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {petDetail.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {petDetail.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pet Basic Info */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{petDetail.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getTransactionTypeColor(petDetail.transactionType)}>
                          {getTransactionTypeText(petDetail.transactionType)}
                        </Badge>
                        {petDetail.vaccinated && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Stethoscope className="w-3 h-3 mr-1" />
                            Đã tiêm vắc xin
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {petDetail.price && petDetail.price > 0 && (
                        <div className="text-2xl font-bold text-green-600">
                          {petDetail.price.toLocaleString('vi-VN')} VNĐ
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Eye className="w-4 h-4 mr-1" />
                        {petDetail.view} lượt xem
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <BadgeIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t('petGenderLabel')}</p>
                        <p className="font-medium">{getGenderText(petDetail.gender)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t('petAgeDetail')}</p>
                        <p className="font-medium">{getAgeText(petDetail.age, petDetail.ageUnit)}</p>
                      </div>
                    </div>
                    {petDetail.weight && (
                      <div className="flex items-center gap-2">
                        <Weight className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">{t('petWeightLabel')}</p>
                          <p className="font-medium">{petDetail.weight} kg</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t('postedTime')}</p>
                        <p className="font-medium">
                          {formatDistanceToNow(new Date(petDetail.createdAt), { 
                            addSuffix: true, 
                            locale: vi 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pet Species & Breed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('speciesBreedInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('speciesLabel')}</p>
                      <p className="font-medium">{petDetail.species.nameVi}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('breedLabel')}</p>
                      <p className="font-medium">
                        {petDetail.breed?.nameVi || petDetail.customBreedName || t('undefinedBreed')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('description')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{petDetail.description}</p>
                </CardContent>
              </Card>

              {/* Owner Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('ownerInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <img
                      src={petDetail.owner.avatar || "/api/placeholder/60/60"}
                      alt={petDetail.owner.name}
                      className="w-15 h-15 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{petDetail.owner.name}</h4>
                        {petDetail.owner.verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <BadgeIcon className="w-3 h-3 mr-1" />
                            {t('verifiedOwner')}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {petDetail.owner.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{petDetail.owner.phone}</span>
                          </div>
                        )}
                        {petDetail.owner.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{petDetail.owner.email}</span>
                          </div>
                        )}
                        {petDetail.owner.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{petDetail.owner.address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            {t('memberSinceText')} {formatDistanceToNow(new Date(petDetail.owner.memberSince), { 
                              addSuffix: true, 
                              locale: vi 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span><strong>{petDetail.owner.rating}</strong> ({t('noRating')})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('petNotFound')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}