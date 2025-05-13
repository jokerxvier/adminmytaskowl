export default function screenshotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 py-4 md:py-10 px-4 sm:px-8">
      <div className="w-full max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
