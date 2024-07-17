import { notification as antdNotification } from 'antd'
import type { PartialBy } from '@libhub/utils'
import { BaseSvg } from '@/components'
import { MessageEnum } from '@/constants'

type AntdNotificationFnArgs = Parameters<Required<typeof antdNotification>['success']>[0]
export const notification: {
  open: (args: AntdNotificationFnArgs) => void
} & Record<
  'success' | 'error' | 'warning' | 'info',
  (args?: PartialBy<AntdNotificationFnArgs, 'message'> | string) => void
> = {
  error: (args) => {
    notification.open(
      mergeArgs(
        {
          icon: <BaseSvg className="c-#f4655f" href="outlined/error" size={48} />,
          message: MessageEnum.Error,
        },
        args,
      ),
    )
  },
  info: (args) => {
    notification.open(
      mergeArgs(
        {
          icon: <BaseSvg className="c-#4C6FFF" href="outlined/info" size={48} />,
          message: 'Info',
        },
        args,
      ),
    )
  },
  open: (args: AntdNotificationFnArgs) => {
    const { message, description, icon, className, ...rest } = args || {}
    antdNotification.open({
      message: (
        <div className="flex items-center gap-5.5">
          {icon}
          <div className="">
            <div className="text-4 fw-600">{message}</div>
            <div className="text-3.5 c-#425466 fw-500">{description}</div>
          </div>
        </div>
      ),
      placement: 'bottomLeft',
      ...rest,
    })
  },
  success: (args) => {
    notification.open(
      mergeArgs(
        {
          icon: <BaseSvg href="outlined/success" size={48} />,
          message: 'Action successful!',
        },
        args,
      ),
    )
  },
  warning: (args) => {
    notification.open(
      mergeArgs(
        {
          icon: <BaseSvg className="c-#f9d423" href="filled/warning" size={48} />,
          message: 'Warning',
        },
        args,
      ),
    )
  },
}

function mergeArgs(
  currentArgs: AntdNotificationFnArgs,
  args?: PartialBy<AntdNotificationFnArgs, 'message'> | string,
) {
  if (typeof args === 'string') {
    return { ...currentArgs, message: args }
  }
  return { ...currentArgs, ...args }
}
