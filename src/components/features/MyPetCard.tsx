'use client';

import { formatDistanceToNow } from 'date-fns';
import { Eye, Heart, MessageCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { AgeUnit, Pet } from '@/types';
import { t } from '@/lib/i18n';

interface MyPetCardProps {
  pet: Pet;
  onEdit?: (petId: string) => void;
  onDelete?: (petId: string) => void;
  onToggleStatus?: (petId: string) => void;
  onViewDetails?: (petId: string) => void;
}

export function MyPetCard({
  pet,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails
}: MyPetCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <img
          src={pet.images[0] || "/api/placeholder/80/80"}
          alt={pet.name}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{pet.name}</h3>
          <p className="text-sm text-gray-600">
            {pet.breed.name_vi} • {pet.age} {pet.ageUnit === AgeUnit.YEAR ? t('years') : pet.ageUnit === AgeUnit.MONTH ? t('months') : t('weeks')}
          </p>
          <p className="text-lg font-bold">${pet.price.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
        <div className="text-sm text-gray-500">
          <span>{t('postedAgo')} {formatDistanceToNow(new Date(pet.createdAt), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{pet.view} {t('views')}</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{pet.favorites} {t('favorites_count')}</span>
          </div> */}
          {/* <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{pet.messages} {t('messages_count')}</span>
          </div> */}
        </div>
        {/* <div className="flex items-center gap-2">
          <Badge
            className={pet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
          >
            {pet.status === 'active' ? t('active') : t('sold')}
          </Badge>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div> */}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Badge
            className={pet.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
          >
            {pet.isAvailable ? t('active') : t('sold')}
          </Badge>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(pet.id)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(pet.id)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus?.(pet.id)}
              title={pet.isAvailable ? "Deactivate" : "Activate"}
            >
              {pet.isAvailable ? '🔒' : '🔓'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(pet.id)}
              title="Delete"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" title="More Options">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
