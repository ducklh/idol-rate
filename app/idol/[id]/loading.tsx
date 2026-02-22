import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoadingSpinner className="text-zinc-500" />
    </div>
  );
}
