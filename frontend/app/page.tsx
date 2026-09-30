'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../app/lib/api';
import { logout } from '../app/store/authSlice';
import type { RootState } from './store';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // verify token still works
    api.get('/auth/me')
      .then(() => setLoading(false))
      .catch(() => {
        dispatch(logout());
        localStorage.clear();
        router.push('/login');
      });
  }, [user, router, dispatch]);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-blue-600">WorkSync</h1>
      <p className="mt-4">Welcome, {user?.name} ({user?.role})</p>

      <div className="mt-6 space-x-3">
        <a href="/projects" className="rounded bg-blue-600 px-4 py-2 text-white">Projects</a>
        <a href="/tasks" className="rounded bg-blue-600 px-4 py-2 text-white">Tasks</a>
        <a href="/shifts" className="rounded bg-blue-600 px-4 py-2 text-white">Shifts</a>
        <a href="/dashboard" className="rounded bg-blue-600 px-4 py-2 text-white">Dashboard</a>
      </div>

      <button
        onClick={() => {
          dispatch(logout());
          localStorage.clear();
          router.push('/login');
        }}
        className="mt-6 rounded bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </main>
  );
}