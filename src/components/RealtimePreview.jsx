import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2, Download } from 'lucide-react';
import { previewPDFByTemplate } from '../utils/templateManager';

function RealtimePreview({ 
  formData, 
  sectionOrder, 
  photo, 
  template,
  onDownload 
}) {
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const updateTimeoutRef = useRef(null);

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

  if (!isVisible) {
    return (
      <div className="fixed right-4 top-24 z-30">
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          title="Show preview"
        >
          <Eye className="w-5 h-5" />
          <span className="text-sm font-semibold">Show Preview</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-white' 
          : 'sticky top-4 h-[calc(100vh-2rem)]'
      } flex flex-col`}
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
            onClick={() => setIsFullscreen(!isFullscreen)}
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
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Hide preview"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="flex-1 bg-gray-100 overflow-auto rounded-b-lg">
        {pdfDataUrl ? (
          <iframe
            src={pdfDataUrl}
            className="w-full h-full border-0"
            title="Resume Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Fill in your details to see preview</p>
            </div>
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
