import { EmailTemplate } from '@/components/email-templates/email-verification-template';
import resend from '@/lib/resend';
import prisma from '@/prisma-client';
import { CreateTokenDto, SendVerificationEmailDto } from './types';

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

export const mailService = {
  createToken,
  sendVerificationEmail,
};
