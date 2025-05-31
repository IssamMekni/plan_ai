import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { JSX } from "react";
import Navbar from "./Navbar";
import { redirect } from "next/navigation";
import DiagramAILanding from "./Linding";

export default async function Home(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (session) redirect("/home");
  return (
    <div>
      {/* <Navbar /> */}
      <DiagramAILanding/>
    </div>
  );
}
