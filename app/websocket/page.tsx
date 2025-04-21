// pages/websockets.tsx
'use client';
import { useState, useEffect } from 'react';
import { websocketService } from '@/lib/websocketService';  // Import correctly
import { Card } from '@heroui/card';

const WebsocketsPage = () => {
  const [clockInArray, setClockInArray] = useState<any[]>([]);
  const [clockInEntry, setClockInEntry] = useState<any>(null);
  const [clockOutArray, setClockOutArray] = useState<any[]>([]);
  const [clockOutEntry, setClockOutEntry] = useState<any>(null);

  useEffect(() => {
    // Listen to updates for clock-in and clock-out data
    websocketService.socket.on('attendanceBackdoorClockin', (data) => {
      if (data) {
        setClockInArray((prevArray) => [...prevArray, data]);
      }
    });

    websocketService.socket.on('attendanceBackdoorClockinEntry', (data) => {
      setClockInEntry(data);
    });

    websocketService.socket.on('attendanceBackdoorClockOut', (data) => {
      setClockOutArray((prevArray) => [...prevArray, data]);
    });

    websocketService.socket.on('attendanceBackdoorClockOutEntry', (data) => {
      setClockOutEntry(data);
    });

    // Cleanup on component unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const clearArray = () => {
    // // Use the existing websocketService instance
    // websocketService.clearArray();
  };

  return (
    <div>
      <h1>Super Admin Backdoor</h1>
      
      <button className="btn btn-primary" onClick={clearArray}>Clear WS Array</button>
      <Card className="flex flex-row gap-4 p-4">
            {/* Clock In Section */}
            <div className="flex flex-col gap-4 w-1/2">
              <div className="card p-4">
                <h2>Clock In Array</h2>
                {clockInArray.length > 0 ? (
                  clockInArray.map((entry, index) => (
                    <div key={index}>
                      <pre>{JSON.stringify(entry, null, 2)}</pre>
                    </div>
                  ))
                ) : (
                  <span>No clock-in data.</span>
                )}
              </div>

              <div className="card p-4">
                <h2>Clock In Latest Entry</h2>
                <span>{clockInEntry?.payload || 'No latest clock-in entry.'}</span>
              </div>
            </div>

            {/* Clock Out Section */}
            <div className="flex flex-col gap-4 w-1/2">
              <div className="card p-4">
                <h2>Clock Out Array</h2>
                {clockOutArray.length > 0 ? (
                  clockOutArray.map((entry, index) => (
                    <div key={index}>
                      <pre>{JSON.stringify(entry, null, 2)}</pre>
                    </div>
                  ))
                ) : (
                  <span>No clock-out data.</span>
                )}
              </div>

              <div className="card p-4">
                <h2>Clock Out Latest Entry</h2>
                <span>{clockOutEntry?.payload || 'No latest clock-out entry.'}</span>
              </div>
            </div>
          </Card>
        </div>
  );
};

export default WebsocketsPage;
