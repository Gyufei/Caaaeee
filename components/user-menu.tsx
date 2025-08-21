'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';

import React, { useEffect } from 'react';

import UserIcon from '@/components/icons/user';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useWalletSign } from '@/lib/api/use-wallet-sign';
import { useAccessToken } from '@/lib/store';
import { cn } from '@/lib/utils';

import Email from './icons/email';
import Wallet from './icons/wallet';
import { Button } from './ui/button';

export default function UserMenu() {
  const accessToken = useAccessToken();
  const isLogin = !!accessToken;

  const { ready, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const { mutate: signWallet } = useWalletSign();

  function handleContinueWithWallet() {
    connectWallet();
  }

  function handleContinueWithEmail() {
    console.log('Continue with Email');
  }

  async function singActiveWallet() {
    const activeWallet = wallets[0];

    const signature = await activeWallet.sign('Welcome to DeTake');

    signWallet({
      wallet_address: activeWallet.address,
      signature,
    });
  }

  useEffect(() => {
    if (!ready || accessToken || !wallets?.length) {
      return;
    }

    singActiveWallet();
  }, [wallets, accessToken, ready]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="User menu"
        >
          <UserIcon className={cn('w-5 h-5', isLogin ? 'text-primary' : 'text-muted-foreground')} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] px-5 py-6">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl text-primary leading-[140%]">Decentralized Takes.</h1>
          <div className="mt-[9px] text-[18px]">
            <p className="text-muted-foreground leading-[140%]">
              Log in or sign up for <span className="text-foreground">DeTake</span>
            </p>
            <p className="text-muted-foreground leading-[140%]">
              Get started with <span className="text-foreground">ContentFi</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-3">
          <Button
            onClick={handleContinueWithWallet}
            className="w-full bg-primary hover:bg-primary/90 text-white h-12 px-4 rounded-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Wallet className="!w-5 !h-5 text-white" />
            <span>Continue with Wallet</span>
          </Button>

          <Button
            onClick={handleContinueWithEmail}
            className="w-full border-2 border-primary bg-white text-primary hover:bg-white/10 h-12 px-4 rounded-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Email className="!w-5 !h-5 text-primary" />
            <span>Continue with Email</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
