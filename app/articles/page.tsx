'use client';

import { ChevronDown, Search } from 'lucide-react';

import { useState } from 'react';

import Image from 'next/image';

import Edit from '@/components/icons/edit';
import Share from '@/components/icons/share';
import Stack from '@/components/icons/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// 模拟数据
const mockArticles = [
  {
    id: 1,
    hash: 'dtc-6z8Fo1',
    title: 'xxx标题xxxxxx',
    uv: '30.2K',
    pv: '90M',
    bonusDistributed: {
      amount: '1000 Tokens',
      contract: '11111idsajn1jklds',
    },
    pool: {
      sol: '200 SOL',
      tokens: '4000 Tokens',
    },
    hunters: 400,
    createdTime: {
      time: '12:11 am',
      date: 'Apr 21, 2025',
    },
  },
  {
    id: 2,
    hash: 'dtc-6z8Fo2',
    title: 'xxx标题xxxxxx',
    uv: '30.2K',
    pv: '90M',
    bonusDistributed: {
      amount: '1000 Tokens',
      contract: '11111idsajn1jklds',
    },
    pool: {
      sol: '200 SOL',
      tokens: '4000 Tokens',
    },
    hunters: 400,
    createdTime: {
      time: '12:11 am',
      date: 'Apr 21, 2025',
    },
  },
  {
    id: 3,
    hash: 'dtc-6z8Fo3',
    title: 'xxx标题xxxxxx',
    uv: '30.2K',
    pv: '90M',
    bonusDistributed: {
      amount: '1000 Tokens',
      contract: '11111idsajn1jklds',
    },
    pool: {
      sol: '200 SOL',
      tokens: '4000 Tokens',
    },
    hunters: 400,
    createdTime: {
      time: '12:11 am',
      date: 'Apr 21, 2025',
    },
  },
  {
    id: 4,
    hash: 'dtc-6z8Fo4',
    title: 'xxx标题xxxxxx',
    uv: '30.2K',
    pv: '90M',
    bonusDistributed: {
      amount: '1000 Tokens',
      contract: '11111idsajn1jklds',
    },
    pool: {
      sol: '200 SOL',
      tokens: '4000 Tokens',
    },
    hunters: 400,
    createdTime: {
      time: '12:11 am',
      date: 'Apr 21, 2025',
    },
  },
  {
    id: 5,
    hash: 'dtc-6z8Fo5',
    title: 'xxx标题xxxxxx',
    uv: '30.2K',
    pv: '90M',
    bonusDistributed: {
      amount: '1000 Tokens',
      contract: '11111idsajn1jklds',
    },
    pool: {
      sol: '200 SOL',
      tokens: '4000 Tokens',
    },
    hunters: 400,
    createdTime: {
      time: '12:11 am',
      date: 'Apr 21, 2025',
    },
  },
];

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 px-6 py-5">
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
            className="pl-10 pr-4 h-12 py-[14px] rounded-none w-[430px] focus:outline-none"
          />
        </div>

        {/* Write 按钮 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-main rounded-none hover:bg-main text-white h-12">
              <Edit className="w-5 h-5" />
              <span className="text-sm">Write</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[140px] p-[10px] rounded-none border border-border">
            <div className="flex flex-col">
              <button className="px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
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
            <thead className="text-[#909399]">
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
              {mockArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 border-b last:border-b-0">
                  <td className="px-4 py-4 text-center text-foreground border-r">{article.id}</td>
                  <td className="px-4 py-4 border-r">
                    <div className="flex flex-col">
                      <div className="text-sm font-normal text-[#909399]">
                        {article.hash}(Hash值)
                      </div>
                      <div className="flex items-center space-x-2">
                        <Image
                          src="/images/article-placeholder.png"
                          alt="art-ph"
                          width={16}
                          height={16}
                        />
                        <div className="text-sm text-foreground">{article.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r text-center">{article.uv}</td>
                  <td className="px-4 py-4 border-r text-center">{article.pv}</td>
                  <td className="px-4 py-4 border-r text-center">
                    <div className="flex items-center gap-x-1">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Image src="/icons/usdc.svg" alt="usdc" width={16} height={16} />
                          <div>{article.bonusDistributed.amount}</div>
                        </div>
                        <div>{article.bonusDistributed.contract}</div>
                      </div>
                      <Share className="w-4 h-4 text-[#909399]" />
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r text-center">
                    <div className="text-sm text-gray-900">
                      <div>{article.pool.sol}</div>
                      <div>{article.pool.tokens}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r text-center">{article.hunters}</td>
                  <td className="px-4 py-4 border-r text-center">
                    <div className="text-sm text-gray-900">
                      <div>{article.createdTime.time}</div>
                      <div>{article.createdTime.date}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded group" title="编辑">
                        <Edit className="w-4 h-4 text-[#909399] group-hover:text-main" />
                      </button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded group" title="复制">
                            <Stack className="w-5 h-5 text-[#909399] group-hover:text-main" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="w-40 text-center">
                          Text Text Text Text Text Text Text
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
