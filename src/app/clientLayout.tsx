"use client"

import { Provider } from 'react-redux'
import { store } from '@/store'
import { AuthChecker } from '@/components/auth/AuthChecker'
import { GoogleOAuthProvider } from "@react-oauth/google";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthChecker>
          <main>{children}</main>
        </AuthChecker>
      </GoogleOAuthProvider>
    </Provider>
  )
}