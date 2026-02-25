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
      description: 'Create stunning, professional resumes in minutes',
      color: 'from-blue-500 to-indigo-600',
      highlights: [
        '🎯 3 Professional Templates - Modern, Classic, ATS-Friendly',
        '🎨 12 Beautiful Color Themes - Match your industry',
        '✍️ 6 Font Styles - Helvetica, Times, Arial, and more',
        '📸 Professional Photo Upload - Optional headshot',
        '✨ One-Click Sample Data - Start with realistic examples'
      ],
      image: '📄'
    },
    {
      icon: Palette,
      title: '3 Professional Templates',
      description: 'Choose the perfect design for your career',
      color: 'from-purple-500 to-pink-600',
      highlights: [
        '🎯 Modern - Clean, contemporary design for tech & creative roles',
        '📋 Classic - Traditional, elegant layout for corporate positions',
        '🤖 ATS-Friendly - Optimized for automated screening systems',
        '🎨 All templates support 12 color themes',
        '✍️ All templates support 6 professional fonts'
      ],
      image: '🎨'
    },
    {
      icon: Camera,
      title: 'Professional Photo Upload',
      description: 'Add your headshot for a personal touch',
      color: 'from-green-500 to-emerald-600',
      highlights: [
        '📸 Upload JPG or PNG photos (up to 5MB)',
        '📐 Automatic positioning in top-right corner',
        '🎨 Colored border matching your theme',
        '✅ Works in all 3 templates',
        '💡 Optional - Create versions with and without photo'
      ],
      image: '📸'
    },
    {
      icon: Sparkles,
      title: 'Smart Rich Text Editor',
      description: 'Format your content like a pro',
      color: 'from-orange-500 to-red-600',
      highlights: [
        '**Bold** - Ctrl/Cmd + B for emphasis',
        '*Italic* - Ctrl/Cmd + I for technologies',
        '• Bullets - Press Enter to auto-continue',
        '1. Numbering - Auto-increment numbered lists',
        '⇧ Enter - Simple line break without formatting'
      ],
      image: '✍️'
    },
    {
      icon: GripVertical,
      title: 'Live Preview & Toggle',
      description: 'See your resume in real-time',
      color: 'from-cyan-500 to-blue-600',
      highlights: [
        '👁️ Live Preview - Updates as you type',
        '🔄 Toggle On/Off - Show/hide preview anytime',
        '🖥️ Fullscreen Mode - View PDF in fullscreen with zoom',
        '📱 Responsive - Works on desktop and tablet',
        '⚡ Instant Updates - No delays or lag'
      ],
      image: '👁️'
    },
    {
      icon: CheckCircle,
      title: 'AI Resume Analyzer',
      description: 'Get instant feedback and improve your resume',
      color: 'from-indigo-500 to-purple-600',
      highlights: [
        '📊 Overall Score - Get rated out of 100',
        '✅ Strengths Analysis - See what you did well',
        '💡 Improvement Tips - Actionable suggestions',
        '🎯 Keyword Optimization - Match job descriptions',
        '📏 Length & Format - Ensure ATS compatibility'
      ],
      image: '📊'
    },
    {
      icon: Zap,
      title: 'Customization & Sections',
      description: 'Make your resume uniquely yours',
      color: 'from-teal-500 to-green-600',
      highlights: [
        '➕ Custom Sections - Add Certifications, Awards, Languages',
        '🎨 12 Color Themes - Blue, Purple, Green, Red, and more',
        '✍️ 6 Font Styles - Professional typography options',
        '🔄 Drag & Drop - Reorder sections (coming soon)',
        '📐 Perfect Spacing - Professional layout automatically'
      ],
      image: '⚙️'
    },
    {
      icon: Download,
      title: 'Export & Download',
      description: 'Get your professional resume instantly',
      color: 'from-pink-500 to-rose-600',
      highlights: [
        '📥 Download PDF - High-quality, print-ready',
        '🎨 Theme Applied - Colors throughout PDF',
        '📸 Photo Included - If uploaded',
        '✅ ATS-Compatible - Passes automated screening',
        '💾 Professional Format - Perfect alignment & spacing'
      ],
      image: '💾'
    },
    {
      icon: CheckCircle,
      title: 'Ready to Start! 🚀',
      description: 'Follow these steps to create your amazing resume',
      color: 'from-green-500 to-teal-600',
      highlights: [
        '1️⃣ Click "Fill Sample Data" to see examples',
        '2️⃣ Choose Template, Color Theme, and Font Style',
        '3️⃣ Upload your photo (optional)',
        '4️⃣ Edit content and use formatting toolbar',
        '5️⃣ Check Resume Score, preview, and download! 🎉'
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
