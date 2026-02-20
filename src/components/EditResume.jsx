import React, { useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Clock, Trash2, Loader } from 'lucide-react';
import { loadFromLocalStorage, clearSavedData, parseResumeFromPDF } from '../utils/pdfParser';

const EditResume = ({ onClose, onLoadData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if there's saved data
  const savedData = loadFromLocalStorage();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    setSuccess('');

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      setSuccess('');
      
      // Parse PDF and extract data
      const extractedData = await parseResumeFromPDF(file);
      
      // Check what data was extracted
      const hasName = extractedData.personalInfo.fullName;
      const hasEmail = extractedData.personalInfo.email;
      const hasPhone = extractedData.personalInfo.phone;
      const hasLinkedIn = extractedData.personalInfo.linkedin;
      const hasEducation = extractedData.education.length > 0;
      const hasExperience = extractedData.experience.length > 0;
      const hasSkills = extractedData.skills.length > 0;
      const hasProjects = extractedData.projects.length > 0;
      
      const extractedFields = [];
      if (hasName) extractedFields.push('Name');
      if (hasEmail) extractedFields.push('Email');
      if (hasPhone) extractedFields.push('Phone');
      if (hasLinkedIn) extractedFields.push('LinkedIn');
      if (hasEducation) extractedFields.push(`Education (${extractedData.education.length})`);
      if (hasExperience) extractedFields.push(`Experience (${extractedData.experience.length})`);
      if (hasSkills) extractedFields.push(`Skills (${extractedData.skills.length})`);
      if (hasProjects) extractedFields.push(`Projects (${extractedData.projects.length})`);
      
      // Load the extracted data into the form
      onLoadData(extractedData);
      
      if (extractedFields.length > 0) {
        setSuccess(`Extracted: ${extractedFields.join(', ')}. Review and fill in any missing details.`);
      } else {
        setSuccess('PDF processed but no data could be extracted. Please enter your information manually.');
      }
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (err) {
      setError(err.message || 'Error processing PDF. Please try again or enter data manually.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSavedData = () => {
    if (savedData) {
      onLoadData(savedData);
      onClose();
    }
  };

  const handleClearSavedData = () => {
    if (window.confirm('Are you sure you want to clear your saved resume data? This cannot be undone.')) {
      clearSavedData();
      setSuccess('Saved data cleared successfully');
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Edit Existing Resume</h2>
              <p className="text-indigo-100 text-sm">Continue where you left off</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Saved Data Section */}
          {savedData && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 rounded-full p-2 flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-800 mb-2">
                    Continue Last Session
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    We found your previously saved resume data from{' '}
                    <span className="font-semibold">
                      {new Date(savedData.lastSaved).toLocaleString()}
                    </span>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleLoadSavedData}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Load Saved Data
                    </button>
                    <button
                      onClick={handleClearSavedData}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Saved Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Upload Previous Resume (PDF)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your previously downloaded resume PDF. We'll help you edit it.
            </p>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl p-8 text-center transition-all ${
                isProcessing
                  ? 'border-green-500 bg-green-50'
                  : dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                {isProcessing ? (
                  <>
                    <div className="rounded-full p-4 bg-green-100">
                      <Loader className="w-8 h-8 text-green-600 animate-spin" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-1">
                        Processing PDF...
                      </p>
                      <p className="text-sm text-gray-500">Extracting resume data</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`rounded-full p-4 ${dragActive ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                      <Upload className={`w-8 h-8 ${dragActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-1">
                        Drag & drop your PDF here
                      </p>
                      <p className="text-sm text-gray-500">or</p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={isProcessing}
                      />
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-md">
                        <FileText className="w-5 h-5" />
                        Browse Files
                      </span>
                    </label>
                    <p className="text-xs text-gray-500">
                      PDF files only • Max 10MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">Info</p>
                  <p className="text-sm text-blue-600">{success}</p>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-800 mb-2">
              ✅ Automatic PDF Data Extraction
            </h4>
            <p className="text-xs text-green-700 mb-2">
              Upload your resume PDF and we'll automatically extract:
            </p>
            <ul className="text-xs text-green-700 space-y-1 ml-4">
              <li>• Personal information (name, email, phone, LinkedIn)</li>
              <li>• Education history</li>
              <li>• Work experience</li>
              <li>• Skills and projects</li>
              <li>• Professional summary</li>
            </ul>
            <p className="text-xs text-green-600 mt-2 italic">
              Note: Review extracted data and make any necessary adjustments before downloading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditResume;
