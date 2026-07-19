"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import VideoForm from "@/components/VideoForm";

export default function EditVideoPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`/api/videos/${id}`)
      .then((r) => r.json())
      .then(setItem);
  }, [id]);

  return (
    <AdminShell active="/admin/videos" title="Videoni tahrirlash">
      {item ? <VideoForm initial={item} itemId={id} /> : <p>Yuklanmoqda...</p>}
    </AdminShell>
  );
}
