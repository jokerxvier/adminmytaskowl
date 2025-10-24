import { GlobalSettings } from "@/common/global.enum";

function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);

  return match ? match[2] : null;
}


export async function getAnnouncements() {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}getAnnouncement`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },  
      body: JSON.stringify({'isAdmin': true}),

    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to fetch data.");
  }

  const data = await res.json();

  return data.response;
}

export async function createAnnouncement(
  title: string,
  description: string,
  imageFile?: File,
  expiryDate?: string,
  redirect_url?: string
) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  // Use FormData for file + text fields
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", description);
  formData.append("created_by", "1"); // must be string
  if (expiryDate) formData.append("expires_at", expiryDate);
  if (imageFile) formData.append("image_url", imageFile); // must match backend key name
  if (redirect_url) formData.append("redirect_url", redirect_url);
  const res = await fetch(`${GlobalSettings.BASE_URL}createAnnouncement`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      // ⚠️ DO NOT manually set "Content-Type" here — browser will auto-set it with correct boundary
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to create announcement.");
  }

  const data = await res.json();
  return data.response;
}

export async function updateAnnouncement(id: number){
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}updateAnnouncement/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to update announcement.");
  }

  const data = await res.json();
  return data.response;
}
