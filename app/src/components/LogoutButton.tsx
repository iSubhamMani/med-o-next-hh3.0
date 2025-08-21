"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  return (
    <Button
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
      variant="ghost"
      size="icon"
      className="cursor-pointer"
    >
      <LogOut className="h-5 w-5 text-neutral-600" />
    </Button>
  );
};

export default LogoutButton;
