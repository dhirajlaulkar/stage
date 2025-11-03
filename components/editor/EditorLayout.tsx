"use client";

import { CanvasProvider } from "@/components/canvas/CanvasContext";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

function EditorContent() {
  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      <Navigation ctaLabel="Home" ctaHref="/" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 pt-6 pb-4">
          <CanvasToolbar />
        </div>
        <div className="flex-1 w-full flex items-center justify-center p-4">
          <CanvasEditor className="w-full h-full max-w-full max-h-full" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function EditorLayout() {
  return (
    <CanvasProvider>
      <EditorContent />
    </CanvasProvider>
  );
}
