import ProtectedRoute from "@/components/ProtectedRoute";
import AdminIdolForm from "./AdminIdolForm";
import AdminIdolList from "./AdminIdolList";

export const metadata = {
  title: "Admin - Idol Rate",
  description: "Quản lý idol",
};

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Quản lý Idol
        </h1>
        <AdminIdolForm />
        <AdminIdolList />
      </div>
    </ProtectedRoute>
  );
}
