import { vi, type TranslationKey } from './translations'

// Current language (can be managed by state later)  
let currentLang: 'vi' | 'en' = 'vi'

// Translation function
export function t(key: TranslationKey): string {
  // For now, only support Vietnamese
  return vi[key] || key
}

// Set language function (for future use)
export function setLanguage(lang: 'vi' | 'en') {
  currentLang = lang
}

// Get current language
export function getCurrentLanguage() {
  return currentLang
}
