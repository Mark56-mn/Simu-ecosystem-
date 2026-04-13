export const syncTime = async (): Promise<number> => {
  try {
    const start = Date.now();
    const response = await fetch('/api/time-sync');
    const { serverTime } = await response.json();
    const end = Date.now();
    
    // Calculate round trip time to get a more accurate server time
    const rtt = end - start;
    const estimatedServerTime = serverTime + (rtt / 2);
    
    // Calculate offset (how far ahead/behind the local clock is)
    const offset = estimatedServerTime - end;
    
    // Store in local storage (in a real React Native app, use AsyncStorage or SQLite)
    localStorage.setItem('simu_clock_offset', offset.toString());
    
    return offset;
  } catch (error) {
    console.warn('Failed to sync time, falling back to local clock', error);
    return 0;
  }
};

export const getAdjustedTime = (): number => {
  const storedOffset = localStorage.getItem('simu_clock_offset');
  const offset = storedOffset ? parseInt(storedOffset, 10) : 0;
  return Date.now() + offset;
};

// 15 seconds buffer for low-end devices with severe clock drift
export const CLOCK_DRIFT_BUFFER_MS = 15000;
