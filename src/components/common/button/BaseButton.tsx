import { Button, type ButtonProps } from 'antd'
import type { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import clsx from 'clsx'
import type { Promisify, StrictOmit } from '@libhub/utils'
import { useMergeState, useUnionIs } from '@/hooks'

export interface BaseButtonProps extends StrictOmit<ButtonProps, 'type' | 'onClick'> {
  type?: ButtonProps['type'] | 'secondary' | 'outline' | 'empty' | 'plain'
  /**
   * 设置后置标签
   */
  addonAfter?: ReactNode
  onClick?: Promisify<Required<ButtonProps>['onClick']> | ButtonProps['onClick']
}

const StyledButton = styled(Button)({
  '& .btn-addon-after': {
    display: 'inline-block',
    marginLeft: '8px',
  },
  '& .img-wrapper': {
    verticalAlign: 'text-bottom',
  },
  '&.ant-btn': {
    alignItems: 'center',
    display: 'flex',
    fontWeight: 500,
    justifyContent: 'center',
    // borderRadius: 999,
  },
  '&.ant-btn-default': {
    borderColor: '#D6D1FA',
    color: 'var(--c-primary)',
  },
  '&.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover': {
    borderColor: '#D6D1FA',
    color: 'var(--c-primary)',
  },
  '&.ant-btn-primary': {
    boxShadow: 'none',
  },
  '&.ant-btn-primary:disabled': {
    backgroundColor: '#4E4D50',
    borderColor: '#d4d7dc',
    color: '#fff',
    opacity: 0.5,
  },
  '&.ant-btn-primary:not(:disabled):hover': {
    opacity: 0.7,
  },
  '&.ant-btn-primary:not(:disabled):active': {
    opacity: 0.85,
  },
  '&.ant-btn.ant-btn-sm': {
    fontSize: '14px',
  },
  '&.ant-btn>.img-wrapper+span, &.ant-btn>.img-wrapper+.anticon': {
    marginInlineStart: '8px',
  },

  '&.btn-empty:disabled': {
    backgroundColor: '#eef2f6',
  },
  '&.btn-empty:not(:disabled)': {
    color: '#838385',
  },
  '&.btn-empty:not(:disabled):hover': {
    backgroundColor: '#f7f9fb',
    color: '#838385',
  },
  '&.btn-empty:not(:disabled):active': {
    backgroundColor: '#ccd9e5',
    color: '#838385',
  },
  '&.btn-outline:disabled': {
    borderColor: '#eef2f6',
    // borderRadius: 999,
  },
  '&.btn-outline:not(:disabled)': {
    // borderRadius: 999,
    backgroundColor: 'transparent',
    color: '#fff',
  },
  '&.btn-outline:not(:disabled):hover': {
    // color: '#838385',
    borderColor: '#d9e3ec',
  },
  '&.btn-outline:not(:disabled):active': {
    // color: '#838385',
    borderColor: '#d9e3ec',
  },
  '&.btn-plain': {
    borderWidth: 2,
  },

  '&.btn-plain:disabled': {
    borderColor: 'var(--c-primary)',
    color: 'var(--c-primary)',
    opacity: 0.125,
  },
  '&.btn-plain:not(:disabled)': {
    backgroundColor: '#fff',
    borderColor: 'var(--c-primary)',
    color: 'var(--c-primary)',
  },
  '&.btn-plain:not(:disabled):hover': {
    backgroundColor: 'var(--c-primary)',
    color: '#fff',
  },
  '&.btn-plain:not(:disabled):active': {
    opacity: 0.7,
  },
  '&.btn-secondary:disabled': {
    // backgroundColor: '#eef2f6',
  },
  '&.btn-secondary:not(:disabled)': {
    backgroundColor: '#4c6fff',
    color: '#fff',
  },
  '&.btn-secondary:not(:disabled):hover': {
    backgroundColor: '#3e5cd6',
    // backgroundColor: '#eef2f6',
    color: '#fff',
  },
  '&.btn-secondary:not(:disabled):active': {
    backgroundColor: '#3e5cd6',
    // backgroundColor: '#dde5ee',
    color: '#fff',
  },
  '&:disabled': {
    color: '#CCD9E6',
  },
})

export const BaseButton: FC<BaseButtonProps> = ({
  type = 'secondary',
  className,
  children,
  addonAfter,
  loading,
  shape = 'default',
  onClick,
  ...rest
}) => {
  const { isSecondary, isOutline, isEmpty, isPlain } = useUnionIs(type)
  const [currentLoading, setCurrentLoading] = useMergeState(false, { value: loading })
  const handleClick: BaseButtonProps['onClick'] = async (e: any) => {
    try {
      setCurrentLoading(true)
      await onClick?.(e)
    } finally {
      setCurrentLoading(false)
    }
  }
  return (
    <StyledButton
      className={clsx(className, {
        'btn-empty': isEmpty,
        'btn-outline': isOutline,
        'btn-plain': isPlain,
        'btn-secondary': isSecondary,
      })}
      loading={currentLoading}
      shape={shape}
      type={
        (isOutline
          ? 'default'
          : isEmpty || isSecondary || isPlain
            ? 'text'
            : type) as ButtonProps['type']
      }
      onClick={handleClick as unknown as ButtonProps['onClick']}
      {...rest}
    >
      {children}
      {addonAfter && <div className="btn-addon-after">{addonAfter}</div>}
    </StyledButton>
  )
}
