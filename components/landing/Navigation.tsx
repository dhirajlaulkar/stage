"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  ctaLabel?: string;
  ctaHref?: string;
}

export function Navigation({ 
  ctaLabel = "Editor", 
  ctaHref = "/home" 
}: NavigationProps) {
  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Stage" 
            width={32} 
            height={32}
            className="h-8 w-8"
          />
        </Link>
        <Link href={ctaHref}>
          <Button variant="ghost">{ctaLabel}</Button>
        </Link>
      </div>
    </nav>
  );
}

