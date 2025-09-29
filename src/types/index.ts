// Enum cho loại thú cưng
export interface Species {
  id: string;
  name_vi: string;
  name_en: string
}

export interface Breeds {
  id: string;
  name_vi: string;
  name_en: string;
  speciesId: string;
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
  NOT_SELL = "not_sell",
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
  species: Species;
  breed: Breeds;
  age: number;
  ageUnit: AgeUnit;
  gender: PetGender;
  color: string;
  weight: number;
  // healthStatus: HealthStatus;
  description: string;
  images: string[];
  ownerId: string;
  owner: User;
  isAvailable: boolean;
  price: number;
  rating: number;
  view: number;
  // location: string;
  isVerified?: boolean;
  // isFeatured?: boolean;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum SortBy {
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
    FEATURED = 'view_desc',
    CREATED_AT_DESC = 'createdAt_desc'
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
  rating: number;
  reviewCount?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  postCount?: number;
  petCount?: number;
  totalPetsSold?: number;
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
  type?: Species;
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
  type: Species | ""
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
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week'
}

// Interface cho City/Location
export interface City {
  id: string
  name: string
  nameEn: string
}

// Interface cho Post/Newsfeed
export interface Post {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: string;
  images?: string[];
  pets: {
    id: string;
    name: string;
    images?: string[];
    breed_vi: string;
    breed_en: string;
    species_vi: string;
    species_en: string;
    price?: number;
  }[];
  likeCount: number;
  comments: number;
  shares: number;
  isLikedByCurrentUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface cho Comment
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  createdAt: Date;
}

// Interface cho userSite
export interface UserSite {
  id: string;
  subDomain: string;
  userId: string;
  user: User;
  layoutConfig: LayoutConfig
}

export enum SectionType {
  HEADER = 'header',
  HERO = 'hero',
  PET_LIST = 'pet_list',
  REVIEW = 'review',
  ABOUT = 'about',
  FOOTER = 'footer',
}

export interface BaseSection {
  type: SectionType;
  title?: string;
  subtitle?: string;
}

export interface HeaderSection extends BaseSection {
  logoUrl?: string;
  logo?: File;
  businessName?: string;
}

export interface HeroSection extends BaseSection {
  imageUrls?: string[];
  images?: File[];
}

export interface PetListSection extends BaseSection {
  pets?: Pet[];
}

export interface AboutSection extends BaseSection {
  content?: string;
}

export interface FooterSection extends BaseSection {
  phone?: string;
  email?: string;
  address?: string;
}

export type Section = HeaderSection | HeroSection | PetListSection | AboutSection | FooterSection;

export interface LayoutConfig {
  sections: Section[];
}
