import { getLoadingMessage } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

export default function LoadingPage() {
  const message = getLoadingMessage();

  return (
    <main className="h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <LoaderCircle strokeWidth={1.5} className="w-10 h-10 animate-spin" />
        <span className="text-center">{message}</span>
      </div>
    </main>
  );
}
