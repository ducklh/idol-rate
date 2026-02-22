"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import StarRating from "@/components/StarRating";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoginButton from "@/components/LoginButton";

type Props = { idolId: string };

type VoteRow = { id: string; star: number; comment: string | null };

export default function IdolDetailVoteForm({ idolId }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingVote, setExistingVote] = useState<VoteRow | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u ?? null);
      if (u) {
        const { data: vote } = await supabase
          .from("votes")
          .select("id, star, comment")
          .eq("user_id", u.id)
          .eq("idol_id", idolId)
          .maybeSingle();
        if (vote) {
          setExistingVote(vote as VoteRow);
          setStar((vote as VoteRow).star);
          setComment((vote as VoteRow).comment ?? "");
        }
      }
      setLoading(false);
    };
    init();
  }, [idolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("votes").upsert(
      {
        user_id: user.id,
        idol_id: idolId,
        star,
        comment: comment.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,idol_id" }
    );
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setExistingVote({ id: "", star, comment: comment.trim() || null });
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500">
        <LoadingSpinner className="size-5" />
        <span>Đang tải...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          Đăng nhập để đánh giá và bình luận.
        </p>
        <LoginButton />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Điểm (1–5 sao)
        </label>
        <StarRating value={star} onChange={setStar} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Bình luận (tùy chọn)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
          placeholder="Viết bình luận..."
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner className="size-4 border-[2px]" />
            Đang gửi...
          </span>
        ) : existingVote ? (
          "Cập nhật đánh giá"
        ) : (
          "Gửi đánh giá"
        )}
      </button>
    </form>
  );
}
