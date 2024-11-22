import { Button } from './components';

interface EmailTemplateProps {
  firstName: string;
  passwordResetUrl: string;
}

const PasswordResetEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  passwordResetUrl,
}) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      padding: 20,
      backgroundColor: '#f4f4f4',
      color: '#333',
    }}
  >
    <h1 style={{ fontSize: 24, color: '#333' }}>Hey, {firstName}!</h1>
    <p style={{ fontSize: 16 }}>
      We received a request to reset your password. If you did not make this
      request, you can ignore this email.
    </p>
    <p style={{ fontSize: 16 }}>
      If you did make this request, click the button below to reset your
      password:
    </p>
    <Button href={passwordResetUrl}>Reset Password</Button>
  </div>
);

export default PasswordResetEmailTemplate;
