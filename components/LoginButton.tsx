"use client";

import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      Đăng nhập với Google
    </button>
  );
}
