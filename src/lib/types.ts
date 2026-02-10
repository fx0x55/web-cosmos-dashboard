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
  explorer_base_url?: string
  rest_url?: string
  adenom?: string
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
  val_moniker?: string
  delegation_amount: number
  reward_amount: number
}

export interface Unbonding {
  address: string
  val_address: string
  val_moniker?: string
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

// Validator Types

export interface ValidatorSummaryResponse {
  val_address: string
  val_moniker: string
  total_delegators_count: number
  total_delegated_amount: number
  total_undelegators_count: number
  total_undelegated_amount: number
}

export interface ValidatorDelegation {
  address: string
  val_address: string
  val_moniker: string
  delegation_amount: number
  reward_amount: number
}

export interface ValidatorUnbonding {
  address: string
  val_address: string
  val_moniker: string
  unbonding_id: number
  unbonding_amount: number
  creation_height: number
  completion_time_ms: number
}
