import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(process.env.MAIL_TRANSPORT_URL, {
  from: `"Todo App" <noreply@todoapp.com>`,
});

export default transporter;
