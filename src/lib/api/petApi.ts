import api from './axios'
import { Pet } from '@/types'

export interface PetDetailResponse {
  id: string
  name: string
  age: number
  ageUnit: string
  gender: string
  weight: number
  description: string
  images: string[]
  species: {
    id: string
    nameVi: string
    nameEn: string
  }
  breed?: {
    id: string
    nameVi: string
    nameEn: string
  }
  customBreedName?: string
  vaccinated: boolean
  isForRehoming: boolean
  transactionType: string
  price: number
  rating: number
  view: number
  owner: {
    id: string
    name: string
    avatar?: string
    phone?: string
    email?: string
    address?: string
    rating: number
    verified: boolean
    memberSince: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface EditPetData {
  id: string
  name?: string
  age?: number
  ageUnit?: string
  gender?: string
  weight?: number
  description?: string
  images?: string[]
  speciesId?: string
  breedId?: string
  customBreedName?: string
  vaccinated?: boolean
  isForRehoming?: boolean
  transactionType?: string
  price?: number
}

class PetApi {
  /**
   * Lấy chi tiết thú cưng
   */
  async getPetDetail(petId: string): Promise<PetDetailResponse> {
    const response = await api.get(`/pets/detail/${petId}`)
    return response.data
  }

  /**
   * Chỉnh sửa thông tin thú cưng
   */
  async updatePet(petData: EditPetData): Promise<Pet> {
    const response = await api.put('/pets', petData)
    return response.data
  }

  /**
   * Toggle trạng thái hiển thị thú cưng
   */
  async togglePetStatus(petId: string): Promise<Pet> {
    const response = await api.put(`/pets/${petId}/toggle-status`)
    return response.data
  }

  /**
   * Xóa thú cưng
   */
  async deletePet(petId: string): Promise<Pet> {
    const response = await api.delete(`/pets/${petId}`)
    return response.data
  }

  /**
   * Lấy danh sách thú cưng cá nhân
   */
  async getMyPets(): Promise<Pet[]> {
    const response = await api.get('/pets/personal')
    return response.data
  }
}

export const petApi = new PetApi()