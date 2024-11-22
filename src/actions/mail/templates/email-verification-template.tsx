import { Button } from './components';

interface EmailTemplateProps {
  firstName: string;
  verificationUrl: string;
}

const EmailVerificationTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  verificationUrl,
}) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      padding: 20,
      backgroundColor: '#f4f4f4',
      color: '#333',
    }}
  >
    <h1 style={{ fontSize: 24, color: '#333' }}>Welcome, {firstName}!</h1>
    <p style={{ fontSize: 16 }}>
      Thank you for signing up. Please verify your email address by clicking the
      button below:
    </p>
    <Button href={verificationUrl}>Verify Email</Button>
    <p style={{ fontSize: 14, color: '#777', marginTop: 20 }}>
      If you did not sign up for this account, you can ignore this email.
    </p>
  </div>
);

export default EmailVerificationTemplate;
