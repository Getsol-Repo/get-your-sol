export function isAddressEqual(addr1?: string, addr2?: string) {
  if (!addr1 || !addr2) {
    return false
  }
  return String(addr1).toLowerCase() === String(addr2).toLowerCase()
}

export function isAddressContains(addressses?: string[], address?: string) {
  if (!addressses || !address) {
    return false
  }
  return addressses.some((addr) => isAddressEqual(addr, address))
}
