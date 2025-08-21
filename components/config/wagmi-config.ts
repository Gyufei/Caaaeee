/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia] as const,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
