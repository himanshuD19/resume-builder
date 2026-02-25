import React, { useState } from 'react';
import { X, Search, Briefcase, Code, Palette, GraduationCap, TrendingUp, Award, Copy, Eye } from 'lucide-react';
import { sampleResumeTemplates } from '../data/resumeTemplates';

const TemplatesLibrary = ({ onClose, onSelectTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Award },
    { id: 'tech', name: 'Tech & IT', icon: Code },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'student', name: 'Student', icon: GraduationCap },
    { id: 'executive', name: 'Executive', icon: TrendingUp }
  ];

  const filteredTemplates = sampleResumeTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    onSelectTemplate(template.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-10">📚</div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Resume Templates Library</h2>
            <p className="text-white text-opacity-90">
              Choose from {sampleResumeTemplates.length}+ professional resume examples
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by role, industry, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No templates found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 overflow-hidden hover:shadow-lg"
                >
                  {/* Template Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50 p-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <span className="text-3xl">{template.icon}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{template.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{template.experience}</p>
                      </div>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Use
                      </button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {template.category}
                      </span>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                      >
                        Use Template
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{previewTemplate.name}</h3>
                  <p className="text-gray-600">{previewTemplate.role}</p>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(previewTemplate.data, null, 2)}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Use This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesLibrary;
