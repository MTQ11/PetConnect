import { X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { t } from "@/lib/i18n"
import { Input } from "../ui/input"
import { useBreedsData, useSpeciesData } from "@/lib/hooks/useSpeciesData"
import { useEffect, useState, useCallback, useRef } from "react"

interface FilterSidebarProps {
    activeFilters: string[]
    onRemoveFilter: (filter: string) => void
    onClearAll: () => void
    onApplyFilters: (filters: {
        specieId?: string;
        breedIds?: string[];
        startPrice?: number;
        endPrice?: number;
    }) => void
}

export function FilterSidebar({
    activeFilters,
    onRemoveFilter,
    onClearAll,
    onApplyFilters
}: FilterSidebarProps) {
    const [selectedSpecies, setSelectedSpecies] = useState<string>('')
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000])
    const [inputMinPrice, setInputMinPrice] = useState<string>('0')
    const [inputMaxPrice, setInputMaxPrice] = useState<string>('1000000000')
    const { species } = useSpeciesData()
    const { breeds } = useBreedsData(selectedSpecies || undefined)

    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const formatCurrency = (value: number) => {
        if (value >= 1000000000) {
            return "1 tỷ"
        }
        return new Intl.NumberFormat('vi-VN').format(value)
    }

    const handleSelectSpecies = (speciesId: string) => {
        setSelectedSpecies(speciesId)
        setSelectedBreeds([]) // Reset breeds when species changes
        applyFilters(speciesId, [], priceRange)
    }

    const handleSelectBreed = (breedId: string) => {
        const newSelectedBreeds = selectedBreeds.includes(breedId)
            ? selectedBreeds.filter(id => id !== breedId)
            : [...selectedBreeds, breedId]
        setSelectedBreeds(newSelectedBreeds)
        applyFilters(selectedSpecies, newSelectedBreeds, priceRange)
    }

    const debouncedApplyFilters = useCallback((specieId: string, breedIds: string[], prices: [number, number]) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }
        debounceRef.current = setTimeout(() => {
            const filters = {
                specieId: specieId || undefined,
                breedIds: breedIds.length > 0 ? breedIds : undefined,
                startPrice: prices[0],
                endPrice: prices[1]
            }
            onApplyFilters(filters)
        }, 500) // 500ms delay
    }, [onApplyFilters])

    const handlePriceRangeChange = (value: [number, number]) => {
        setPriceRange(value)
        setInputMinPrice(value[0].toString())
        setInputMaxPrice(value[1].toString())
        debouncedApplyFilters(selectedSpecies, selectedBreeds, value)
    }

    const handleMinPriceInputChange = (value: string) => {
        setInputMinPrice(value)
        const numValue = parseInt(value) || 0
        const newRange: [number, number] = [numValue, priceRange[1]]
        setPriceRange(newRange)
        debouncedApplyFilters(selectedSpecies, selectedBreeds, newRange)
    }

    const handleMaxPriceInputChange = (value: string) => {
        setInputMaxPrice(value)
        const numValue = parseInt(value) || 1000000000
        const newRange: [number, number] = [priceRange[0], numValue]
        setPriceRange(newRange)
        debouncedApplyFilters(selectedSpecies, selectedBreeds, newRange)
    }

    const applyFilters = (specieId: string, breedIds: string[], prices: [number, number]) => {
        const filters = {
            specieId: specieId || undefined,
            breedIds: breedIds.length > 0 ? breedIds : undefined,
            startPrice: prices[0],
            endPrice: prices[1]
        }
        onApplyFilters(filters)
    }

    // Apply filters on mount with default values
    useEffect(() => {
        applyFilters(selectedSpecies, selectedBreeds, priceRange)
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [])

    return (
        <div className="w-42 space-y-4">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {t('activeFilters')} ({activeFilters.length})
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearAll}
                                className="text-xs"
                            >
                                {t('clearAll')}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map((filter) => (
                                <Badge
                                    key={filter}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {filter}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => onRemoveFilter(filter)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pet Type Filter */}
            <Card>
                <CardHeader className="px-4">
                    <CardTitle className="text-sm font-medium">
                        {t('petType')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 space-y-3">
                    <RadioGroup value={selectedSpecies} onValueChange={handleSelectSpecies}>
                        {species.map(specie =>
                            <div className="flex items-center space-x-2" key={specie.id}>
                                <RadioGroupItem value={specie.id} id={specie.id} />
                                <label htmlFor={specie.id} className="text-sm">
                                    {specie.name_vi}
                                </label>
                            </div>
                        )}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
                <CardHeader className="px-4">
                    <CardTitle className="text-sm font-medium">
                        {t('priceRange')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-1">
                    <div className="space-y-4">
                        <Slider
                            value={priceRange}
                            onValueChange={handlePriceRangeChange}
                            max={1000000000}
                            min={0}
                            step={500000}
                            className="w-full"
                        />
                        <div className="flex flex-col items-center justify-between">
                            <div className="flex-1">
                                <span className="text-sm text-gray-500">Từ: {formatCurrency(priceRange[0])}{t('currency')}</span>
                                <Input
                                    type="number"
                                    value={inputMinPrice}
                                    onChange={(e) => handleMinPriceInputChange(e.target.value)}
                                    placeholder="0"
                                    min={0}
                                    max={1000000000}
                                    className="text-sm"
                                />
                            </div>
                            <span className="text-sm text-gray-500">-</span>
                            <div className="flex-1">
                                <span className="text-sm text-gray-500">Đến: {formatCurrency(priceRange[1])}{t('currency')}</span>
                                <Input
                                    type="number"
                                    value={inputMaxPrice}
                                    onChange={(e) => handleMaxPriceInputChange(e.target.value)}
                                    placeholder="1 tỷ"
                                    min={0}
                                    max={1000000000}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Breeds */}
            <Card>
                <CardHeader className="px-4">
                    <CardTitle className="text-sm font-medium">
                        {t('breeds')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2 space-y-3">
                    {breeds.length > 0 ? (
                        breeds.map(breed =>
                            <div className="flex items-center space-x-2" key={breed.id}>
                                <Checkbox
                                    id={breed.id}
                                    checked={selectedBreeds.includes(breed.id)}
                                    onCheckedChange={() => handleSelectBreed(breed.id)}
                                />
                                <label htmlFor={breed.id} className="text-sm">
                                    {breed.name_vi}
                                </label>
                            </div>
                        )
                    ) : (
                        <p className="text-sm text-gray-500">{t('selectSpeciesFirst')}</p>
                    )}
                </CardContent>
            </Card>

            {/* Location */}
            <Card>
                <CardHeader className="px-4">
                    <CardTitle className="text-sm font-medium">
                        {t('location')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                    <Input placeholder={t('inputLocation')} />
                </CardContent>
            </Card>

            {/* Special Offers */}
            <Card className="bg-gray-50">
                <CardContent className="px-2 text-center">
                    <div className="text-lg mb-2">🎁</div>
                    <h3 className="font-semibold text-sm mb-2">
                        {t('specialOffers')}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                        {t('verifiedOffers')}
                    </p>
                    <Button size="sm" className="w-full bg-gray-900 hover:bg-gray-800">
                        {t('learnMore')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
