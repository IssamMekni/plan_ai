'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadButton({projectId}:{projectId:string}) {
  const handleDownload = () => {
    window.open(`/api/projects/${projectId}/download-images`,"_blank");
  };

  return (
    <Button onClick={handleDownload} size={"default"}>
      Download <Download/>
    </Button>
  );
}
