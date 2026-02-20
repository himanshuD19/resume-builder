import React, { useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, FileText, Camera, Palette, 
  Sparkles, GripVertical, Download, CheckCircle, Zap
} from 'lucide-react';

const UserManual = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: FileText,
      title: 'Welcome to Resume Builder! 🎉',
      description: 'Create professional resumes in minutes with our powerful features',
      color: 'from-blue-500 to-indigo-600',
      highlights: [
        'Choose between resume with or without photo',
        'Rich text formatting with markdown support',
        '12 beautiful color themes',
        'Drag-and-drop section reordering',
        'Custom sections for certifications, awards, etc.'
      ],
      image: '📄'
    },
    {
      icon: Camera,
      title: 'Resume Types',
      description: 'Select the perfect format for your needs',
      color: 'from-purple-500 to-pink-600',
      highlights: [
        '📝 Resume without Photo - ATS-friendly, widely accepted',
        '📸 Resume with Photo - Modern, creative, personal branding',
        'Upload professional headshot (PNG, JPG)',
        'Photo appears in top-right corner of PDF',
        'Easy toggle between types'
      ],
      image: '🎨'
    },
    {
      icon: Sparkles,
      title: 'Smart Features',
      description: 'Powerful tools to make resume building effortless',
      color: 'from-green-500 to-emerald-600',
      highlights: [
        '✨ Fill Sample Data - One-click demo with realistic content',
        '📝 Rich Text Editor - Bold, italic, bullets, numbering',
        '⌨️ Smart Enter - Auto-continue bullets and numbered lists',
        '🎯 Shift+Enter - Simple line break without formatting',
        '📋 Real-time preview of your resume'
      ],
      image: '⚡'
    },
    {
      icon: Palette,
      title: 'Customization',
      description: 'Make your resume uniquely yours',
      color: 'from-orange-500 to-red-600',
      highlights: [
        '🎨 12 Color Themes - Blue, Indigo, Purple, Green, and more',
        '➕ Custom Sections - Add Certifications, Awards, Languages',
        '🔄 Drag & Drop - Reorder sections to highlight strengths',
        '📐 Professional Layout - Optimized spacing and typography',
        '💾 Auto-save in browser (coming soon)'
      ],
      image: '🎨'
    },
    {
      icon: GripVertical,
      title: 'Drag & Drop Sections',
      description: 'Organize your resume your way',
      color: 'from-cyan-500 to-blue-600',
      highlights: [
        '🔀 Reorder main sections (Education, Experience, Skills, Projects)',
        '📌 Custom sections stay in their own area',
        '👆 Grab the grip icon to drag',
        '✨ Smooth animations during reordering',
        '📱 Works on touch devices too'
      ],
      image: '↕️'
    },
    {
      icon: Download,
      title: 'Export & Preview',
      description: 'Get your professional resume instantly',
      color: 'from-indigo-500 to-purple-600',
      highlights: [
        '👁️ Preview PDF - See before downloading',
        '⬇️ Download PDF - Save to your device',
        '📄 Professional formatting preserved',
        '🎨 Color theme applied throughout',
        '📸 Photo included (if selected)'
      ],
      image: '💾'
    },
    {
      icon: CheckCircle,
      title: 'Ready to Start!',
      description: 'You\'re all set to create an amazing resume',
      color: 'from-green-500 to-teal-600',
      highlights: [
        '1️⃣ Choose your resume type (with/without photo)',
        '2️⃣ Fill in your details or use sample data',
        '3️⃣ Customize colors and sections',
        '4️⃣ Preview and download your resume',
        '5️⃣ Land your dream job! 🚀'
      ],
      image: '✅'
    }
  ];

  const currentFeature = features[currentStep];
  const Icon = currentFeature.icon;

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('resume_builder_manual_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentFeature.color} text-white p-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 text-9xl opacity-10 transform rotate-12">
            {currentFeature.image}
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentFeature.title}</h2>
                  <p className="text-white text-opacity-90 text-sm">{currentFeature.description}</p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                title="Close manual"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-4 mb-6">
            {currentFeature.highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-r ${currentFeature.color} rounded-full p-1 flex-shrink-0 mt-0.5`}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed">{highlight}</p>
              </div>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? `w-8 bg-gradient-to-r ${currentFeature.color}` 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-sm text-gray-500 font-medium">
              {currentStep + 1} of {features.length}
            </div>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentFeature.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all`}
            >
              {currentStep === features.length - 1 ? (
                <>
                  Get Started
                  <Zap className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Skip Button */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition font-medium"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManual;
