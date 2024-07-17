import { PublicKey, Transaction } from '@solana/web3.js'
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token'

export function omitAddress(address?: string) {
  if (!address) {
    return ''
  }
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`
}

export function toSolscanTXUrl(signature?: string) {
  return signature ? `https://solscan.io/tx/${signature}` : ''
}

let lastNonce = 0
let lastTimestamp = Date.now()
export function generateNonce() {
  const currentTimestamp = Date.now()
  if (currentTimestamp !== lastTimestamp) {
    lastNonce = 0
    lastTimestamp = currentTimestamp
  }
  return `${currentTimestamp}${lastNonce++}`
}

export function getPhantomProvider() {
  if ('phantom' in window) {
    // @ts-expect-error
    const provider = window.phantom?.solana
    if (provider?.isPhantom) {
      return provider as {
        connect: (t: any) => void
        disconnect: () => void
        handleNotification: (t: any) => void
        isPhantom: boolean
        removeAllListeners: (t: any) => void
        request: (o: any) => Promise<any>
        signAllTransactions: (...n: any[]) => Promise<any[]>
        signAndSendAllTransactions: (transactions: Transaction[]) => Promise<{ signatures: string[], publicKey: PublicKey }>
        signAndSendTransaction: (o: any, ...s: any[]) => Promise<any>
        signIn: (t: any) => Promise<any>
        signMessage: (t: any, n?: string) => Promise<any>
        signTransaction: (t: any) => Promise<any>
        isConnected: boolean
        publicKey: any
      }
    }
  }
}

export async function creatTokenAccountTx(payer: PublicKey) {
  const transaction = new Transaction()
  const keypair = { publicKey: new PublicKey('2mysC3fDxCUG4T6gBBWn35a8VkykqY1A9Hj7fkiApump') }
  const ata = await getAssociatedTokenAddress(keypair.publicKey, payer)
  transaction.add(
    createAssociatedTokenAccountInstruction(
      payer, // payer
      ata, // ata
      payer, // owner
      keypair.publicKey, // mint
    ),
  )
  return transaction
}
