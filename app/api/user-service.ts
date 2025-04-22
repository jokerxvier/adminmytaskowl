import { GlobalSettings } from "@/common/global.enum";

// Utility to read token from cookies
function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);
  return match ? match[2] : null;
}

export async function searchUser(query: string) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/searchUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}


