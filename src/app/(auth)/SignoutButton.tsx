import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
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
