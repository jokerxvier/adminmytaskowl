import { GlobalSettings } from "@/common/global.enum";
import router from "next/router";
import { NextResponse } from "next/server";
  
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

  export async function logout() {
    // Clear the access_token cookie by setting max-age to 0
    document.cookie = "access_token=; path=/; max-age=0";
    
    // Optionally: redirect the user or return a response
    router.push("/login");
    return { success: true };
  }