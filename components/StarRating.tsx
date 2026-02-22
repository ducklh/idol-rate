"use client";

import { useState } from "react";

type Props = {
  value: number;
  onChange?: (star: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
};

const sizeClass = { sm: "text-lg", md: "text-2xl" };

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  const s = sizeClass[size];

  return (
    <div className="flex gap-0.5" role={readonly ? "img" : "slider"} aria-label={`Đánh giá ${value} sao`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(null)}
          onClick={() => !readonly && onChange?.(star)}
          className={`${s} transition transform hover:scale-110 ${readonly ? "cursor-default" : "cursor-pointer"}`}
          aria-pressed={value === star}
        >
          <span
            className={
              star <= display
                ? "text-amber-400"
                : "text-zinc-300 dark:text-zinc-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
