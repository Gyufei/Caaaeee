'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const T = useTranslations('Footer');

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1440px] mx-auto pb-12">
        <div className="grid grid-cols-2 gap-12">
          <div className="p-12 pl-12">
            <h3 className="text-xs font-medium mb-4">{T('newsletter.title')}</h3>
            <h4 className="text-xl font-medium mb-4">{T('newsletter.subtitle')}</h4>
            <p className="text-white/60 mb-6">{T('newsletter.description')}</p>
            <div className="flex">
              <input
                type="email"
                placeholder={T('newsletter.emailPlaceholder')}
                className="flex-1 px-4 py-2 bg-white !text-muted-foreground border border-gray-700 rounded-l focus:outline-none focus:border-teal-500"
              />
              <button className="bg-teal-500 px-6 py-2 rounded-r hover:bg-[#06A17E] flex items-center">
                {T('newsletter.subscribeButton')}
              </button>
            </div>
          </div>

          <div className="p-12 pl-12 border-l border-gray-800">
            <h3 className="text-[20px] font-medium mb-4">{T('disclosure.title')}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{T('disclosure.content')}</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center border-b border-gray-800 pb-8 px-12">
            <div className="flex flex-wrap space-x-8">
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.news')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.podcasts')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.newsletters')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.events')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.roundtables')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.analytics')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.sitemap')}
              </a>
            </div>
            <div className="flex flex-wrap space-x-8">
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.about')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.manageCookies')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.careers')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.termsOfService')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.privacyPolicy')}
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">
                {T('navigation.contactUs')}
              </a>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 px-12">
            <div>
              <Image width={90} height={90} src="/icons/footer/detake.svg" alt="Twitter" />
              <p className="text-white text-[12px] mt-5">{T('company.copyright')}</p>
            </div>
            <div className="flex mt-6 space-x-5">
              <a
                href="https://twitter.com/detake"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={T('social.twitter')}
              >
                <Image width={24} height={24} src="/icons/footer/twitter.svg" alt="Twitter" />
              </a>
              <a
                href="https://t.me/detake"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={T('social.telegram')}
              >
                <Image width={24} height={24} src="/icons/footer/telegram.svg" alt="Telegram" />
              </a>
              <a
                href="https://github.com/detake"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={T('social.github')}
              >
                <Image width={24} height={24} src="/icons/footer/github.svg" alt="GitHub" />
              </a>
              <a
                href="https://discord.gg/detake"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={T('social.discord')}
              >
                <Image width={24} height={24} src="/icons/footer/discord.svg" alt="Discord" />
              </a>
              <a
                href="https://youtube.com/@detake"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={T('social.youtube')}
              >
                <Image width={24} height={24} src="/icons/footer/youtube.svg" alt="YouTube" />
              </a>
              <a
                href="/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={T('social.rss')}
              >
                <Image width={24} height={24} src="/icons/footer/rss.svg" alt="RSS" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
