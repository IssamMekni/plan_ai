import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { JSX } from "react";
import Navbar from "./Navbar";

export default async function Home():Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  
  return (
    <div>
      <Navbar/>
      <br />
      {session&&JSON.stringify(session)}
      landing page
    </div>
  );
}
