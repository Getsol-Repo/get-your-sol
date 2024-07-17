import { Component } from 'react'
import { Alert } from 'antd'
import type { BaseProps } from '@/types'

export class ErrorBoundary extends Component<
  BaseProps,
  { error: any, errorInfo: Record<string, any>, hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  constructor(props: any) {
    super(props)
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state?.hasError) {
      return (
        <div className="p-6">
          <Alert
            description={this.state.errorInfo?.componentStack}
            message={this.state.error?.message}
            type="error"
          />
        </div>
      )
    }

    return this.props.children
  }
}
