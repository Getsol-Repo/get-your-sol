import type { FC, SVGAttributes } from 'react'
import styled from '@emotion/styled'
import { TooltipWrapper, type TooltipWrapperProps } from '../wrappers'

const StyledSvg = styled('svg')({
  '&.svg-icon': {
    color: 'inherit',
    display: 'inline-block',
    fill: 'currentColor',
    height: '1em',
    outline: 'none',
    overflow: 'hidden',
    verticalAlign: '-0.125em',
    width: '1em',
  },
})

export interface BaseSvgProps extends SVGAttributes<SVGElement>, TooltipWrapperProps {
  size?: string | number
  prefix?: string
}

export const BaseSvg: FC<BaseSvgProps> = ({
  prefix = 'icon',
  href,
  tooltip,
  size,
  color,
  style,
  className = '',
  width,
  height,
  ...rest
}) => {
  return (
    <span
      className={`${className} anticon`}
      style={{ color, fontSize: size, height, width, ...style }}
    >
      <TooltipWrapper tooltip={tooltip}>
        <StyledSvg aria-hidden="true" className="svg-icon" style={{ fontSize: size }} {...rest}>
          <use xlinkHref={`#${prefix}-${href}`} />
        </StyledSvg>
      </TooltipWrapper>
    </span>
  )
}

BaseSvg.displayName = 'BaseSvg'
