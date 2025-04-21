export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10 px-4 sm:px-8">
        <div className="w-full max-w-2xl text-center justify-center">
          {children}
        </div>
      </section>
    );
  }
  