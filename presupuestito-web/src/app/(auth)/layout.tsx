export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
      </div>
      {children}
    </>
  );
}
