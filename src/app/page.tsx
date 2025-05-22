import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { JSX } from "react";
import Navbar from "./Navbar";
import getUserProjects from "@/db/getUserProjects";

export default async function Home(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  const projects = session ? await getUserProjects(session.user.id) : [];
  
  return (
    <div>
      <Navbar />
      <img src="https://www.svgrepo.com/show/230754/placeholder-pin.svg" width={100} height={100} alt="" />
      <br />
      {/* {session&&JSON.stringify(session)}
       */}
       {/* <img src={session.user.image} alt="Uploaded image" /> */}
      <br />
      <br />
      <br />
      <br />
      {/* {session&&JSON.stringify(projects)} */}
      landing page
    </div>
  );
}
