// types/hetzner-metrics.ts
export interface HetznerMetricData {
  time_series: {
    [metricName: string]: {
      values: Array<[number, string]>;
    };
  };
}

export interface HetznerMetricsResponse {
  metrics: HetznerMetricData;
}