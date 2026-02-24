// Template Manager - Handles all resume templates

import { generatePDF as generateModernPDF, previewPDF as previewModernPDF } from './pdfGenerator';
import { generateClassicPDF, previewClassicPDF } from './templates/classicTemplate';
import { generateATSPDF, previewATSPDF } from './templates/atsTemplate';

// Available templates
export const TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Colorful, creative design with photo support',
    icon: '🎨',
    features: ['Color themes', 'Photo support', 'Modern layout'],
    bestFor: 'Creative, Tech, Marketing roles'
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, professional, conservative',
    icon: '📄',
    features: ['Traditional layout', 'Professional look', 'Timeless design'],
    bestFor: 'Corporate, Finance, Legal, Government'
  },
  ats: {
    id: 'ats',
    name: 'ATS-Friendly',
    description: 'Optimized for Applicant Tracking Systems',
    icon: '🤖',
    features: ['Simple formatting', 'Easy to parse', 'Keyword optimized'],
    bestFor: 'Online applications, Large companies'
  }
};

// Generate PDF based on selected template
export function generatePDFByTemplate(template, formData, sectionOrder, photo) {
  switch (template) {
    case 'classic':
      return generateClassicPDF(formData, photo);
    case 'ats':
      return generateATSPDF(formData, photo);
    case 'modern':
    default:
      return generateModernPDF(formData, sectionOrder, photo);
  }
}

// Preview PDF based on selected template
// Returns jsPDF document object (NOT data URL to avoid triggering browser actions)
export function previewPDFByTemplate(template, formData, sectionOrder, photo) {
  let doc;
  switch (template) {
    case 'classic':
      doc = generateClassicPDF(formData, photo);
      break;
    case 'ats':
      doc = generateATSPDF(formData, photo);
      break;
    case 'modern':
    default:
      doc = generateModernPDF(formData, sectionOrder, photo);
      break;
  }
  // Return the document object, let the caller decide what to do with it
  // This prevents automatic opening in new tabs
  return doc;
}

// Download PDF with template
export function downloadPDFByTemplate(template, formData, sectionOrder, photo) {
  const doc = generatePDFByTemplate(template, formData, sectionOrder, photo);
  
  const fileName = formData.personalInfo.fullName 
    ? `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  
  doc.save(fileName);
}
