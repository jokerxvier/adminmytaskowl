import { GlobalSettings } from "@/common/global.enum";
import { NextResponse } from "next/server";

function getTokenFromCookies(): string | null {
    const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);
    return match ? match[2] : null;
  }
  
  export async function getAttendance(date: any, orgID: number) {
    const token = getTokenFromCookies();
  
    if (!token) {
      throw new Error("Unauthorized: No access token found.");
    }
  
    const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/getAttendanceAdmin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",

      },      
      body: JSON.stringify({
        date: date, 
        organization_id: orgID 
    }),
    

    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to fetch data.");
    }
  
    const data = await res.json();
    return data.response; 
  }