import Link from "next/link";
import { supabase } from "@/lib/supabase";
import IdolCard from "@/components/IdolCard";
import type { IdolWithStats } from "@/types";

export const revalidate = 60;

async function getIdols(): Promise<IdolWithStats[]> {
  const { data, error } = await supabase
    .from("idols_with_stats")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getIdols error:", error);
    throw new Error("Không thể tải danh sách idol.");
  }
  return (data ?? []) as IdolWithStats[];
}

export default async function HomePage() {
  let idols: IdolWithStats[];
  try {
    idols = await getIdols();
  } catch (e) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
        <p className="text-red-700 dark:text-red-400">
          {(e as Error).message}
        </p>
        <Link href="/" className="mt-2 inline-block text-sm underline">
          Thử lại
        </Link>
      </div>
    );
  }

  if (idols.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-600">
        <p className="text-zinc-600 dark:text-zinc-400">
          Chưa có idol nào. Admin có thể thêm idol mới.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Idol nổi bật
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {idols.map((idol) => (
          <IdolCard key={idol.id} idol={idol} />
        ))}
      </div>
    </div>
  );
}
