import { GlobalSettings } from "@/common/global.enum";

function getTokenFromCookies(): string | null {
    const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);
    return match ? match[2] : null;
  }
  
 export async function searchScreenshotOrg(query: string) {
   const token = getTokenFromCookies();
 
   if (!token) {
     throw new Error("Unauthorized: No access token found.");
   }
 
   const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/searchOrgScreenshot`, {
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

 export async function selectOrgSS(organizationID: number) {
    const token = getTokenFromCookies();
  
    if (!token) {
      throw new Error("Unauthorized: No access token found.");
    }
  
    const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/selectedOrgSS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ organization_id: organizationID }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to search user.");
    }
  
    return await res.json();
  }

  export async function getScreenshots(organizationID: number, userID: number, date: any) {
    const token = getTokenFromCookies();
  
    if (!token) {
      throw new Error("Unauthorized: No access token found.");
    }
  
    const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/getUserScreenshotsAdmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: JSON.stringify({ 
        organization_id: organizationID,
        user_id: userID,
        date: date
    }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to search user.");
    }
  
    return await res.json();
  }

  export async function toggleDisableScreenshot(screenshot_id: number) {
    const token = getTokenFromCookies();
  
    if (!token) {
      throw new Error("Unauthorized: No access token found.");
    }
  
    const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/toggleDisableScreenshot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'accept': 'application/json'
      },
      body: JSON.stringify({screenshot_id: screenshot_id,}),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to search user.");
    }
  
    return await res.json();
  }


  



  