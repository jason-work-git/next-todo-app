export const Button = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      style={{
        cursor: 'pointer',
        display: 'inline-block',
        padding: '0.5rem 1rem',
        marginTop: '0.5rem',
        color: '#fff',
        backgroundColor: '#e11d48',
        textDecoration: 'none',
        borderRadius: '0.75rem',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
      }}
    >
      {children}
    </a>
  );
};
