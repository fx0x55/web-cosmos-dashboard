export interface ChainStats {
  totalSupply: {
    amount: string
    denom: string
  }
  bondedTokens: {
    amount: string
    denom: string
  }
  notBondedTokens: {
    amount: string
    denom: string
  }
  communityPool: {
    amount: string
    denom: string
  }
}

export interface Chain {
  id: string
  name: string
  icon: string
  denom: string
  decimals: number
}

// API Types based on API.md

export interface Account {
  address: string
  account_number: number
  sequence: number
  amount: number
  staking_amount: number
  staking_count: number
  reward_amount: number
  unbonding_amount: number
}

export interface Staking {
  address: string
  val_address: string
  delegation_amount: number
  reward_amount: number
}

export interface Unbonding {
  address: string
  val_address: string
  unbonding_id: number
  unbonding_amount: number
  creation_height: number
  completion_time_ms: number
}

export interface AccountDetailResponse {
  account: Account
  stakings: Staking[]
  unbondings: Unbonding[]
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
}
