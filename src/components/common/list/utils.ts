export function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
  if (el === null) {
    return null
  }
  if (el.scrollHeight > el.clientHeight || el.style.overflowY === 'scroll' || el.style.overflowY === 'auto') {
    return el
  }
  return findScrollContainer(el.parentElement)
}
