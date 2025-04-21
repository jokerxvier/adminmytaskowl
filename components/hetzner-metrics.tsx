// /components/HetznerMetrics.tsx
'use client';
import { useEffect, useState } from 'react';
import { Progress } from '@heroui/progress';
// --- Interfaces matching the actual API response structure ---
interface TimeSeriesValue {
  // An array where each element is a tuple: [timestamp (number), value (string)]
  values: Array<[number, string]>;
}

interface TimeSeriesData {
  cpu: TimeSeriesValue;
  // You might have other metrics here too, like memory, disk, network
  // e.g., memory?: TimeSeriesValue;
}

// Interface for the relevant part of the state we want to keep
interface ProcessedMetrics {
  latestCpu: number | null;
}
// ------------------------------------------------------------

const HetznerMetricsComponent = () => {
  // State to hold the processed metric we care about
  const [metrics, setMetrics] = useState<ProcessedMetrics | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true); // Start loading
      setError(''); // Reset error on new fetch
      try {
        const response = await fetch('/api/hetzner');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch metrics: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Explicitly type the expected raw API structure
        const rawData: { metrics: { time_series: TimeSeriesData } } = await response.json();

        // --- Data Extraction and Processing ---
        let latestCpuValue: number | null = null;

        // Safely access the nested data
        if (
            rawData &&
            rawData.metrics &&
            rawData.metrics.time_series &&
            rawData.metrics.time_series.cpu &&
            Array.isArray(rawData.metrics.time_series.cpu.values) &&
            rawData.metrics.time_series.cpu.values.length > 0
           ) {
          // Get the last entry in the 'values' array (assuming it's the latest)
          const cpuValues = rawData.metrics.time_series.cpu.values;
          const latestEntry = cpuValues[cpuValues.length - 1];

          // The value is the second element in the entry array, and it's a string
          if (latestEntry && typeof latestEntry[1] === 'string') {
             // Parse the string value into a number
             latestCpuValue = parseFloat(latestEntry[1]);
             // Handle cases where parsing might fail (though parseFloat is quite robust)
             if (isNaN(latestCpuValue)) {
                latestCpuValue = null; // Set to null if parsing results in NaN
                console.warn("Could not parse CPU value:", latestEntry[1]);
             }
          }
        } else {
            console.warn("CPU data structure unexpected or empty:", rawData);
        }

        setMetrics({ latestCpu: latestCpuValue });
        // --------------------------------------

      } catch (error) {
        console.error("Error fetching or processing metrics:", error);
        setError('Error fetching metrics: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setMetrics(null); // Clear metrics on error
      } finally {
         setIsLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchMetrics();
  }, []); // Empty dependency array means this runs once on mount

  // --- Rendering Logic ---
  if (isLoading) {
    return <div>Loading CPU metric...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // Check if metrics loaded and latestCpu has a valid number
  const cpuValue = metrics?.latestCpu;
  const displayValue = typeof cpuValue === 'number'
    ? cpuValue.toFixed(2) // Format to 2 decimal places
    : 'N/A'; // Display N/A if data is missing or invalid

  return (
    <div className="p-4 shadow-md rounded-lg">
      <h3 className="mb-4">Hetzner CPU Metric</h3>
      <ul>
        {/* Display only the latest CPU usage */}
        <li>CPU Usage: {displayValue}%</li>
        <Progress aria-label="Loading..." className="max-w-md" value={parseFloat(displayValue)} />
      </ul>
       {typeof cpuValue !== 'number' && !error && !isLoading && (
          <p style={{fontSize: '0.8em', color: 'orange'}}>Could not retrieve CPU value.</p>
       )}
    </div>
  );
};

export default HetznerMetricsComponent;