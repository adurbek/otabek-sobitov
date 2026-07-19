"use client";

import AdminShell from "@/components/AdminShell";
import SlideForm from "@/components/SlideForm";

export default function NewSlidePage() {
  return (
    <AdminShell active="/admin/slides" title="Yangi slayd qo‘shish">
      <SlideForm />
    </AdminShell>
  );
}
