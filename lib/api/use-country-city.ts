import { useQuery } from '@tanstack/react-query';

export type CountryCity = Record<string, string[]>;

export function useCountryCity() {
  const res = useQuery<CountryCity>({
    queryKey: ['country-city'],
    queryFn: async () => {
      try {
        const res = await fetch(`/data/countries.min.json`);
        if (!res.ok) {
          throw new Error(`Failed to fetch countries data: ${res.status}`);
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Error fetching countries data:', error);
        throw error;
      }
    },
    staleTime: Infinity, // 数据永不过期
    gcTime: 1000 * 60 * 60 * 24, // 缓存24小时
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2, // 失败时重试2次
    retryDelay: 1000, // 重试间隔1秒
  });

  return res;
}
