'use client';

import { Button } from '@/components/ui/button';
import GithubIcon from '@/components/icons/github-icon';
import DiscordIcon from './icons/discord-icon';
import Image from 'next/image';

import { signIn } from 'next-auth/react';

const AuthProviders = () => {
  return (
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
        <Button
          onClick={() => signIn('github')}
          variant={'outline'}
          size={'icon'}
        >
          <GithubIcon />
        </Button>
        <Button
          onClick={() => signIn('google')}
          variant={'outline'}
          size={'icon'}
        >
          <Image src={'/google-icon.svg'} alt="Google" width={18} height={18} />
        </Button>
        <Button
          onClick={() => signIn('discord')}
          variant={'outline'}
          size={'icon'}
        >
          <DiscordIcon />
        </Button>
      </div>
    </div>
  );
};

export default AuthProviders;
