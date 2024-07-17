import clsx from 'clsx'
import { forwardRef, useMemo } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import type { StrictOmit } from '@libhub/utils'
import { getCurrentTo, resoveFullpathFromRouteLoaction, useRoute, useRouterStore } from '@/router'

export interface BaseLinkProps
  extends StrictOmit<LinkProps, 'to'>, Pick<RouterOptions, 'retainParams'> {
  to: RouteLocation
  text?: boolean
  external?: boolean
}
export const BaseLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  ({ to, className, text = false, external = false, retainParams, ...rest }, ref) => {
    const routes = useRouterStore((state) => state.routes)
    const route = useRoute()
    const fullpath = useMemo(
      () => resoveFullpathFromRouteLoaction(getCurrentTo(to, route, retainParams), routes) || '',
      [to, routes],
    )

    return (
      <Link
        ref={ref}
        className={clsx(className, text && 'hover:(underline) focus:(underline)')}
        target={external ? '_blank' : undefined}
        to={fullpath}
        {...rest}
      />
    )
  },
)
