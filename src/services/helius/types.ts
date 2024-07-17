export interface HeliusBaseReq {
  /**
   * Start searching backwards from this transaction signature.
   */
  before?: string
  /**
   * Search until this transaction signature.
   */
  until?: string
  commitment?: string
}

export interface HeliusListReq extends HeliusBaseReq {
  limit?: number
}
