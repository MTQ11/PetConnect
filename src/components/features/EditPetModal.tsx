"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Upload, Camera } from 'lucide-react'
import { petApi, EditPetData } from '@/lib/api/petApi'
import { Pet, AgeUnit } from '@/types'
import { t } from '@/lib/i18n'

interface EditPetModalProps {
  isOpen: boolean
  onClose: () => void
  pet: Pet | null
  onUpdateSuccess?: (updatedPet: Pet) => void
}

export function EditPetModal({ isOpen, onClose, pet, onUpdateSuccess }: EditPetModalProps) {
  const [formData, setFormData] = useState<EditPetData>({
    id: '',
    name: '',
    age: 0,
    ageUnit: 'year',
    gender: 'male',
    weight: 0,
    description: '',
    images: [],
    vaccinated: true,
    isForRehoming: false,
    transactionType: 'not_sell',
    price: 0
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string[]>([])

  useEffect(() => {
    if (isOpen && pet) {
      setFormData({
        id: pet.id,
        name: pet.name,
        age: pet.age,
        ageUnit: pet.ageUnit,
        gender: pet.gender,
        weight: pet.weight || 0,
        description: pet.description,
        images: pet.images || [],
        vaccinated: pet.vaccinated || true,
        isForRehoming: pet.isForRehoming || false,
        transactionType: pet.transactionType || 'not_sell',
        price: pet.price || 0
      })
      setImagePreview(pet.images || [])
    }
  }, [isOpen, pet])

  const handleInputChange = (field: keyof EditPetData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newImages: string[] = []
    const fileReaders: Promise<string>[] = []

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      const promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      fileReaders.push(promise)
    })

    Promise.all(fileReaders).then(results => {
      const updatedImages = [...(formData.images || []), ...results]
      setFormData(prev => ({ ...prev, images: updatedImages }))
      setImagePreview(updatedImages)
    })
  }

  const removeImage = (index: number) => {
    const updatedImages = formData.images?.filter((_, i) => i !== index) || []
    setFormData(prev => ({ ...prev, images: updatedImages }))
    setImagePreview(updatedImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pet) return

    try {
      setLoading(true)
      const updatedPet = await petApi.updatePet(formData)
      onUpdateSuccess?.(updatedPet)
      onClose()
    } catch (error) {
      console.error('Failed to update pet:', error)
      alert(t('updatePetError'))
    } finally {
      setLoading(false)
    }
  }

  const transactionTypes = [
    { value: 'not_sell', label: t('notSellOption') },
    { value: 'sell', label: t('sellOption') },
    { value: 'adopt', label: t('adoptOption') },
    { value: 'exchange', label: t('exchangeOption') },
    { value: 'lost', label: t('lostOption') },
    { value: 'found', label: t('foundOption') }
  ]

  const ageUnits = [
    { value: 'year', label: t('yearOption') },
    { value: 'month', label: t('monthOption') },
    { value: 'week', label: t('weekOption') }
  ]

  if (!isOpen || !pet) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('editPetTitle')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('basicInfoSection')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">{t('petNameInput')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('petNamePlaceholder')}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">{t('ageInput')} *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ageUnit">{t('ageUnitSelect')}</Label>
                  <Select value={formData.ageUnit} onValueChange={(value) => handleInputChange('ageUnit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ageUnits.map(unit => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">{t('genderSelect')}</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('maleOption')}</SelectItem>
                      <SelectItem value="female">{t('femaleOption')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight">{t('weightInput')}</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    placeholder={t('weightPlaceholder')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('descriptionInput')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('imagesSection')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {imagePreview.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Pet image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {imagePreview.length < 6 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 flex flex-col items-center justify-center h-24">
                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">{t('addImageButton')}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">{t('maxImagesNote')}</p>
            </CardContent>
          </Card>

          {/* Transaction Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('transactionInfoSection')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="transactionType">{t('transactionTypeSelect')}</Label>
                <Select value={formData.transactionType} onValueChange={(value) => handleInputChange('transactionType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.transactionType === 'sell' || formData.transactionType === 'exchange') && (
                <div>
                  <Label htmlFor="price">{t('priceInput')}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vaccinated"
                    checked={formData.vaccinated}
                    onCheckedChange={(checked) => handleInputChange('vaccinated', checked)}
                  />
                  <Label htmlFor="vaccinated">{t('vaccinatedCheckbox')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isForRehoming"
                    checked={formData.isForRehoming}
                    onCheckedChange={(checked) => handleInputChange('isForRehoming', checked)}
                  />
                  <Label htmlFor="isForRehoming">{t('rehomingCheckbox')}</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="bg-gray-900 hover:bg-gray-800">
              {loading ? t('savingText') : t('saveChangesButton')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}