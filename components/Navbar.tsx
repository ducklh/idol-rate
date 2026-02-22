"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import LoginButton from "./LoginButton";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applySession = (session: { user: User } | null) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .maybeSingle()
          .then(({ data: p }) => setProfile(p ?? null));
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Idol Rate
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Trang chủ
          </Link>
          {user && profile?.role === "admin" && (
            <Link
              href="/admin"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Admin
            </Link>
          )}
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name ?? "Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                    {(profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden text-sm text-zinc-700 dark:text-zinc-300 sm:inline">
                  {profile?.full_name ?? user.email ?? "User"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
}
