"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { X, Camera } from "lucide-react"
import { PetType, PetGender, HealthStatus, TransactionType } from "@/types"
import { t } from "@/lib/i18n"

// Types for form data
interface PetFormData {
    // Step 1 - Pet Details
    name: string
    type: PetType | ""
    breed: string
    age: number | ""
    ageUnit: "weeks" | "months" | "years"
    gender: PetGender | ""
    weight: number | ""
    color: string
    healthStatus: HealthStatus | ""

    // Step 2 - Description & Images
    description: string
    images: File[]
    price: number | ""
    transactionType: TransactionType | ""

    // Step 3 - Contact Info
    ownerName: string
    email: string
    phone: string
    address: string
    city: string
    notes: string
}

const initialFormData: PetFormData = {
    name: "",
    type: "",
    breed: "",
    age: "",
    ageUnit: "months",
    gender: "",
    weight: "",
    color: "",
    healthStatus: "",
    description: "",
    images: [],
    price: "",
    transactionType: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
}

// Breed options based on pet type
const breedOptions = {
    [PetType.DOG]: ["Golden Retriever", "Labrador", "Poodle", "Bulldog", "German Shepherd", "Shiba Inu", "Corgi", "Husky"],
    [PetType.CAT]: ["Persian", "British Shorthair", "Maine Coon", "Ragdoll", "Bengal", "Siamese", "Munchkin", "Scottish Fold"],
    [PetType.BIRD]: ["Parrot", "Canary", "Budgie", "Cockatiel", "Lovebird", "Finch"],
    [PetType.FISH]: ["Goldfish", "Betta", "Guppy", "Angelfish", "Koi", "Tetra"],
    [PetType.RABBIT]: ["Holland Lop", "Mini Rex", "Netherland Dwarf", "Lionhead", "Flemish Giant"],
    [PetType.HAMSTER]: ["Syrian", "Dwarf", "Roborovski", "Chinese"],
    [PetType.OTHER]: ["Khác"]
}

export default function PostPetPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<PetFormData>(initialFormData)
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

    const updateFormData = (field: keyof PetFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return

        const newFiles = Array.from(files).slice(0, 10 - formData.images.length)
        const newImages = [...formData.images, ...newFiles]

        // Create preview URLs
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file))
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])

        updateFormData('images', newImages)
    }

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index)
        const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index)

        URL.revokeObjectURL(imagePreviewUrls[index])
        setImagePreviewUrls(newPreviewUrls)
        updateFormData('images', newImages)
    }

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const getProgressPercentage = () => {
        return (currentStep / 4) * 100
    }

    const handleSubmit = () => {
        console.log("Form submitted:", formData)
        // Here you would typically send the data to your API
        alert("Tin đăng đã được tạo thành công!")
    }

    return (
        <Layout maxWidth="xl">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {t('postYourPet')}
                </h1>
                <p className="text-gray-600">
                    {t('createDetailedListing')}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">
                        {t('stepOf').replace('{current}', currentStep.toString()).replace('{total}', '4')} 4
                    </span>
                    <span className="text-sm text-gray-600">
                        {Math.round(getProgressPercentage())}% {t('complete')}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                        className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage()}%` }}
                    />
                </div>

                {/* Step indicators */}
                <div className="flex justify-between">
                    {[
                        { number: 1, label: t('petDetails'), active: currentStep >= 1 },
                        { number: 2, label: t('description'), active: currentStep >= 2 },
                        { number: 3, label: t('contactInfo'), active: currentStep >= 3 },
                        { number: 4, label: t('review'), active: currentStep >= 4 }
                    ].map((step) => (
                        <div key={step.number} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${step.active
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {step.number}
                            </div>
                            <span className={`text-xs text-center ${step.active ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <Card className="mb-6 sm:mb-8">
                <CardContent className="px-6 sm:px-8">
                    {/* Step 1: Pet Details */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-6">{t('petDetails')}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pet Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('petName')} *
                                    </label>
                                    <Input
                                        placeholder={t('enterPetName')}
                                        value={formData.name}
                                        onChange={(e) => updateFormData('name', e.target.value)}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('category')} *
                                    </label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => {
                                            updateFormData('type', value)
                                            updateFormData('breed', '') // Reset breed when category changes
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectPetCategory')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={PetType.DOG}>{t('dogs')}</SelectItem>
                                            <SelectItem value={PetType.CAT}>{t('cats')}</SelectItem>
                                            <SelectItem value={PetType.BIRD}>{t('birds')}</SelectItem>
                                            <SelectItem value={PetType.FISH}>{t('fish')}</SelectItem>
                                            <SelectItem value={PetType.RABBIT}>{t('rabbits')}</SelectItem>
                                            <SelectItem value={PetType.HAMSTER}>{t('smallPets')}</SelectItem>
                                            <SelectItem value={PetType.OTHER}>Khác</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Breed */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('breed')} *
                                    </label>
                                    <Select
                                        value={formData.breed}
                                        onValueChange={(value) => updateFormData('breed', value)}
                                        disabled={!formData.type}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={formData.type ? "Chọn giống" : t('selectCategoryFirst')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {formData.type && breedOptions[formData.type as PetType]?.map((breed) => (
                                                <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Age */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('ageLabel')} *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder={t('enterAge')}
                                            value={formData.age}
                                            onChange={(e) => updateFormData('age', parseInt(e.target.value) || "")}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('unit')} *
                                        </label>
                                        <Select
                                            value={formData.ageUnit}
                                            onValueChange={(value) => updateFormData('ageUnit', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('selectUnit')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="weeks">{t('weeksUnit')}</SelectItem>
                                                <SelectItem value="months">{t('monthsUnit')}</SelectItem>
                                                <SelectItem value="years">{t('yearsUnit')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('gender')} *
                                    </label>
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant={formData.gender === PetGender.MALE ? "default" : "outline"}
                                            onClick={() => updateFormData('gender', PetGender.MALE)}
                                        >
                                            {t('male')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={formData.gender === PetGender.FEMALE ? "default" : "outline"}
                                            onClick={() => updateFormData('gender', PetGender.FEMALE)}
                                        >
                                            {t('female')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('weight')} (kg)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder={t('enterWeight')}
                                        value={formData.weight}
                                        onChange={(e) => updateFormData('weight', parseFloat(e.target.value) || "")}
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('color')}
                                    </label>
                                    <Input
                                        placeholder={t('enterColor')}
                                        value={formData.color}
                                        onChange={(e) => updateFormData('color', e.target.value)}
                                    />
                                </div>

                                {/* Health Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('healthStatus')} *
                                    </label>
                                    <Select
                                        value={formData.healthStatus}
                                        onValueChange={(value) => updateFormData('healthStatus', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectHealthStatus')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={HealthStatus.EXCELLENT}>{t('excellent')}</SelectItem>
                                            <SelectItem value={HealthStatus.GOOD}>{t('good')}</SelectItem>
                                            <SelectItem value={HealthStatus.FAIR}>{t('fair')}</SelectItem>
                                            <SelectItem value={HealthStatus.POOR}>{t('poor')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Description & Images */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-6">{t('description')}</h2>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('petDescription')} *
                                </label>
                                <Textarea
                                    placeholder={t('enterDescription')}
                                    value={formData.description}
                                    onChange={(e) => updateFormData('description', e.target.value)}
                                    rows={5}
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('uploadPhotos')}
                                </label>

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <Camera className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-gray-600 mb-2">{t('dragDropPhotos')}</p>
                                        <p className="text-sm text-gray-500">{t('maxPhotos')}</p>
                                    </label>
                                </div>

                                {/* Image Previews */}
                                {imagePreviewUrls.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('price')} (VND) *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder={t('enterPrice')}
                                        value={formData.price}
                                        onChange={(e) => updateFormData('price', parseInt(e.target.value) || "")}
                                    />
                                </div>

                                {/* Transaction Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('transactionType')} *
                                    </label>
                                    <Select
                                        value={formData.transactionType}
                                        onValueChange={(value) => updateFormData('transactionType', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectTransactionType')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={TransactionType.SELL}>{t('sell')}</SelectItem>
                                            <SelectItem value={TransactionType.EXCHANGE}>{t('exchange')}</SelectItem>
                                            <SelectItem value={TransactionType.ADOPT}>{t('adopt')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact Info */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-6">{t('contactInfo')}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Owner Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('yourName')} *
                                    </label>
                                    <Input
                                        placeholder={t('enterYourName')}
                                        value={formData.ownerName}
                                        onChange={(e) => updateFormData('ownerName', e.target.value)}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('email')} *
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder={t('enterEmail')}
                                        value={formData.email}
                                        onChange={(e) => updateFormData('email', e.target.value)}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('phone')} *
                                    </label>
                                    <Input
                                        type="tel"
                                        placeholder={t('enterPhone')}
                                        value={formData.phone}
                                        onChange={(e) => updateFormData('phone', e.target.value)}
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('city')} *
                                    </label>
                                    <Select
                                        value={formData.city}
                                        onValueChange={(value) => updateFormData('city', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectCity')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hanoi">{t('hanoi')}</SelectItem>
                                            <SelectItem value="hochiminh">{t('hochiminh')}</SelectItem>
                                            <SelectItem value="haiphong">{t('haiphong')}</SelectItem>
                                            <SelectItem value="danang">{t('danang')}</SelectItem>
                                            <SelectItem value="cantho">{t('cantho')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('address')} *
                                </label>
                                <Input
                                    placeholder={t('enterAddress')}
                                    value={formData.address}
                                    onChange={(e) => updateFormData('address', e.target.value)}
                                />
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('additionalNotes')}
                                </label>
                                <Textarea
                                    placeholder={t('enterNotes')}
                                    value={formData.notes}
                                    onChange={(e) => updateFormData('notes', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-6">{t('reviewListing')}</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Pet Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">{t('petInformation')}</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('petName')}:</span>
                                            <span className="font-medium">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('category')}:</span>
                                            <span className="font-medium">{formData.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('breed')}:</span>
                                            <span className="font-medium">{formData.breed}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('ageLabel')}:</span>
                                            <span className="font-medium">{formData.age} {formData.ageUnit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('gender')}:</span>
                                            <span className="font-medium">{formData.gender}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('price')}:</span>
                                            <span className="font-medium">{formData.price?.toLocaleString()} VND</span>
                                        </div>
                                    </div>

                                    {/* Images Preview */}
                                    {imagePreviewUrls.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-medium mb-2">Ảnh:</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {imagePreviewUrls.slice(0, 6).map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-16 object-cover rounded"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">{t('contactInformation')}</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('yourName')}:</span>
                                            <span className="font-medium">{formData.ownerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('email')}:</span>
                                            <span className="font-medium">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('phone')}:</span>
                                            <span className="font-medium">{formData.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('city')}:</span>
                                            <span className="font-medium">{formData.city}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('address')}:</span>
                                            <span className="font-medium">{formData.address}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">{t('petDescription')}:</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                            {formData.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                >
                    ← {t('previous')}
                </Button>

                <div className="flex gap-3">
                    {currentStep === 4 ? (
                        <>
                            <Button variant="outline">
                                {t('saveDraft')}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="bg-gray-900 hover:bg-gray-800"
                            >
                                {t('publishListing')} →
                            </Button>
                        </>
                    ) : (
                        <Button onClick={nextStep} className="bg-gray-900 hover:bg-gray-800">
                            {t('next')} →
                        </Button>
                    )}
                </div>
            </div>
        </Layout>
    )
}
