import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2, Download } from 'lucide-react';
import { previewPDFByTemplate } from '../utils/templateManager';

function RealtimePreview({ 
  formData, 
  sectionOrder, 
  photo, 
  template,
  onDownload,
  isVisible = true,
  onVisibilityChange 
}) {
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const updateTimeoutRef = useRef(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-open fullscreen on mobile when preview is shown
  useEffect(() => {
    if (isVisible && isMobile && !isFullscreen) {
      setIsFullscreen(true);
    }
  }, [isVisible, isMobile]);

  // Generate preview with debouncing
  useEffect(() => {
    if (!isVisible) return;

    // Clear previous timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Set loading state
    setIsLoading(true);

    // Debounce preview generation (wait 500ms after last change)
    updateTimeoutRef.current = setTimeout(() => {
      try {
        // Generate PDF and get data URL without opening new window
        const doc = previewPDFByTemplate(template, formData, sectionOrder, photo);
        // Make sure we get the data URL string, not trigger any download/open action
        const dataUrl = typeof doc === 'string' ? doc : doc.output('dataurlstring');
        setPdfDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating preview:', error);
        setPdfDataUrl(''); // Clear on error
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [formData, sectionOrder, photo, template, isVisible]);

  // Component is controlled by parent, no need for local show/hide button
  // Parent controls visibility through conditional rendering

  return (
    <div 
      className={`${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-white flex' 
          : 'sticky top-4 h-[calc(100vh-2rem)] hidden lg:flex'
      } flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          <h3 className="font-semibold">Live Preview</h3>
          {isLoading && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs">Updating...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Download Button */}
          <button
            onClick={onDownload}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          
          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              const newFullscreenState = !isFullscreen;
              setIsFullscreen(newFullscreenState);
              // On mobile, close preview when exiting fullscreen
              if (isMobile && !newFullscreenState && onVisibilityChange) {
                onVisibilityChange(false);
              }
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          
          {/* Hide Button */}
          <button
            onClick={() => {
              setIsFullscreen(false);
              onVisibilityChange && onVisibilityChange(false);
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Hide preview"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className={`flex-1 bg-gray-100 overflow-auto ${isFullscreen ? '' : 'rounded-b-lg'}`}>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating preview...</p>
            </div>
          </div>
        )}
        
        {!isLoading && pdfDataUrl && (
          <>
            {isMobile ? (
              // Mobile: Show PDF with better compatibility
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <object
                  data={`${pdfDataUrl}#view=FitH&toolbar=0&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full border-0 bg-white"
                  title="Resume Preview"
                  style={{ minHeight: '100vh' }}
                >
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <p className="text-gray-600 mb-4">PDF preview not available</p>
                    <a
                      href={pdfDataUrl}
                      download="resume.pdf"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                </object>
              </div>
            ) : (
              // Desktop: Use object tag for better Chrome compatibility
              <object
                data={`${pdfDataUrl}#zoom=${isFullscreen ? '100' : '39'}`}
                type="application/pdf"
                className="w-full h-full border-0"
                title="Resume Preview"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50">
                  <div className="text-center max-w-md">
                    <div className="mb-4">
                      <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview Not Available</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Your browser doesn't support inline PDF preview. Download the PDF to view it.
                      </p>
                    </div>
                    <a
                      href={pdfDataUrl}
                      download="resume.pdf"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </object>
            )}
          </>
        )}
        
        {!isLoading && !pdfDataUrl && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No preview available</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-700">Updating preview...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealtimePreview;
