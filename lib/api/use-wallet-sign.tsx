'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useLocale } from 'next-intl';

import { Fetcher } from '../fetcher';
import { useAppStore } from '../store';
import type { ApiResponse } from '../types/common';
import { ApiPath } from './api-path';

export interface WalletSignPayload {
  wallet_address: string;
  signature: string;
}

export interface WalletSignData {
  type: string;
  user_id: string;
  access_token: string;
}

export type WalletSignResponse = ApiResponse<WalletSignData>;

export function useWalletSign() {
  const locale = useLocale();
  const setAccessToken = useAppStore((state) => state.setAccessToken);

  return useMutation<WalletSignResponse, Error, WalletSignPayload>({
    mutationKey: ['wallet-sign'],
    mutationFn: async (payload: WalletSignPayload): Promise<WalletSignResponse> => {
      const response = await Fetcher<WalletSignResponse>(ApiPath.walletSign, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response;
    },
    onSuccess: (res) => {
      if (res?.data?.access_token) {
        setAccessToken(res.data.access_token);
      }
      toast.success(res?.msg[locale === 'us' ? 'en' : 'zh']);
    },
  });
}
