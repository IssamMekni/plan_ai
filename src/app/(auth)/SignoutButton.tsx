"use client";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOut({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        await signOut();
      }}
    >
      <Button
        className={" ring-2 ring-primary/40 hover:ring-primary transition w-full " + className}
        variant="secondary"
        type="submit"
      >
        <LogOutIcon />
        Sign Out
      </Button>
    </form>
  );
}
