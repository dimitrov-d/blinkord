import axios from 'axios';

const registryCache: { data: { host: string; state: string }[]; timestamp: number } = {
  data: [],
  timestamp: 0,
};
const cacheDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export async function isTrusted(origin: string): Promise<boolean> {
  if (!origin) return false;
  origin = origin.replace(/^https?:\/\//, '');

  const now = Date.now();
  if (now - registryCache.timestamp < cacheDuration) {
    return registryCache.data.some(
      (entry: { host: string; state: string }) => entry.host === origin && entry.state === 'trusted',
    );
  }

  try {
    const { data } = await axios.get('https://actions-registry.dial.to/all');
    registryCache.data = data.websites.concat(data.actions);
    registryCache.timestamp = now;
  } catch (error) {
    console.error(`Error fetching registry data: ${error}`);
  }

  return registryCache.data.some(
    (entry: { host: string; state: string }) => entry.host === origin && entry.state === 'trusted',
  );
}
