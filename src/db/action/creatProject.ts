"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { revalidatePath } from "next/cache";

export async function handleSubmit(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = session.user.id; 
  const name = formData.get("project-name") as string;
  const description = formData.get("description") as string;
  console.log(formData);
  
  // Save to database
  await prisma.project.create({
    data: {
      name,
      description,
      userId, // Associate project with the logged-in user
    },
  });

  revalidatePath("/me"); // Refresh the page to show new projects
}
