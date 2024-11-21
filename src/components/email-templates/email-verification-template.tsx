interface EmailTemplateProps {
  firstName: string;
  verificationUrl: string;
}

// tailwind doesn't work
// TODO: style it later
// maybe using react-email library to use tailwind and etc. but it isnt too important
export const EmailVerificationTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ firstName, verificationUrl }) => (
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
    <a
      href={verificationUrl}
      style={{
        display: 'inline-block',
        padding: '10px 20px',
        marginTop: 10,
        color: '#fff',
        backgroundColor: '#007bff',
        textDecoration: 'none',
        borderRadius: 5,
      }}
    >
      Verify Email
    </a>
    <p style={{ fontSize: 14, color: '#777', marginTop: 20 }}>
      If you did not sign up for this account, you can ignore this email.
    </p>
  </div>
);
