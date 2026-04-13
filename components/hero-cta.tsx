"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";

export function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <SignUpButton mode="modal">
        <Button size="lg" className="gap-2 px-8 h-12 text-base">
          Get Started Free
          <ArrowRight className="size-4" />
        </Button>
      </SignUpButton>
      <SignInButton mode="modal">
        <Button variant="outline" size="lg" className="gap-2 px-8 h-12 text-base">
          <LogIn className="size-4" />
          Sign In
        </Button>
      </SignInButton>
    </div>
  );
}
