import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const GuidedTour = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElement, setHighlightElement] = useState(null);

  const tourSteps = [
    {
      title: 'Welcome to Resume Builder! 👋',
      description: 'Let me show you around. This quick tour will help you create your perfect resume in minutes.',
      target: null,
      position: 'center'
    },
    {
      title: 'Fill Sample Data 📝',
      description: 'Click here to instantly fill all fields with professional example data. Great for testing or getting started quickly!',
      target: '[data-tour="fill-sample"]',
      position: 'bottom'
    },
    {
      title: 'Choose Template 🎨',
      description: 'Select from 3 professional templates: Modern, Classic, or ATS-Friendly. Each optimized for different industries.',
      target: '[data-tour="template-select"]',
      position: 'bottom'
    },
    {
      title: 'Pick Colors & Fonts ✨',
      description: 'Customize your resume with 12 color themes and 6 font styles to match your personal brand.',
      target: '[data-tour="color-theme"]',
      position: 'bottom'
    },
    {
      title: 'Upload Photo 📸',
      description: 'Add a professional headshot to make your resume stand out (optional but recommended for creative roles).',
      target: '[data-tour="photo-upload"]',
      position: 'bottom'
    },
    {
      title: 'Rich Text Formatting 💪',
      description: 'Use the formatting toolbar to add bold, italic, bullets, and numbered lists to your descriptions.',
      target: '[data-tour="experience-section"]',
      position: 'top'
    },
    {
      title: 'Live Preview 👁️',
      description: 'Toggle the live preview to see your resume update in real-time as you type. Click fullscreen for a better view!',
      target: '[data-tour="preview-toggle"]',
      position: 'left'
    },
    {
      title: 'Resume Score 📊',
      description: 'Get AI-powered feedback on your resume. See your score, strengths, and improvement suggestions.',
      target: '[data-tour="analyzer-toggle"]',
      position: 'bottom'
    },
    {
      title: 'Auto-Save 💾',
      description: 'Your work is automatically saved every 30 seconds. You can also export/import your resume data anytime.',
      target: '[data-tour="autosave"]',
      position: 'left'
    },
    {
      title: 'Download PDF 📥',
      description: 'When you\'re done, click here to download your professional resume as a PDF. Ready to apply!',
      target: '[data-tour="download-pdf"]',
      position: 'bottom'
    },
    {
      title: 'You\'re All Set! 🎉',
      description: 'That\'s it! You now know everything to create an amazing resume. Start building and land your dream job!',
      target: null,
      position: 'center'
    }
  ];

  const currentTourStep = tourSteps[currentStep];

  useEffect(() => {
    if (currentTourStep.target) {
      const element = document.querySelector(currentTourStep.target);
      setHighlightElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightElement(null);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('resume_builder_tour_completed', 'true');
    onComplete();
  };

  const handleSkipTour = () => {
    localStorage.setItem('resume_builder_tour_completed', 'true');
    onSkip();
  };

  const getTooltipPosition = () => {
    if (!highlightElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = highlightElement.getBoundingClientRect();
    const position = currentTourStep.position;

    switch (position) {
      case 'top':
        return {
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 20}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 pointer-events-none">
        {/* Highlight */}
        {highlightElement && (
          <div
            className="absolute border-4 border-yellow-400 rounded-lg pointer-events-auto animate-pulse"
            style={{
              top: `${highlightElement.getBoundingClientRect().top - 4}px`,
              left: `${highlightElement.getBoundingClientRect().left - 4}px`,
              width: `${highlightElement.getBoundingClientRect().width + 8}px`,
              height: `${highlightElement.getBoundingClientRect().height + 8}px`,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-50 pointer-events-auto"
        style={getTooltipPosition()}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md border-2 border-purple-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {currentTourStep.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentTourStep.description}
              </p>
            </div>
            <button
              onClick={handleSkipTour}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleSkipTour}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <Check className="w-4 h-4" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuidedTour;
