"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

const LoginModal = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Handle changes in the form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error.toString());
    }

    if (result?.url) {
      toast.success("Sign in successful!");
      router.replace("/p/dashboard");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group relative cursor-pointer text-white px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 border border-emerald-500/30">
          <div className="flex items-center space-x-3">
            <span className="font-semibold tracking-wide">Login</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Login to your account</h2>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={submitting}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
                    type="submit"
                  >
                    {submitting ? (
                      <LoaderCircle className="animate-spin size-4" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;