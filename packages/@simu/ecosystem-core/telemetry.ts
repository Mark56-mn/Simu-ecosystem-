export interface TelemetryEvent {
  id: string;
  type: 'crash' | 'error' | 'usage';
  appId: string;
  version: string;
  deviceFingerprint: string;
  data: any;
  timestamp: number;
}

export const reportEvent = async (type: TelemetryEvent['type'], appId: string, version: string, data: any) => {
  const event: TelemetryEvent = {
    id: crypto.randomUUID(),
    type,
    appId,
    version,
    deviceFingerprint: localStorage.getItem('simu_fingerprint') || 'unknown',
    data,
    timestamp: Date.now()
  };
  
  // In a real app, this would send to Supabase
  console.log('[Telemetry]', event);
  
  // Store locally for Admin Dashboard mock
  const existing = JSON.parse(localStorage.getItem('telemetry_events') || '[]');
  localStorage.setItem('telemetry_events', JSON.stringify([event, ...existing].slice(0, 100)));
};
