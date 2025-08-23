"use client";

import Cal from "@calcom/embed-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CalButton({ calLink }: { calLink: string }) {
  return (
    <Dialog>
      <DialogTrigger className="w-full bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition">
        Book a consultation
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a consultation</DialogTitle>
          <DialogDescription>
            Book a consultation with this provider
          </DialogDescription>
        </DialogHeader>
        <div className="pb-8">
          <Cal
            calLink={calLink.split("cal.com/")[1]}
            style={{ width: "100%", height: "600px" }}
          ></Cal>
        </div>
      </DialogContent>
    </Dialog>
  );
}
