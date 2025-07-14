import type { Metadata } from 'next';
import { SequelSansFont } from './fonts';
import './globals.css';
import SWRGlobal from '@/components/swr-global';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import PrivyGlobalProvider from '@/components/privy-global';

export const metadata: Metadata = {
  title: 'DeTake Admin',
  description: 'DeTake Admin',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${SequelSansFont.variable} antialiased`}>
        <NextIntlClientProvider>
          <PrivyGlobalProvider>
            <SWRGlobal>{children}</SWRGlobal>
          </PrivyGlobalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
