"use client";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/app/api/auth-service";

export default function LoginPage() {
  // State to handle form errors and loading state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      console.log("Login successful!");
      router.push("/"); // ✅ redirect to homepage
    } catch (err) {
      console.log("ERROR SA LOGIN", err);
      setError("Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 md:py-2 px-4 sm:px-8">
      <Image
        alt="MyTaskOwl Logo"
        className="justify-center"
        src="https://mytaskowl.com/wp-content/uploads/2024/10/taskowl-logo-final-edited-1-300x300.png"
        width={100}
      />
      <h1 className="mb-4 text-3xl sm:text-4xl md:text-3xl font-bold text-center">
        MyTaskOwl Admin Panel
      </h1>
      <div className="w-full max-w-2xl">
        <Card className="w-full">
          <CardHeader className="justify-center">
            <span>Login to your account</span>
          </CardHeader>
          <Divider />
          <CardBody className="p-8">
            <form className="space-y-4 gap-8 h-full" onSubmit={handleSubmit}>
              <Input
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="inside"
                name="email"
                placeholder="Enter your email"
                type="email"
              />
              <Input
                isRequired
                errorMessage="Invalid or Wrong Password"
                label="Password"
                labelPlacement="inside"
                name="password"
                placeholder="Password"
                type="password"
              />
              <Divider />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end w-full">
                <Button
                  color="secondary"
                  disabled={loading}
                  type="submit"
                  variant="shadow"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
