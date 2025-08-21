'use client';

import { useMutation } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAccessToken } from '../store';
import { ApiPath } from './api-path';

export interface SaveContentContact {
  full_name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface SaveContentPayload {
  country: string;
  city: string;
  title: string;
  sub_title: string;
  body: string;
  content_type: string;
  business_type: string;
  category: string;
  tags: string[];
  language: string;
  img_url: string;
  status: string;
  contact: SaveContentContact;
  entry_id?: string;
}

export interface SaveContentResponse {
  code: number;
  msg: {
    en: string;
    zh: string;
  };
}

export function useSaveContent() {
  const token = useAccessToken();

  return useMutation<SaveContentResponse, Error, SaveContentPayload>({
    mutationKey: ['save-content'],
    mutationFn: async (payload: SaveContentPayload): Promise<SaveContentResponse> => {
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await Fetcher<SaveContentResponse>(ApiPath.saveContent, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return response;
    },
  });
}
