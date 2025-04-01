"use client";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  return (
    <div className="w-full shadow-sm z-[9999] bg-white sticky top-0 dark:bg-gray-900">
      <div className="w-full mx-auto max-w-7xl flex justify-between items-center p-3 px-5">
        <div className="flex flex-1 gap-9 items-center">
          <div>
            <h5 className="font-black text-lg text-primary">SmartCV.ai</h5>
          </div>

          <div className="hidden md:flex">
            <ul className="flex items-center gap-5 text-[14px] font-medium text-black dark:text-white">
              <li>
                <Link href="#">AI Features</Link>
              </li>
              <li>
                <Link href="#">Pricing</Link>
              </li>
              <li>
                <Link href="#">Resources</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignInButton>
            <Button variant={"outline"}>Sign-in</Button>
          </SignInButton>
          <SignUpButton>
            <Button variant={"default"}>Get Started</Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
