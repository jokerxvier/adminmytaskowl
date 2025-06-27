import router from "next/router";

import { GlobalSettings } from "@/common/global.enum";
function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);

  return match ? match[2] : null;
}
export async function countDuplicates() {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/countDuplicates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function cleanupDuplicates() {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/cleanupDuplicates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function deleteDuplicatesFromDB() {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/deleteDuplicatesFromDB`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}


