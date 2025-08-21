'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';

import React, { useEffect, useRef, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { cn, getAppPath } from '@/lib/utils';

interface HeaderProps {
  userComponent?: React.ReactNode;
}

export default function Header({ userComponent }: HeaderProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const T = useTranslations('Header');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localeDropdownOpen, setLocaleDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const collectionsDropdownRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLocaleDropdownOpen(false);
      }
      if (
        collectionsDropdownRef.current &&
        !collectionsDropdownRef.current.contains(event.target as Node)
      ) {
        setCollectionsDropdownOpen(false);
      }
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Internationalized navigation items
  const navigation = {
    left: [
      {
        name: T('navigation.social'),
        href: getAppPath(`/social`, locale),
        key: 'social',
      },
      {
        name: T('navigation.explore'),
        href: getAppPath(`/explore`, locale),
        key: 'explore',
      },
      {
        name: T('navigation.technology'),
        href: getAppPath(`/technology`, locale),
        key: 'technology',
      },
    ],
    right: [
      {
        name: T('navigation.trending'),
        href: getAppPath(`/trending`, locale),
        key: 'trending',
      },
      {
        name: T('navigation.learn'),
        href: getAppPath(`/learn`, locale),
        key: 'learn',
      },
    ],
  };

  // Locale configuration
  const localeConfig = {
    us: {
      name: T('locale.northAmerica'),
      displayName: 'US',
    },
    asia: {
      name: T('locale.asia'),
      displayName: 'Asia',
    },
  };

  /**
   * Handle locale switching with smooth transition
   */
  const handleLocaleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  /**
   * Toggle locale dropdown
   */
  const toggleLocaleDropdown = () => {
    setLocaleDropdownOpen(!localeDropdownOpen);
  };

  /**
   * Toggle collections dropdown
   */
  const toggleCollectionsDropdown = () => {
    setCollectionsDropdownOpen(!collectionsDropdownOpen);
  };

  /**
   * Toggle categories dropdown
   */
  const toggleCategoriesDropdown = () => {
    setCategoriesDropdownOpen(!categoriesDropdownOpen);
  };

  // Collections dropdown items
  const collectionsItems = [
    {
      name: T('navigation.myCollections'),
      href: getAppPath(`/collections/my`, locale),
      key: 'my-collections',
    },
  ];

  // Categories dropdown items
  const categoriesItems = [
    {
      name: T('navigation.categories.news'),
      href: getAppPath(`/news`, locale),
      key: 'news',
    },
    {
      name: T('navigation.categories.insights'),
      href: getAppPath(`/insights`, locale),
      key: 'insights',
    },
    {
      name: T('navigation.categories.research'),
      href: getAppPath(`/research`, locale),
      key: 'research',
    },
  ];

  return (
    <header className="border-b border-border fixed w-screen top-0 z-50 bg-white h-[96px] flex items-center">
      <div className="max-w-[1440px] mx-auto px-4 w-full">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Categories Dropdown */}
            <div className="" ref={categoriesDropdownRef}>
              <button
                onClick={toggleCategoriesDropdown}
                className={`h-12 flex items-center space-x-1 text-sm px-3 py-1.5 text-foreground transition-colors hover:bg-gray-100 ${categoriesDropdownOpen ? '!bg-primary text-white' : ''}`}
                aria-label={T('navigation.allCategories')}
                aria-expanded={categoriesDropdownOpen}
              >
                <span>{T('navigation.allCategories')}</span>
                <Image
                  src={
                    categoriesDropdownOpen
                      ? '/icons/header/down-white.svg'
                      : '/icons/header/down.svg'
                  }
                  alt="dropdown"
                  width={16}
                  height={16}
                  className={`w-4 h-4 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Categories Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute left-0 right-0 top-[95px] w-screen bg-white z-50 border border-border">
                  <div className="max-w-[1440px] mx-auto px-4">
                    <div className="pt-4 pb-3">
                      <h3 className="text-lg font-medium text-foreground mb-2 mt-1">
                        {T('dropdown.article')}
                      </h3>
                      <div className="flex items-center gap-8">
                        {categoriesItems.map((item) => (
                          <a
                            key={item.key}
                            href={item.href}
                            className={`text-sm py-2 relative transition-colors ${
                              pathname === item.href
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={() => setCategoriesDropdownOpen(false)}
                          >
                            {item.name}
                            {pathname === item.href && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Navigation Items */}
            {navigation.left.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm transition-colors hover:text-gray-800 ${pathname === item.href ? 'text-primary' : 'text-foreground'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logo - Center */}
          <div className="flex items-center">
            <Link href={`/`} className="flex items-center">
              <Image src="/icons/header/detake.svg" alt="logo" width={96} height={96} />
            </Link>
          </div>

          {/* Right Navigation & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Collections Dropdown */}
            <div className="relative" ref={collectionsDropdownRef}>
              <button
                onClick={toggleCollectionsDropdown}
                className={`flex items-center space-x-1 text-sm px-3 py-1.5 transition-colors hover:bg-gray-100 ${collectionsDropdownOpen ? '!bg-primary text-white' : ''}`}
                aria-label={T('navigation.collections')}
                aria-expanded={collectionsDropdownOpen}
              >
                <span>{T('navigation.collections')}</span>
                <Image
                  src={
                    collectionsDropdownOpen
                      ? '/icons/header/down-white.svg'
                      : '/icons/header/down.svg'
                  }
                  alt="dropdown"
                  width={16}
                  height={16}
                  className={`w-4 h-4 transition-transform duration-200 ${collectionsDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Collections Dropdown Menu */}
              {collectionsDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-border shadow-lg z-50">
                  <div className="py-1">
                    {collectionsItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={`block px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${pathname === item.href ? 'bg-gray-50 text-gray-900' : 'text-gray-600'}`}
                        onClick={() => setCollectionsDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Navigation Items */}
            {navigation.right.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm transition-colors hover:text-gray-800 ${pathname === item.href ? 'text-primary' : 'text-foreground'}`}
              >
                {item.name}
              </Link>
            ))}

            {/* Search Icon */}
            <button
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              aria-label={T('actions.search')}
            >
              <Image src="/icons/header/search.svg" alt="SearchIcon" width={16} height={16} />
            </button>

            {/* Locale Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleLocaleDropdown}
                className={`flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded transition-colors ${localeDropdownOpen ? '!bg-primary text-white' : ''}`}
                aria-label={T('actions.switchLanguage')}
                aria-expanded={localeDropdownOpen}
              >
                <Image
                  src={
                    localeDropdownOpen
                      ? '/icons/header/country-white.svg'
                      : '/icons/header/country.svg'
                  }
                  alt="CountryIcon"
                  width={16}
                  height={16}
                />
                <span
                  className={cn('text-sm', localeDropdownOpen ? 'text-white' : 'text-foreground')}
                >
                  {localeConfig[locale as keyof typeof localeConfig].name}
                </span>
                <Image
                  src={
                    localeDropdownOpen ? '/icons/header/down-white.svg' : '/icons/header/down.svg'
                  }
                  alt="dropdown"
                  width={16}
                  height={16}
                  className={`w-4 h-4 transition-transform duration-200 ${localeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {localeDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {Object.entries(localeConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => handleLocaleSwitch(key)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === key ? 'bg-gray-50 text-primary' : 'text-gray-600'}`}
                      >
                        <span>{config.name}</span>
                        {locale === key && <span className="ml-auto text-xs text-primary">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Component - Can be customized for different projects */}
            {userComponent}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={T('actions.openMenu')}
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Navigation Items */}
            {[...navigation.left, ...navigation.right].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => handleLocaleSwitch(locale === 'us' ? 'asia' : 'us')}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <span className="text-sm">{locale === 'us' ? '🌏' : '🇺🇸'}</span>
                <span>{locale === 'us' ? T('locale.switchToAsia') : T('locale.switchToUS')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
