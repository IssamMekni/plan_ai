import { User, Project as PrismaProject, Diagram } from '@prisma/client';
import { Session } from 'next-auth';

export interface Project extends PrismaProject {
  // author: User;
  diagrams: Diagram[];
  // likes: { id: string }[];
  _count?: {
    // likes: number;
  };
}

export interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
