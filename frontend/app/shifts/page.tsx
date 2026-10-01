'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { api } from '../app/../lib/api';
import type { RootState } from '../app/../store';

type Shift = {
  id: number;
  clockIn: string;
  clockOut: string | null;
};

export default function ShiftsPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);   // ← NEW

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [active, setActive] = useState<Shift | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hydrated) return;          //wait for rehydration
    if (!user) {
      router.push('/login');
      return;
    }
    loadShifts();
    loadActive();
  }, [user, hydrated, router]);     

  async function loadShifts() {
    const data = await api.get<Shift[]>('/shifts/me');
    setShifts(data);
  }

  async function loadActive() {
    try {
      const data = await api.get<Shift | null>('/shifts/active');
      setActive(data);
    } catch {
      setActive(null);
    }
  }

  async function clockIn() {
    setMessage('');
    try {
      await api.post('/shifts/clock-in');
      loadShifts();
      loadActive();
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
      setMessage(axiosErr.response?.data?.error?.message || 'Failed');
    }
  }

  async function clockOut() {
    setMessage('');
    try {
      const data = await api.post<{ totalHours: number }>('/shifts/clock-out');
      setMessage(`Worked ${data.totalHours} hours`);
      loadShifts();
      loadActive();
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
      setMessage(axiosErr.response?.data?.error?.message || 'Failed');
    }
  }

  if (!hydrated) return <p className="p-10">Loading...</p>;   // ← NEW

  return (
    <main className="p-10">
      <Link href="/" className="text-blue-600">← Back</Link>
      <h1 className="mt-2 text-2xl font-bold">My Shifts</h1>

      {message && <p className="mt-3 rounded bg-yellow-100 p-2 text-sm">{message}</p>}

      <div className="mt-4 flex gap-3">
        <button
          onClick={clockIn}
          disabled={!!active}
          className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Clock In
        </button>
        <button
          onClick={clockOut}
          disabled={!active}
          className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Clock Out
        </button>
      </div>

      {active && (
        <p className="mt-2 text-sm text-green-700">
          Currently clocked in since {new Date(active.clockIn).toLocaleTimeString()}
        </p>
      )}

      <h2 className="mt-6 font-semibold">History</h2>
      <ul className="mt-2 space-y-2">
        {shifts.map((s) => (
          <li key={s.id} className="rounded border p-2 text-sm">
            In: {new Date(s.clockIn).toLocaleString()}
            {' — '}
            Out: {s.clockOut ? new Date(s.clockOut).toLocaleString() : 'active'}
          </li>
        ))}
        {shifts.length === 0 && <p className="text-gray-500">No shifts yet.</p>}
      </ul>
    </main>
  );
}