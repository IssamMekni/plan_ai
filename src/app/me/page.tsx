'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { CustomSession } from '@/types';
// import {prisma} from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export default function MePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (status === 'loading') return <div>جارٍ التحميل...</div>;
  if (!session) redirect('/auth/signin');

  const customSession = session as CustomSession;
  console.log(session);
  
  // const handleAddProject = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const projectSlug = name.toLowerCase().replace(/\s+/g, '-');
  //   const newProject = await prisma.project.create({
  //     data: {
  //       name,
  //       description,
  //       userId: customSession.user.id,
  //     },
  //   });
  //   setName('');
  //   setDescription('');
  //   router.push(`/project/${projectSlug}`);
  // };
  
  return (
    <div className="container mx-auto p-4">
      <h1>مرحبًا، {customSession.user.name}</h1>
      {/* <form onSubmit={handleAddProject} className="space-y-4"> */}
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم المشروع"
          required
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="الوصف"
        />
        <Button type="submit">إضافة مشروع</Button>
      {/* </form> */}
    </div>
  );
}