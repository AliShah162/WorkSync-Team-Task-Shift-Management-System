'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { api } from '../app/../../lib/api';
import type { RootState } from '../app/../../store';

type Comment = {
  id: number;
  body: string;
  user?: { id: number; name: string };
};
type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedUser?: { id: number; name: string };
  project?: { id: number; title: string };
  comments: Comment[];
};

export default function TaskDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);   // ← NEW

  const [task, setTask] = useState<Task | null>(null);
  const [commentBody, setCommentBody] = useState('');

  useEffect(() => {
    if (!hydrated) return;          // ← NEW: wait for rehydration
    if (!user) {
      router.push('/login');
      return;
    }
    loadTask();
  }, [user, hydrated, router, id]);   // ← added `hydrated`

  async function loadTask() {
    try {
      const data = await api.get<Task>(`/tasks/${id}`);
      setTask(data);
    } catch {
      router.push('/tasks');
    }
  }

  async function updateStatus(status: string) {
    await api.patch(`/tasks/${id}`, { status });
    loadTask();
  }

  async function addComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await api.post(`/tasks/${id}/comments`, { body: commentBody });
    setCommentBody('');
    loadTask();
  }

  if (!hydrated) return <p className="p-10">Loading...</p>;   // ← NEW
  if (!task) return <p className="p-10">Loading...</p>;

  return (
    <main className="p-10">
      <Link href="/tasks" className="text-blue-600">← Back</Link>
      <h1 className="mt-2 text-2xl font-bold">{task.title}</h1>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm text-gray-500">
        {task.project?.title} · Assigned to {task.assignedUser?.name || 'Unassigned'}
      </p>

      {/* Status change */}
      <div className="mt-4 flex gap-2">
        {['TODO', 'IN_PROGRESS', 'COMPLETED'].map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            className={`rounded px-3 py-1 text-sm ${
              task.status === s ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Comments */}
      <h2 className="mt-6 font-semibold">Comments</h2>
      <ul className="mt-2 space-y-2">
        {task.comments?.map((c) => (
          <li key={c.id} className="rounded border p-2">
            <p className="text-sm font-medium">{c.user?.name}</p>
            <p>{c.body}</p>
          </li>
        ))}
        {task.comments?.length === 0 && <p className="text-gray-500">No comments yet.</p>}
      </ul>

      <form onSubmit={addComment} className="mt-4 flex gap-2">
        <input
          placeholder="Write a comment..."
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          className="flex-1 rounded border p-2"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">Post</button>
      </form>
    </main>
  );
}