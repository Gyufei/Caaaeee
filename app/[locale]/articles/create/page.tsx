'use client';

import { useSearchParams } from 'next/navigation';

import { useContentDetail } from '@/lib/api/use-content-detail';

import CreateArticle from './content-form';

export default function Page() {
  const searchParams = useSearchParams();
  const entryId = searchParams.get('entryId');

  const { data: contentDetail } = useContentDetail(entryId ?? undefined);

  return <CreateArticle initFormData={contentDetail?.data ?? undefined} />;
}
