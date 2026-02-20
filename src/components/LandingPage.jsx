import React from 'react';
import { FileText, User, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = ({ onSelectType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-indigo-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Resume Builder
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional resume in minutes. Choose your preferred format and get started!
          </p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Without Photo Option */}
          <div 
            onClick={() => onSelectType('without-photo')}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-indigo-500 transform hover:-translate-y-2"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Resume without Photo
              </h2>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Traditional professional resume format. Perfect for most job applications and ATS-friendly systems.
              </p>
              
              {/* Features */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  ATS-friendly format
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  Clean and professional
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  Widely accepted
                </li>
              </ul>
              
              {/* Button */}
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold group-hover:from-indigo-700 group-hover:to-blue-700 transition-all shadow-md">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Recommended Badge */}
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Recommended
            </div>
          </div>

          {/* With Photo Option */}
          <div 
            onClick={() => onSelectType('with-photo')}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500 transform hover:-translate-y-2"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Resume with Photo
              </h2>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Modern resume format with professional photo. Ideal for creative fields and international applications.
              </p>
              
              {/* Features */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                  Professional photo upload
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                  Modern and creative
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                  Personal branding
                </li>
              </ul>
              
              {/* Button */}
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold group-hover:from-purple-700 group-hover:to-pink-700 transition-all shadow-md">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* New Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Popular
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            ✨ Both formats support rich text formatting, custom sections, and 12 color themes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
