import { GlobalSettings } from "@/common/global.enum";

// Utility to read token from cookies
function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);
  return match ? match[2] : null;
}

export async function searchOrg(query: string) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/searchOrganization`, {
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


export async function updateOrgAdmin(org: any) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/updateOrgAdmin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ org }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}


export async function updateUserRoleAdmin(email: any, role: any, orgID: number) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/updateUserRoleAdmin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ 
      email: email,
      role: role,
      organization_id: orgID
     }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function removeUserFromDirectlyFromOrg(email: string, orgID: number) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/removeUserFromDirectlyFromOrg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ 
      email:  email,
      organization_id: orgID
     }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function updateTask(task:any) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/editTaskAdmin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ task }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function updateProject(project:any) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/updateProjectAdmin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ project }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function updateTeam(team:any) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/updateTeamAdmin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ team }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

