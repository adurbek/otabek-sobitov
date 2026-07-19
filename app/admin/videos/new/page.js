"use client";

import AdminShell from "@/components/AdminShell";
import VideoForm from "@/components/VideoForm";

export default function NewVideoPage() {
  return (
    <AdminShell active="/admin/videos" title="Yangi video qo‘shish">
      <VideoForm />
    </AdminShell>
  );
}
