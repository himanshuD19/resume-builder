import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Download, Upload, Trash2 } from 'lucide-react';

const AutoSaveIndicator = ({ 
  lastSaveTime, 
  isSaving, 
  onManualSave, 
  onExport, 
  onImport,
  onClear 
}) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSaveTime) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now - lastSaveTime) / 1000); // seconds

      if (diff < 10) {
        setTimeAgo('Just now');
      } else if (diff < 60) {
        setTimeAgo(`${diff}s ago`);
      } else if (diff < 3600) {
        setTimeAgo(`${Math.floor(diff / 60)}m ago`);
      } else {
        setTimeAgo(`${Math.floor(diff / 3600)}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, [lastSaveTime]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[280px]">
        {/* Auto-Save Status */}
        <div className="flex items-center gap-3 mb-3">
          {isSaving ? (
            <>
              <div className="animate-spin">
                <Save className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Saving...</p>
                <p className="text-xs text-gray-500">Auto-saving your changes</p>
              </div>
            </>
          ) : lastSaveTime ? (
            <>
              <div className="bg-green-100 rounded-full p-1">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Saved</p>
                <p className="text-xs text-gray-500">{timeAgo}</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Not saved</p>
                <p className="text-xs text-gray-500">Start editing to auto-save</p>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onManualSave}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            title="Save Now"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={onExport}
            className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            title="Export as JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={onImport}
            className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            title="Import JSON"
          >
            <Upload className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClear}
            className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-600 transition"
            title="Clear Saved Data"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-400 mt-2 text-center">
          Auto-saves every 30 seconds
        </p>
      </div>
    </div>
  );
};

export default AutoSaveIndicator;
