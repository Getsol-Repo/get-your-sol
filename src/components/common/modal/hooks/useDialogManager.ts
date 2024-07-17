import { useState } from 'react'
import { type CamelCaseJoin, camelCaseJoin } from '@libhub/utils'
import type { BaseModalProps } from '../BaseModal'
import type { ActionType } from '@/types'

export interface UseModalManagerOptions<Namespace extends string = ''> extends BaseModalProps {
  namespace?: Namespace
}

/**
 * Modal管理器 封装了弹框关闭时的逻辑, 声明了常用state, 返回的modalProps直接展开传递到modal即可,当需要关闭弹框时调用返回的modalProps里的onOk即可
 * @param options
 * @param options.namespace 该弹框的命名空间 返回值与类型提示将会与此有关
 */
export function useModalManager<T = any, Namespace extends string = ''>(
  options?: UseModalManagerOptions<Namespace>,
) {
  const { namespace, onCancel, onOk, ...rest } = options || {}
  const currentNamespace = (namespace || '') as Namespace
  const [actionState, setActionState] = useState<ActionType>()
  const [openState, setOpenState] = useState(false)
  const [currentState, setCurrentState] = useState<T>()
  const modalProps: BaseModalProps = {
    ...rest,
    actionType: actionState,
    onCancel: (e) => {
      setOpenState(false)
      setCurrentState(undefined)
      onCancel?.(e)
    },
    onOk: (e) => {
      setOpenState(false)
      setCurrentState(undefined)
      onOk?.(e)
    },
    open: openState,
  }

  const open = camelCaseJoin([
    currentNamespace,
    currentNamespace ? 'modalOpen' : 'open',
  ]) as Namespace extends '' ? 'open' : CamelCaseJoin<[Namespace, 'modalOpen']>

  const setOpen = camelCaseJoin([
    'set',
    currentNamespace,
    currentNamespace ? 'modalOpen' : 'open',
  ]) as Namespace extends '' ? 'setOpen' : CamelCaseJoin<['set', Namespace, 'modalOpen']>

  const current = camelCaseJoin(['current', currentNamespace])
  const setCurrent = camelCaseJoin(['setCurrent', currentNamespace])

  const props = camelCaseJoin([
    currentNamespace,
    currentNamespace ? 'modalProps' : 'props',
  ]) as Namespace extends '' ? 'props' : CamelCaseJoin<[Namespace, 'modalProps']>

  const action = camelCaseJoin([
    currentNamespace,
    currentNamespace ? 'modalAction' : 'action',
  ]) as Namespace extends '' ? 'action' : CamelCaseJoin<[Namespace, 'modalAction']>

  const setAction = camelCaseJoin([
    'set',
    currentNamespace,
    currentNamespace ? 'modalAction' : 'action',
  ]) as Namespace extends '' ? 'setAction' : CamelCaseJoin<['set', Namespace, 'modalAction']>

  const result = {
    [action]: actionState,
    [current]: currentState,
    [open]: openState,
    [props]: modalProps,
    [setAction]: setActionState,
    [setCurrent]: setCurrentState,
    [setOpen]: setOpenState,
  } as Record<typeof open, typeof openState> &
  Record<typeof setOpen, typeof setOpenState> &
  Record<typeof current, typeof currentState> &
  Record<typeof setCurrent, typeof setCurrentState> &
  Record<typeof props, typeof modalProps> &
  Record<typeof action, typeof actionState> &
  Record<typeof setAction, typeof setActionState>
  return result
}
