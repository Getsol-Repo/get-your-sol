let hasReloadConfirm = false
export function handleGlobalError(e: ErrorEvent) {
  console.log('🚀 ~ e:', e)
  const srcElement = e.target
  if (srcElement instanceof HTMLScriptElement) {
    if (srcElement.tagName === 'SCRIPT' && srcElement.src && !hasReloadConfirm) {
      hasReloadConfirm = true
      window.location.reload()
    } else {
      hasReloadConfirm = false
    }
  }
}
