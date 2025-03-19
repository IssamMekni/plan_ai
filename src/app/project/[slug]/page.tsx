import getProject from "@/db/getProjectById";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { FC } from "react";
import DiagramEditor from "./_components/DiagramEditor";

const page: FC = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const project = await getProject(slug);
  const session = await getServerSession(authOptions);
  if (project?.userId === session?.user.id) {
    return (
    <div>
      {JSON.stringify(project)}
    <DiagramEditor diagram={project.diagrams[0]}  />
    </div>
  );
  } else {
    return <div>404</div>;
  }
};
export default page;
