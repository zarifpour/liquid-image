'use client';

import { useCallback, useRef, useState } from 'react';

export const CopyShareLink = () => {
  const [copied, setCopied] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(async () => {
    try {
      await navigator?.clipboard?.writeText(window.location.href);
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <button onClick={handleClick} className="w-[200px] rounded-lg bg-blue-500 p-2 text-sm text-white" type="button">
      {copied ? <span>✓ Copied!</span> : <span>Copy Share Link</span>}
    </button>
  );
};
