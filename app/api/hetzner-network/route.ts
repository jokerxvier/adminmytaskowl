// /app/api/hetzner/route.ts

import { NextResponse } from "next/server";

import { HetznerMetricsResponse } from "@/types/hetzner-metrics";

export async function GET() {
  try {
    const serverId = process.env.HETZNER_SERVER_ID;
    const apiToken = process.env.HETZNER_API_TOKEN;

    if (!serverId || !apiToken) {
      throw new Error("Server configuration is missing");
    }

    // Get the current date and time
    const now = new Date();

    // Calculate the date and time 24 hours ago
    const past24Hours = new Date(now);

    past24Hours.setHours(now.getHours() - 24);

    // Format the dates in ISO 8601 format
    const start = past24Hours.toISOString();
    const end = now.toISOString();

    // Fetch metrics from Hetzner API
    const response = await fetch(
      `https://api.hetzner.cloud/v1/servers/${serverId}/metrics?start=${start}&end=${end}&type=network`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        `Hetzner API Error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const networkResponse = await fetch(
      `https://api.hetzner.cloud/v1/servers/${serverId}/metrics?start=${start}&end=${end}&type=network`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!networkResponse.ok) {
      const errorData = await networkResponse.json().catch(() => ({}));

      throw new Error(
        `Hetzner API Error: ${networkResponse.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const networkData = await networkResponse.json();

    const data: HetznerMetricsResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching metrics:", error);

    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
