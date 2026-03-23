export default function UnauthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background fixed flex h-full w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}
