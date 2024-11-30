import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import prisma from '@/prisma-client';
import { CustomPrismaAdapter } from './lib/prisma-adapter';
import { z } from 'zod';

import { NextResponse } from 'next/server';
import { userService } from '@/actions/user/service';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  adapter: CustomPrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized: async ({ auth: session, request: { nextUrl } }) => {
      const isLoggedIn = !!session?.user;
      const isOnHome = nextUrl.pathname.startsWith('/home');

      if (nextUrl.pathname === '/home' && isLoggedIn) {
        return NextResponse.redirect(new URL('/home/today', nextUrl));
      }

      if (isLoggedIn && nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/home', nextUrl));
      }

      if (isOnHome) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        const callbackUrl = nextUrl.searchParams.get('callbackUrl');
        if (callbackUrl) {
          return NextResponse.redirect(new URL(callbackUrl));
        }
      }
      return true;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.error) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await userService.getUserByEmail(email);

        if (!user) {
          return null;
          throw new Error("User with this email doesn't exist");
        }

        if (!user.verified) {
          return null;
          throw new Error('User is not verified');
        }

        if (!user.password) {
          return null;
          throw new Error('Password is not set');
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
          return null;
          throw new Error('Invalid password');
        }

        return {
          ...user,
          password: undefined,
        };
      },
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
});
