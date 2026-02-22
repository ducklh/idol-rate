"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Idol } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminIdolList() {
  const [idols, setIdols] = useState<Idol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchIdols = async () => {
    const { data, error: err } = await supabase
      .from("idols")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
      setIdols([]);
    } else {
      setIdols((data ?? []) as Idol[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIdols();
    const onCreated = () => fetchIdols();
    window.addEventListener("admin-idol-created", onCreated);
    return () => window.removeEventListener("admin-idol-created", onCreated);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa idol này?")) return;
    setDeletingId(id);
    await supabase.from("idols").delete().eq("id", id);
    setDeletingId(null);
    fetchIdols();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner className="text-zinc-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (idols.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Danh sách idol
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">Chưa có idol nào.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Danh sách idol
      </h2>
      <ul className="space-y-4">
        {idols.map((idol) => (
          <li
            key={idol.id}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              {idol.image_url ? (
                <Image
                  src={idol.image_url}
                  alt={idol.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-zinc-400">
                  No img
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {idol.name}
              </p>
              {idol.description && (
                <p className="mt-0.5 line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {idol.description}
                </p>
              )}
            </div>
            <a
              href={`/idol/${idol.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-600 hover:underline dark:text-amber-400"
            >
              Xem
            </a>
            <button
              type="button"
              onClick={() => handleDelete(idol.id)}
              disabled={deletingId === idol.id}
              className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50"
            >
              {deletingId === idol.id ? "Đang xóa..." : "Xóa"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
