export function formatTime(value) {
  if (!value) return null;
  // ISO 8601 duration (e.g. PT30M, PT1H30M) from schema.org
  const iso = String(value).match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (iso) {
    const h = parseInt(iso[1] || 0, 10);
    const m = parseInt(iso[2] || 0, 10);
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    if (m) return `${m}m`;
  }
  // Plain minutes integer
  const num = parseInt(value, 10);
  if (!isNaN(num)) {
    if (num < 60) return `${num}m`;
    const h = Math.floor(num / 60);
    const m = num % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return value;
}
