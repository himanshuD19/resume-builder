import React, { useState, useEffect } from 'react';
import { 
  FileText, ArrowRight, Sparkles, BookOpen, Palette, 
  Zap, Camera, CheckCircle, Star, TrendingUp, Award, User, Edit
} from 'lucide-react';
import UserManual from './UserManual';

const LandingPage = ({ onSelectType, onEditResume }) => {
  const [showManual, setShowManual] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    // Check if user has seen the manual before
    const hasSeenManual = localStorage.getItem('resume_builder_manual_seen');
    if (!hasSeenManual) {
      // Show manual after a brief delay for better UX
      setTimeout(() => {
        setShowManual(true);
      }, 500);
    }
  }, []);

  const handleCloseManual = () => {
    setShowManual(false);
    localStorage.setItem('resume_builder_manual_seen', 'true');
  };

  const handleTemplateSelect = (type) => {
    setShowTemplateModal(false);
    onSelectType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">{/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6 border border-purple-100">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">Professional Resume Builder</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Your Dream
            </span>
            <br />
            <span className="text-gray-800">Resume in Minutes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Build stunning, ATS-friendly resumes with AI-powered analysis, 
            <span className="font-semibold text-purple-600"> 3 professional templates</span>, and 
            <span className="font-semibold text-blue-600"> 12 color themes</span>
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 flex-wrap mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">3 Templates</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Palette className="w-5 h-5 text-purple-500" />
              <span className="font-medium">12 Colors</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">AI Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Camera className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Photo Upload</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Start Building Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={() => setShowManual(true)}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200 hover:border-purple-300 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              View Tutorial
            </button>
          </div>
        </div>
        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Template Feature */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">3 Professional Templates</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Modern, Classic, and ATS-Friendly designs for every career stage and industry
            </p>
          </div>

          {/* Customization Feature */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Full Customization</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              12 color themes, 6 font styles, and unlimited custom sections to make it yours
            </p>
          </div>

          {/* AI Analysis Feature */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get instant feedback, score your resume, and receive actionable improvement tips
            </p>
          </div>
        </div>

        {/* Footer with Creator Credit */}
        <div className="mt-16 pt-8 border-t border-purple-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Award className="w-5 h-5 text-purple-600" />
              <p className="text-lg">
                Created with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
                <span className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Himanshu Dwivedi
                </span>
              </p>
            </div>
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Crafted with best design practices & modern technologies
            </p>
          </div>
        </div>

      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-9xl opacity-10">🎨</div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-2">Choose Your Perfect Template</h2>
                <p className="text-white text-opacity-90 text-lg">
                  Select the format that best suits your needs
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="absolute top-6 right-6 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Template Options */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Without Photo Option */}
                <div 
                  onClick={() => handleTemplateSelect('without-photo')}
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Recommended
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Resume without Photo</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Traditional professional format. Perfect for most job applications and ATS-friendly systems.
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      ATS-friendly format
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      Clean and professional
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      Widely accepted globally
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      3 templates available
                    </li>
                  </ul>
                  
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold group-hover:from-blue-700 group-hover:to-indigo-700 transition-all shadow-md">
                    Select This Format
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* With Photo Option */}
                <div 
                  onClick={() => handleTemplateSelect('with-photo')}
                  className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Resume with Photo</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Modern format with professional photo. Ideal for creative fields and international applications.
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                      Professional photo upload
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                      Modern and creative design
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                      Personal branding focus
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                      3 templates available
                    </li>
                  </ul>
                  
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold group-hover:from-purple-700 group-hover:to-pink-700 transition-all shadow-md">
                    Select This Format
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Info Footer */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Both formats include:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      3 professional templates (Modern, Classic, ATS-Friendly) • 12 color themes • 6 font styles • 
                      Rich text formatting • Custom sections • AI-powered analysis • Live preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Manual Modal */}
      {showManual && <UserManual onClose={handleCloseManual} />}
    </div>
  );
};

export default LandingPage;
