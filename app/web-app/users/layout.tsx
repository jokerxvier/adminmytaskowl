import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

interface UsersLayoutProps {
  children: React.ReactNode;
}

const UsersLayout: React.FC<UsersLayoutProps> = async ({ children }) => {
  const cookiesData = await cookies();

  // Check if cookiesData exists
  if (cookiesData) {
    const token = cookiesData.get("access_token")?.value;

    if (!token) {
      return redirect("/login");
    }
  }
  return (
    <div className="flex flex-col w-full h-full p-8">
      <main>{children}</main>
    </div>
  );
};

export default UsersLayout;
