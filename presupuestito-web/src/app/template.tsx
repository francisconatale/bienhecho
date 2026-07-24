export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col flex-1 animate-page-in">
      {children}
    </div>
  );
}
