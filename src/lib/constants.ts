export const APP_CONFIG = {
  name: "PetConnect",
  description: "Nền tảng mua bán và trao đổi thú cưng",
  url: "https://petconnect.com",
  social: {
    facebook: "https://facebook.com/petconnect",
    instagram: "https://instagram.com/petconnect",
    twitter: "https://twitter.com/petconnect"
  }
}

export const API_ROUTES = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout"
  },
  pets: {
    list: "/api/pets",
    create: "/api/pets",
    detail: (id: string) => `/api/pets/${id}`,
    update: (id: string) => `/api/pets/${id}`,
    delete: (id: string) => `/api/pets/${id}`
  },
  marketplace: {
    list: "/api/marketplace",
    create: "/api/marketplace",
    detail: (id: string) => `/api/marketplace/${id}`
  },
  users: {
    profile: "/api/users/profile",
    update: "/api/users/profile"
  }
}

export const ROUTES = {
  home: "/",
  pets: "/pets",
  marketplace: "/marketplace",
  profile: "/profile",
  userProfile: (id: string) => `/profile/${id}`,
  createpet: "/createpet",
  auth: {
    login: "/auth/login",
    register: "/auth/register"
  }
}
