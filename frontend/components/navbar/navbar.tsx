"use client";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { HiChevronDown } from "react-icons/hi";

export default function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 h-16 flex items-center justify-between px-4 shadow-sm border-b bg-white z-10">
      <p className="text-xl font-semibold">Overseer</p>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
