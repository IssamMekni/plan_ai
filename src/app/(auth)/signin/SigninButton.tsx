"use client"
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignIn() {

  return (

      <Button
        className=" ring-2 ring-primary/40 hover:ring-primary transition w-full flex items-center justify-center gap-4 "
        variant="secondary"
        onClick={() => signIn("google")}
      >
        <img src="google.svg" className="w-6 h-6 text-red-500"/>
        Signin with Google
      </Button>
  );
}
