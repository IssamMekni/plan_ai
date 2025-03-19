'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CustomSession } from '@/types';
import ProjectDetails from '../_components/ProjectDetails';
import DiagramEditor from '../_components/DiagramEditor';
import DiagramPagination from '../_components/DiagramPagination';
// import AIAssistant from '../_components/AIAssistant';

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

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
//   const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [currentDiagram, setCurrentDiagram] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`/api/projects/${slug}`);
      const data = await response.json();
      if (response.ok) {
        setProject({
          ...data,
          createdAt: new Date(data.createdAt).toISOString(),
          diagrams: data.diagrams.map((d: any) => ({
            ...d,
            code: d.code || '',
          })),
        });
      }
    };
    fetchProject();
  }, [slug]);

  if (status === 'loading') return <div>جارٍ التحميل...</div>;
  if (!project) return <div>المشروع غير موجود</div>;

  const customSession = session as CustomSession | null;
  const userId = customSession?.user?.id;

  const handleCopyProject = async () => {
    if (!userId) {
      router.push('/auth/signin');
      return;
    }
    const response = await fetch('/api/projects/copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id, userId }),
    });
    if (response.ok) router.push('/me');
  };

  return (
    <div className="container mx-auto p-4">
      <ProjectDetails project={project} onCopy={handleCopyProject} />
      {project.diagrams.length > 0 ? (
        <>
          <DiagramEditor
            diagram={project.diagrams[currentDiagram]}
            onCodeChange={(code) => {
              const updatedProject = { ...project };
              updatedProject.diagrams[currentDiagram].code = code;
              setProject(updatedProject);
            }}
            onSave={async (code) => {
              await fetch('/api/diagrams', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: project.diagrams[currentDiagram].id,
                  code,
                }),
              });
            }}
          />
          <DiagramPagination
            currentDiagram={currentDiagram}
            totalDiagrams={project.diagrams.length}
            onPageChange={setCurrentDiagram}
          />
          {/* <AIAssistant
            onGenerate={(code) => {
              const updatedProject = { ...project };
              updatedProject.diagrams[currentDiagram].code = code;
              setProject(updatedProject);
            }}
          /> */}
        </>
      ) : (
        <div>لا توجد رسوم تخطيطية بعد. استخدم مساعد AI لإنشاء واحد.</div>
      )}
    </div>
  );
}