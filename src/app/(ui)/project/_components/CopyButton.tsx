"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type CopyProjectButtonProps = {
  projectId: string;
  userId: string;
};

export default function CopyProjectButton({ projectId}: CopyProjectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCopy = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/projects/${projectId}/copy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to copy project"); //  "فشل نسخ المشروع"  -> "Failed to copy project"
      }

      setMessage(`Project copied: ${data.name}`); // `تم نسخ المشروع: ${data.name}` -> `Project copied: ${data.name}`
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleCopy}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Copy ..." : "Copy This"}
      </Button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}