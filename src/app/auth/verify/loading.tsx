import { LoaderCircle } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <LoaderCircle className="animate-spin" />
      <span className="text-center">
        Hang tight! We&apos;re verifying your email address. This might take a
        few seconds... or a few minutes... or a few hours... just kidding (we
        hope).
      </span>
    </div>
  );
}
