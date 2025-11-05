"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface EditorContentProps {
  children: React.ReactNode;
  className?: string;
}

export function EditorContent({ children, className }: EditorContentProps) {
  return (
    <main
      className={cn(
        "flex-1 flex items-center justify-center overflow-auto",
        "p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16",
        className
      )}
      style={{ backgroundColor: 'transparent' }}
    >
      {children}
    </main>
  );
}

