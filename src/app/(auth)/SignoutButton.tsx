"use client"
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <form
      action={async () => {
        await signOut();
      }}
    >
      <Button
        className="w-20 ring-2 ring-primary/40 hover:ring-primary transition "
        variant="secondary"
        type="submit"
      >
        Sign Out
      </Button>
    </form>
  );
}
