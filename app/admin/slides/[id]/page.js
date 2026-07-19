"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import SlideForm from "@/components/SlideForm";

export default function EditSlidePage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`/api/slides/${id}`)
      .then((r) => r.json())
      .then(setItem);
  }, [id]);

  return (
    <AdminShell active="/admin/slides" title="Slaydni tahrirlash">
      {item ? <SlideForm initial={item} itemId={id} /> : <p>Yuklanmoqda...</p>}
    </AdminShell>
  );
}
