// /api/hetzner.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { HetznerMetricsResponse } from '@/types/hetzner-metrics';

export default async function hetznerMetrics(
    req: NextApiRequest,
    res: NextApiResponse<HetznerMetricsResponse | { error: string }>
) {
    try {
        // Validate environment variables
        const serverId = process.env.HETZNER_SERVER_ID;
        const apiToken = process.env.HETZNER_API_TOKEN;
        
        if (!serverId || !apiToken) {
            throw new Error('Server configuration is missing');
        }

        // Fetch metrics from Hetzner API
        const response = await fetch(
            `https://api.hetzner.cloud/v1/servers/${serverId}/metrics?type=cpu,memory,network,disk`,
            {
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `Hetzner API Error: ${response.status} - ${JSON.stringify(errorData)}`
            );
        }

        const data: HetznerMetricsResponse = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            error: 'Failed to fetch metrics',
        });
    }
}
