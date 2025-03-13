import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { JSX } from "react";
import Navbar from "./Navbar";
import getUserProjects from '@/db/getUserProjects';

export default async function Home():Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  const projects =session? await getUserProjects(session.user.id):[];

  return (
    <div>
      <Navbar/>
      <br />
      {session&&JSON.stringify(session)}
      <br />
      <br />
      <br />
      <br />
      {session&&JSON.stringify(projects)}
      landing page
    </div>
  );
}
