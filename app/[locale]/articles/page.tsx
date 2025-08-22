'use client';

import { ChevronDown, Search } from 'lucide-react';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Edit from '@/components/icons/edit';
import Stack from '@/components/icons/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useUserContents } from '@/lib/api/use-user-contents';

// 使用后端数据

export default function Articles() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useUserContents({ page, limit, type: 'article' });
  const list = data?.data.list ?? [];
  const hasNext = data?.data.next ?? false;
  const canPrev = page > 1;
  const canNext = hasNext;
  const startIndex = (page - 1) * limit + 1;

  function handleCreateArticle() {
    router.push('/articles/create');
  }

  function handleEdit(entryId: string) {
    router.push(`/articles/create?entry_id=${entryId}`);
  }

  return (
    <div className="flex-1 px-6 py-5 mb-16">
      {/* 顶部搜索栏和操作按钮 */}
      <div className="flex justify-between items-center mb-5">
        {/* 搜索栏 */}
        <div className="relative text-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search hash, title, token contract..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 py-[14px] rounded-xs w-[430px] focus:outline-none"
          />
        </div>

        {/* Write 按钮 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-primary rounded-xs hover:bg-primary text-white h-12">
              <Edit className="w-5 h-5" />
              <span className="text-sm">Write</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[140px] p-[10px] rounded-xs border border-border">
            <div className="flex flex-col">
              <button
                onClick={handleCreateArticle}
                className="px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
              >
                Article
              </button>
              <button className="px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                Tweet
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 数据表格 */}
      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm leading-[140%]">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-center font-normal border-r" rowSpan={2}>
                  #
                </th>
                <th className="text-center font-normal border-r" rowSpan={2}>
                  Article
                </th>
                <th className="text-center font-normal border-r" rowSpan={2}>
                  UV
                </th>
                <th className="text-center font-normal border-r" rowSpan={2}>
                  PV
                </th>
                <th className="py-[10px] text-center font-normal border-r" colSpan={3} rowSpan={1}>
                  Ongoing Campaign Status
                </th>
                <th className="text-center font-normal border-r" rowSpan={2}>
                  Created time
                </th>
                <th className="text-center font-normal" rowSpan={2}>
                  Actions
                </th>
              </tr>
              <tr className="border-b border-border">
                <th className="py-[10px] text-center font-normal border-r" rowSpan={1}>
                  Bonus Distributed
                </th>
                <th className="py-[10px] text-center font-normal border-r" rowSpan={1}>
                  Pool
                </th>
                <th className="py-[10px] text-center font-normal border-r" rowSpan={1}>
                  Hunters
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-destructive">
                    {error.message}
                  </td>
                </tr>
              )}
              {!isLoading && !error && list.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                    No data
                  </td>
                </tr>
              )}
              {!isLoading &&
                !error &&
                list.map((item, idx) => {
                  const created = new Date(item.created_at);
                  const timeStr = isNaN(created.getTime()) ? '-' : created.toLocaleTimeString();
                  const dateStr = isNaN(created.getTime()) ? '-' : created.toLocaleDateString();
                  return (
                    <tr key={item.entry_id} className="hover:bg-gray-50 border-b last:border-b-0">
                      <td className="px-4 py-4 text-center text-foreground border-r">
                        {startIndex + idx}
                      </td>
                      <td className="px-4 py-4 border-r">
                        <div className="flex flex-col">
                          <div className="text-sm font-normal text-muted-foreground">
                            {item.entry_id}(Hash值)
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image
                              src="/images/article-placeholder.png"
                              alt="art-ph"
                              width={16}
                              height={16}
                            />
                            <div className="text-sm text-foreground">{item.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r text-center">{item.unique_vistor}</td>
                      <td className="px-4 py-4 border-r text-center">{item.page_view}</td>
                      <td className="px-4 py-4 border-r text-center">
                        <div>-</div>
                        {/* <div className="flex items-center gap-x-1">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Image src="/icons/usdc.svg" alt="usdc" width={16} height={16} />
                              <div>-</div>
                            </div>
                            <div>-</div>
                          </div>
                          <Share className="w-4 h-4 text-muted-foreground" />
                        </div> */}
                      </td>
                      <td className="px-4 py-4 border-r text-center">
                        <div className="text-sm text-gray-900">
                          <div>-</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r text-center">-</td>
                      <td className="px-4 py-4 border-r text-center">
                        <div className="text-sm text-gray-900">
                          <div>{timeStr}</div>
                          <div>{dateStr}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleEdit(item.entry_id)}
                            className="p-1 hover:bg-gray-100 rounded group"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-1 hover:bg-gray-100 rounded group" title="复制">
                                <Stack className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="w-40 text-center bg-foreground text-white"></TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {list.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={canPrev ? () => setPage((p) => Math.max(1, p - 1)) : undefined}
                className={!canPrev ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={canNext ? () => setPage((p) => p + 1) : undefined}
                className={!canNext ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
