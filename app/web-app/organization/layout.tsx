export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full">{children}</div>
    </div>
  );
}
