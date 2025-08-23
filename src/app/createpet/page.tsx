"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Camera } from "lucide-react"
import { Species, PetGender, HealthStatus, TransactionType, Breeds, AgeUnit } from "@/types"
import { t } from "@/lib/i18n"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { getSpecies, getBreeds } from "@/store/slices/speciesSlice"
import { useBreedsData, useSpeciesData } from "@/lib/hooks/useSpeciesData"
import api from "@/lib/api/axios"

interface PetFormData {
    name: string
    age: number | ""
    ageUnit: AgeUnit
    gender: PetGender | ""
    weight: number | ""
    // color: string
    // healthStatus: HealthStatus | ""
    description: string
    images: File[]
    speciesId: string
    breedId: string
    customBreedName: string
    isForRehoming: boolean
    price: number
    transactionType?: TransactionType | ""

    // Contact Info 
    // ownerName: string
    // email: string
    // phone: string
    // address: string
    // city: string
    // notes: string
}

export default function CreatePetPage() {
    const [formData, setFormData] = useState<PetFormData>({
        name: "",
        age: "",
        ageUnit: AgeUnit.MONTH,
        gender: "",
        weight: "",
        description: "",
        images: [],
        speciesId: "",
        breedId: "",
        customBreedName: "",
        isForRehoming: false,
        price: 0,
        transactionType: TransactionType.NOT_SELL,
    })

    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
    const { species, loading: speciesLoading } = useSpeciesData()
    const { breeds, loading: breedsLoading } = useBreedsData(formData.speciesId)


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

    const imageUploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "petconnect");

        const response = await fetch("https://api.cloudinary.com/v1_1/dhtjhpibu/image/upload", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }

        const data = await response.json();
        return data.secure_url;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const uploadedUrls = await Promise.all(
                formData.images.map(file => imageUploadToCloudinary(file))
            );

            const payload = { ...formData, images: uploadedUrls }

            api.post('/pets', payload)

        } catch (error) {
            console.error(error)
        }
    }

    const handleRehomingChange = (checked: boolean) => {
        updateFormData('isForRehoming', checked)

        // Reset contact info if unchecked
        if (!checked) {
            updateFormData('price', "")
            updateFormData('transactionType', "")
            // updateFormData('ownerName', "")
            // updateFormData('email', "")
            // updateFormData('phone', "")
            // updateFormData('address', "")
            // updateFormData('city', "")
            // updateFormData('notes', "")
        }
    }

    return (
        <Layout maxWidth="2xl">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('postYourPet')}
                    </h1>
                    <p className="text-gray-600">
                        {t('createDetailedListing')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Pet Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t('petDetails')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pet Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('petName')} *</Label>
                                    <Input
                                        id="name"
                                        placeholder={t('enterPetName')}
                                        value={formData.name}
                                        onChange={(e) => updateFormData('name', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Pet Type */}
                                <div className="space-y-2">
                                    <Label>{t('category')} *</Label>
                                    <Select
                                        value={formData.speciesId}
                                        onValueChange={(value) => {
                                            updateFormData('speciesId', value)
                                            updateFormData('breedId', '')
                                            updateFormData('customBreedName', '')
                                        }}
                                        disabled={speciesLoading}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={speciesLoading ? "Đang tải..." : t('selectPetCategory')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {species.map((specie) => (
                                                <SelectItem key={specie.id} value={specie.id}>{specie.name_vi}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Breed */}
                                <div className="space-y-2">
                                    <Label>{t('breed')} *</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={formData.breedId}
                                            onValueChange={(value) => updateFormData('breedId', value)}
                                            disabled={!formData.speciesId || breedsLoading}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={
                                                    breedsLoading ? "Đang tải giống..." :
                                                        formData.speciesId ? "Chọn giống" :
                                                            t('selectCategoryFirst')
                                                } />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {breeds.map((breed) => (
                                                    <SelectItem key={breed.id} value={breed.id}>
                                                        {breed.name_vi}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="custom">Khác (tự nhập)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="customBreedName"
                                            placeholder={t('customBreedName')}
                                            value={formData.customBreedName}
                                            onChange={(e) => updateFormData('customBreedName', e.target.value)}
                                            disabled={formData.breedId !== 'custom'}
                                            required={formData.breedId === 'custom'}
                                        />
                                    </div>
                                </div>

                                {/* Age */}
                                <div className="space-y-2">
                                    <Label>{t('ageLabel')} *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder={t('enterAge')}
                                            value={formData.age}
                                            onChange={(e) => updateFormData('age', parseInt(e.target.value) || "")}
                                            className="flex-1"
                                            required
                                        />
                                        <Select
                                            value={formData.ageUnit}
                                            onValueChange={(value) => updateFormData('ageUnit', value)}
                                        >
                                            <SelectTrigger className="w-28">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="week">{t('weeksUnit')}</SelectItem>
                                                <SelectItem value="month">{t('monthsUnit')}</SelectItem>
                                                <SelectItem value="year">{t('yearsUnit')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="space-y-2">
                                    <Label>{t('gender')} *</Label>
                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant={formData.gender === PetGender.MALE ? "default" : "outline"}
                                            onClick={() => updateFormData('gender', PetGender.MALE)}
                                            className="flex-1"
                                        >
                                            {t('male')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={formData.gender === PetGender.FEMALE ? "default" : "outline"}
                                            onClick={() => updateFormData('gender', PetGender.FEMALE)}
                                            className="flex-1"
                                        >
                                            {t('female')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div className="space-y-2">
                                    <Label htmlFor="weight">{t('weight')} (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        placeholder={t('enterWeight')}
                                        value={formData.weight}
                                        onChange={(e) => updateFormData('weight', parseFloat(e.target.value) || "")}
                                    />
                                </div>

                                {/* Color */}
                                {/* <div className="space-y-2">
                                    <Label htmlFor="color">{t('color')}</Label>
                                    <Input
                                        id="color"
                                        placeholder={t('enterColor')}
                                        value={formData.color}
                                        onChange={(e) => updateFormData('color', e.target.value)}
                                    />
                                </div> */}

                                {/* Health Status */}
                                {/* <div className="space-y-2">
                                    <Label>{t('healthStatus')} *</Label>
                                    <Select
                                        value={formData.healthStatus}
                                        onValueChange={(value) => updateFormData('healthStatus', value)}
                                        required
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
                                </div> */}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">{t('petDescription')} *</Label>
                                <Textarea
                                    id="description"
                                    placeholder={t('enterDescription')}
                                    value={formData.description}
                                    onChange={(e) => updateFormData('description', e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-4">
                                <Label>{t('uploadPhotos')}</Label>

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                                        <Camera className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="text-gray-600 mb-1">{t('dragDropPhotos')}</p>
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
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Rehoming Checkbox */}
                            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                                <Checkbox
                                    id="isForRehoming"
                                    checked={formData.isForRehoming}
                                    onCheckedChange={handleRehomingChange}
                                />
                                <Label
                                    htmlFor="isForRehoming"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    {t('findNewOwner')}
                                </Label>
                            </div>

                            {/* Rehoming Details */}
                            {formData.isForRehoming && (
                                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-blue-900">{t('rehomingInfo')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price">{t('price')} (VND) *</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                placeholder={t('enterPrice')}
                                                value={formData.price}
                                                onChange={(e) => updateFormData('price', parseInt(e.target.value) || "")}
                                                required={formData.isForRehoming}
                                            />
                                        </div>

                                        {/* Transaction Type */}
                                        <div className="space-y-2">
                                            <Label>{t('transactionType')} *</Label>
                                            <Select
                                                value={formData.transactionType}
                                                onValueChange={(value) => updateFormData('transactionType', value)}
                                                required={formData.isForRehoming}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('selectTransactionType')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={TransactionType.SELL}>{t('sell')}</SelectItem>
                                                    <SelectItem value={TransactionType.ADOPT}>{t('adopt')}</SelectItem>
                                                    <SelectItem value={TransactionType.EXCHANGE}>{t('exchange')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contact Information Section */}
                    {/* {formData.isForRehoming && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">{t('contactInfo')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">{t('yourName')} *</Label>
                                        <Input
                                            id="ownerName"
                                            placeholder={t('enterYourName')}
                                            value={formData.ownerName}
                                            onChange={(e) => updateFormData('ownerName', e.target.value)}
                                            required={formData.isForRehoming}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('email')} *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={t('enterEmail')}
                                            value={formData.email}
                                            onChange={(e) => updateFormData('email', e.target.value)}
                                            required={formData.isForRehoming}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('phone')} *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder={t('enterPhone')}
                                            value={formData.phone}
                                            onChange={(e) => updateFormData('phone', e.target.value)}
                                            required={formData.isForRehoming}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{t('city')} *</Label>
                                        <Select
                                            value={formData.city}
                                            onValueChange={(value) => updateFormData('city', value)}
                                            required={formData.isForRehoming}
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

                                <div className="space-y-2">
                                    <Label htmlFor="address">{t('address')} *</Label>
                                    <Input
                                        id="address"
                                        placeholder={t('enterAddress')}
                                        value={formData.address}
                                        onChange={(e) => updateFormData('address', e.target.value)}
                                        required={formData.isForRehoming}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">{t('additionalNotes')}</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder={t('enterNotes')}
                                        value={formData.notes}
                                        onChange={(e) => updateFormData('notes', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )} */}

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            className="bg-gray-900 hover:bg-gray-800 px-8 py-2"
                            size="lg"
                        >
                            {formData.isForRehoming ? t('publishListing') : t('savePetInfo')}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
