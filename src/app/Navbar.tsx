import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignoutButton from "./(auth)/SignoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

export default async function UserAvatar() {
  const session = await getServerSession(authOptions);
  
  return (
    <div>
      <div className="w-full ">
        <nav className=" pt-2 flex container justify-between m-auto items-center">
          <div>logo</div>
          <ul className=" flex space-x-4  ">
            {!session?.user ? (
              <>
                <li>
                  <Button className="text-white w-20 ">
                    <Link href="/signin">sign in</Link>
                  </Button>
                </li>
              </>
            ) : (
              <SignoutButton />
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
