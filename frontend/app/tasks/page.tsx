'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { api } from '../app/../lib/api';
import type { RootState } from '../app/../store';

type Task = {
  id: number;
  title: string;
  status: string;
  dueDate: string | null;
  assignedUser?: { id: number; name: string };
  project?: { id: number; title: string };
};

export default function TasksPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);   // ← NEW

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // create form
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');

  useEffect(() => {
    if (!hydrated) return;          // ← NEW: wait for rehydration
    if (!user) {
      router.push('/login');
      return;
    }
    loadTasks();
  }, [user, hydrated, router, status, sortBy, order, page]);   // ← added `hydrated`

  async function loadTasks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      params.set('sortBy', sortBy);
      params.set('order', order);
      params.set('page', String(page));
      params.set('limit', '5');

      const data = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.items);
      setTotalPages(data.totalPages);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await api.post('/tasks', {
      title,
      projectId: Number(projectId),
      assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
    });
    setTitle('');
    setProjectId('');
    setAssignedUserId('');
    setPage(1);
    loadTasks();
  }

  if (!hydrated) return <p className="p-10">Loading...</p>;   // ← NEW

  return (
    <main className="p-10">
      <Link href="/" className="text-blue-600">← Back</Link>
      <h1 className="mt-2 text-2xl font-bold">Tasks</h1>

      {/* Create form */}
      {user?.role === 'admin' && (

      <form onSubmit={handleCreate} className="mt-4 rounded bg-gray-100 p-4">
        <h2 className="mb-2 font-semibold">Create Task</h2>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="mb-2 w-full rounded border p-2" />
        <input placeholder="Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)}
          className="mb-2 w-full rounded border p-2" />
        <input placeholder="Assign to User ID (optional)" value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
          className="mb-2 w-full rounded border p-2" />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">Create</button>
      </form>
      )}

      {/* Filters */}
      <div className="mt-6 flex gap-2">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded border p-2">
          <option value="">All statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded border p-2">
          <option value="createdAt">Sort: Created</option>
          <option value="dueDate">Sort: Due date</option>
          <option value="updatedAt">Sort: Updated</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)} className="rounded border p-2">
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-gray-600">
                  {t.project?.title} · {t.assignedUser?.name || 'Unassigned'}
                </p>
                <p className="text-xs text-gray-500">Status: {t.status}</p>
              </div>
              <Link href={`/tasks/${t.id}`} className="rounded bg-gray-200 px-3 py-1 text-sm">
                View
              </Link>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-gray-500">No tasks found.</p>}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50">Prev</button>
        <span>Page {page} of {totalPages || 1}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50">Next</button>
      </div>
    </main>
  );
}