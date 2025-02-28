import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button
        className=" ring-2 ring-primary/40 hover:ring-primary transition w-full flex items-center justify-center gap-4 "
        variant="secondary"
        type="submit"
      >
        <img src="google.svg" className="w-6 h-6 text-red-500"/>
        Signin with Google
      </Button>
    </form>
  );
}
