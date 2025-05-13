import { GlobalSettings } from "@/common/global.enum";

// Utility to extract token from cookies
function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);

  return match ? match[2] : null;
}

async function fetchWithAuth(endpoint: string) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to fetch data.");
  }

  const data = await res.json();

  return data.response;
}

// Service functions
export async function getTotalUsers() {
  return fetchWithAuth("totalUsers");
}

export async function getTotalOrganizations() {
  return fetchWithAuth("totalOrganizations");
}

export async function getTotalScreenshots() {
  return fetchWithAuth("totalScreenshots");
}
export async function totalClockInsToday() {
  return fetchWithAuth("totalClockInsToday");
}

export async function totalNewUsersThisMonth() {
  return fetchWithAuth("totalNewUsersThisMonth");
}
export async function totalNewOrganizationsThisMonth() {
  return fetchWithAuth("totalNewOrganizationsThisMonth");
}
