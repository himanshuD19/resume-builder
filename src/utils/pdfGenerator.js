import jsPDF from 'jspdf';

// Color theme mapping
const COLOR_THEMES = {
  blue: '#1e40af',
  indigo: '#4338ca',
  purple: '#7c3aed',
  green: '#059669',
  teal: '#0d9488',
  red: '#dc2626',
  orange: '#ea580c',
  pink: '#db2777',
  slate: '#475569',
  gray: '#4b5563',
  cyan: '#0891b2',
  navy: '#1e3a8a'
};

const getColors = (theme = 'blue') => ({
  primary: COLOR_THEMES[theme] || COLOR_THEMES.blue,
  secondary: '#64748b',
  text: '#1f2937',
  lightGray: '#f3f4f6'
});

const MARGINS = {
  left: 20,
  right: 20,
  top: 20,
  bottom: 20
};

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGINS.left - MARGINS.right;

// Helper function to wrap text
function wrapText(doc, text, maxWidth) {
  const lines = doc.splitTextToSize(text, maxWidth);
  return lines;
}

// Helper function to add section header
function addSectionHeader(doc, text, yPos, COLORS) {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.primary);
  doc.text(text.toUpperCase(), MARGINS.left, yPos);
  
  // Add underline
  doc.setDrawColor(COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(MARGINS.left, yPos + 1, PAGE_WIDTH - MARGINS.right, yPos + 1);
  
  return yPos + 8;
}

// Helper function to check if we need a new page
function checkPageBreak(doc, currentY, requiredSpace) {
  if (currentY + requiredSpace > PAGE_HEIGHT - MARGINS.bottom) {
    doc.addPage();
    return MARGINS.top;
  }
  return currentY;
}

// Helper function to parse and render formatted text
function parseFormattedText(text) {
  // Parse markdown-style formatting: **bold**, *italic*
  const parts = [];
  let currentIndex = 0;
  
  // Regex to match **bold** or *italic*
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push({
        text: text.substring(currentIndex, match.index),
        bold: false,
        italic: false
      });
    }
    
    // Add the formatted text
    if (match[1]) {
      // Bold text (**text**)
      parts.push({
        text: match[2],
        bold: true,
        italic: false
      });
    } else if (match[3]) {
      // Italic text (*text*)
      parts.push({
        text: match[4],
        bold: false,
        italic: true
      });
    }
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push({
      text: text.substring(currentIndex),
      bold: false,
      italic: false
    });
  }
  
  return parts.length > 0 ? parts : [{ text, bold: false, italic: false }];
}

// Helper function to render formatted line
function renderFormattedLine(doc, parts, x, y, maxWidth) {
  let currentX = x;
  const lineHeight = 5;
  
  parts.forEach(part => {
    if (!part.text) return;
    
    // Set font style
    if (part.bold && part.italic) {
      doc.setFont('helvetica', 'bolditalic');
    } else if (part.bold) {
      doc.setFont('helvetica', 'bold');
    } else if (part.italic) {
      doc.setFont('helvetica', 'italic');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    // Split text if it exceeds maxWidth
    const words = part.text.split(' ');
    words.forEach((word, idx) => {
      const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
      const wordWidth = doc.getTextWidth(wordWithSpace);
      
      if (currentX + wordWidth > x + maxWidth && currentX > x) {
        // Word doesn't fit, move to next line
        currentX = x;
        y += lineHeight;
      }
      
      doc.text(wordWithSpace, currentX, y);
      currentX += wordWidth;
    });
  });
  
  // Reset to normal font
  doc.setFont('helvetica', 'normal');
  
  return y;
}

export function generatePDF(formData) {
  const doc = new jsPDF();
  const COLORS = getColors(formData.colorTheme);
  let yPos = MARGINS.top;

  // Header - Name and Contact Info
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.primary);
  doc.text(formData.personalInfo.fullName || 'Your Name', PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 8;

  // Contact Information
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.secondary);
  
  const contactInfo = [];
  if (formData.personalInfo.email) contactInfo.push(formData.personalInfo.email);
  if (formData.personalInfo.phone) contactInfo.push(formData.personalInfo.phone);
  if (formData.personalInfo.address) contactInfo.push(formData.personalInfo.address);
  
  if (contactInfo.length > 0) {
    doc.text(contactInfo.join(' | '), PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 5;
  }

  const links = [];
  if (formData.personalInfo.linkedin) links.push(formData.personalInfo.linkedin);
  if (formData.personalInfo.portfolio) links.push(formData.personalInfo.portfolio);
  
  if (links.length > 0) {
    doc.text(links.join(' | '), PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 5;
  }

  yPos += 5;

  // Professional Summary
  if (formData.personalInfo.summary && formData.personalInfo.summary.trim()) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Professional Summary', yPos, COLORS);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    
    const summaryLines = wrapText(doc, formData.personalInfo.summary, CONTENT_WIDTH);
    summaryLines.forEach(line => {
      yPos = checkPageBreak(doc, yPos, 5);
      doc.text(line, MARGINS.left, yPos);
      yPos += 5;
    });
    yPos += 3;
  }

  // Education Section
  const hasEducation = formData.education.some(edu => 
    edu.degree || edu.institution || edu.startDate || edu.endDate
  );
  
  if (hasEducation) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Education', yPos, COLORS);
    
    formData.education.forEach(edu => {
      if (!edu.degree && !edu.institution) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      // Degree and Institution
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(edu.degree || 'Degree', MARGINS.left, yPos);
      yPos += 5;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.secondary);
      
      let institutionLine = edu.institution || '';
      if (edu.location) institutionLine += ` - ${edu.location}`;
      doc.text(institutionLine, MARGINS.left, yPos);
      
      // Date on the right
      if (edu.startDate || edu.endDate) {
        const dateText = `${edu.startDate || ''} - ${edu.endDate || ''}`;
        doc.text(dateText, PAGE_WIDTH - MARGINS.right, yPos, { align: 'right' });
      }
      yPos += 5;
      
      // GPA if provided
      if (edu.gpa) {
        doc.setFontSize(9);
        doc.text(`GPA: ${edu.gpa}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      yPos += 2;
    });
    yPos += 2;
  }

  // Work Experience Section
  const hasExperience = formData.experience.some(exp => 
    exp.title || exp.company || exp.description
  );
  
  if (hasExperience) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Work Experience', yPos, COLORS);
    
    formData.experience.forEach(exp => {
      if (!exp.title && !exp.company) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      // Job Title
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(exp.title || 'Position', MARGINS.left, yPos);
      yPos += 5;
      
      // Company and Location
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.secondary);
      
      let companyLine = exp.company || '';
      if (exp.location) companyLine += ` - ${exp.location}`;
      doc.text(companyLine, MARGINS.left, yPos);
      
      // Date on the right
      if (exp.startDate || exp.endDate) {
        const dateText = `${exp.startDate || ''} - ${exp.endDate || ''}`;
        doc.text(dateText, PAGE_WIDTH - MARGINS.right, yPos, { align: 'right' });
      }
      yPos += 6;
      
      // Description with formatting support
      if (exp.description && exp.description.trim()) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.text);
        
        const descLines = exp.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          
          const trimmedLine = line.trim();
          
          // Check for bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            doc.setFont('helvetica', 'normal');
            doc.text('•', MARGINS.left + 2, yPos);
            
            // Parse formatting in bullet text
            const parts = parseFormattedText(bulletText);
            let currentX = MARGINS.left + 7;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              // Set font style
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              // Wrap text manually
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                  currentY += 4;
                  currentX = MARGINS.left + 7;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          // Check for numbered lists
          else if (/^\d+\./.test(trimmedLine)) {
            const match = trimmedLine.match(/^(\d+\.)\s*(.*)$/);
            if (match) {
              const number = match[1];
              const text = match[2];
              
              doc.setFont('helvetica', 'normal');
              doc.text(number, MARGINS.left + 2, yPos);
              
              // Parse formatting in numbered text
              const parts = parseFormattedText(text);
              let currentX = MARGINS.left + 2 + doc.getTextWidth(number + ' ');
              let currentY = yPos;
              
              parts.forEach(part => {
                if (!part.text) return;
                
                // Set font style
                if (part.bold && part.italic) {
                  doc.setFont('helvetica', 'bolditalic');
                } else if (part.bold) {
                  doc.setFont('helvetica', 'bold');
                } else if (part.italic) {
                  doc.setFont('helvetica', 'italic');
                } else {
                  doc.setFont('helvetica', 'normal');
                }
                
                // Wrap text manually
                const words = part.text.split(' ');
                words.forEach((word, idx) => {
                  const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                  const wordWidth = doc.getTextWidth(wordWithSpace);
                  
                  if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                    currentY += 4;
                    currentX = MARGINS.left + 7;
                    currentY = checkPageBreak(doc, currentY, 5);
                  }
                  
                  doc.text(wordWithSpace, currentX, currentY);
                  currentX += wordWidth;
                });
              });
              
              yPos = currentY;
            }
          }
          // Regular text with formatting
          else {
            const parts = parseFormattedText(trimmedLine);
            let currentX = MARGINS.left + 2;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              // Set font style
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              // Wrap text manually
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 2) {
                  currentY += 4;
                  currentX = MARGINS.left + 2;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          
          yPos += 4;
        });
      }
      
      yPos += 3;
    });
    yPos += 2;
  }

  // Skills Section
  const hasSkills = formData.skills.some(skill => skill.category || skill.items);
  
  if (hasSkills) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Skills', yPos, COLORS);
    
    formData.skills.forEach(skill => {
      if (!skill.category && !skill.items) return;
      
      yPos = checkPageBreak(doc, yPos, 10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      
      if (skill.category) {
        doc.text(skill.category + ':', MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (skill.items) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.secondary);
        const skillLines = wrapText(doc, skill.items, CONTENT_WIDTH - 2);
        skillLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          doc.text(line, MARGINS.left + 2, yPos);
          yPos += 4;
        });
      }
      
      yPos += 2;
    });
    yPos += 2;
  }

  // Projects Section
  const hasProjects = formData.projects.some(project => 
    project.name || project.description
  );
  
  if (hasProjects) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Projects', yPos, COLORS);
    
    formData.projects.forEach(project => {
      if (!project.name) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      // Project Name
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(project.name, MARGINS.left, yPos);
      yPos += 5;
      
      // Technologies
      if (project.technologies) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(COLORS.secondary);
        doc.text(`Technologies: ${project.technologies}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      // Link
      if (project.link) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#2563eb');
        doc.text(project.link, MARGINS.left, yPos);
        yPos += 5;
      }
      
      // Description with formatting support
      if (project.description && project.description.trim()) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.text);
        
        const descLines = project.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          
          const trimmedLine = line.trim();
          
          // Check for bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            doc.setFont('helvetica', 'normal');
            doc.text('•', MARGINS.left + 2, yPos);
            
            // Parse formatting in bullet text
            const parts = parseFormattedText(bulletText);
            let currentX = MARGINS.left + 7;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              // Set font style
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              // Wrap text manually
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                  currentY += 4;
                  currentX = MARGINS.left + 7;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          // Check for numbered lists
          else if (/^\d+\./.test(trimmedLine)) {
            const match = trimmedLine.match(/^(\d+\.)\s*(.*)$/);
            if (match) {
              const number = match[1];
              const text = match[2];
              
              doc.setFont('helvetica', 'normal');
              doc.text(number, MARGINS.left + 2, yPos);
              
              // Parse formatting in numbered text
              const parts = parseFormattedText(text);
              let currentX = MARGINS.left + 2 + doc.getTextWidth(number + ' ');
              let currentY = yPos;
              
              parts.forEach(part => {
                if (!part.text) return;
                
                // Set font style
                if (part.bold && part.italic) {
                  doc.setFont('helvetica', 'bolditalic');
                } else if (part.bold) {
                  doc.setFont('helvetica', 'bold');
                } else if (part.italic) {
                  doc.setFont('helvetica', 'italic');
                } else {
                  doc.setFont('helvetica', 'normal');
                }
                
                // Wrap text manually
                const words = part.text.split(' ');
                words.forEach((word, idx) => {
                  const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                  const wordWidth = doc.getTextWidth(wordWithSpace);
                  
                  if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                    currentY += 4;
                    currentX = MARGINS.left + 7;
                    currentY = checkPageBreak(doc, currentY, 5);
                  }
                  
                  doc.text(wordWithSpace, currentX, currentY);
                  currentX += wordWidth;
                });
              });
              
              yPos = currentY;
            }
          }
          // Regular text with formatting
          else {
            const parts = parseFormattedText(trimmedLine);
            let currentX = MARGINS.left + 2;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              // Set font style
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              // Wrap text manually
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 2) {
                  currentY += 4;
                  currentX = MARGINS.left + 2;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          
          yPos += 4;
        });
      }
      
      yPos += 3;
    });
  }

  // Custom Sections
  if (formData.customSections && formData.customSections.length > 0) {
    formData.customSections.forEach(customSection => {
      if (!customSection.title || !customSection.items || customSection.items.length === 0) return;
      
      yPos = checkPageBreak(doc, yPos, 20);
      yPos = addSectionHeader(doc, customSection.title, yPos, COLORS);
      
      customSection.items.forEach(item => {
        if (!item.content || !item.content.trim()) return;
        
        yPos = checkPageBreak(doc, yPos, 10);
        
        doc.setFontSize(9);
        doc.setTextColor(COLORS.text);
        
        const contentLines = item.content.split('\n').filter(line => line.trim());
        contentLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          
          const trimmedLine = line.trim();
          
          // Check for bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            doc.setFont('helvetica', 'normal');
            doc.text('•', MARGINS.left, yPos);
            
            const parts = parseFormattedText(bulletText);
            let currentX = MARGINS.left + 5;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 5) {
                  currentY += 4;
                  currentX = MARGINS.left + 5;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          // Check for numbered lists
          else if (/^\d+\./.test(trimmedLine)) {
            const match = trimmedLine.match(/^(\d+\.)\s*(.*)$/);
            if (match) {
              const number = match[1];
              const text = match[2];
              
              doc.setFont('helvetica', 'normal');
              doc.text(number, MARGINS.left, yPos);
              
              const parts = parseFormattedText(text);
              let currentX = MARGINS.left + doc.getTextWidth(number + ' ');
              let currentY = yPos;
              
              parts.forEach(part => {
                if (!part.text) return;
                
                if (part.bold && part.italic) {
                  doc.setFont('helvetica', 'bolditalic');
                } else if (part.bold) {
                  doc.setFont('helvetica', 'bold');
                } else if (part.italic) {
                  doc.setFont('helvetica', 'italic');
                } else {
                  doc.setFont('helvetica', 'normal');
                }
                
                const words = part.text.split(' ');
                words.forEach((word, idx) => {
                  const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                  const wordWidth = doc.getTextWidth(wordWithSpace);
                  
                  if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 5) {
                    currentY += 4;
                    currentX = MARGINS.left + 5;
                    currentY = checkPageBreak(doc, currentY, 5);
                  }
                  
                  doc.text(wordWithSpace, currentX, currentY);
                  currentX += wordWidth;
                });
              });
              
              yPos = currentY;
            }
          }
          // Regular text with formatting
          else {
            const parts = parseFormattedText(trimmedLine);
            let currentX = MARGINS.left;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left) {
                  currentY += 4;
                  currentX = MARGINS.left;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          
          yPos += 4;
        });
        
        yPos += 2;
      });
      
      yPos += 2;
    });
  }

  // Save the PDF
  const fileName = formData.personalInfo.fullName 
    ? `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    : 'Resume.pdf';
  
  doc.save(fileName);
}

export function previewPDF(formData) {
  const doc = new jsPDF();
  const COLORS = getColors(formData.colorTheme);
  let yPos = MARGINS.top;

  // Same PDF generation logic as above
  // Header - Name and Contact Info
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.primary);
  doc.text(formData.personalInfo.fullName || 'Your Name', PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 8;

  // Contact Information
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.secondary);
  
  const contactInfo = [];
  if (formData.personalInfo.email) contactInfo.push(formData.personalInfo.email);
  if (formData.personalInfo.phone) contactInfo.push(formData.personalInfo.phone);
  if (formData.personalInfo.address) contactInfo.push(formData.personalInfo.address);
  
  if (contactInfo.length > 0) {
    doc.text(contactInfo.join(' | '), PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 5;
  }

  const links = [];
  if (formData.personalInfo.linkedin) links.push(formData.personalInfo.linkedin);
  if (formData.personalInfo.portfolio) links.push(formData.personalInfo.portfolio);
  
  if (links.length > 0) {
    doc.text(links.join(' | '), PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 5;
  }

  yPos += 5;

  // Professional Summary
  if (formData.personalInfo.summary && formData.personalInfo.summary.trim()) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Professional Summary', yPos, COLORS);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    
    const summaryLines = wrapText(doc, formData.personalInfo.summary, CONTENT_WIDTH);
    summaryLines.forEach(line => {
      yPos = checkPageBreak(doc, yPos, 5);
      doc.text(line, MARGINS.left, yPos);
      yPos += 5;
    });
    yPos += 3;
  }

  // Education Section
  const hasEducation = formData.education.some(edu => 
    edu.degree || edu.institution || edu.startDate || edu.endDate
  );
  
  if (hasEducation) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Education', yPos, COLORS);
    
    formData.education.forEach(edu => {
      if (!edu.degree && !edu.institution) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(edu.degree || 'Degree', MARGINS.left, yPos);
      yPos += 5;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.secondary);
      
      let institutionLine = edu.institution || '';
      if (edu.location) institutionLine += ` - ${edu.location}`;
      doc.text(institutionLine, MARGINS.left, yPos);
      
      if (edu.startDate || edu.endDate) {
        const dateText = `${edu.startDate || ''} - ${edu.endDate || ''}`;
        doc.text(dateText, PAGE_WIDTH - MARGINS.right, yPos, { align: 'right' });
      }
      yPos += 5;
      
      if (edu.gpa) {
        doc.setFontSize(9);
        doc.text(`GPA: ${edu.gpa}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      yPos += 2;
    });
    yPos += 2;
  }

  // Work Experience Section
  const hasExperience = formData.experience.some(exp => 
    exp.title || exp.company || exp.description
  );
  
  if (hasExperience) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Work Experience', yPos, COLORS);
    
    formData.experience.forEach(exp => {
      if (!exp.title && !exp.company) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(exp.title || 'Position', MARGINS.left, yPos);
      yPos += 5;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.secondary);
      
      let companyLine = exp.company || '';
      if (exp.location) companyLine += ` - ${exp.location}`;
      doc.text(companyLine, MARGINS.left, yPos);
      
      if (exp.startDate || exp.endDate) {
        const dateText = `${exp.startDate || ''} - ${exp.endDate || ''}`;
        doc.text(dateText, PAGE_WIDTH - MARGINS.right, yPos, { align: 'right' });
      }
      yPos += 6;
      
      // Description with formatting support
      if (exp.description && exp.description.trim()) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.text);
        
        const descLines = exp.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          
          const trimmedLine = line.trim();
          
          // Check for bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            doc.setFont('helvetica', 'normal');
            doc.text('•', MARGINS.left + 2, yPos);
            
            // Parse formatting in bullet text
            const parts = parseFormattedText(bulletText);
            let currentX = MARGINS.left + 7;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              // Set font style
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              // Wrap text manually
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                  currentY += 4;
                  currentX = MARGINS.left + 7;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          // Check for numbered lists
          else if (/^\d+\./.test(trimmedLine)) {
            const match = trimmedLine.match(/^(\d+\.)\s*(.*)$/);
            if (match) {
              const number = match[1];
              const text = match[2];
              
              doc.setFont('helvetica', 'normal');
              doc.text(number, MARGINS.left + 2, yPos);
              
              // Parse formatting in numbered text
              const parts = parseFormattedText(text);
              let currentX = MARGINS.left + 2 + doc.getTextWidth(number + ' ');
              let currentY = yPos;
              
              parts.forEach(part => {
                if (!part.text) return;
                
                // Set font style
                if (part.bold && part.italic) {
                  doc.setFont('helvetica', 'bolditalic');
                } else if (part.bold) {
                  doc.setFont('helvetica', 'bold');
                } else if (part.italic) {
                  doc.setFont('helvetica', 'italic');
                } else {
                  doc.setFont('helvetica', 'normal');
                }
                
                // Wrap text manually
                const words = part.text.split(' ');
                words.forEach((word, idx) => {
                  const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                  const wordWidth = doc.getTextWidth(wordWithSpace);
                  
                  if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                    currentY += 4;
                    currentX = MARGINS.left + 7;
                    currentY = checkPageBreak(doc, currentY, 5);
                  }
                  
                  doc.text(wordWithSpace, currentX, currentY);
                  currentX += wordWidth;
                });
              });
              
              yPos = currentY;
            }
          }
          // Regular text with formatting
          else {
            const parts = parseFormattedText(trimmedLine);
            let currentX = MARGINS.left + 2;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              // Set font style
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              // Wrap text manually
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 2) {
                  currentY += 4;
                  currentX = MARGINS.left + 2;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          
          yPos += 4;
        });
      }
      
      yPos += 3;
    });
    yPos += 2;
  }

  // Skills Section
  const hasSkills = formData.skills.some(skill => skill.category || skill.items);
  
  if (hasSkills) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Skills', yPos, COLORS);
    
    formData.skills.forEach(skill => {
      if (!skill.category && !skill.items) return;
      
      yPos = checkPageBreak(doc, yPos, 10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      
      if (skill.category) {
        doc.text(skill.category + ':', MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (skill.items) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.secondary);
        const skillLines = wrapText(doc, skill.items, CONTENT_WIDTH - 2);
        skillLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          doc.text(line, MARGINS.left + 2, yPos);
          yPos += 4;
        });
      }
      
      yPos += 2;
    });
    yPos += 2;
  }

  // Projects Section
  const hasProjects = formData.projects.some(project => 
    project.name || project.description
  );
  
  if (hasProjects) {
    yPos = checkPageBreak(doc, yPos, 20);
    yPos = addSectionHeader(doc, 'Projects', yPos, COLORS);
    
    formData.projects.forEach(project => {
      if (!project.name) return;
      
      yPos = checkPageBreak(doc, yPos, 15);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.text);
      doc.text(project.name, MARGINS.left, yPos);
      yPos += 5;
      
      if (project.technologies) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(COLORS.secondary);
        doc.text(`Technologies: ${project.technologies}`, MARGINS.left, yPos);
        yPos += 5;
      }
      
      if (project.link) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#2563eb');
        doc.text(project.link, MARGINS.left, yPos);
        yPos += 5;
      }
      
      // Description with formatting support
      if (project.description && project.description.trim()) {
        doc.setFontSize(9);
        doc.setTextColor(COLORS.text);
        
        const descLines = project.description.split('\n').filter(line => line.trim());
        descLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          
          const trimmedLine = line.trim();
          
          // Check for bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            doc.setFont('helvetica', 'normal');
            doc.text('•', MARGINS.left + 2, yPos);
            
            const parts = parseFormattedText(bulletText);
            let currentX = MARGINS.left + 7;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                  currentY += 4;
                  currentX = MARGINS.left + 7;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          // Check for numbered lists
          else if (/^\d+\./.test(trimmedLine)) {
            const match = trimmedLine.match(/^(\d+\.)\s*(.*)$/);
            if (match) {
              const number = match[1];
              const text = match[2];
              
              doc.setFont('helvetica', 'normal');
              doc.text(number, MARGINS.left + 2, yPos);
              
              const parts = parseFormattedText(text);
              let currentX = MARGINS.left + 2 + doc.getTextWidth(number + ' ');
              let currentY = yPos;
              
              parts.forEach(part => {
                if (!part.text) return;
                
                if (part.bold && part.italic) {
                  doc.setFont('helvetica', 'bolditalic');
                } else if (part.bold) {
                  doc.setFont('helvetica', 'bold');
                } else if (part.italic) {
                  doc.setFont('helvetica', 'italic');
                } else {
                  doc.setFont('helvetica', 'normal');
                }
                
                const words = part.text.split(' ');
                words.forEach((word, idx) => {
                  const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                  const wordWidth = doc.getTextWidth(wordWithSpace);
                  
                  if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 7) {
                    currentY += 4;
                    currentX = MARGINS.left + 7;
                    currentY = checkPageBreak(doc, currentY, 5);
                  }
                  
                  doc.text(wordWithSpace, currentX, currentY);
                  currentX += wordWidth;
                });
              });
              
              yPos = currentY;
            }
          }
          // Regular text with formatting
          else {
            const parts = parseFormattedText(trimmedLine);
            let currentX = MARGINS.left + 2;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 2) {
                  currentY += 4;
                  currentX = MARGINS.left + 2;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          
          yPos += 4;
        });
      }
      
      yPos += 3;
    });
  }

  // Custom Sections
  if (formData.customSections && formData.customSections.length > 0) {
    formData.customSections.forEach(customSection => {
      if (!customSection.title || !customSection.items || customSection.items.length === 0) return;
      
      yPos = checkPageBreak(doc, yPos, 20);
      yPos = addSectionHeader(doc, customSection.title, yPos, COLORS);
      
      customSection.items.forEach(item => {
        if (!item.content || !item.content.trim()) return;
        
        yPos = checkPageBreak(doc, yPos, 10);
        
        doc.setFontSize(9);
        doc.setTextColor(COLORS.text);
        
        const contentLines = item.content.split('\n').filter(line => line.trim());
        contentLines.forEach(line => {
          yPos = checkPageBreak(doc, yPos, 5);
          
          const trimmedLine = line.trim();
          
          // Check for bullet points
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const bulletText = trimmedLine.substring(1).trim();
            doc.setFont('helvetica', 'normal');
            doc.text('•', MARGINS.left, yPos);
            
            const parts = parseFormattedText(bulletText);
            let currentX = MARGINS.left + 5;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 5) {
                  currentY += 4;
                  currentX = MARGINS.left + 5;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          // Check for numbered lists
          else if (/^\d+\./.test(trimmedLine)) {
            const match = trimmedLine.match(/^(\d+\.)\s*(.*)$/);
            if (match) {
              const number = match[1];
              const text = match[2];
              
              doc.setFont('helvetica', 'normal');
              doc.text(number, MARGINS.left, yPos);
              
              const parts = parseFormattedText(text);
              let currentX = MARGINS.left + doc.getTextWidth(number + ' ');
              let currentY = yPos;
              
              parts.forEach(part => {
                if (!part.text) return;
                
                if (part.bold && part.italic) {
                  doc.setFont('helvetica', 'bolditalic');
                } else if (part.bold) {
                  doc.setFont('helvetica', 'bold');
                } else if (part.italic) {
                  doc.setFont('helvetica', 'italic');
                } else {
                  doc.setFont('helvetica', 'normal');
                }
                
                const words = part.text.split(' ');
                words.forEach((word, idx) => {
                  const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                  const wordWidth = doc.getTextWidth(wordWithSpace);
                  
                  if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left + 5) {
                    currentY += 4;
                    currentX = MARGINS.left + 5;
                    currentY = checkPageBreak(doc, currentY, 5);
                  }
                  
                  doc.text(wordWithSpace, currentX, currentY);
                  currentX += wordWidth;
                });
              });
              
              yPos = currentY;
            }
          }
          // Regular text with formatting
          else {
            const parts = parseFormattedText(trimmedLine);
            let currentX = MARGINS.left;
            let currentY = yPos;
            
            parts.forEach(part => {
              if (!part.text) return;
              
              if (part.bold && part.italic) {
                doc.setFont('helvetica', 'bolditalic');
              } else if (part.bold) {
                doc.setFont('helvetica', 'bold');
              } else if (part.italic) {
                doc.setFont('helvetica', 'italic');
              } else {
                doc.setFont('helvetica', 'normal');
              }
              
              const words = part.text.split(' ');
              words.forEach((word, idx) => {
                const wordWithSpace = idx < words.length - 1 ? word + ' ' : word;
                const wordWidth = doc.getTextWidth(wordWithSpace);
                
                if (currentX + wordWidth > PAGE_WIDTH - MARGINS.right && currentX > MARGINS.left) {
                  currentY += 4;
                  currentX = MARGINS.left;
                  currentY = checkPageBreak(doc, currentY, 5);
                }
                
                doc.text(wordWithSpace, currentX, currentY);
                currentX += wordWidth;
              });
            });
            
            yPos = currentY;
          }
          
          yPos += 4;
        });
        
        yPos += 2;
      });
      
      yPos += 2;
    });
  }

  // Open in new window for preview
  window.open(doc.output('bloburl'), '_blank');
}
