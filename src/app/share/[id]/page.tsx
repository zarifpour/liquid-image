'use client';

import { MainContent } from '@/app/main-content';
import { useParams } from 'next/navigation';

export default function SharePage() {
  const { id } = useParams();

  let initialImageId = id;
  if (typeof initialImageId !== 'string' || initialImageId.length === 0) {
    initialImageId = undefined;
  }

  return <MainContent initialImageId={initialImageId} />;
}
