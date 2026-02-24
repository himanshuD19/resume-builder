import React from 'react';
import { FileText, Sparkles, Check } from 'lucide-react';
import { TEMPLATES } from '../utils/templateManager';

function TemplateSelector({ selectedTemplate, onTemplateChange }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        Resume Template
      </h2>
      <p className="text-xs text-gray-600 mb-3">
        Choose a template that best fits your industry and career level
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.values(TEMPLATES).map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              selectedTemplate === template.id
                ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            {/* Selected Checkmark */}
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            
            {/* Template Icon */}
            <div className="text-3xl mb-2">{template.icon}</div>
            
            {/* Template Name */}
            <h3 className="text-base font-bold text-gray-800 mb-1">
              {template.name}
            </h3>
            
            {/* Description */}
            <p className="text-xs text-gray-600 mb-2">
              {template.description}
            </p>
            
            {/* Features */}
            <div className="space-y-1 mb-3">
              {template.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Best For */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-1">Best for:</p>
              <p className="text-xs text-gray-600">{template.bestFor}</p>
            </div>
          </button>
        ))}
      </div>
      
      {/* Template Info */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-blue-900 mb-1">
              Template Tips:
            </p>
            <ul className="text-xs text-blue-800 space-y-0.5">
              <li>• <strong>Modern:</strong> Great for creative fields, includes color themes and photo</li>
              <li>• <strong>Classic:</strong> Professional and conservative, perfect for traditional industries</li>
              <li>• <strong>ATS-Friendly:</strong> Optimized for online applications and automated screening</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TemplateSelector;
