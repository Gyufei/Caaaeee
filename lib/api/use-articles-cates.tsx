'use client';

import { useQuery } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { ApiResponse } from '../types/common';
import { ApiPath } from './api-path';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export function useArticlesCates() {
  return useQuery({
    queryKey: ['articles-categories'],
    queryFn: async (): Promise<ApiResponse<Category[]>> => {
      const response = await Fetcher<ApiResponse<Category[]>>(ApiPath.categories);
      return response;
    },
  });
}
