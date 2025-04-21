// pages/api/websocket-ping.ts
import { NextApiRequest, NextApiResponse } from 'next';
import WebSocket from 'ws';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const wsUrl = 'wss://ws.stage.mytaskowl.com';

  // Create a WebSocket client instance using 'ws' library
  const ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    // When the WebSocket connection opens
    res.status(200).json({ message: 'WebSocket is reachable', status: 'ok' });
    ws.close(); // Close the WebSocket connection after checking
  });

  ws.on('error', (error: any) => {
    // If there is an error with the WebSocket connection
    res.status(500).json({ message: 'WebSocket connection error', status: 'error' });
  });

  ws.on('close', (event: any) => {
    // If the WebSocket connection is closed
    if (event.code !== 1000) { // Check if the WebSocket closed abnormally
      res.status(500).json({ message: 'WebSocket closed unexpectedly', status: 'error' });
    }
  });
}
