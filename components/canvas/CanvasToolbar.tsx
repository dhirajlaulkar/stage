"use client";

import { useState } from "react";
import { Upload, Type, Palette, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasContext } from "./CanvasContext";
import Konva from "konva";
import { useDropzone } from "react-dropzone";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, DEFAULT_TEXT_FONT_SIZE, DEFAULT_TEXT_COLOR } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function CanvasToolbar() {
  const { operations, canvas } = useCanvas();
  const { stage, layer } = useCanvasContext();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  // Upload states
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Text states
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(DEFAULT_TEXT_FONT_SIZE);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);

  // Export states
  const [exportFormat, setExportFormat] = useState<"png" | "jpg">("png");
  const [exportQuality, setExportQuality] = useState(0.92);
  const [isExporting, setIsExporting] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `File type not supported. Please use: ${ALLOWED_IMAGE_TYPES.join(", ")}`;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `File size too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`;
    }
    return null;
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      setUploadError(null);
      const url = URL.createObjectURL(file);

      try {
        await operations.addImage(url);
        setUploadDialogOpen(false);
      } catch (err) {
        setUploadError("Failed to load image. Please try again.");
        console.error(err);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": ALLOWED_IMAGE_TYPES.map((type) => type.split("/")[1]),
    },
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
  });

  const handleAddText = async () => {
    if (!text.trim() || !canvas) return;

    try {
      const width = typeof canvas.width === 'function' ? canvas.width() : canvas.width || 1920;
      const height = typeof canvas.height === 'function' ? canvas.height() : canvas.height || 1080;

      await operations.addText(text, {
        fontSize,
        color: textColor,
        x: width / 2,
        y: height / 2,
      });
      setTextDialogOpen(false);
      setText("");
    } catch (err) {
      console.error("Failed to add text:", err);
    }
  };

  const updateCanvasBackground = (color: string) => {
    if (layer) {
      const bgRect = layer.findOne((node: any) => node.id() === "canvas-background") as Konva.Rect;
      if (bgRect && bgRect instanceof Konva.Rect) {
        bgRect.fill(color);
        layer.batchDraw();
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataURL = await operations.exportCanvas(exportFormat, exportQuality);

      const link = document.createElement("a");
      link.download = `canvas.${exportFormat}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportDialogOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setUploadDialogOpen(true)}
          className="h-10 w-10"
          title="Upload Image"
        >
          <Upload className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTextDialogOpen(true)}
          className="h-10 w-10"
          title="Add Text"
        >
          <Type className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setColorDialogOpen(true)}
          className="h-10 w-10"
          title="Change Background Color"
        >
          <Palette className="h-5 w-5" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExportDialogOpen(true)}
          className="h-10 w-10"
          title="Export Canvas"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              {isDragActive ? (
                <p className="text-sm">Drop the image here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to {MAX_IMAGE_SIZE / 1024 / 1024}MB
                  </p>
                </div>
              )}
            </div>
            {uploadError && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {uploadError}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Text Dialog */}
      <Dialog open={textDialogOpen} onOpenChange={setTextDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Text</label>
              <Input
                type="text"
                placeholder="Enter text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text.trim()) {
                    handleAddText();
                  }
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Font Size</label>
                <Input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20 h-8"
                  min={12}
                  max={200}
                />
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={12}
                max={200}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            <Button onClick={handleAddText} className="w-full" disabled={!text.trim()}>
              Add Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Dialog */}
      <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Background Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Color</label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setBackgroundColor(color);
                    updateCanvasBackground(color);
                  }}
                  className="w-20 h-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  placeholder="#ffffff"
                  className="flex-1"
                  onChange={(e) => {
                    const color = e.target.value;
                    setBackgroundColor(color);
                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
                      updateCanvasBackground(color);
                    }
                  }}
                />
              </div>
            </div>

            {/* Preset Colors */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Preset Colors</label>
              <div className="grid grid-cols-8 gap-2">
                {[
                  "#ffffff", "#000000", "#f3f4f6", "#ef4444",
                  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
                  "#ec4899", "#06b6d4", "#84cc16", "#f97316",
                ].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setBackgroundColor(color);
                      updateCanvasBackground(color);
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Canvas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <div className="flex gap-2">
                <Button
                  variant={exportFormat === "png" ? "default" : "outline"}
                  onClick={() => setExportFormat("png")}
                  className="flex-1"
                >
                  PNG
                </Button>
                <Button
                  variant={exportFormat === "jpg" ? "default" : "outline"}
                  onClick={() => setExportFormat("jpg")}
                  className="flex-1"
                >
                  JPG
                </Button>
              </div>
            </div>

            {exportFormat === "jpg" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Quality</label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(exportQuality * 100)}%
                  </span>
                </div>
                <Slider
                  value={[exportQuality]}
                  onValueChange={([value]) => setExportQuality(value)}
                  min={0.1}
                  max={1}
                  step={0.01}
                />
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
              size="lg"
            >
              {isExporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
