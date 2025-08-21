'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

const HOME_PATH = '/';
const ARTICLES_PATH = '/articles';
const TWEETS_PATH = '/tweets';
const CAMPAIGNS_PATH = '/campaigns';

export default function SideNav() {
  return (
    <div className="w-[270px] px-6 py-5 flex flex-col gap-1 border-r border-border">
      <NavItem
        label="Home"
        icon="/icons/home.svg"
        activeIcon="/icons/home-main.svg"
        href={HOME_PATH}
      />
      <ContentNavItem />
      <NavItem
        label="Campaigns"
        icon="/icons/campaigns.svg"
        activeIcon="/icons/campaigns-main.svg"
        href={CAMPAIGNS_PATH}
      />
      <NavItem
        label="Finance"
        icon="/icons/finance.svg"
        activeIcon="/icons/finance-main.svg"
        href={CAMPAIGNS_PATH}
      />
      <NavItem
        label="WatchList"
        icon="/icons/profile.svg"
        activeIcon="/icons/profile-main.svg"
        href={CAMPAIGNS_PATH}
      />
      <NavItem
        label="Profile"
        icon="/icons/profile.svg"
        activeIcon="/icons/profile-main.svg"
        href={CAMPAIGNS_PATH}
      />
      <NavItem
        label="Settings"
        icon="/icons/settings.svg"
        activeIcon="/icons/settings-main.svg"
        href={CAMPAIGNS_PATH}
      />
    </div>
  );
}

function NavItem({
  label,
  icon,
  activeIcon,
  href,
}: {
  label: string;
  icon: string;
  activeIcon: string;
  href: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = useMemo(() => {
    if (label === 'Home') {
      return pathname === HOME_PATH;
    }

    return pathname.startsWith(href);
  }, [pathname, href, label]);

  function handleClick() {
    if (pathname !== href) {
      router.push(href);
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex cursor-pointer gap-3 items-center h-11 px-3 rounded-xs',
        isActive ? 'text-primary bg-[#F5F6F7]' : 'text-muted-foreground bg-transparent'
      )}
    >
      <Image src={isActive ? activeIcon : icon} alt={label} width={20} height={20} />
      <span className="text-sm font-normal">{label}</span>
    </div>
  );
}

function ContentNavItem() {
  const pathname = usePathname();
  const router = useRouter();

  const [subOpen, setSubOpen] = useState(false);

  const isArticles = pathname.startsWith(ARTICLES_PATH);
  const isTweets = pathname.startsWith(TWEETS_PATH);
  const isContent = isArticles || isTweets;

  // 自动展开子菜单（如直接进入 /articles）
  useEffect(() => {
    if (isContent) {
      setSubOpen(true);
    }
  }, [isContent]);

  function handleClick() {
    setSubOpen(!subOpen);
  }

  function handleSubClick(path: string) {
    router.push(path);
  }

  return (
    <div className="h-fit transition-all duration-300">
      <div
        onClick={handleClick}
        className={cn(
          'flex cursor-pointer items-center justify-between h-11 px-3 rounded-xs',
          isContent ? 'text-primary bg-[#F5F6F7]' : 'text-muted-foreground bg-transparent'
        )}
      >
        <div className="flex gap-3 items-center">
          <Image
            src={isContent ? '/icons/articles-main.svg' : '/icons/articles.svg'}
            alt="Articles"
            width={20}
            height={20}
          />
          <span className="text-sm font-normal">Content</span>
        </div>
        <Image
          src={subOpen ? '/icons/arrow-top-main.svg' : '/icons/arrow-bottom.svg'}
          alt="Chevron"
          width={16}
          height={16}
        />
      </div>
      <div
        className={cn(
          'ml-5 overflow-hidden transition-all duration-300 pl-3 border-l border-border',
          subOpen ? 'max-h-[100px] my-[10px]' : 'max-h-0'
        )}
      >
        <div className="flex flex-col gap-1">
          <div
            onClick={() => handleSubClick(ARTICLES_PATH)}
            className={cn(
              'text-xs relative cursor-pointer flex items-center font-normal h-9 pl-3',
              isArticles ? 'text-primary bg-[#F5F6F7]' : 'text-muted-foreground bg-transparent'
            )}
          >
            {isArticles && (
              <div className="absolute -left-[12px] top-[6px] w-[1px] h-6 bg-primary"></div>
            )}
            <span>Articles</span>
          </div>
          <div
            onClick={() => handleSubClick(TWEETS_PATH)}
            className={cn(
              'text-xs relative cursor-pointer flex items-center font-normal h-9 pl-3',
              isTweets ? 'text-primary bg-[#F5F6F7]' : 'text-muted-foreground bg-transparent'
            )}
          >
            {isTweets && (
              <div className="absolute -left-[12px] top-[6px] w-[1px] h-6 bg-primary"></div>
            )}
            <span>Tweets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
