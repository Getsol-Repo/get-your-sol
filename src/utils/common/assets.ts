export function getStaticAssetsUrl(path: string) {
  let currentPath = path
  if (currentPath[0] === '/') {
    currentPath = path.slice(1)
  }
  return new URL(`/${currentPath}`, import.meta.url).href
}

export function getSvgUrl(name: string) {
  return getStaticAssetsUrl(`/src/assets/icons/${name}.svg`)
}
