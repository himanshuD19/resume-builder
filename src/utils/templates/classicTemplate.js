import jsPDF from 'jspdf';

// Classic Template - Traditional, Conservative Design
// Perfect for corporate, finance, legal, government positions

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGINS = { top: 25, bottom: 25, left: 25, right: 25 };
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

// Helper function for section headers
function addSectionHeader(doc, text, yPos, colors, fontFamily = 'times') {
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.text(text.toUpperCase(), MARGINS.left, yPos);
  
  // Underline
  doc.setDrawColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.setLineWidth(0.5);
  doc.line(MARGINS.left, yPos + 1, PAGE_WIDTH - MARGINS.right, yPos + 1);
  
  return yPos + 8;
}

export function generateClassicPDF(formData, photo = null) {
  const doc = new jsPDF();
  const FONT_FAMILY = formData.fontStyle || 'times';
  const COLORS = getColors(formData.colorTheme || 'blue');
  let yPos = MARGINS.top;

  // Add photo if provided (top-right corner)
  if (photo) {
    const photoSize = 30; // 30mm square for classic template
    const photoX = PAGE_WIDTH - MARGINS.right - photoSize;
    const photoY = 15; // Higher position (was MARGINS.top = 25)
    
    try {
      doc.addImage(photo, 'JPEG', photoX, photoY, photoSize, photoSize);
      // Add border around photo
      doc.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
      doc.setLineWidth(0.5);
      doc.rect(photoX, photoY, photoSize, photoSize);
    } catch (error) {
      console.error('Error adding photo to Classic PDF:', error);
    }
  }

  // Header - Name (Centered, Large)
  doc.setFontSize(20);
  doc.setFont(FONT_FAMILY, 'bold');
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.text(formData.personalInfo.fullName || 'Your Name', PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 8;

  // Contact Info (Centered, Small)
  doc.setFontSize(10);
  doc.setFont(FONT_FAMILY, 'normal');
  doc.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
  
  const contactInfo = [];
  if (formData.personalInfo.email) contactInfo.push(formData.personalInfo.email);
  if (formData.personalInfo.phone) contactInfo.push(formData.personalInfo.phone);
  if (formData.personalInfo.address) contactInfo.push(formData.personalInfo.address);
  
  if (contactInfo.length > 0) {
    doc.text(contactInfo.join(' • '), PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 5;
  }

  const links = [];
  if (formData.personalInfo.linkedin) links.push(formData.personalInfo.linkedin);
  if (formData.personalInfo.portfolio) links.push(formData.personalInfo.portfolio);
  
  if (links.length > 0) {
    doc.text(links.join(' • '), PAGE_WIDTH / 2, yPos, { align: 'center' });
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

  // Education
  const hasEducation = formData.education.some(edu => edu.degree || edu.institution);
  if (hasEducation) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Education', yPos, COLORS, FONT_FAMILY);
    
    formData.education.forEach(edu => {
      if (!edu.degree && !edu.institution) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text(edu.degree || 'Degree', MARGINS.left, yPos);
      
      if (edu.startDate || edu.endDate) {
        const dateText = `${edu.startDate || ''} - ${edu.endDate || ''}`;
        doc.setFont(FONT_FAMILY, 'normal');
        doc.text(dateText, PAGE_WIDTH - MARGINS.right, yPos, { align: 'right' });
      }
      yPos += 5;
      
      doc.setFontSize(10);
      doc.setFont(FONT_FAMILY, 'italic');
      doc.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
      
      let institutionLine = edu.institution || '';
      if (edu.location) institutionLine += `, ${edu.location}`;
      doc.text(institutionLine, MARGINS.left, yPos);
      yPos += 5;
      
      if (edu.gpa) {
        doc.setFont(FONT_FAMILY, 'normal');
        doc.text(`GPA: ${edu.gpa}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      yPos += 3;
    });
    yPos += 3;
  }

  // Work Experience
  const hasExperience = formData.experience.some(exp => exp.title || exp.company);
  if (hasExperience) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Professional Experience', yPos, COLORS, FONT_FAMILY);
    
    formData.experience.forEach(exp => {
      if (!exp.title && !exp.company) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      doc.setFontSize(11);
      doc.setFont(FONT_FAMILY, 'bold');
      doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
      doc.text(exp.title || 'Position', MARGINS.left, yPos);
      
      if (exp.startDate || exp.endDate) {
        const dateText = `${exp.startDate || ''} - ${exp.endDate || ''}`;
        doc.setFont(FONT_FAMILY, 'normal');
        doc.text(dateText, PAGE_WIDTH - MARGINS.right, yPos, { align: 'right' });
      }
      yPos += 5;
      
      doc.setFontSize(10);
      doc.setFont(FONT_FAMILY, 'italic');
      doc.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
      
      let companyLine = exp.company || '';
      if (exp.location) companyLine += `, ${exp.location}`;
      doc.text(companyLine, MARGINS.left, yPos);
      yPos += 6;
      
      if (exp.description && exp.description.trim()) {
        doc.setFontSize(10);
        doc.setFont(FONT_FAMILY, 'normal');
        doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        
        const descLines = exp.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            doc.text('•', MARGINS.left + 2, yPos);
            const wrappedText = wrapText(doc, bulletText, CONTENT_WIDTH - 7);
            wrappedText.forEach((textLine, idx) => {
              if (idx > 0) {
                yPos += 4;
                yPos = checkPageBreak(doc, yPos, 5);
              }
              doc.text(textLine, MARGINS.left + 7, yPos);
            });
          } else {
            const wrappedText = wrapText(doc, trimmedLine, CONTENT_WIDTH - 2);
            wrappedText.forEach((textLine, idx) => {
              if (idx > 0) {
                yPos += 4;
                yPos = checkPageBreak(doc, yPos, 5);
              }
              doc.text(textLine, MARGINS.left + 2, yPos);
            });
          }
          yPos += 4;
        });
      }
      
      yPos += 3;
    });
    yPos += 3;
  }

  // Skills
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
      }
      
      if (skill.items) {
        doc.setFont(FONT_FAMILY, 'normal');
        doc.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
        
        // If category exists, put items on same line, otherwise start new line
        if (skill.category) {
          const categoryWidth = doc.getTextWidth(skill.category + ': ');
          const itemsWidth = CONTENT_WIDTH - categoryWidth - 2;
          const skillLines = wrapText(doc, skill.items, itemsWidth);
          
          // First line on same line as category
          doc.text(skillLines[0], MARGINS.left + categoryWidth + 2, yPos);
          yPos += 5;
          
          // Remaining lines indented
          for (let i = 1; i < skillLines.length; i++) {
            yPos = checkPageBreak(doc, yPos, 5);
            doc.text(skillLines[i], MARGINS.left + 2, yPos);
            yPos += 5;
          }
        } else {
          const skillLines = wrapText(doc, skill.items, CONTENT_WIDTH - 2);
          skillLines.forEach(line => {
            yPos = checkPageBreak(doc, yPos, 5);
            doc.text(line, MARGINS.left + 2, yPos);
            yPos += 5;
          });
        }
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
        doc.setFontSize(9);
        doc.setFont(FONT_FAMILY, 'italic');
        doc.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
        doc.text(`Technologies: ${project.technologies}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (project.description && project.description.trim()) {
        doc.setFontSize(10);
        doc.setFont(FONT_FAMILY, 'normal');
        doc.setTextColor(COLORS.text.r, COLORS.text.g, COLORS.text.b);
        
        const descLines = wrapText(doc, project.description, CONTENT_WIDTH - 2);
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          doc.text(line, MARGINS.left + 2, yPos);
          yPos += 4;
        });
      }
      
      yPos += 3;
    });
  }

  return doc;
}

export function previewClassicPDF(formData, photo = null) {
  const doc = generateClassicPDF(formData, photo);
  return doc.output('dataurlstring');
}
