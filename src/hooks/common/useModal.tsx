import { App } from 'antd'
import type { useAppProps } from 'antd/es/app/context'
import { useBreakpoints } from './useBreakpoints'
import { BaseButton, BaseSvg } from '@/components'

export function useModal(): Pick<useAppProps['modal'], 'confirm'> {
  const { modal } = App.useApp()
  const { md } = useBreakpoints()
  const size = md ? 'large' : 'middle'
  return {
    confirm: ({
      footer,
      cancelButtonProps,
      okButtonProps,
      okText = 'OK',
      cancelText = 'Cancel',
      okType,
      title = 'Warning',
      content,
      onCancel,
      onOk,
      ...rest
    }) => {
      let externalResolve: (value: boolean) => void = () => {}
      const currentFooter = (() => {
        if (!footer && footer !== null) {
          return (
            <div className="ant-modal-custom-footer">
              <BaseButton
                block
                ghost
                size={size}
                type="primary"
                onClick={async (e) => {
                  await onCancel?.(e)
                  externalResolve(false)
                  // eslint-disable-next-line ts/no-use-before-define
                  ref.destroy()
                }}
                {...cancelButtonProps}
              >
                {cancelText}
              </BaseButton>
              <BaseButton
                block
                size={size}
                type="primary"
                onClick={async (e) => {
                  await onOk?.(e)
                  externalResolve(true)
                  // eslint-disable-next-line ts/no-use-before-define
                  ref.destroy()
                }}
                {...okButtonProps}
              >
                {okText}
              </BaseButton>
            </div>
          )
        }
        return footer
      })()
      const ref = modal.confirm({
        title: (
          <div className="flex items-center gap-2.5">
            <BaseSvg href="filled/warning-round" size={30} />
            {title}
          </div>
        ),
        centered: true,
        icon: null,
        content: <div className="pb-10 pt-8">{content}</div>,
        footer: currentFooter,
        okText: 'Continue',
        maskClosable: true,
        onCancel(...args) {
          onCancel?.(...args)
          externalResolve(false)
        },
        ...rest,
      })
      ref.then = async (resolve, reject) => {
        const confirmed = await new Promise<boolean>((resolve) => {
          externalResolve = resolve
        })
        return resolve(confirmed)
      }
      return ref
    },
  }
}
