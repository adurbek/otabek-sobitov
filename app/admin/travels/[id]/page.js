"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import TravelForm from "@/components/TravelForm";

export default function EditTravelPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`/api/travels/${id}`)
      .then((r) => r.json())
      .then(setItem);
  }, [id]);

  return (
    <AdminShell active="/admin/travels" title="Safarni tahrirlash">
      {item ? <TravelForm initial={item} itemId={id} /> : <p>Yuklanmoqda...</p>}
    </AdminShell>
  );
}
