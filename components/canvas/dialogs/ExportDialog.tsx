"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: "png" | "jpg", quality: number) => Promise<string>;
}

export function ExportDialog({ open, onOpenChange, onExport }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<"png" | "jpg">("png");
  const [exportQuality, setExportQuality] = useState(0.92);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataURL = await onExport(exportFormat, exportQuality);

      if (!dataURL || dataURL === 'data:,') {
        throw new Error('Invalid image data generated');
      }

      const link = document.createElement("a");
      link.download = `stage-${Date.now()}.${exportFormat}`;
      link.href = dataURL;
      
      document.body.appendChild(link);
      link.click();
      
      // Small delay before removing to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      onOpenChange(false);
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to export image. Please try again.";
      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">Export Canvas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Format</label>
            <div className="flex gap-2">
              <Button
                variant={exportFormat === "png" ? "default" : "outline"}
                onClick={() => setExportFormat("png")}
                className={`flex-1 h-11 touch-manipulation ${exportFormat === "png" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                PNG
              </Button>
              <Button
                variant={exportFormat === "jpg" ? "default" : "outline"}
                onClick={() => setExportFormat("jpg")}
                className={`flex-1 h-11 touch-manipulation ${exportFormat === "jpg" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                JPG
              </Button>
            </div>
          </div>

          {exportFormat === "jpg" && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Quality</label>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {Math.round(exportQuality * 100)}%
                </span>
              </div>
              <Slider
                value={[exportQuality]}
                onValueChange={([value]) => setExportQuality(value)}
                min={0.1}
                max={1}
                step={0.01}
                className="py-2"
              />
            </div>
          )}

          <div className="pt-2 pb-1">
            <p className="text-xs text-gray-500 text-center">
              Exported images will include Stage watermark
            </p>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full h-11 font-semibold bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isExporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

