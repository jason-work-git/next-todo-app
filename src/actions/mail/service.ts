import { EmailTemplate } from '@/components/email-templates/email-verification-template';
import resend from '@/lib/resend';
import prisma from '@/prisma-client';
import {
  CreateTokenDto,
  SendPasswordResetEmailDto,
  SendVerificationEmailDto,
} from './types';
import { PasswordResetEmailTemplate } from '@/components/email-templates/email-password-reset-template';

const createToken = (data: CreateTokenDto) => {
  return prisma.token.create({
    data,
  });
};

const sendVerificationEmail = ({
  email,
  name,
  generatedToken,
}: SendVerificationEmailDto) => {
  return resend.emails.send({
    from: 'Todo app <onboarding@resend.dev>',
    to: [email],
    subject: 'Verify your email',
    react: EmailTemplate({
      firstName: name || email,
      verificationUrl: `${process.env.AUTH_URL}/auth/verify?token=${generatedToken}`,
    }),
  });
};

const sendPasswordResetEmail = ({
  email,
  name,
  generatedToken,
}: SendPasswordResetEmailDto) => {
  return resend.emails.send({
    from: 'Todo app <onboarding@resend.dev>',
    to: [email],
    subject: 'Reset your password',
    react: PasswordResetEmailTemplate({
      firstName: name || email,
      passwordResetUrl: `${process.env.AUTH_URL}/auth/reset-password?token=${generatedToken}`,
    }),
  });
};

export const mailService = {
  createToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
