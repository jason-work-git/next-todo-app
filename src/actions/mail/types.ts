import { Token, User } from '@prisma/client';

export type CreateTokenDto = Pick<
  Token,
  'userId' | 'token' | 'type' | 'expiresAt'
>;

export type SendVerificationEmailDto = {
  email: User['email'];
  name: User['name'];
  generatedToken: Token['token'];
};
