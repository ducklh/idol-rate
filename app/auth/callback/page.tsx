"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (!code) {
      router.replace(next);
      return;
    }

    let cancelled = false;
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error: err }) => {
        if (cancelled) return;
        if (err) {
          setError(err.message);
          return;
        }
        router.replace(next);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-red-600 dark:text-red-400">Lỗi đăng nhập: {error}</p>
        <a href="/" className="text-sm underline">
          Về trang chủ
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner className="text-zinc-500" />
    </div>
  );
}
