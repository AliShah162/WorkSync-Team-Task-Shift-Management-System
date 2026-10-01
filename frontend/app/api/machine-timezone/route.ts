import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const offsetMinutes = -now.getTimezoneOffset(); // in minutes
  const offsetHours = offsetMinutes / 60;

  const sign = offsetHours >= 0 ? '+' : '-';
  const abs = Math.abs(offsetHours);
  const hh = String(Math.floor(abs)).padStart(2, '0');
  const mm = String(Math.round((abs % 1) * 60)).padStart(2, '0');
  const utcOffset = `UTC${sign}${hh}:${mm}`;

  return NextResponse.json({
    success: true,
    data: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utcOffset,
      serverTimestamp: now.toISOString(),
    },
  });
}