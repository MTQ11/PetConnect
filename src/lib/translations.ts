// Translations for Vietnamese (default)
export const vi = {
  // Header
  search: "Tìm kiếm thú cưng, giống, địa điểm...",
  favorites: "Yêu thích",
  login: "Đăng nhập",
  register: "Đăng ký",
  postPet: "Đăng tin",

  // Categories
  allPets: "Tất cả",
  dogs: "Chó",
  cats: "Mèo",
  birds: "Chim",
  fish: "Cá",
  rabbits: "Thỏ",
  reptiles: "Bò sát",
  smallPets: "Động vật nhỏ",

  // Filters
  activeFilters: "Bộ lọc hiện tại",
  clearAll: "Xóa tất cả",
  age: "Tuổi",
  goldenRetriever: "Golden Retriever",
  inputLocation: "Tìm địa điểm",
  petType: "Loại thú cưng",
  priceRange: "Khoảng giá",
  popularBreeds: "Giống phổ biến",
  location: "Địa điểm",

  // Listing
  browsePets: "Duyệt thú cưng",
  petsFound: "thú cưng được tìm thấy",
  featuredFirst: "Nổi bật trước",
  verified: "Đã xác thực",
  featured: "Nổi bật",
  viewDetails: "Xem chi tiết",

  // Footer
  quickLinks: "Liên kết nhanh",
  browsePetsLink: "Duyệt thú cưng",
  postAPet: "Đăng tin thú cưng",
  howItWorks: "Cách hoạt động",
  safetyTips: "Mẹo an toàn",
  support: "Hỗ trợ",
  helpCenter: "Trung tâm trợ giúp",
  contactUs: "Liên hệ chúng tôi",
  termsOfService: "Điều khoản dịch vụ",
  privacyPolicy: "Chính sách bảo mật",
  stayUpdated: "Cập nhật tin tức",
  getLatestListings: "Nhận danh sách mới nhất và mẹo được gửi đến hộp thư của bạn.",
  subscribe: "Đăng ký",
  allRightsReserved: "Tất cả quyền được bảo lưu.",

  // Special offers
  specialOffers: "Ưu đãi đặc biệt",
  verifiedOffers: "Nhận ưu đãi được xác minh và danh sách ưu tiên chỉ với $5.99/tháng",
  learnMore: "Tìm hiểu thêm",

  // Common
  currency: "đ",
  previous: "Trước",
  next: "Tiếp theo",
  years: "năm",
  months: "tháng",
  male: "Đực",
  female: "Cái"
}

// Translations for English (future use)
export const en = {
  // Header
  search: "Search for pets, breeds, locations...",
  favorites: "Favorites",
  login: "Login",
  register: "Register",
  postPet: "Post a Pet",

  // Categories
  allPets: "All Pets",
  dogs: "Dogs",
  cats: "Cats",
  birds: "Birds",
  fish: "Fish",
  rabbits: "Rabbits",
  reptiles: "Reptiles",
  smallPets: "Small Pets",

  // ... rest will be added when needed
}

export type TranslationKey = keyof typeof vi
export type Translations = typeof vi
