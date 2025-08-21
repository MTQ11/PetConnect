"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { FilterSidebar } from "@/components/features/FilterSidebar"
import { PetCard } from "@/components/features/PetCard"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Pet, Species, PetGender, HealthStatus, SearchFilters } from "@/types"
import { t } from "@/lib/i18n"
import api from "@/lib/api/axios"

export default function MarketplacePage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const [pets, setPets] = useState<Pet[]>([])

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
  }

  const handleClearAll = () => {
    setActiveFilters([])
  }

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get('/pets')
        setPets(response.data)
      } catch (error) {
        console.error('Error fetching pets:', error)
      }
    }

    fetchPets()
  }, [])

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Filters */}
        <div className="w-full lg:w-1/4">
          <FilterSidebar
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t('browsePets')}
            </h1>
            <p className="text-gray-600">
              {pets.length} {t('petsFound')}
            </p>
          </div>

          {/* Sorting */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Hiển thị {pets.length} kết quả
            </div>
            <Select defaultValue="featured">
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('featuredFirst')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{t('featuredFirst')}</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}

            {/* Empty placeholder cards */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm">Đang cập nhật</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('previous')}
            </Button>
            <Button variant="outline" size="sm" className="bg-gray-900 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4 ml-1" />
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
