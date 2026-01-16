export interface ChainStats {
  totalSupply: {
    amount: string;
    denom: string;
  };
  bondedTokens: {
    amount: string;
    denom: string;
  };
  notBondedTokens: {
    amount: string;
    denom: string;
  };
  communityPool: {
    amount: string;
    denom: string;
  };
}

export interface Chain {
  id: string;
  name: string;
  icon: string;
  denom: string;
  decimals: number;
}

export interface Balance {
  address: string;
  amount: string;
  denom: string;
}

export interface Delegation {
  delegatorAddress: string;
  validatorAddress: string;
  validatorName: string; // Mocked for display
  amount: string;
  denom: string;
  delegationCount?: number; // Total delegations count for the delegator
  reward?: {
    amount: string;
    denom: string;
  };
}

export interface UnbondingDelegation {
  delegatorAddress: string;
  validatorAddress: string;
  validatorName: string;
  amount: string;
  denom: string;
  completionTime: string;
}

export interface AccountDetail {
  address: string;
  balance: Balance;
  delegations: Delegation[];
  unbonding: UnbondingDelegation[];
  rewards: {
    amount: string;
    denom: string;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
