import jsPDF from 'jspdf';

// ATS-Friendly Template - Optimized for Applicant Tracking Systems
// Simple, clean, no graphics, easy to parse

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGINS = { top: 20, bottom: 20, left: 20, right: 20 };
const CONTENT_WIDTH = PAGE_WIDTH - MARGINS.left - MARGINS.right;

// Get colors based on theme
function getColors(theme = 'blue') {
  const colorMap = {
    blue: { r: 30, g: 64, b: 175 },
    green: { r: 22, g: 163, b: 74 },
    purple: { r: 147, g: 51, b: 234 },
    red: { r: 220, g: 38, b: 38 },
    teal: { r: 20, g: 184, b: 166 },
    orange: { r: 234, g: 88, b: 12 },
    pink: { r: 219, g: 39, b: 119 },
    indigo: { r: 99, g: 102, b: 241 },
    gray: { r: 75, g: 85, b: 99 },
    cyan: { r: 6, g: 182, b: 212 },
    navy: { r: 30, g: 58, b: 138 },
    emerald: { r: 16, g: 185, b: 129 }
  };

  const color = colorMap[theme] || colorMap.blue;
  
  return {
    primary: color,
    secondary: { r: 51, g: 51, b: 51 },
    text: { r: 0, g: 0, b: 0 },
    lightGray: { r: 102, g: 102, b: 102 }
  };
}

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
function addSectionHeader(doc, text, yPos, colors, fontFamily = 'helvetica') {
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.text(text.toUpperCase(), MARGINS.left, yPos);
  return yPos + 7;
}

export function generateATSPDF(formData, photo = null) {
  const doc = new jsPDF();
  const FONT_FAMILY = formData.fontStyle || 'helvetica'; // ATS systems prefer standard fonts
  const COLORS = getColors(formData.colorTheme || 'blue');
  let yPos = MARGINS.top;

  // Add photo if provided (Note: Photos not recommended for ATS, but adding support)
  if (photo) {
    const photoSize = 25; // 25mm square for ATS template (smaller, less intrusive)
    const photoX = PAGE_WIDTH - MARGINS.right - photoSize;
    const photoY = MARGINS.top;
    
    try {
      doc.addImage(photo, 'JPEG', photoX, photoY, photoSize, photoSize);
      // Simple border
      doc.setDrawColor(0, 0, 0); // Black border for ATS
      doc.setLineWidth(0.3);
      doc.rect(photoX, photoY, photoSize, photoSize);
    } catch (error) {
      console.error('Error adding photo to ATS PDF:', error);
    }
  }

  // Header - Name (Left-aligned, Simple)
  doc.setFontSize(16);
  doc.setFont(FONT_FAMILY, 'bold');
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(formData.personalInfo.fullName || 'Your Name', MARGINS.left, yPos);
  yPos += 7;

  // Contact Info (Left-aligned, One per line for ATS parsing)
  doc.setFontSize(10);
  doc.setFont(FONT_FAMILY, 'normal');
  doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
  
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
    yPos = addSectionHeader(doc, 'Professional Summary', yPos, COLORS, FONT_FAMILY);
    
    doc.setFontSize(10);
    doc.setFont(FONT_FAMILY, 'normal');
    doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
    
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
    yPos = addSectionHeader(doc, 'Work Experience', yPos, COLORS, FONT_FAMILY);
    
    formData.experience.forEach(exp => {
      if (!exp.title && !exp.company) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      // Job Title
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
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
        doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        
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
    yPos = addSectionHeader(doc, 'Education', yPos, COLORS, FONT_FAMILY);
    
    formData.education.forEach(edu => {
      if (!edu.degree && !edu.institution) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      // Degree
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
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
    yPos = addSectionHeader(doc, 'Skills', yPos, COLORS, FONT_FAMILY);
    
    formData.skills.forEach(skill => {
      if (!skill.category && !skill.items) return;
      
      yPos = checkPageBreak(doc, yPos, 10);
      
      doc.setFontSize(10);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      
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
    yPos = addSectionHeader(doc, 'Projects', yPos, COLORS, FONT_FAMILY);
    
    formData.projects.forEach(project => {
      if (!project.name) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
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
