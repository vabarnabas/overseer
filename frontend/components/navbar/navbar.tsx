import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import Logo from "../logo/logo";
import { auth } from "@clerk/nextjs/server";

export default function Navbar() {
  const { userId } = auth();

  return (
    <div className="fixed top-0 inset-x-0 w-full flex-shrink-0 h-16 flex items-center justify-between px-4 border-b bg-white z-10">
      <Link href={userId ? "/databases" : "/"}>
        <div className="flex w-max items-center gap-x-2 text-lg font-medium">
          <Logo className="text-primary" width={32} height={32} />
        </div>
      </Link>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
