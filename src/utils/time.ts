import { differenceInHours, parseISO } from 'date-fns';

export function getHoursUntilExpiry(expiresAtISO: string): number {
  try {
    const expiresAt = parseISO(expiresAtISO);
    const now = new Date();
    return Math.max(0, differenceInHours(expiresAt, now));
  } catch (e) {
    console.error("Invalid date format", e);
    return 0;
  }
}

export function isExpired(expiresAtISO: string): boolean {
  return getHoursUntilExpiry(expiresAtISO) <= 0;
}
