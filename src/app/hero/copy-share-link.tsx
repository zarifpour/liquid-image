'use client';

import { toast } from 'sonner';

// I have no idea why but if we useSTate in this file, next won't build with "Unexpected end of JSON input"
// spent 30 minutes on this and still can't figure out what's going on
// so just switching to sonner to give feedback that the url was copied

export const CopyShareLink = () => {
  function handleClick() {
    navigator?.clipboard?.writeText(window.location.href);
    toast.success('Copied to clipboard');
    console.log('yoo');
  }

  return (
    <button onClick={handleClick} className="w-[200px] rounded-lg bg-blue-500 p-2 text-sm text-white" type="button">
      Copy Share Link
    </button>
  );
};
