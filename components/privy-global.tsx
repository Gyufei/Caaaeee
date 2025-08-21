'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

export default function PrivyGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmd2yvp2201eil40mc0rx8ade"
      config={{
        appearance: { walletChainType: 'ethereum-and-solana' },
        externalWallets: { solana: { connectors: toSolanaWalletConnectors() } },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
