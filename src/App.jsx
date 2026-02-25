import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Eye, Download, Sparkles, Palette, GripVertical, Upload, X, BarChart3 } from 'lucide-react';
import { generatePDF, previewPDF } from './utils/pdfGenerator';
import { downloadPDFByTemplate } from './utils/templateManager';
import RichTextEditor from './components/RichTextEditor';
import SectionRenderer from './components/SectionRenderer';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import EditResume from './components/EditResume';
import TemplateSelector from './components/TemplateSelector';
import RealtimePreview from './components/RealtimePreview';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ScrollToTop from './components/ScrollToTop';
import { trackDownload, trackPreview } from './utils/analytics';
import { saveToLocalStorage } from './utils/pdfParser';

function App() {
  const [resumeType, setResumeType] = useState(null); // 'with-photo' or 'without-photo'
  const [photo, setPhoto] = useState(null); // Base64 encoded photo
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // Template selection
  const [showRealtimePreview, setShowRealtimePreview] = useState(false); // Real-time preview toggle
  
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
    education: [],
    experience: [],
    skills: [],
    projects: [],
    customSections: [],
    colorTheme: 'blue', // Default color theme
    fontStyle: 'helvetica' // Default font style
  });

  const [sectionOrder, setSectionOrder] = useState(['education', 'experience', 'skills', 'projects']);
  const [showCustomSectionModal, setShowCustomSectionModal] = useState(false);
  const [showAnalyzer, setShowAnalyzer] = useState(false); // Toggle for analyzer sidebar (hidden by default)
  const [customSectionInput, setCustomSectionInput] = useState('');
  const [draggedSection, setDraggedSection] = useState(null);
  const [draggedCustomSection, setDraggedCustomSection] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showEditResume, setShowEditResume] = useState(false);

  // Auto-save to localStorage whenever formData, resumeType, or photo changes
  useEffect(() => {
    if (resumeType) {
      const timer = setTimeout(() => {
        saveToLocalStorage(formData, resumeType, photo);
      }, 2000); // Save after 2 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [formData, resumeType, photo]);

  // Check for admin route and authentication
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setIsAdminRoute(true);
      // Check if already authenticated
      const authToken = sessionStorage.getItem('admin_auth');
      if (authToken === 'authenticated') {
        setIsAdminAuthenticated(true);
        setShowAdmin(true);
      }
    }
  }, []);

  // Check if user has filled any data
  const hasFilledData = () => {
    const { personalInfo, education, experience, skills, projects } = formData;
    
    // Check personal info
    const hasPersonalInfo = personalInfo.fullName || personalInfo.email || 
                           personalInfo.phone || personalInfo.summary;
    
    // Check if any section has data
    const hasEducation = education.length > 0 && education.some(e => e.degree || e.institution);
    const hasExperience = experience.length > 0 && experience.some(e => e.title || e.company);
    const hasSkills = skills.length > 0 && skills.some(s => s.category || s.items);
    const hasProjects = projects.length > 0 && projects.some(p => p.name);
    
    return hasPersonalInfo || hasEducation || hasExperience || hasSkills || hasProjects;
  };

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
    // Preview is now always visible in real-time preview component
    // This function just tracks the preview action
    trackPreview(resumeType, formData.colorTheme);
  };

  const handleDownload = () => {
    downloadPDFByTemplate(selectedTemplate, formData, sectionOrder, photo);
    trackDownload(resumeType, formData.colorTheme);
  };

  const handleSelectResumeType = (type) => {
    setResumeType(type);
    // Clear photo if switching to without-photo type
    if (type === 'without-photo') {
      setPhoto(null);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setShowAdmin(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_login_time');
    setIsAdminAuthenticated(false);
    setShowAdmin(false);
    window.location.href = '/';
  };

  const handleLoadData = (loadedData) => {
    if (loadedData.formData) {
      setFormData(loadedData.formData);
    }
    if (loadedData.resumeType) {
      setResumeType(loadedData.resumeType);
    }
    if (loadedData.photo) {
      setPhoto(loadedData.photo);
    }
    setShowEditResume(false);
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

  // Show admin login if on admin route and not authenticated
  if (isAdminRoute && !isAdminAuthenticated) {
    return <AdminLogin onLoginSuccess={handleAdminLogin} />;
  }

  // Show admin panel if on admin route and authenticated
  if (isAdminRoute && isAdminAuthenticated) {
    return <AdminPanel onClose={handleAdminLogout} />;
  }

  // Show landing page if resume type not selected
  if (!resumeType) {
    return (
      <>
        <LandingPage 
          onSelectType={handleSelectResumeType}
          onEditResume={() => setShowEditResume(true)}
        />
        {showEditResume && (
          <EditResume 
            onClose={() => setShowEditResume(false)}
            onLoadData={handleLoadData}
          />
        )}
      </>
    );
  }

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
                {resumeType === 'with-photo' && (
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                    With Photo
                  </span>
                )}
              </div>
              <p className="text-gray-600">Create your professional resume with ease</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setResumeType(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                title="Change resume type"
              >
                Change Type
              </button>
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
        </div>

        {/* Main Content Grid - Form and Preview */}
        <div className={`grid grid-cols-1 gap-6 ${showRealtimePreview ? 'lg:grid-cols-3' : ''}`}>
          {/* Left Column - Form (dynamic width based on preview visibility) */}
          <div className={showRealtimePreview ? 'lg:col-span-2' : ''}>
            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              {/* Template Selector */}
              <TemplateSelector 
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />

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

          {/* Font Style Selection */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-600 pb-2 flex items-center gap-2">
              <Palette className="w-6 h-6" />
              Font Style
            </h2>
            <p className="text-sm text-gray-600 mb-4">Choose a font style for your resume</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Helvetica', value: 'helvetica', description: 'Clean and professional' },
                { name: 'Times New Roman', value: 'times', description: 'Classic and traditional' },
                { name: 'Courier', value: 'courier', description: 'Modern monospace' },
                { name: 'Arial', value: 'arial', description: 'Simple and readable' },
                { name: 'Georgia', value: 'georgia', description: 'Elegant serif' },
                { name: 'Palatino', value: 'palatino', description: 'Sophisticated style' }
              ].map((font) => (
                <button
                  key={font.value}
                  onClick={() => setFormData(prev => ({ ...prev, fontStyle: font.value }))}
                  className={`flex flex-col items-start gap-1 p-4 rounded-lg border-2 transition-all text-left ${
                    formData.fontStyle === font.value
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg font-semibold text-gray-800" style={{ fontFamily: font.value === 'times' ? 'Times New Roman' : font.value === 'courier' ? 'Courier New' : font.value === 'arial' ? 'Arial' : font.value === 'georgia' ? 'Georgia' : font.value === 'palatino' ? 'Palatino' : 'Helvetica' }}>
                    {font.name}
                  </span>
                  <span className="text-xs text-gray-500">{font.description}</span>
                  {formData.fontStyle === font.value && (
                    <span className="text-xs text-indigo-600 font-semibold mt-1">✓ Selected</span>
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
            
            {/* Photo Upload - Only for with-photo resumes */}
            {resumeType === 'with-photo' && (
              <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Professional Photo
                </h3>
                {!photo ? (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-300 rounded-lg bg-white hover:bg-purple-50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer text-center">
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-gray-700 font-medium mb-1">Click to upload photo</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                      <p className="text-xs text-gray-400 mt-2">Recommended: Professional headshot, square format</p>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={photo}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-lg border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        ✓ Photo uploaded successfully
                      </p>
                      <label
                        htmlFor="photo-upload-change"
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer text-sm font-medium"
                      >
                        Change Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload-change"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
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
          {hasFilledData() && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          )}
            </div>
          </div>

          {/* Right Column - Real-time Preview (1/3 width) - Only show when enabled */}
          {showRealtimePreview && (
            <div className="lg:col-span-1">
              {resumeType && hasFilledData() ? (
                <RealtimePreview
                  formData={formData}
                  sectionOrder={sectionOrder}
                  photo={photo}
                  template={selectedTemplate}
                  onDownload={handleDownload}
                  isVisible={showRealtimePreview}
                  onVisibilityChange={setShowRealtimePreview}
                />
              ) : (
                <div className="sticky top-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Live Preview</h3>
                  <p className="text-sm text-gray-500">Fill in your details to see a real-time preview of your resume</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-6">
          <p>Click "Fill Sample Data" for a quick demo, or fill in your details manually.</p>
          <p className="mt-1">{hasFilledData() ? 'Use the real-time preview or "Download PDF" to get your resume.' : 'Fill in your details to see preview and download options.'}</p>
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

      {/* Resume Analyzer - Full Width Bottom Panel */}
      {resumeType && hasFilledData() && (
        <>
          {/* Toggle Button - Fixed at bottom */}
          <button
            onClick={() => setShowAnalyzer(!showAnalyzer)}
            className={`fixed bottom-24 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-105 ${
              showAnalyzer ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            title="Show Resume Score"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-semibold">Resume Score</span>
          </button>

          {/* Analyzer Bottom Panel - Full Width */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-purple-600 shadow-2xl transition-all duration-300 ${
              showAnalyzer ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
            style={{ maxHeight: '60vh' }}
          >
            <div className="relative max-w-7xl mx-auto">
              {/* Close Button */}
              <button
                onClick={() => setShowAnalyzer(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200 transition-colors border-2 border-gray-300"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Analyzer Component */}
              <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                <ResumeAnalyzer formData={formData} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Show Preview Button - Shows when preview is hidden and user has data */}
      {resumeType && hasFilledData() && !showRealtimePreview && (
        <button
          onClick={() => setShowRealtimePreview(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-2xl hover:shadow-blue-500/50 hover:scale-105 z-40 animate-slideUp animate-pulse-shadow"
          title="Show live preview"
        >
          <Eye className="w-5 h-5" />
          <span className="hidden sm:inline">Show Preview</span>
        </button>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
