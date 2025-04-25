import { GlobalSettings } from "@/common/global.enum";
import router from "next/router";
import { NextResponse } from "next/server";

function getTokenFromCookies(): string | null {
  const match = document.cookie.match(/(^|;) ?access_token=([^;]*)(;|$)/);
  return match ? match[2] : null;
}

export async function login(email: string, password: string) {
    const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (res.ok) {
        const data = await res.json();
        // Set the token as a cookie in the browser
        const token = data.authorisation.token;
        // Set the token in a cookie, with HttpOnly and Secure flags if needed
        document.cookie = `access_token=${token}; path=/; max-age=3600`;  // Set cookie for 1 hour
    
        return { success: true };
      }
  
    const errorData = await res.json();
    throw new Error(errorData?.message || "Login failed");
  }

  export async function verifyPassword(password:string){
  const token = getTokenFromCookies();

    if (!token) {
      throw new Error("Unauthorized: No access token found.");
    }

    const res = await fetch(`${GlobalSettings.BASE_URL}super-admin/verifyPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.message || "Failed to search user.");
    }

    return await res.json();
  }

  export async function logout() {
    // Clear the access_token cookie by setting max-age to 0
    document.cookie = "access_token=; path=/; max-age=0";
    
    // Optionally: redirect the user or return a response
    router.push("/login");
    return { success: true };
  }