import { Token, TokenType, User } from '@prisma/client';

export type CreateTokenDto = Pick<
  Token,
  'userId' | 'token' | 'type' | 'expiresAt'
>;

export type CreateEmailVerificationTokenDto = Pick<Token, 'userId' | 'token'>;

export type CreatePasswordResetTokenDto = CreateEmailVerificationTokenDto;

export type DeactivatePreviousTokensDto = {
  userId: User['id'];
  type: TokenType;
};
