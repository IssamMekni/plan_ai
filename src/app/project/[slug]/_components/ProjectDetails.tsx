'use client';

import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  description?: string | null;
  imageUrl: string;
  isPublic: boolean;
  user: { name: string; id: string };
  diagrams: { id: string; name: string; code: string }[];
  createdAt: string;
}

interface Props {
  project: Project;
  onCopy: () => void;
}

export default function ProjectDetails({ project, onCopy }: Props) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-4">
      المشروع: {project.name}
      </h1>
      <p>المؤلف: {project.user.name}</p>
      <p>التاريخ: {new Date(project.createdAt).toLocaleDateString()}</p>
      <Button onClick={onCopy} className="mt-2">
      </Button>
    </div>
  );
}