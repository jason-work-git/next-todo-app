export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-8 flex flex-col items-center justify-center min-h-dvh">
      {children}
    </main>
  );
}
