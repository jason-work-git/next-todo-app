'use client';

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-error mb-8">
        Something went wrong!
      </h1>
      <p className="text-2xl text-muted-foreground mb-8">
        We are so sorry, but something went wrong. If you want you can try to
        reload the page.
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary hover:bg-primary-foreground text-primary-foreground font-bold py-2 px-4 rounded"
      >
        Try again
      </button>
    </div>
  );
}
