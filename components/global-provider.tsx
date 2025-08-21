'use client';

import { WagmiProvider } from '@privy-io/wagmi';

import { wagmiConfig } from '@/components/config/wagmi-config';
import { GlobalQuery } from '@/components/global-query';

import PrivyGlobalProvider from './privy-global';

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyGlobalProvider>
      <GlobalQuery>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </GlobalQuery>
    </PrivyGlobalProvider>
  );
}
