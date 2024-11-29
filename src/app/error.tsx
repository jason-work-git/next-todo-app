'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <h1 className="text-4xl text-center font-bold text-error mb-3">
        Something went wrong!
      </h1>
      <p className="text-lg text-center text-muted-foreground mb-4">
        We are so sorry, but something went wrong. If you want you can try to
        reload the page.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
