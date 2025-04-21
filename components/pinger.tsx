'use client'
import { cookies } from 'next/dist/server/request/cookies';
import { useState, useEffect } from 'react';

const Pinger = () => {
  const [wsStatus, setWsStatus] = useState<string>('Checking WebSocket...');

  useEffect(() => {
    pingWebSocket();
  }, []);

  const pingWebSocket = async () => {
    try {
      const response = await fetch('/api/websocket-ping');
      const data = await response.json();
      // If the WebSocket responds with status "ok", mark it as reachable
      setWsStatus(data.status === 'ok' ? 'WebSocket is reachable' : 'WebSocket is not reachable');
    } catch (error) {
      setWsStatus('Error pinging WebSocket');
    }
  };

  return (
    <div>
      <h3>WebSocket Status: {wsStatus}</h3>
    </div>
  );
};

export default Pinger;
