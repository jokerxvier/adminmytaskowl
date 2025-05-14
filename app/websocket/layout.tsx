import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WebSocketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesData = await cookies();

  // Check if cookiesData exists
  if (cookiesData) {
    const token = cookiesData.get("access_token")?.value;

    if (!token) {
      return redirect("/login");
    }
  }
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10 px-4 sm:px-8">
      <div className="w-full max-w-2xl text-center justify-center">
        {children}
      </div>
    </section>
  );
}
