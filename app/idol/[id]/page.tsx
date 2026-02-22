import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { IdolWithStats, VoteWithProfile } from "@/types";
import StarRating from "@/components/StarRating";
import CommentList from "@/components/CommentList";
import IdolDetailVoteForm from "./IdolDetailVoteForm";

type Props = { params: Promise<{ id: string }> };

async function getIdol(id: string): Promise<IdolWithStats | null> {
  const { data, error } = await supabase
    .from("idols_with_stats")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as IdolWithStats;
}

async function getVotes(idolId: string): Promise<VoteWithProfile[]> {
  const { data, error } = await supabase
    .from("votes")
    .select(
      `
      id, user_id, idol_id, star, comment, created_at, updated_at,
      profiles ( full_name, avatar_url )
    `
    )
    .eq("idol_id", idolId)
    .order("created_at", { ascending: false });
  if (error) return [];
  const raw = (data ?? []) as unknown[];
  return raw.map((v) => {
    const row = v as Record<string, unknown>;
    const profiles = row.profiles;
    const normalized =
      profiles && !Array.isArray(profiles) && typeof profiles === "object"
        ? (profiles as { full_name: string | null; avatar_url: string | null })
        : null;
    return { ...row, profiles: normalized } as VoteWithProfile;
  });
}

export default async function IdolDetailPage({ params }: Props) {
  const { id } = await params;
  const [idol, votes] = await Promise.all([getIdol(id), getVotes(id)]);

  if (!idol) notFound();

  const avg = idol.average_star != null ? Number(idol.average_star).toFixed(1) : "—";
  const totalVotes = idol.total_votes ?? 0;

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-block text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Trang chủ
      </Link>

      <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 p-6 sm:flex-row">
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:h-72 sm:w-80 dark:bg-zinc-800">
            {idol.image_url ? (
              <Image
                src={idol.image_url}
                alt={idol.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
                priority
              />
            ) : (
              <div className="flex size-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                No image
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {idol.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <StarRating value={Math.round(Number(avg)) || 0} readonly size="md" />
              <span className="font-medium text-amber-500">{avg}</span>
              <span>·</span>
              <span>{totalVotes} đánh giá</span>
            </div>
            {idol.description && (
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                {idol.description}
              </p>
            )}
          </div>
        </div>
      </article>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Đánh giá của bạn
        </h2>
        <IdolDetailVoteForm idolId={idol.id} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Bình luận
        </h2>
        <CommentList comments={votes} />
      </section>
    </div>
  );
}
