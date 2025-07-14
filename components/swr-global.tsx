'use client';

import { Fetcher } from '@/lib/fetcher';
import { SWRConfig } from 'swr';

export default function SWRGlobal({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: Fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
}
