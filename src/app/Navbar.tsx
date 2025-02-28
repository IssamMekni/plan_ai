import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { FC } from "react";

// export const Navbar: FC = () => {
//     return (
//         <div className="w-full ">
//             <nav className=" pt-2 flex container justify-between m-auto items-center">
//                 <div>logo</div>
//                 <ul className=" flex space-x-4  ">
//                     <li><Button className="text-white w-20 "><Link href="/auth/login">log in</Link></Button></li>
//                     <li><Button variant={"secondary"} className="w-20 ring-2 ring-primary/40 hover:ring-primary transition "><Link href="/auth/login">sign ups</Link></Button></li>
//                 </ul>
//             </nav>
//         </div>
//     );
// }
import { auth } from "../auth";
import SignoutButton from "./(auth)/SignoutButton";

export default async function UserAvatar() {
  const session = await auth();

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
