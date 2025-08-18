"use client"

import { Provider } from 'react-redux'
import { store } from '@/store'
import { AuthChecker } from '@/components/auth/AuthChecker'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthChecker>
        <main>{children}</main>
      </AuthChecker>
    </Provider>
  )
}