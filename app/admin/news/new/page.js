"use client";

import AdminShell from "@/components/AdminShell";
import NewsForm from "@/components/NewsForm";

export default function NewNewsPage() {
  return (
    <AdminShell active="/admin/news" title="Yangi voqea qo‘shish">
      <NewsForm />
    </AdminShell>
  );
}
