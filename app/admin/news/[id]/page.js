"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import NewsForm from "@/components/NewsForm";

export default function EditNewsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then((r) => r.json())
      .then(setItem);
  }, [id]);

  return (
    <AdminShell active="/admin/news" title="Voqeani tahrirlash">
      {item ? <NewsForm initial={item} newsId={id} /> : <p>Yuklanmoqda...</p>}
    </AdminShell>
  );
}
