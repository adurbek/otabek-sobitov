"use client";

import AdminShell from "@/components/AdminShell";
import TravelForm from "@/components/TravelForm";

export default function NewTravelPage() {
  return (
    <AdminShell active="/admin/travels" title="Yangi safar qo‘shish">
      <TravelForm />
    </AdminShell>
  );
}
