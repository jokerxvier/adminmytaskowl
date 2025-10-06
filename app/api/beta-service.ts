import { GlobalSettings } from "@/common/global.enum";

// Utility to read token from cookies
function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);

  return match ? match[2] : null;
}

export async function registerUserBeta(name:string, email: string, usersCount: number) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/registerUserBeta`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',

      },
      body: JSON.stringify({ 
        name: name,
        email: email,
        user_limit: usersCount,
       }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function getInvitedUsers() {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/getInvitedUsers`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',

      },

    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to retrieve invited users");
  }

  return await res.json();
}