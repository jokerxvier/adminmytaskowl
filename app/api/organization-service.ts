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

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/searchOrganization`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    },
  );

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

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/updateOrgAdmin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ org }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function updateUserRoleAdmin(
  email: any,
  role: any,
  orgID: number,
) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/updateUserRoleAdmin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        role: role,
        organization_id: orgID,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function removeUserFromDirectlyFromOrg(
  email: string,
  orgID: number,
) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/removeUserFromDirectlyFromOrg`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        organization_id: orgID,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function updateTask(task: any) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/editTaskAdmin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ task }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function updateProject(project: any) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/updateProjectAdmin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ project }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function updateTeam(team: any) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/updateTeamAdmin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ team }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}

export async function toggleDisableOrg(orgID: number) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/toggleDisableOrgAdmin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ organization_id: orgID }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to fetch org.");
  }

  return await res.json();
}

export async function toggleStatus(
  model: "organization" | "project" | "team" | "task",
  id: number,
  organization_id: number,
): Promise<{ status: string; message: string; new_status: number; data: any }> {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  try {
    const res = await fetch(
      `${GlobalSettings.BASE_URL}super-admin/toggleStatusAdmin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          model_type: model,
          id: id,
          organization_id: organization_id,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();

      throw new Error(
        errorData?.message || `Failed to toggle status (HTTP ${res.status})`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Error in toggleStatus:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to toggle status",
    );
  }
}

export async function addUserToOrg(
  user_id: any,
  organization_id: any,
  role: string,
) {
  const token = getTokenFromCookies();

  if (!token) {
    throw new Error("Unauthorized: No access token found.");
  }

  const res = await fetch(
    `${GlobalSettings.BASE_URL}super-admin/addUserToOrgAdmin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        organization_id: organization_id,
        role: role,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || "Failed to search user.");
  }

  return await res.json();
}
