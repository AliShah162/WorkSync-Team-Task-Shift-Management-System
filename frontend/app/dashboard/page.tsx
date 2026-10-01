import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Stats = {
  completedTasks: number;
  activeProjects: number;
  weeklyHours: number;
  recentActivity: { id: number; title: string; status: string }[];
};

async function getStats(token: string): Promise<Stats | null> {
  const res = await fetch('http://localhost:4000/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  const stats = await getStats(token);
  if (!stats) redirect('/login');

  return (
    <main className="p-10">
      <Link href="/" className="text-blue-600">← Back</Link>
      <h1 className="mt-2 text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-gray-500">This page is server-rendered.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <p className="text-2xl font-bold">{stats.completedTasks}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Active Projects</p>
          <p className="text-2xl font-bold">{stats.activeProjects}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Weekly Hours</p>
          <p className="text-2xl font-bold">{stats.weeklyHours}</p>
        </div>
      </div>

      <h2 className="mt-6 font-semibold">Recent Activity</h2>
      <ul className="mt-2 space-y-1">
        {stats.recentActivity.map((t) => (
          <li key={t.id} className="rounded border p-2 text-sm">
            {t.title} — <span className="text-gray-500">{t.status}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}