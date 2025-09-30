"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

import { t } from '@/lib/i18n'

export type ConfirmType = 'warning' | 'info' | 'success' | 'danger'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  type?: ConfirmType
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
}

const getIcon = (type: ConfirmType) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="w-6 h-6 text-amber-500" />
    case 'danger':
      return <XCircle className="w-6 h-6 text-red-500" />
    case 'success':
      return <CheckCircle className="w-6 h-6 text-green-500" />
    case 'info':
    default:
      return <Info className="w-6 h-6 text-blue-500" />
  }
}

const getTypeStyles = (type: ConfirmType) => {
  switch (type) {
    case 'warning':
      return 'border-amber-200 bg-amber-50'
    case 'danger':
      return 'border-red-200 bg-red-50'
    case 'success':
      return 'border-green-200 bg-green-50'
    case 'info':
    default:
      return 'border-blue-200 bg-blue-50'
  }
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  content,
  confirmText = t('confirmTitle'),
  cancelText = t('cancel'),
  confirmVariant = 'default',
  type = 'info',
  onConfirm,
  onCancel,
  loading = false
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Confirm action failed:', error)
      // Keep dialog open if action fails
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon(type)}
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className={`p-4 rounded-lg border ${getTypeStyles(type)}`}>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
            className={
              confirmVariant === 'destructive' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : ''
            }
          >
            {loading ? t('processing') : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}