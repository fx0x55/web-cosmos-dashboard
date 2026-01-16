import { Chain, Balance, Delegation, UnbondingDelegation, AccountDetail, PaginatedResponse, ChainStats } from './types';

export const CHAINS: Chain[] = [
  { id: 'cosmos', name: 'Cosmos Hub', icon: '⚛️', denom: 'ATOM', decimals: 6 },
  { id: 'osmosis', name: 'Osmosis', icon: '🧪', denom: 'OSMO', decimals: 6 },
  { id: 'juno', name: 'Juno', icon: '🛡️', denom: 'JUNO', decimals: 6 },
  { id: 'stargaze', name: 'Stargaze', icon: '✨', denom: 'STARS', decimals: 6 },
];

const MOCK_DELAY = 500;

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data Generators
const generateAddress = (prefix: string) => `${prefix}1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

export const getChains = async (): Promise<Chain[]> => {
  await delay(MOCK_DELAY);
  return CHAINS;
};

export const getChainStats = async (chainId: string): Promise<ChainStats> => {
  await delay(MOCK_DELAY);
  const chain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];
  
  return {
    totalSupply: {
      amount: (1000000000 * Math.random() + 500000000).toFixed(0),
      denom: chain.denom,
    },
    bondedTokens: {
      amount: (300000000 * Math.random() + 100000000).toFixed(0),
      denom: chain.denom,
    },
    notBondedTokens: {
      amount: (50000000 * Math.random() + 10000000).toFixed(0),
      denom: chain.denom,
    },
    communityPool: {
      amount: (10000000 * Math.random() + 1000000).toFixed(0),
      denom: chain.denom,
    },
  };
};

export const getBalances = async (chainId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<Balance>> => {
  await delay(MOCK_DELAY);
  const chain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];
  const data: Balance[] = Array.from({ length: pageSize }).map((_, i) => ({
    address: generateAddress(chain.id),
    amount: (Math.random() * 1000).toFixed(chain.decimals),
    denom: chain.denom,
  }));
  
  return {
    data,
    total: 100, // Mock total
    page,
    pageSize,
  };
};

export const getDelegations = async (chainId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<Delegation>> => {
  await delay(MOCK_DELAY);
  const chain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];
  const data: Delegation[] = Array.from({ length: pageSize }).map((_, i) => ({
    delegatorAddress: generateAddress(chain.id),
    validatorAddress: `${chain.id}valoper1${Math.random().toString(36).substring(2, 10)}`,
    validatorName: `Validator ${i + 1 + (page - 1) * pageSize}`,
    amount: (Math.random() * 500).toFixed(chain.decimals),
    denom: chain.denom,
    delegationCount: Math.floor(Math.random() * 20) + 1,
  }));

  return {
    data,
    total: 80,
    page,
    pageSize,
  };
};

export const getUnbondingDelegations = async (chainId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<UnbondingDelegation>> => {
  await delay(MOCK_DELAY);
  const chain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];
  const data: UnbondingDelegation[] = Array.from({ length: pageSize }).map((_, i) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 21));
    return {
      delegatorAddress: generateAddress(chain.id),
      validatorAddress: `${chain.id}valoper1${Math.random().toString(36).substring(2, 10)}`,
      validatorName: `Validator ${i + 1}`,
      amount: (Math.random() * 200).toFixed(chain.decimals),
      denom: chain.denom,
      completionTime: futureDate.toISOString(),
    };
  });

  return {
    data,
    total: 30,
    page,
    pageSize,
  };
};

export const getAccountDetail = async (chainId: string, address: string): Promise<AccountDetail> => {
  await delay(MOCK_DELAY);
  const chain = CHAINS.find((c) => c.id === chainId) || CHAINS[0];
  
  return {
    address,
    balance: {
      address,
      amount: (Math.random() * 5000).toFixed(chain.decimals),
      denom: chain.denom,
    },
    delegations: Array.from({ length: 3 }).map((_, i) => ({
      delegatorAddress: address,
      validatorAddress: `${chain.id}valoper1${Math.random().toString(36).substring(2, 10)}`,
      validatorName: `Validator ${i + 1}`,
      amount: (Math.random() * 1000).toFixed(chain.decimals),
      denom: chain.denom,
      reward: {
        amount: (Math.random() * 10).toFixed(chain.decimals),
        denom: chain.denom,
      },
    })),
    unbonding: Array.from({ length: 1 }).map((_, i) => ({
      delegatorAddress: address,
      validatorAddress: `${chain.id}valoper1${Math.random().toString(36).substring(2, 10)}`,
      validatorName: `Old Validator`,
      amount: (Math.random() * 100).toFixed(chain.decimals),
      denom: chain.denom,
      completionTime: new Date(Date.now() + 86400000 * 5).toISOString(),
    })),
    rewards: [
      {
        amount: (Math.random() * 50).toFixed(chain.decimals),
        denom: chain.denom,
      }
    ]
  };
};
