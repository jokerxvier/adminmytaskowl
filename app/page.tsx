import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@heroui/button";
import { FaAngular } from "react-icons/fa";
import { IoLogoElectron } from "react-icons/io5";
import { SiNestjs } from "react-icons/si";
import HetznerMetrics from "@/components/hetzner-metrics";
import { Card } from "@heroui/card";
import PingComponent from "@/components/pinger";
import Link from "next/link";
import SuperAdminDashboard from "@/components/DashboardCount";

export default async function Home() {
  // Await the cookies
  const cookiesData = await cookies();

  // Check if cookiesData exists
  if (cookiesData) {
    const token = cookiesData.get("access_token")?.value;
    if (!token) {
      return redirect("/login");
    } 
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Greeting, Super Admin
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-base sm:text-lg">
          What would you like to work on today?
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center mb-8">
          <Link href="/web-app">
            <Button variant="shadow" className="rounded-full px-6 py-2">
              <FaAngular />
              Web App
            </Button>
          </Link>
          <Link href="/">
            <Button variant="shadow" className="rounded-full px-6 py-2">
                <IoLogoElectron />
                Software
            </Button>
          </Link>
          <Link href="/websocket">
            <Button variant="shadow" className="rounded-full px-6 py-2">
                <SiNestjs />
                Websockets
            </Button> 
          </Link>
      </div>
      <section>
        <Card>
          <HetznerMetrics />
        </Card>
      </section>
      <section>
        <Card className="p-4">
          <PingComponent />
        </Card>
      </section>
      <section>
        <SuperAdminDashboard />
      </section>
    </section>

  );
}
