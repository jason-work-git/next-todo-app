import { Button } from '@/components/ui/button';
import AppleIcon from '@/components/icons/apple-icon';
import GithubIcon from '@/components/icons/github-icon';
import Image from 'next/image';

const AuthProviders = () => (
  <div>
    <div className="relative mb-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background px-2 text-gray-500 uppercase text-xs">
          Or continue with
        </span>
      </div>
    </div>
    <div className="flex gap-3 justify-center">
      <Button variant={'outline'} size={'icon'}>
        <GithubIcon />
      </Button>
      <Button variant={'outline'} size={'icon'}>
        <Image src={'/google-icon.svg'} alt="Google" width={18} height={18} />
      </Button>
      <Button variant={'outline'} size={'icon'}>
        <AppleIcon />
      </Button>
    </div>
  </div>
);

export default AuthProviders;
