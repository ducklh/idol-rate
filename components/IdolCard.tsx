import Link from "next/link";
import Image from "next/image";
import type { IdolWithStats } from "@/types";

type Props = { idol: IdolWithStats };

export default function IdolCard({ idol }: Props) {
  const avg = idol.average_star != null ? Number(idol.average_star).toFixed(1) : "—";
  const votes = idol.total_votes ?? 0;

  return (
    <Link
      href={`/idol/${idol.id}`}
      className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {idol.image_url ? (
          <Image
            src={idol.image_url}
            alt={idol.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-zinc-400 dark:text-zinc-500">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1">
          {idol.name}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-amber-500">★ {avg}</span>
          <span>·</span>
          <span>{votes} đánh giá</span>
        </div>
      </div>
    </Link>
  );
}
