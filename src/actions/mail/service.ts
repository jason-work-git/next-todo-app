import transporter from '@/lib/transporter';
import { render } from '@react-email/components';
import { createElement } from 'react';

import { SendPasswordResetEmailDto, SendVerificationEmailDto } from './types';
import EmailVerificationTemplate from './templates/email-verification-template';
import PasswordResetEmailTemplate from './templates/email-password-reset-template';

const sendVerificationEmail = async ({
  email,
  name,
  generatedToken,
}: SendVerificationEmailDto) => {
  const verificationUrl = `${process.env.AUTH_URL}/auth/verify?token=${generatedToken}`;
  const html = await render(
    createElement(EmailVerificationTemplate, {
      firstName: name || email,
      verificationUrl: verificationUrl,
    }),
  );

  return transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    html,
  });
};

const sendPasswordResetEmail = async ({
  email,
  name,
  generatedToken,
}: SendPasswordResetEmailDto) => {
  const passwordResetUrl = `${process.env.AUTH_URL}/auth/reset-password?token=${generatedToken}`;
  const html = await render(
    createElement(PasswordResetEmailTemplate, {
      firstName: name || email,
      passwordResetUrl,
    }),
  );

  return transporter.sendMail({
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const mailService = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
