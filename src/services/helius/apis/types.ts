interface RawTokenAmount {
  tokenAmount: string
}

interface TokenBalanceChange {
  userAccount: string
  tokenAccount: string
  mint: string
  rawTokenAmount: RawTokenAmount
}

interface AccountData {
  account: string
  nativeBalanceChange: number
  tokenBalanceChanges: TokenBalanceChange[]
}

interface NativeTransfer {
  fromUserAccount: string
  toUserAccount: string
}

interface TokenTransfer {
  fromUserAccount: string
  toUserAccount: string
  fromTokenAccount: string
  toTokenAccount: string
  tokenAmount: number
  mint: string
}

interface InnerInstruction {
  accounts: string[]
  data: string
  programId: string
}

interface Instruction {
  accounts: string[]
  data: string
  programId: string
  innerInstructions: InnerInstruction[]
}

interface TransactionError {
  error: string
}

interface Nft {
  mint: string
  tokenStandard: string
}

interface NftEvent {
  description: string
  type: string
  source: string
  amount: number
  fee: number
  feePayer: string
  signature: string
  slot: number
  timestamp: number
  saleType: string
  buyer: string
  seller: string
  staker: string
  nfts: Nft[]
}

interface NativeInput {
  account: string
  amount: string
}

interface TokenInputOutput {
  userAccount: string
  tokenAccount: string
  mint: string
  rawTokenAmount: RawTokenAmount
}

interface TokenFee {
  userAccount: string
  tokenAccount: string
  mint: string
  rawTokenAmount: RawTokenAmount
}

interface NativeFee {
  account: string
  amount: string
}

interface ProgramInfo {
  source: string
  account: string
  programName: string
  instructionName: string
}

interface InnerSwap {
  tokenInputs: TokenTransfer[]
  tokenOutputs: TokenTransfer[]
  tokenFees: TokenTransfer[]
  nativeFees: NativeTransfer[]
  programInfo: ProgramInfo
}

interface SwapEvent {
  nativeInput: NativeInput
  nativeOutput: NativeInput
  tokenInputs: TokenInputOutput[]
  tokenOutputs: TokenInputOutput[]
  tokenFees: TokenFee[]
  nativeFees: NativeFee[]
  innerSwaps: InnerSwap[]
}

interface CompressedEvent {
  type: string
  treeId: string
  assetId: string
  newLeafOwner: string
  oldLeafOwner: string
}

interface SetAuthorityEvent {
  account: string
  from: string
  to: string
}

interface Events {
  nft: NftEvent
  swap: SwapEvent
  compressed: CompressedEvent
  distributeCompressionRewards: object
  setAuthority: SetAuthorityEvent
}

export interface ITransaction {
  description: string
  type: string
  source: string
  fee: number
  feePayer: string
  signature: string
  slot: number
  timestamp: number
  nativeTransfers: NativeTransfer[]
  tokenTransfers: TokenTransfer[]
  accountData: AccountData[]
  transactionError: TransactionError
  instructions: Instruction[]
  events: Events
}
