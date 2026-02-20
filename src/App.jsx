import React, { useState } from 'react';
import { FileText, Plus, Trash2, Eye, Download, Sparkles, Palette, GripVertical } from 'lucide-react';
import { generatePDF, previewPDF } from './utils/pdfGenerator';
import RichTextEditor from './components/RichTextEditor';
import SectionRenderer from './components/SectionRenderer';

function App() {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: '',
      summary: ''
    },
    education: [
      { degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' }
    ],
    experience: [
      { title: '', company: '', location: '', startDate: '', endDate: '', description: '' }
    ],
    skills: [{ category: '', items: '' }],
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    customSections: [], // User-defined custom sections
    colorTheme: 'blue' // Default color theme
  });

  const [sectionOrder, setSectionOrder] = useState(['education', 'experience', 'skills', 'projects']);
  const [showPreview, setShowPreview] = useState(false);
  const [showCustomSectionModal, setShowCustomSectionModal] = useState(false);
  const [customSectionInput, setCustomSectionInput] = useState('');
  const [draggedSection, setDraggedSection] = useState(null);
  const [draggedCustomSection, setDraggedCustomSection] = useState(null);

  const handlePersonalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayField = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayField = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const addCustomSection = () => {
    setCustomSectionInput('');
    setShowCustomSectionModal(true);
  };

  const handleCustomSectionSubmit = () => {
    if (customSectionInput && customSectionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        customSections: [...prev.customSections, { 
          title: customSectionInput.trim(), 
          items: [{ content: '' }] 
        }]
      }));
      setShowCustomSectionModal(false);
      setCustomSectionInput('');
    }
  };

  const handleCustomSectionCancel = () => {
    setShowCustomSectionModal(false);
    setCustomSectionInput('');
  };

  const removeCustomSection = (index) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index)
    }));
  };

  const handleCustomSectionTitleChange = (sectionIndex, newTitle) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) => 
        i === sectionIndex ? { ...section, title: newTitle } : section
      )
    }));
  };

  const addCustomSectionItem = (sectionIndex) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, items: [...section.items, { content: '' }] }
          : section
      )
    }));
  };

  const removeCustomSectionItem = (sectionIndex, itemIndex) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, items: section.items.filter((_, idx) => idx !== itemIndex) }
          : section
      )
    }));
  };

  const handleCustomSectionItemChange = (sectionIndex, itemIndex, value) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) => 
        i === sectionIndex 
          ? { 
              ...section, 
              items: section.items.map((item, idx) => 
                idx === itemIndex ? { content: value } : item
              ) 
            }
          : section
      )
    }));
  };

  // Drag and drop handlers for main sections
  const handleSectionDragStart = (e, sectionKey) => {
    setDraggedSection(sectionKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleSectionDrop = (e, targetSectionKey) => {
    e.preventDefault();
    if (draggedSection && draggedSection !== targetSectionKey) {
      const newOrder = [...sectionOrder];
      const draggedIndex = newOrder.indexOf(draggedSection);
      const targetIndex = newOrder.indexOf(targetSectionKey);
      
      // Remove dragged item and insert at target position
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedSection);
      
      setSectionOrder(newOrder);
    }
    setDraggedSection(null);
  };

  const handleSectionDragEnd = () => {
    setDraggedSection(null);
  };

  // Drag and drop handlers for custom sections
  const handleCustomSectionDragStart = (e, index) => {
    setDraggedCustomSection(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCustomSectionDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCustomSectionDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedCustomSection !== null && draggedCustomSection !== targetIndex) {
      const newCustomSections = [...formData.customSections];
      const draggedItem = newCustomSections[draggedCustomSection];
      
      // Remove dragged item and insert at target position
      newCustomSections.splice(draggedCustomSection, 1);
      newCustomSections.splice(targetIndex, 0, draggedItem);
      
      setFormData(prev => ({
        ...prev,
        customSections: newCustomSections
      }));
    }
    setDraggedCustomSection(null);
  };

  const handleCustomSectionDragEnd = () => {
    setDraggedCustomSection(null);
  };

  const fillSampleData = () => {
    setFormData({
      personalInfo: {
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/sarahjohnson',
        portfolio: 'sarahjohnson.dev',
        summary: 'Results-driven Full Stack Developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact solutions that improve user experience and business outcomes.'
      },
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'Stanford University',
          location: 'Stanford, CA',
          startDate: 'Sep 2015',
          endDate: 'Jun 2019',
          gpa: '3.8/4.0'
        },
        {
          degree: 'AWS Certified Solutions Architect',
          institution: 'Amazon Web Services',
          location: 'Online',
          startDate: 'Jan 2022',
          endDate: 'Mar 2022',
          gpa: ''
        }
      ],
      experience: [
        {
          title: 'Senior Full Stack Developer',
          company: 'TechCorp Solutions',
          location: 'San Francisco, CA',
          startDate: 'Jan 2022',
          endDate: 'Present',
          description: `**Key Achievements:**
• **Led development** of a *microservices architecture* serving **1M+ active users** with 99.9% uptime
• Improved application performance by **60%** through code optimization and caching strategies
• *Mentored* 5 junior developers and established best practices for code reviews

**Technical Contributions:**
1. **Architected and implemented** RESTful APIs using Node.js, Express, and PostgreSQL
2. Built responsive front-end applications with *React, Redux, and TypeScript*
3. Integrated third-party services including **Stripe**, SendGrid, and *AWS S3*
4. Established **CI/CD pipeline** using GitHub Actions, reducing deployment time by *75%*`
        },
        {
          title: 'Full Stack Developer',
          company: 'StartupHub Inc',
          location: 'San Francisco, CA',
          startDate: 'Jun 2019',
          endDate: 'Dec 2021',
          description: `• Developed and maintained **e-commerce platform** handling *$2M+ in annual transactions*
• Implemented **real-time features** using WebSockets and Redis
• Collaborated with *design team* to create intuitive user interfaces
• Reduced page load time by **40%** through optimization techniques
1. Built authentication system with **JWT** and OAuth 2.0
2. Created *automated testing suite* with 85% code coverage
3. Optimized database queries reducing response time by **50%**`
        }
      ],
      skills: [
        {
          category: 'Programming Languages',
          items: 'JavaScript, TypeScript, Python, Java, SQL, HTML5, CSS3'
        },
        {
          category: 'Frontend Technologies',
          items: 'React, Redux, Next.js, Vue.js, TailwindCSS, Material-UI, Webpack'
        },
        {
          category: 'Backend Technologies',
          items: 'Node.js, Express, Django, REST APIs, GraphQL, Microservices'
        },
        {
          category: 'Databases & Cloud',
          items: 'PostgreSQL, MongoDB, Redis, AWS (EC2, S3, Lambda), Docker, Kubernetes'
        },
        {
          category: 'Tools & Practices',
          items: 'Git, GitHub Actions, Jest, Cypress, Agile/Scrum, CI/CD, TDD'
        }
      ],
      projects: [
        {
          name: 'E-Commerce Analytics Dashboard',
          technologies: 'React, Node.js, PostgreSQL, Chart.js, AWS',
          link: 'github.com/sarahjohnson/analytics-dashboard',
          description: `**Key Features:**
• Built **comprehensive analytics platform** for e-commerce businesses
• Implemented *real-time sales tracking* and customer insights
• Created **predictive analytics** using machine learning algorithms
• Designed *interactive dashboards* with Chart.js and D3.js
• Automated reporting system with **email notifications**`
        },
        {
          name: 'Task Management SaaS Application',
          technologies: 'Next.js, TypeScript, MongoDB, Stripe, Vercel',
          link: 'taskmaster.app',
          description: `**Achievements:**
• Developed full-featured **project management tool** with team collaboration
• Implemented *real-time updates* using WebSockets
• Integrated **Stripe subscription billing** with multiple pricing tiers
• Achieved **500+ active users** within first 3 months
• Built responsive UI with *Next.js and TypeScript*`
        },
        {
          name: 'Open Source Contribution - React Component Library',
          technologies: 'React, TypeScript, Storybook, NPM',
          link: 'github.com/sarahjohnson/react-ui-components',
          description: `**Impact:**
• Created and maintain open-source library with **1000+ GitHub stars**
• Includes **50+ customizable components** with full TypeScript support
• Comprehensive *documentation* and interactive Storybook demos
• Implements **WCAG 2.1 accessibility standards**
• Published to *NPM* with 10K+ monthly downloads`
        }
      ],
      customSections: [
        {
          title: 'Certifications',
          items: [
            { content: '**AWS Certified Solutions Architect** - Amazon Web Services (2023)' },
            { content: '**Professional Scrum Master (PSM I)** - Scrum.org (2022)' },
            { content: '**MongoDB Certified Developer** - MongoDB University (2021)' }
          ]
        },
        {
          title: 'Awards & Recognition',
          items: [
            { content: '**Employee of the Year** - TechCorp Solutions (2023)' },
            { content: '**Best Innovation Award** for microservices architecture implementation' },
            { content: '**Hackathon Winner** - Internal company hackathon for AI-powered tool (2022)' }
          ]
        }
      ],
      colorTheme: 'blue'
    });
  };

  const handlePreview = () => {
    previewPDF(formData, sectionOrder);
    setShowPreview(true);
  };

  const handleDownload = () => {
    generatePDF(formData, sectionOrder);
  };

  // Helper function to get section configuration
  const getSectionConfig = (sectionKey) => {
    const configs = {
      education: {
        title: 'Education',
        addButtonText: 'Add Education',
        template: { degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' }
      },
      experience: {
        title: 'Work Experience',
        addButtonText: 'Add Experience',
        template: { title: '', company: '', location: '', startDate: '', endDate: '', description: '' }
      },
      skills: {
        title: 'Skills',
        addButtonText: 'Add Skill Category',
        template: { category: '', items: '' }
      },
      projects: {
        title: 'Projects',
        addButtonText: 'Add Project',
        template: { name: '', description: '', technologies: '', link: '' }
      }
    };
    return configs[sectionKey];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-800">Resume Builder</h1>
              </div>
              <p className="text-gray-600">Create your professional resume with ease</p>
            </div>
            <button
              onClick={fillSampleData}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-md whitespace-nowrap"
              title="Fill form with sample data for quick preview"
            >
              <Sparkles className="w-5 h-5" />
              Fill Sample Data
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Color Theme Selector */}
          <section className="mb-8 pb-6 border-b-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-800">PDF Color Theme</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select a color theme for your resume headings and name</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                { name: 'Blue', value: 'blue', color: '#1e40af', bgColor: 'bg-blue-700' },
                { name: 'Indigo', value: 'indigo', color: '#4338ca', bgColor: 'bg-indigo-700' },
                { name: 'Purple', value: 'purple', color: '#7c3aed', bgColor: 'bg-purple-600' },
                { name: 'Green', value: 'green', color: '#059669', bgColor: 'bg-emerald-600' },
                { name: 'Teal', value: 'teal', color: '#0d9488', bgColor: 'bg-teal-600' },
                { name: 'Red', value: 'red', color: '#dc2626', bgColor: 'bg-red-600' },
                { name: 'Orange', value: 'orange', color: '#ea580c', bgColor: 'bg-orange-600' },
                { name: 'Pink', value: 'pink', color: '#db2777', bgColor: 'bg-pink-600' },
                { name: 'Slate', value: 'slate', color: '#475569', bgColor: 'bg-slate-600' },
                { name: 'Gray', value: 'gray', color: '#4b5563', bgColor: 'bg-gray-600' },
                { name: 'Cyan', value: 'cyan', color: '#0891b2', bgColor: 'bg-cyan-600' },
                { name: 'Navy', value: 'navy', color: '#1e3a8a', bgColor: 'bg-blue-900' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setFormData(prev => ({ ...prev, colorTheme: theme.value }))}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    formData.colorTheme === theme.value
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={`${theme.name} theme`}
                >
                  <div className={`w-10 h-10 rounded-full ${theme.bgColor} shadow-sm`}></div>
                  <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                  {formData.colorTheme === theme.value && (
                    <span className="text-xs text-indigo-600 font-semibold">✓ Selected</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Personal Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-600 pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
              />
              <input
                type="email"
                placeholder="Email *"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.personalInfo.address}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
              />
              <input
                type="text"
                placeholder="LinkedIn Profile"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.personalInfo.linkedin}
                onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
              />
              <input
                type="text"
                placeholder="Portfolio/Website"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.personalInfo.portfolio}
                onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
              />
            </div>
            <textarea
              placeholder="Professional Summary"
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="4"
              value={formData.personalInfo.summary}
              onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
            />
          </section>

          {/* Main Sections - Draggable and Reorderable */}
          {sectionOrder.map((sectionKey) => (
            <SectionRenderer
              key={sectionKey}
              sectionKey={sectionKey}
              formData={formData}
              handleArrayFieldChange={handleArrayFieldChange}
              addArrayField={addArrayField}
              removeArrayField={removeArrayField}
              onDragStart={handleSectionDragStart}
              onDragOver={handleSectionDragOver}
              onDrop={handleSectionDrop}
              onDragEnd={handleSectionDragEnd}
              isDragging={draggedSection === sectionKey}
            />
          ))}

          {/* Custom Sections */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-600 pb-2">
                Custom Sections
              </h2>
              <button
                onClick={addCustomSection}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Custom Section
              </button>
            </div>
            
            {formData.customSections.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-600 mb-2">No custom sections yet</p>
                <p className="text-sm text-gray-500">
                  Click "Add Custom Section" to add sections like Certifications, Awards, Publications, Languages, Volunteer Work, etc.
                </p>
              </div>
            ) : (
              formData.customSections.map((section, sectionIndex) => (
                <div 
                  key={sectionIndex} 
                  className={`mb-6 p-4 border-2 border-purple-200 rounded-lg bg-purple-50 transition-all ${draggedCustomSection === sectionIndex ? 'opacity-50' : 'opacity-100'}`}
                  draggable
                  onDragStart={(e) => handleCustomSectionDragStart(e, sectionIndex)}
                  onDragOver={handleCustomSectionDragOver}
                  onDrop={(e) => handleCustomSectionDrop(e, sectionIndex)}
                  onDragEnd={handleCustomSectionDragEnd}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="cursor-move text-purple-400 hover:text-purple-600 transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Section Title"
                        className="text-lg font-semibold text-gray-800 bg-transparent border-b-2 border-purple-400 focus:border-purple-600 outline-none px-2 py-1 flex-1"
                        value={section.title}
                        onChange={(e) => handleCustomSectionTitleChange(sectionIndex, e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => removeCustomSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                      title="Remove this section"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-3 flex gap-2">
                      <div className="flex-1">
                        <RichTextEditor
                          value={item.content}
                          onChange={(value) => handleCustomSectionItemChange(sectionIndex, itemIndex, value)}
                          placeholder="Add content - Use toolbar for bold, italic, bullets, and numbering"
                        />
                      </div>
                      {section.items.length > 1 && (
                        <button
                          onClick={() => removeCustomSectionItem(sectionIndex, itemIndex)}
                          className="text-red-500 hover:text-red-700 self-start mt-2"
                          title="Remove this item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={() => addCustomSectionItem(sectionIndex)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm mt-2"
                  >
                    <Plus className="w-3 h-3" />
                    Add Item
                  </button>
                </div>
              ))
            )}
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={handlePreview}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
            >
              <Eye className="w-5 h-5" />
              Preview PDF
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Click "Fill Sample Data" for a quick demo, or fill in your details manually.</p>
          <p className="mt-1">Use "Preview PDF" to see your resume or "Download PDF" to save it.</p>
        </div>
      </div>

      {/* Custom Section Modal */}
      {showCustomSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Add Custom Section
              </h3>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Section Name
              </label>
              <input
                type="text"
                value={customSectionInput}
                onChange={(e) => setCustomSectionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCustomSectionSubmit();
                  if (e.key === 'Escape') handleCustomSectionCancel();
                }}
                placeholder="e.g., Certifications, Awards, Publications"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                autoFocus
              />
              
              {/* Suggestions */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Popular sections:</p>
                <div className="flex flex-wrap gap-2">
                  {['Certifications', 'Awards', 'Publications', 'Languages', 'Volunteer Work', 'Memberships'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setCustomSectionInput(suggestion)}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3 justify-end">
              <button
                onClick={handleCustomSectionCancel}
                className="px-5 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomSectionSubmit}
                disabled={!customSectionInput.trim()}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
