import { useState } from 'react'
import { ConfirmType } from '@/components/ui/ConfirmDialog'

interface ConfirmOptions {
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmType
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmProps, setConfirmProps] = useState<ConfirmOptions>({
    title: '',
    content: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    type: 'info'
  })
  const [confirmAction, setConfirmAction] = useState<() => Promise<void> | void>(() => {})
  const [loading, setLoading] = useState(false)

  const confirm = (options: ConfirmOptions, action: () => Promise<void> | void) => {
    setConfirmProps({
      confirmText: 'Xác nhận',
      cancelText: 'Hủy',
      type: 'info',
      ...options
    })
    setConfirmAction(() => action)
    setIsOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await confirmAction()
      setIsOpen(false)
    } catch (error) {
      console.error('Confirm action failed:', error)
      // Keep dialog open if action fails
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    confirmProps,
    loading,
    confirm,
    handleConfirm,
    handleCancel,
    close: () => setIsOpen(false)
  }
}