'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { api } from '../../lib/api';
import type { RootState } from '../../store';

type User = { id: number; name: string; email: string };
type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  creator: User;
  members: User[];
};

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const currentUser = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);   // ← NEW
  const [project, setProject] = useState<Project | null>(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (!hydrated) return;          // ← NEW: wait for rehydration
    if (!currentUser) {
      router.push('/login');
      return;
    }
    loadProject();
  }, [currentUser, hydrated, router, id]);   // ← added `hydrated`

  async function loadProject() {
    try {
      const data = await api.get<Project>(`/projects/${id}`);
      setProject(data);
    } catch {
      router.push('/projects');
    }
  }

  async function addMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await api.post(`/projects/${id}/members`, { userId: Number(userId) });
    setUserId('');
    loadProject();
  }

  async function removeMember(uid: number) {
    await api.delete(`/projects/${id}/members/${uid}`);
    loadProject();
  }

  if (!hydrated) return <p className="p-10">Loading...</p>;   // ← NEW
  if (!project) return <p className="p-10">Loading...</p>;

  return (
    <main className="p-10">
      <Link href="/projects" className="text-blue-600">← Back</Link>
      <h1 className="mt-2 text-2xl font-bold">{project.title}</h1>
      <p className="text-gray-600">{project.description}</p>
      <p className="text-sm text-gray-500">
        Status: {project.status} · Created by: {project.creator?.name}
      </p>

      <h2 className="mt-6 font-semibold">Members</h2>
      <ul className="mt-2 space-y-1">
        {project.members?.map((m) => (
          <li key={m.id} className="flex items-center justify-between rounded border p-2">
            <span>{m.name} ({m.email})</span>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => removeMember(m.id)}
                className="rounded bg-red-500 px-2 py-1 text-xs text-white"
              >
                Remove
              </button>
            )}
          </li>
        ))}
        {project.members?.length === 0 && <p className="text-gray-500">No members yet.</p>}
      </ul>

      {currentUser?.role === 'admin' && (
        <form onSubmit={addMember} className="mt-4 flex gap-2">
          <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="rounded border p-2"
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-white">Add Member</button>
        </form>
      )}
    </main>
  );
}