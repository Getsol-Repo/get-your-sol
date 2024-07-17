import { Modal, type ModalProps } from 'antd'
import { type FC, useMemo } from 'react'
import type { StrictOmit } from '@libhub/utils'
import { BaseButton, type BaseButtonProps } from '../button'
import type { ActionType } from '@/types'

export interface BaseModalProps
  extends StrictOmit<ModalProps, 'okButtonProps' | 'cancelButtonProps' | 'okType'> {
  hideCancelButton?: boolean
  hideOkButton?: boolean
  okButtonProps?: BaseButtonProps
  cancelButtonProps?: BaseButtonProps
  okType?: BaseButtonProps['type']
  actionType?: ActionType
  loading?: boolean
  onOk?: (e?: React.MouseEvent<HTMLButtonElement>) => void
}
export const BaseModal: FC<BaseModalProps> = (props) => {
  const {
    footer,
    hideCancelButton = false,
    hideOkButton = false,
    okButtonProps,
    cancelButtonProps,
    children,
    loading,
    okText = 'OK',
    okType = 'primary',
    onOk,
    cancelText = 'Cancel',
    onCancel,
    ...rest
  } = props
  const currentFooter = useMemo(() => {
    if (!footer && footer !== null) {
      return (
        (!hideCancelButton || !hideOkButton) && (
          <div className="ant-modal-custom-footer">
            {!hideCancelButton && (
              <BaseButton
                block
                ghost
                size="middle"
                type="primary"
                onClick={onCancel}
                {...cancelButtonProps}
              >
                {cancelText}
              </BaseButton>
            )}
            {!hideOkButton && (
              <BaseButton
                block
                loading={loading}
                size="middle"
                type={okType}
                // @ts-expect-error
                onClick={onOk}
                {...okButtonProps}
              >
                {okText}
              </BaseButton>
            )}
          </div>
        )
      )
    }
    return footer
  }, [props])
  return (
    <Modal centered footer={currentFooter} onCancel={onCancel} onOk={onOk} {...rest}>
      {/* <Spin spinning={loading}> */}
      {children}
      {/* </Spin> */}
    </Modal>
  )
}
