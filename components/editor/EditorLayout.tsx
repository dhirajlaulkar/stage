"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarLeft } from "./sidebar-left";
import { EditorContent } from "./EditorContent";
import { EditorCanvas } from "@/components/canvas/EditorCanvas";
import { EditorStoreSync } from "@/components/canvas/EditorStoreSync";

function EditorMain() {
  return (
    <SidebarProvider defaultOpen={true} className="h-screen overflow-hidden">
      <EditorStoreSync />
      <SidebarLeft />
      <SidebarInset>
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          <EditorContent>
            <EditorCanvas />
          </EditorContent>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function EditorLayout() {
  return <EditorMain />;
}
