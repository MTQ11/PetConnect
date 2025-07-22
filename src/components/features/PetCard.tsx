import { Pet } from "@/types"

interface PetCardProps {
  pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Pet Image */}
      <div className="aspect-square relative">
        <img
          src={pet.images[0] || "/placeholder-pet.jpg"}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Pet Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{pet.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Loại: {pet.type}</p>
          <p>Giống: {pet.breed}</p>
          <p>Tuổi: {pet.age} tháng</p>
          <p>Giới tính: {pet.gender}</p>
        </div>
        
        <div className="mt-3">
          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
            pet.isAvailable 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {pet.isAvailable ? "Có sẵn" : "Không có sẵn"}
          </span>
        </div>
      </div>
    </div>
  )
}
