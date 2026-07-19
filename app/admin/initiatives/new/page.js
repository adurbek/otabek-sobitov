"use client";

import AdminShell from "@/components/AdminShell";
import InitiativeForm from "@/components/InitiativeForm";

export default function NewInitiativePage() {
  return (
    <AdminShell active="/admin/initiatives" title="Yangi tashabbus qo‘shish">
      <InitiativeForm />
    </AdminShell>
  );
}
