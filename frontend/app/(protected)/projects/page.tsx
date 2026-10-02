"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { api } from "../lib/api";
import type { RootState } from "../store";

type Project = {
  id: number;
  title: string;
  description: string;
  status: string;
  deadline: string | null;
};

export default function ProjectsPage() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated); // ← NEW
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (!hydrated) return; //wait for rehydration
    if (!user) {
      router.push("/login");
      return;
    }
    loadProjects();
  }, [user, hydrated, router]); // ← added `hydrated` to deps

  async function loadProjects() {
    try {
      const data = await api.get<Project[]>("/projects");
      setProjects(data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await api.post("/projects", { title, description,deadline: deadline || undefined, });
    setTitle("");
    setDescription("");
    setDeadline('');
    loadProjects();

  }

  async function archiveProject(id: number) {
    await api.patch(`/projects/${id}/archive`);
    loadProjects();
  }
async function deleteProject(id: number) {
  if (!confirm('Delete this project? Tasks and members will also be removed.')) return;
  await api.delete(`/projects/${id}`);
  loadProjects();
}

  if (!hydrated || loading) return <p className="p-10">Loading...</p>; 

  return (
    <main className="p-10">
      <Link href="/" className="text-blue-600">
        ← Back
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Projects</h1>

      {user?.role === "admin" && (
        <form onSubmit={handleCreate} className="mt-4 rounded bg-gray-100 p-4">
          <h2 className="mb-2 font-semibold">Create Project</h2>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2 w-full rounded border p-2"
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2 w-full rounded border p-2"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mb-2 w-full rounded border p-2"
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-white">
            Create
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-xs text-gray-500">
                Status: {p.status} · Deadline:{" "}
                {p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}
              </p>
            </div>
            <div className="space-x-2">
              <Link
                href={`/projects/${p.id}`}
                className="rounded bg-gray-200 px-3 py-1 text-sm"
              >
                View
              </Link>
              {user?.role === "admin" && p.status === "active" && (
                <button
    onClick={() => archiveProject(p.id)}
    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white"
  >
    Archive
  </button>
)}
{user?.role === 'admin' && (
  <button
    onClick={() => deleteProject(p.id)}
    className="rounded bg-red-600 px-3 py-1 text-sm text-white"
  >
    Delete
  </button>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-gray-500">No projects yet.</p>
        )}
      </div>
    </main>
  );
}
