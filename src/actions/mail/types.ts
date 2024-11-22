import { Token, User } from '@prisma/client';

export type SendVerificationEmailDto = {
  email: User['email'];
  name: User['name'];
  generatedToken: Token['token'];
};

export type SendPasswordResetEmailDto = SendVerificationEmailDto;
