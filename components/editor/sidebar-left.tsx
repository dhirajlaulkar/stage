'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useImageStore } from '@/lib/store';
import { ExportDialog } from '@/components/canvas/dialogs/ExportDialog';
import { StyleTabs } from './style-tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { uploadedImageUrl } = useImageStore();
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  const handleExport = async (format: 'png' | 'jpg', quality: number): Promise<string> => {
    // Wait a bit to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const element = document.getElementById('image-render-card');
    if (!element) {
      throw new Error('Image render card not found. Please ensure an image is uploaded.');
    }

    // Wait for all images to load
    const images = element.getElementsByTagName('img');
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image failed to load'));
        // Timeout after 5 seconds
        setTimeout(() => reject(new Error('Image load timeout')), 5000);
      });
    });

    try {
      await Promise.all(imagePromises);
    } catch (error) {
      console.warn('Some images failed to load, continuing with export:', error);
    }

    // Use html2canvas directly with format options
    const html2canvas = (await import('html2canvas')).default;
    
    // Helper function to convert oklch/rgb to hex
    const convertColorToHex = (color: string): string => {
      if (!color || color === 'transparent' || color === 'none') return color;
      
      // If it's already a hex color, return it
      if (color.startsWith('#')) return color;
      
      // If it's rgb/rgba, convert to hex
      if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
          const r = parseInt(match[0]);
          const g = parseInt(match[1]);
          const b = parseInt(match[2]);
          const a = match[3] ? parseFloat(match[3]) : 1;
          if (a < 1) {
            return `rgba(${r}, ${g}, ${b}, ${a})`;
          }
          return `#${[r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('')}`;
        }
      }
      
      // For oklch or other formats, try to get computed style
      const tempDiv = document.createElement('div');
      tempDiv.style.color = color;
      document.body.appendChild(tempDiv);
      const computed = window.getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      
      // Convert rgb/rgba to hex
      const rgbMatch = computed.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0]);
        const g = parseInt(rgbMatch[1]);
        const b = parseInt(rgbMatch[2]);
        return `#${[r, g, b].map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('')}`;
      }
      
      return color;
    };
    
    // Function to convert CSS variables and computed styles to RGB
    const convertStylesToRGB = (element: HTMLElement, doc: Document) => {
      // Get computed style from the cloned document's window
      const win = doc.defaultView || (doc as any).parentWindow;
      if (!win) return;
      
      const computedStyle = win.getComputedStyle(element);
      const stylesToConvert = [
        'color', 'backgroundColor', 'borderColor', 'borderTopColor',
        'borderRightColor', 'borderBottomColor', 'borderLeftColor',
        'outlineColor', 'boxShadow', 'textShadow'
      ];
      
      stylesToConvert.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && (value.includes('oklch') || value.includes('var('))) {
          try {
            const computed = (computedStyle as any)[prop];
            if (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent' && computed !== 'none') {
              element.style.setProperty(prop, computed, 'important');
            }
          } catch (e) {
            // Ignore errors
          }
        }
      });
      
      // Convert all children recursively
      Array.from(element.children).forEach(child => {
        if (child instanceof HTMLElement) {
          convertStylesToRGB(child, doc);
        }
      });
    };
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.scrollWidth || element.clientWidth,
        height: element.scrollHeight || element.clientHeight,
        windowWidth: element.scrollWidth || element.clientWidth,
        windowHeight: element.scrollHeight || element.clientHeight,
        removeContainer: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Ensure all images are loaded in the cloned document
          const clonedElement = clonedDoc.getElementById('image-render-card');
          if (clonedElement) {
            const images = clonedElement.getElementsByTagName('img');
            Array.from(images).forEach((img) => {
              // Force display for images that might be hidden
              if (img.style.display === 'none') {
                img.style.display = '';
              }
            });
            
            // Convert all CSS variables and oklch colors to RGB
            convertStylesToRGB(clonedElement, clonedDoc);
            
            // Also convert any direct style attributes
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el) => {
              if (el instanceof HTMLElement) {
                convertStylesToRGB(el, clonedDoc);
              }
            });
          }
        },
      });

      if (!canvas) {
        throw new Error('Failed to create canvas');
      }

      // Convert canvas to data URL with specified format
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const dataURL = canvas.toDataURL(mimeType, quality);
      
      if (!dataURL || dataURL === 'data:,') {
        throw new Error('Failed to generate image data URL');
      }

      return dataURL;
    } catch (error) {
      console.error('Export error:', error);
      throw new Error(`Failed to export image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <Sidebar className="bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 shadow-sm" {...props}>
        <SidebarHeader className="p-4 pb-3 border-b border-blue-100 bg-white">
          <div className="space-y-3">
            <Button
              onClick={() => setExportDialogOpen(true)}
              disabled={!uploadedImageUrl}
              className={`w-full h-10 rounded-lg font-medium transition-all ${
                uploadedImageUrl
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download className="size-4 mr-2" />
              Export Image
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-4 py-4 space-y-6 bg-white">
          <StyleTabs />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
      />
    </>
  );
}
