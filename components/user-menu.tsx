'use client';

import { LogOut } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import UserIcon from '@/components/icons/user';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useAccessToken, useAppStore } from '@/lib/store';
import { cn, getAppPath } from '@/lib/utils';

import { Button } from './ui/button';

export default function UserMenu() {
  const locale = useLocale();
  const logout = useAppStore((state) => state.logout);
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchParams = useSearchParams();
  const t = searchParams.get('t');

  const accessToken = useAccessToken();
  const isLogin = !!accessToken;

  useEffect(() => {
    if (t) {
      return;
    }

    const localStore = localStorage.getItem('app-store');
    if (!localStore) {
      goApp();
    }

    const storeData = JSON.parse(localStore || '{}');
    if (!storeData?.state?.accessToken) {
      goApp();
    }
  }, [accessToken, t]);

  useEffect(() => {
    if (t) {
      setAccessToken(t);
      removeUrlParam('t');
    }
  }, [t]);

  function goApp() {
    window.location.href = getAppPath('', locale);
  }

  function handleLogout() {
    logout();
    window.location.href = getAppPath('?ac=q', locale);
  }

  function removeUrlParam(param: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url.toString());
  }

  return (
    <Popover open={showDropdown} onOpenChange={setShowDropdown}>
      <PopoverTrigger asChild>
        <button
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="User menu"
        >
          <UserIcon className={cn('w-5 h-5', isLogin ? 'text-primary' : 'text-muted-foreground')} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[180px] px-2 py-2">
        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-3">
          <Button
            onClick={handleLogout}
            className="w-full bg-primary hover:bg-primary/90 text-white h-10 px-4 rounded-xs transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut />
            <span>Log out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
