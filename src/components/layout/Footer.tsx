import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { t } from "@/lib/i18n"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🐾</span>
              </div>
              <span className="text-xl font-bold">PetMarket</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nền tảng marketplace đáng tin cậy nhất kết nối những gia đình yêu thương với những người bạn hoàn hảo của họ.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/pets" className="hover:text-white transition-colors">
                  {t('browsePetsLink')}
                </a>
              </li>
              <li>
                <a href="/post" className="hover:text-white transition-colors">
                  {t('postAPet')}
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="hover:text-white transition-colors">
                  {t('howItWorks')}
                </a>
              </li>
              <li>
                <a href="/safety" className="hover:text-white transition-colors">
                  {t('safetyTips')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  {t('helpCenter')}
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  {t('contactUs')}
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  {t('termsOfService')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">{t('stayUpdated')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t('getLatestListings')}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="mtquy1000@gmail.com"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-orange-500 hover:bg-orange-600 shrink-0">
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 PetMarket. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
