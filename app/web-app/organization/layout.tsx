import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrganizationLayout({
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
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-full">{children}</div>
    </div>
  );
}
