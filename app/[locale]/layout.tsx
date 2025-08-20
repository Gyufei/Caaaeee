import { routing } from '@/i18n/routing';

import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { GlobalQuery } from '@/components/global-query';
import CommonLayout from '@/components/layout/common';
import PrivyGlobalProvider from '@/components/privy-global';

import { SequelSansFont } from '../fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'DeTake Admin',
  description: 'DeTake Admin',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale === 'us' ? 'en' : 'zh'}>
      <body className={`${SequelSansFont.variable} antialiased`}>
        <NextIntlClientProvider>
          <PrivyGlobalProvider>
            <GlobalQuery>
              <CommonLayout>{children}</CommonLayout>
            </GlobalQuery>
          </PrivyGlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
