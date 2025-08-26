'use client';
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
      size="sm"
      className="cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 rounded-full shadow-lg border border-slate-700 text-emerald-300 hover:text-emerald-100"
    >
      <LogOut className="h-5 w-5 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;
