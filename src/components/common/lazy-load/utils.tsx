import { type ComponentProps, type ComponentType, lazy } from 'react'
import { AsyncComponent } from './AsyncComponent'

export function withAsync<T extends ComponentType<any>>(importFn: () => Promise<{ default: T }>) {
  const Component = lazy<T>(async () =>
    importFn(),
  )
  return (props: ComponentProps<T>) => (
    <AsyncComponent>
      <Component {...props} />
    </AsyncComponent>
  )
}
