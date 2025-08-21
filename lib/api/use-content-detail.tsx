'use client';

import { useQuery } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAccessToken } from '../store';
import type { ApiResponse } from '../types/common';
import { ApiPath } from './api-path';

export interface ContentDetailTag {
  id: string;
  name: string;
}

export interface ContentDetailCategory {
  id: string;
  name: string;
}

export interface ContentDetailBusinessTypeInfo {
  id: string;
  name: string;
}

export interface ContentDetailContact {
  email: string;
  phone: string;
  title: string;
  company: string;
  full_name: string;
}

export interface ContentDetailData {
  id: string;
  entry_id: string;
  slug: string;
  title: string;
  type: string; // e.g. 'article'
  language: string; // e.g. 'en'
  img_url: string;
  user_id: string;
  status: string; // e.g. 'published'
  body: string;
  sub_title: string;
  contact: ContentDetailContact;
  created_at: string;
  updated_at: string;
  country: string;
  city: string;
  unique_vistor: string;
  page_view: string;
  tags: ContentDetailTag[];
  category: ContentDetailCategory;
  business_type_info: ContentDetailBusinessTypeInfo;
}

export type ContentDetailResponse = ApiResponse<ContentDetailData>;

export function useContentDetail(entryId?: string) {
  const token = useAccessToken();

  const url = entryId ? `${ApiPath.contentDetail}?entry_id=${encodeURIComponent(entryId)}` : '';

  return useQuery<ContentDetailResponse, Error>({
    queryKey: ['content-detail', entryId],
    queryFn: async (): Promise<ContentDetailResponse> => {
      const init = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;
      const response = await Fetcher<ContentDetailResponse>(url, init);
      return response;
    },
    enabled: Boolean(entryId),
  });
}
