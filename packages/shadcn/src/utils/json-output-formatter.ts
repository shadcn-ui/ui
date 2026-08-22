export function formatCliJson(status: string, data: Record<string, any>) {
  return JSON.stringify({ status, timestamp: new Date().toISOString(), ...data }, null, 2);
}
