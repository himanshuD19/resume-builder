import jsPDF from 'jspdf';

// ATS-Friendly Template - Optimized for Applicant Tracking Systems
// Simple, clean, no graphics, easy to parse

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGINS = { top: 20, bottom: 20, left: 20, right: 20 };
const CONTENT_WIDTH = PAGE_WIDTH - MARGINS.left - MARGINS.right;

const COLORS = {
  primary: '#000000',
  secondary: '#000000',
  text: '#000000'
};

// Helper function to check page break
function checkPageBreak(doc, yPos, requiredSpace) {
  if (yPos + requiredSpace > PAGE_HEIGHT - MARGINS.bottom) {
    doc.addPage();
    return MARGINS.top;
  }
  return yPos;
}

// Helper function to wrap text
function wrapText(doc, text, maxWidth) {
  return doc.splitTextToSize(text, maxWidth);
}

// Simple section header - ATS friendly (no lines, simple formatting)
function addSectionHeader(doc, text, yPos, fontFamily = 'helvetica') {
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(COLORS.primary);
  doc.text(text.toUpperCase(), MARGINS.left, yPos);
  return yPos + 7;
}

export function generateATSPDF(formData, photo = null) {
  const doc = new jsPDF();
  const FONT_FAMILY = 'helvetica'; // ATS systems prefer standard fonts
  let yPos = MARGINS.top;

  // Header - Name (Left-aligned, Simple)
  doc.setFontSize(16);
  doc.setFont(FONT_FAMILY, 'bold');
  doc.setTextColor(COLORS.primary);
  doc.text(formData.personalInfo.fullName || 'Your Name', MARGINS.left, yPos);
  yPos += 7;

  // Contact Info (Left-aligned, One per line for ATS parsing)
  doc.setFontSize(10);
  doc.setFont(FONT_FAMILY, 'normal');
  doc.setTextColor(COLORS.text);
  
  if (formData.personalInfo.email) {
    doc.text(`Email: ${formData.personalInfo.email}`, MARGINS.left, yPos);
    yPos += 5;
  }
  
  if (formData.personalInfo.phone) {
    doc.text(`Phone: ${formData.personalInfo.phone}`, MARGINS.left, yPos);
    yPos += 5;
  }
  
  if (formData.personalInfo.address) {
    doc.text(`Address: ${formData.personalInfo.address}`, MARGINS.left, yPos);
    yPos += 5;
  }
  
  if (formData.personalInfo.linkedin) {
    doc.text(`LinkedIn: ${formData.personalInfo.linkedin}`, MARGINS.left, yPos);
    yPos += 5;
  }
  
  if (formData.personalInfo.portfolio) {
    doc.text(`Portfolio: ${formData.personalInfo.portfolio}`, MARGINS.left, yPos);
    yPos += 5;
  }

  yPos += 5;

  // Professional Summary
  if (formData.personalInfo.summary && formData.personalInfo.summary.trim()) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Professional Summary', yPos, FONT_FAMILY);
    
    doc.setFontSize(10);
    doc.setFont(FONT_FAMILY, 'normal');
    doc.setTextColor(COLORS.text);
    
    const summaryLines = wrapText(doc, formData.personalInfo.summary, CONTENT_WIDTH);
    summaryLines.forEach(line => {
      yPos = checkPageBreak(doc, yPos, 5);
      doc.text(line, MARGINS.left, yPos);
      yPos += 5;
    });
    yPos += 5;
  }

  // Work Experience (Most important for ATS - put first)
  const hasExperience = formData.experience.some(exp => exp.title || exp.company);
  if (hasExperience) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Work Experience', yPos, FONT_FAMILY);
    
    formData.experience.forEach(exp => {
      if (!exp.title && !exp.company) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      // Job Title
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(exp.title || 'Position', MARGINS.left, yPos);
      yPos += 5;
      
      // Company and Dates (separate lines for ATS)
      doc.setFontSize(10);
      doc.setFont(FONT_FAMILY, 'normal');
      
      if (exp.company) {
        let companyLine = exp.company;
        if (exp.location) companyLine += ` | ${exp.location}`;
        doc.text(companyLine, MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (exp.startDate || exp.endDate) {
        const dateText = `${exp.startDate || ''} - ${exp.endDate || ''}`;
        doc.text(dateText, MARGINS.left, yPos);
        yPos += 5;
      }
      
      // Description
      if (exp.description && exp.description.trim()) {
        doc.setFontSize(10);
        doc.setFont(FONT_FAMILY, 'normal');
        doc.setTextColor(COLORS.text);
        
        const descLines = exp.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          const trimmedLine = line.trim();
          
          // Keep bullets simple for ATS
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            const wrappedText = wrapText(doc, `• ${bulletText}`, CONTENT_WIDTH);
            wrappedText.forEach(textLine => {
              yPos = checkPageBreak(doc, yPos, 5);
              doc.text(textLine, MARGINS.left, yPos);
              yPos += 5;
            });
          } else {
            const wrappedText = wrapText(doc, trimmedLine, CONTENT_WIDTH);
            wrappedText.forEach(textLine => {
              yPos = checkPageBreak(doc, yPos, 5);
              doc.text(textLine, MARGINS.left, yPos);
              yPos += 5;
            });
          }
        });
      }
      
      yPos += 3;
    });
    yPos += 3;
  }

  // Education
  const hasEducation = formData.education.some(edu => edu.degree || edu.institution);
  if (hasEducation) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Education', yPos, FONT_FAMILY);
    
    formData.education.forEach(edu => {
      if (!edu.degree && !edu.institution) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      // Degree
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(edu.degree || 'Degree', MARGINS.left, yPos);
      yPos += 5;
      
      // Institution and location (separate lines)
      doc.setFontSize(10);
      doc.setFont(FONT_FAMILY, 'normal');
      
      if (edu.institution) {
        let institutionLine = edu.institution;
        if (edu.location) institutionLine += ` | ${edu.location}`;
        doc.text(institutionLine, MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (edu.startDate || edu.endDate) {
        const dateText = `${edu.startDate || ''} - ${edu.endDate || ''}`;
        doc.text(dateText, MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (edu.gpa) {
        doc.text(`GPA: ${edu.gpa}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      yPos += 3;
    });
    yPos += 3;
  }

  // Skills (Important for ATS keyword matching)
  const hasSkills = formData.skills.some(skill => skill.category || skill.items);
  if (hasSkills) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Skills', yPos, FONT_FAMILY);
    
    formData.skills.forEach(skill => {
      if (!skill.category && !skill.items) return;
      
      yPos = checkPageBreak(doc, yPos, 10);
      
      doc.setFontSize(10);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text);
      
      if (skill.category) {
        doc.text(skill.category + ':', MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (skill.items) {
        doc.setFont(FONT_FAMILY, 'normal');
        const skillLines = wrapText(doc, skill.items, CONTENT_WIDTH);
        skillLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          doc.text(line, MARGINS.left, yPos);
          yPos += 5;
        });
      }
      
      yPos += 2;
    });
    yPos += 3;
  }

  // Projects
  const hasProjects = formData.projects.some(project => project.name);
  if (hasProjects) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Projects', yPos, FONT_FAMILY);
    
    formData.projects.forEach(project => {
      if (!project.name) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(project.name, MARGINS.left, yPos);
      yPos += 5;
      
      if (project.technologies) {
        doc.setFontSize(10);
        doc.setFont(FONT_FAMILY, 'normal');
        doc.text(`Technologies: ${project.technologies}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (project.link) {
        doc.text(`Link: ${project.link}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (project.description && project.description.trim()) {
        doc.setFontSize(10);
        doc.setFont(FONT_FAMILY, 'normal');
        
        const descLines = wrapText(doc, project.description, CONTENT_WIDTH);
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          doc.text(line, MARGINS.left, yPos);
          yPos += 5;
        });
      }
      
      yPos += 3;
    });
  }

  return doc;
}

export function previewATSPDF(formData, photo = null) {
  const doc = generateATSPDF(formData, photo);
  return doc.output('dataurlstring');
}
