"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import InitiativeForm from "@/components/InitiativeForm";

export default function EditInitiativePage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`/api/initiatives/${id}`)
      .then((r) => r.json())
      .then(setItem);
  }, [id]);

  return (
    <AdminShell active="/admin/initiatives" title="Tashabbusni tahrirlash">
      {item ? <InitiativeForm initial={item} itemId={id} /> : <p>Yuklanmoqda...</p>}
    </AdminShell>
  );
}
