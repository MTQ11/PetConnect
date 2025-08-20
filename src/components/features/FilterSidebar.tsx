import { X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Species } from "@/types"
import { t } from "@/lib/i18n"
import { Input } from "../ui/input"

interface FilterSidebarProps {
    activeFilters: string[]
    onRemoveFilter: (filter: string) => void
    onClearAll: () => void
}

export function FilterSidebar({
    activeFilters,
    onRemoveFilter,
    onClearAll
}: FilterSidebarProps) {
    return (
        <div className="w-60 space-y-6">
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
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        {t('petType')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="dogs" />
                        <label htmlFor="dogs" className="text-sm">
                            {t('dogs')} (245)
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="cats" />
                        <label htmlFor="cats" className="text-sm">
                            {t('cats')} (189)
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="birds" />
                        <label htmlFor="birds" className="text-sm">
                            {t('birds')} (45)
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="fish" />
                        <label htmlFor="fish" className="text-sm">
                            {t('fish')} (156)
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="rabbits" />
                        <label htmlFor="rabbits" className="text-sm">
                            {t('rabbits')} (23)
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="reptiles" />
                        <label htmlFor="reptiles" className="text-sm">
                            {t('reptiles')} (12)
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="smallPets" />
                        <label htmlFor="smallPets" className="text-sm">
                            {t('smallPets')} (78)
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        {t('priceRange')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Slider
                            defaultValue={[100, 5000]}
                            max={10000}
                            min={0}
                            step={100}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>100{t('currency')}</span>
                            <span>5000{t('currency')}+</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Popular Breeds */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        {t('popularBreeds')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="golden-retriever" />
                        <label htmlFor="golden-retriever" className="text-sm">
                            Golden Retriever
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="labrador" />
                        <label htmlFor="labrador" className="text-sm">
                            Labrador
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="persian-cat" />
                        <label htmlFor="persian-cat" className="text-sm">
                            Persian Cat
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="siamese-cat" />
                        <label htmlFor="siamese-cat" className="text-sm">
                            Siamese Cat
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="french-bulldog" />
                        <label htmlFor="french-bulldog" className="text-sm">
                            French Bulldog
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="german-shepherd" />
                        <label htmlFor="german-shepherd" className="text-sm">
                            German Shepherd
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="beagle" />
                        <label htmlFor="beagle" className="text-sm">
                            Beagle
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="pomeranian" />
                        <label htmlFor="pomeranian" className="text-sm">
                            Pomeranian
                        </label>
                    </div>
                </CardContent>
            </Card>

            {/* Location */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        {t('location')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Input placeholder={t('inputLocation')} />
                </CardContent>
            </Card>

            {/* Special Offers */}
            <Card className="bg-gray-50">
                <CardContent className="p-4 text-center">
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
