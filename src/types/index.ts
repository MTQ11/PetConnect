// Enum cho loại thú cưng
export enum PetType {
  DOG = "dog",
  CAT = "cat",
  BIRD = "bird",
  FISH = "fish",
  RABBIT = "rabbit",
  HAMSTER = "hamster",
  OTHER = "other"
}

// Enum cho giới tính thú cưng
export enum PetGender {
  MALE = "male",
  FEMALE = "female",
  UNKNOWN = "unknown"
}

// Enum cho tình trạng sức khỏe
export enum HealthStatus {
  EXCELLENT = "excellent",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor"
}

// Enum cho loại giao dịch
export enum TransactionType {
  SELL = "sell",
  EXCHANGE = "exchange",
  ADOPT = "adopt",
  LOST = "lost",
  FOUND = "found"
}

// Interface cho Pet
export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  gender: PetGender;
  color: string;
  weight: number;
  healthStatus: HealthStatus;
  description: string;
  images: string[];
  ownerId: string;
  isAvailable: boolean;
  price: number;
  view: number;
  location: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface cho User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: string;
  verified: boolean;
  pets: Pet[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface cho Marketplace Listing
export interface MarketplaceListing {
  id: string;
  petId: string;
  pet: Pet;
  sellerId: string;
  seller: User;
  transactionType: TransactionType;
  price?: number;
  exchangeDescription?: string;
  location: string;
  contactInfo: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface cho Search Filters
export interface SearchFilters {
  type?: PetType;
  breed?: string;
  minAge?: number;
  maxAge?: number;
  gender?: PetGender;
  transactionType?: TransactionType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

// Interface cho Pet Form
export interface PetFormData {
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

// Enum cho đơn vị tuổi
export enum AgeUnit {
  WEEKS = "weeks",
  MONTHS = "months", 
  YEARS = "years"
}

// Interface cho City/Location
export interface City {
  id: string
  name: string
  nameEn: string
}
