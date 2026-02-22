import Image from "next/image";
import type { VoteWithProfile } from "@/types";
import StarRating from "./StarRating";

type Props = { comments: VoteWithProfile[] };

export default function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 py-8 text-center text-sm text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
        Chưa có bình luận nào.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((v) => (
        <li
          key={v.id}
          className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
        >
          <div className="flex items-start gap-3">
            {v.profiles?.avatar_url ? (
              <Image
                src={v.profiles.avatar_url}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300">
                {(v.profiles?.full_name ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {v.profiles?.full_name ?? "Ẩn danh"}
                </span>
                <StarRating value={v.star} readonly size="sm" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(v.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {v.comment && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {v.comment}
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
