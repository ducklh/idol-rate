"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

const BUCKET = "idol-images";

export default function AdminIdolForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!name.trim()) {
      setError("Vui lòng nhập tên idol.");
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });
        if (uploadErr) {
          setError(uploadErr.message);
          setSubmitting(false);
          return;
        }
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
      const { data: { user } } = await supabase.auth.getUser();
      const { error: insertErr } = await supabase.from("idols").insert({
        name: name.trim(),
        description: description.trim() || null,
        image_url: imageUrl,
        created_by: user?.id ?? null,
      });
      if (insertErr) {
        setError(insertErr.message);
        setSubmitting(false);
        return;
      }
      setName("");
      setDescription("");
      setFile(null);
      setSuccess(true);
      window.dispatchEvent(new Event("admin-idol-created"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Thêm idol mới
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Tên *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Tên idol"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Mô tả ngắn"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Ảnh
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-600 file:mr-2 file:rounded file:border-0 file:bg-amber-500 file:px-3 file:py-1 file:text-white dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Đã thêm idol thành công.
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner className="size-4 border-[2px]" />
              Đang lưu...
            </span>
          ) : (
            "Thêm idol"
          )}
        </button>
      </form>
    </section>
  );
}
