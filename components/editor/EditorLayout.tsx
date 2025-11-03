"use client";

import { CanvasProvider } from "@/components/canvas/CanvasContext";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";

function EditorContent() {
  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center relative bg-gray-50">
      <CanvasToolbar />
      <div className="w-full h-full flex items-center justify-center p-4">
        <CanvasEditor className="w-full h-full max-w-full max-h-full" />
      </div>
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
