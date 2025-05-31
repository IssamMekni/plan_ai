"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { revalidatePath } from "next/cache";

export async function handleSubmit(formData: FormData) {    
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  // const userId = session.user.id; 
  const name = formData.get("project-name") as string;
  const description = formData.get("project-description") as string;
  const projectId = formData.get("project-id") as string;
  const isPublic = formData.get("project-visibility") as string;  
  const imageUrl = formData.get("project-image") as string;
  console.log(`${name} ${description} ${projectId} ${isPublic} ${imageUrl}`)
  
  
  // Save to database
  await prisma.project.update({
    where:{
        id: projectId,
    },
    data: {
      name,
      description,
      isPublic: isPublic === "true",
      imageUrl ,
    },
  });

  revalidatePath("./"); // Refresh the page to show new projects
}
