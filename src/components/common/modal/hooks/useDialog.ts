import { useEffect, useMemo } from 'react'
import type { BaseModalProps } from '../BaseModal'
import type { ActionType } from '@/types'
import { useUnionIs } from '@/hooks'

interface useModalOptions {
  /**
   * create时下打开弹框时触发
   */
  onCreateOpen?: () => void
  /**
   * create时下关闭弹框时触发
   */
  onCreateClose?: () => void
  /**
   * edit时下打开弹框时触发
   */
  onEditOpen?: () => void
  /**
   * edit时下关闭弹框时触发
   */
  onEditClose?: () => void
  /**
   * view时下打开弹框时触发
   */
  onViewOpen?: () => void
  /**
   * view时下关闭弹框时触发
   */
  onViewClose?: () => void
  /**
   * 关闭弹框时触发
   */
  onClose?: () => void
  /**
   * 打开弹框时触发
   */
  onOpen?: () => void
  /**
   * 自定义每个动作的描述
   */
  actionDesc?: Partial<Record<ActionType, string>>
}

/**
 * 提供了弹框打开关闭的生命周期方法
 */
export function useModalLifecycle(
  { actionType = 'view', open }: BaseModalProps,
  options?: useModalOptions,
) {
  const {
    actionDesc,
    onEditOpen,
    onEditClose,
    onCreateClose,
    onCreateOpen,
    onViewClose,
    onViewOpen,
    onClose,
    onOpen,
  } = options || {}

  const is = useUnionIs(actionType)

  const { isEdit, isCreate, isView } = is
  const desc = useMemo(() => {
    if (!actionType) {
      return ''
    }
    return actionDesc?.[actionType]
  }, [actionType, actionDesc])

  useEffect(() => {
    if (open) {
      onOpen?.()
      if (isCreate) {
        onCreateOpen?.()
      } else if (isEdit) {
        onEditOpen?.()
      } else if (isView) {
        onViewOpen?.()
      }
    } else {
      if (isCreate) {
        onCreateClose?.()
      } else if (isEdit) {
        onEditClose?.()
      } else if (isView) {
        onViewClose?.()
      }
      onClose?.()
    }
  }, [open, is])
  return { ...is, actionDesc: desc }
}
