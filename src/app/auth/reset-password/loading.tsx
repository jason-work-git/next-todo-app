import { LoaderCircle } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <LoaderCircle className="animate-spin" />
      <span className="text-center">
        Hang tight! Resetting your password is on the way... 🔄
      </span>
    </div>
  );
}
