"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import LoadingSpinner from "./LoadingSpinner";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const resolve = async (userId: string | undefined) => {
      if (!userId) {
        if (!cancelled) setAllowed(false);
        router.replace("/");
        return;
      }
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
        if (cancelled) return;
        if (profileError || (profile as Profile | null)?.role !== "admin") {
          setAllowed(false);
          router.replace("/");
          return;
        }
        setAllowed(true);
      } catch {
        if (!cancelled) setAllowed(false);
        router.replace("/");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return;
        if (event === "INITIAL_SESSION") {
          if (timeoutId) clearTimeout(timeoutId);
          await resolve(session?.user?.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(session.user.id);
      } else {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          setAllowed(false);
          router.replace("/");
        }, 5000);
      }
    });

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [router]);

  if (allowed === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner className="text-zinc-500" />
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
