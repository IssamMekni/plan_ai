import { JSX } from "react";
import Navbar from "./Navbar";
import { auth } from "@/auth";

export default async function Home():Promise<JSX.Element> {
  const session = await auth();
  return (
    <div>
      <Navbar/>
      <br />
      {JSON.stringify(session)}
      landing page
    </div>
  );
}
