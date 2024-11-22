import prisma from '@/prisma-client';
import { Token, TokenType } from '@prisma/client';
import crypto from 'crypto';
import {
  CreateEmailVerificationTokenDto,
  CreatePasswordResetTokenDto,
  CreateTokenDto,
  DeactivatePreviousTokensDto,
} from './types';

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const createToken = (data: CreateTokenDto) => {
  return prisma.token.create({
    data,
  });
};

const createEmailVerificationToken = ({
  userId,
  token,
}: CreateEmailVerificationTokenDto) => {
  return createToken({
    userId,
    token,
    type: TokenType.PASSWORD_RESET,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
  });
};

const createPasswordResetToken = ({
  token,
  userId,
}: CreatePasswordResetTokenDto) => {
  return createToken({
    userId,
    token,
    type: TokenType.PASSWORD_RESET,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1 hour
  });
};

const getTokenByToken = (token: Token['token']) => {
  return prisma.token.findUnique({ where: { token } });
};

const deactivateTokenById = async (tokenId: Token['id']) => {
  return prisma.token.update({
    where: {
      id: tokenId,
    },
    data: {
      isActive: false,
    },
  });
};

const deactivatePreviousUserTokens = async ({
  userId,
  type,
}: DeactivatePreviousTokensDto) => {
  await prisma.token.updateMany({
    where: {
      userId,
      type,
    },
    data: {
      isActive: false,
    },
  });
};

export const tokenService = {
  generateVerificationToken,
  createToken,
  createEmailVerificationToken,
  createPasswordResetToken,
  getTokenByToken,
  deactivateTokenById,
  deactivatePreviousUserTokens,
};
