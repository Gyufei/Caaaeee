import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { APP_PATH } from './config/url';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppPath(path: string, locale: string) {
  return `${APP_PATH}${locale === 'us' ? '/us' : '/asia'}${path}`;
}
