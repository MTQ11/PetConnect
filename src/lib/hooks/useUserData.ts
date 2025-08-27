import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api/axios'
import { User } from '@/types'

export const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/users/${userId}`)
      setUser(response.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, loading, error, refetch: fetchUser }
}
