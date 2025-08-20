'use client';

import { useQuery } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { ApiResponse } from '../types/common';
import { ApiPath } from './api-path';

export interface Tag {
  id: string;
  name: string;
  description: string;
}

export function useArticlesTags() {
  return useQuery({
    queryKey: ['articles-tags'],
    queryFn: async (): Promise<ApiResponse<Tag[]>> => {
      const response = await Fetcher<ApiResponse<Tag[]>>(ApiPath.tags);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
