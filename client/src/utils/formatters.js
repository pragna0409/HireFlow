import { formatDistanceToNow, format, parseISO } from 'date-fns';

export function formatSalary(min, max, currency = 'USD') {
  if (min == null && max == null) return 'Not disclosed';
  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  if (min != null && max != null) return `${fmt.format(min)} – ${fmt.format(max)}`;
  return fmt.format(min ?? max);
}

export function toDate(val) {
  if (!val) return null;
  try {
    return typeof val === 'string' ? parseISO(val) : new Date(val);
  } catch {
    return null;
  }
}

export function timeAgo(val) {
  const d = toDate(val);
  if (!d || isNaN(d.getTime())) return '';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDate(val, pattern = 'MMM d, yyyy') {
  const d = toDate(val);
  if (!d || isNaN(d.getTime())) return '';
  return format(d, pattern);
}

export function formatDateTime(val) {
  return formatDate(val, "MMM d, yyyy 'at' h:mm a");
}

export function initials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function truncate(str, n = 120) {
  if (!str) return '';
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

export function buildResumeUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
  let origin = window.location.origin;

  try {
    origin = new URL(apiUrl, window.location.origin).origin;
  } catch (err) {
    origin = window.location.origin;
  }

  return `${origin}${url}`;
}
