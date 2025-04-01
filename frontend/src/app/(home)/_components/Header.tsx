"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ChevronDown, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

const Header = () => {
  const { setTheme } = useTheme();
  const { isSignedIn, user, isLoaded } = useUser();
  if (!user) {
    return;
  }

  return (
    <div className="shadow-sm w-full sticky top-0 bg-white dark:bg-gray-900 z-[9]">
      <div className="w-full mx-auto max-w-7xl py-2 px-5 flex items-center justify-between">
        <div className="flex items-center flex-1 gap-9">
          <div>
            <Link
              href={"/dashboard"}
              className="font-black text-[20px] text-primary"
            >
              SmartCV.ai
            </Link>
          </div>

          {isSignedIn && user ? (
            <div className="flex items-center gap-2">
              <span className="font-normal text-black/50 dark:text-primary-foreground">
                Hi,
              </span>
              <h5 className="font-bold text-black dark:text-primary-foreground">
                {user.fullName}
              </h5>
            </div>
          ) : null}
        </div>

        <div
          className="flex items-center gap-4
        "
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {!isLoaded ? (
            <Loader2 className="size-6 animate-spin text-black dark:text-white" />
          ) : (
            <>
              {isSignedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger role="button">
                    <div className="flex items-center gap-1">
                      <Avatar role="button" className="cursor-pointer">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                          <AvatarFallback>
                            {user.firstName?.[0]}
                            {user.lastName && user.lastName}
                          </AvatarFallback>
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown size={"17px"} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="my-3">
                    <DropdownMenuItem
                      asChild
                      className="text-destructive font-medium cursor-pointer w-full"
                    >
                      <SignOutButton>Log out</SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
