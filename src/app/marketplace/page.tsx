"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { FilterSidebar } from "@/components/features/FilterSidebar"
import { PetCard } from "@/components/features/PetCard"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { t } from "@/lib/i18n"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { getPets } from "@/store/slices/marketplaceSlice"
import { useSpeciesData } from "@/lib/hooks/useSpeciesData"
import { SortBy } from "@/types"

export default function MarketplacePage() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { pets, isLoading, error } = useAppSelector((state) => state.marketplace)
  const dispatch = useAppDispatch()

  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [currentFilters, setCurrentFilters] = useState<{
    specieId?: string;
    breedIds?: string[];
    startPrice?: number;
    endPrice?: number;
    sortBy?: SortBy;
  }>({})
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.CREATED_AT_DESC)

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
  }

  const handleClearAll = () => {
    setActiveFilters([])
    setCurrentFilters({})
    dispatch(getPets({ sortBy }))
  }

  const handleSortChange = (value: SortBy) => {
    setSortBy(value)
    dispatch(getPets({
      ...currentFilters,
      sortBy: value
    }))
  }

  const handleApplyFilters = (filters: {
    specieId?: string;
    breedIds?: string[];
    startPrice?: number;
    endPrice?: number;
  }) => {
    setCurrentFilters(filters)
    dispatch(getPets({
      ...filters,
      sortBy: sortBy
    }))
  }

  useEffect(() => {
    dispatch(getPets({ sortBy }))
  }, [isAuthenticated])

  const PetCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )

  return (
    <Layout maxWidth="full">
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Filters */}
        <div className="w-full lg:w-1/6">
          <FilterSidebar
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sorting */}
          <div className="flex justify-between items-center mb-6">
            <div className="font-semibold">
              {isLoading ? <Skeleton className="h-6 w-32" /> : `${pets.length} ${t('petsFound')}`}
            </div>
            <Select value={sortBy} onValueChange={handleSortChange} disabled={isLoading}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('featuredFirst')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SortBy.FEATURED}>{t('featuredFirst')}</SelectItem>
                <SelectItem value={SortBy.PRICE_ASC}>{t('priceLowToHigh')}</SelectItem>
                <SelectItem value={SortBy.PRICE_DESC}>{t('priceHighToLow')}</SelectItem>
                <SelectItem value={SortBy.CREATED_AT_DESC}>{t('newest')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {isLoading ? (
              // Show skeleton cards while loading
              Array.from({ length: 12 }).map((_, index) => (
                <PetCardSkeleton key={`skeleton-${index}`} />
              ))
            ) : (
              <>
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
                
                {/* Empty placeholder cards only when not loading and have pets */}
                {pets.length > 0 && Array.from({ length: 4 }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">Đang cập nhật</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            <Button variant="outline" size="sm" disabled={isLoading}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('previous')}
            </Button>
            <Button variant="outline" size="sm" className="bg-gray-900 text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled={isLoading}>
              2
            </Button>
            <Button variant="outline" size="sm" disabled={isLoading}>
              3
            </Button>
            <Button variant="outline" size="sm" disabled={isLoading}>
              <ChevronRight className="w-4 h-4 ml-1" />
              {t('next')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
