'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function PrivyGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider appId="cmd2yvp2201eil40mc0rx8ade" config={{}}>
      {children}
    </PrivyProvider>
  );
}
