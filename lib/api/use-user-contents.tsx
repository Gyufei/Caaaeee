'use client';

import { useQuery } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { useAccessToken } from '../store';
import { ApiPath } from './api-path';

export interface UserContentItem {
  entry_id: string;
  slug: string;
  title: string;
  unique_vistor: string;
  page_view: string;
  img_url: string;
  status: string;
  sub_title: string;
  created_at: string;
}

export interface UserContentsData {
  list: UserContentItem[];
  next: boolean;
}

export interface UserContentsResponse {
  code: number;
  msg: string;
  data: UserContentsData;
}

export interface UseUserContentsParams {
  page?: number;
  limit?: number;
  type?: string; // e.g. 'article'
}

export function useUserContents(params: UseUserContentsParams = {}) {
  const token = useAccessToken();

  const { page = 1, limit = 10, type = 'article' } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    type,
  });

  const url = `${ApiPath.contents}/?${searchParams.toString()}`;

  return useQuery<UserContentsResponse, Error>({
    queryKey: ['user-contents', page, limit, type],
    queryFn: async (): Promise<UserContentsResponse> => {
      const init = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined;
      const response = await Fetcher<UserContentsResponse>(url, init);
      return response;
    },
    enabled: !!token, // 需要登录后再请求
  });
}
