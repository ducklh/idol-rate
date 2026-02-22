import Link from "next/link";

export default function IdolNotFound() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Không tìm thấy idol
      </h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Idol này không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-sm font-medium text-amber-600 hover:underline dark:text-amber-400"
      >
        ← Về trang chủ
      </Link>
    </div>
  );
}
