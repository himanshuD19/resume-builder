// PDF Parser utility to extract data from uploaded resume PDF
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for PDF.js - using unpkg CDN which is more reliable
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

// Extract text from PDF
const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error in extractTextFromPDF:', error);
    throw error;
  }
};

// Extract email using regex
const extractEmail = (text) => {
  try {
    if (!text) return '';
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const matches = text.match(emailRegex);
    return matches && matches[0] ? matches[0] : '';
  } catch (error) {
    console.warn('Error extracting email:', error);
    return '';
  }
};

// Extract phone number
const extractPhone = (text) => {
  try {
    if (!text) return '';
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const matches = text.match(phoneRegex);
    return matches && matches[0] ? matches[0] : '';
  } catch (error) {
    console.warn('Error extracting phone:', error);
    return '';
  }
};

// Extract LinkedIn URL
const extractLinkedIn = (text) => {
  try {
    if (!text) return '';
    const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi;
    const matches = text.match(linkedinRegex);
    return matches && matches[0] ? matches[0] : '';
  } catch (error) {
    console.warn('Error extracting LinkedIn:', error);
    return '';
  }
};

// Extract portfolio/website URL
const extractPortfolio = (text) => {
  try {
    if (!text) return '';
    const urlRegex = /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.(com|dev|io|net|org)(\/[^\s]*)?/gi;
    const matches = text.match(urlRegex);
    if (matches) {
      // Filter out LinkedIn and email domains
      const filtered = matches.filter(url => 
        !url.includes('linkedin.com') && 
        !url.includes('@')
      );
      return filtered[0] || '';
    }
    return '';
  } catch (error) {
    console.warn('Error extracting portfolio:', error);
    return '';
  }
};

// Extract name (usually first line or before email)
const extractName = (text) => {
  try {
    if (!text) return '';
    const lines = text.split('\n').filter(line => line.trim());
    // First non-empty line is usually the name
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Check if it looks like a name (not too long, not an email, etc.)
      if (firstLine.length < 50 && !firstLine.includes('@') && !firstLine.includes('http')) {
        return firstLine;
      }
    }
    return '';
  } catch (error) {
    console.warn('Error extracting name:', error);
    return '';
  }
};

// Extract section content
const extractSection = (text, sectionName) => {
  try {
    if (!text) return '';
    const sectionRegex = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=(EDUCATION|EXPERIENCE|WORK EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|$))`, 'i');
    const match = text.match(sectionRegex);
    return match && match[1] ? match[1].trim() : '';
  } catch (error) {
    console.warn('Error extracting section:', error);
    return '';
  }
};

// Parse education section
const parseEducation = (text) => {
  try {
    if (!text) return [];
    const educationText = extractSection(text, 'EDUCATION');
    if (!educationText) return [];
    
    // Split by common patterns (degree names, universities)
    const entries = educationText.split(/(?=Bachelor|Master|PhD|Associate|B\.S\.|M\.S\.|B\.A\.|M\.A\.)/gi);
    
    return entries.filter(e => e && e.trim()).map(entry => {
      const lines = entry.trim().split('\n').filter(l => l && l.trim());
      return {
        degree: lines[0] || '',
        institution: lines[1] || '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      };
    }).filter(e => e.degree || e.institution); // Only return if has some data
  } catch (error) {
    console.warn('Error parsing education:', error);
    return [];
  }
};

// Parse work experience
const parseExperience = (text) => {
  try {
    if (!text) return [];
    const expText = extractSection(text, 'WORK EXPERIENCE|EXPERIENCE');
    if (!expText) return [];
    
    // Split by job titles or companies
    const entries = expText.split(/(?=\n[A-Z][a-zA-Z\s&]+\n)/g);
    
    return entries.filter(e => e && e.trim()).slice(0, 5).map(entry => {
      const lines = entry.trim().split('\n').filter(l => l && l.trim());
      return {
        position: lines[0] || '',
        company: lines[1] || '',
        location: '',
        startDate: '',
        endDate: '',
        responsibilities: lines.slice(2).map(line => ({ content: line }))
      };
    }).filter(e => e.position || e.company); // Only return if has some data
  } catch (error) {
    console.warn('Error parsing experience:', error);
    return [];
  }
};

// Parse skills
const parseSkills = (text) => {
  try {
    if (!text) return [];
    const skillsText = extractSection(text, 'SKILLS|TECHNICAL SKILLS');
    if (!skillsText) return [];
    
    // Split by common delimiters
    const skillsList = skillsText.split(/[,;•\n]/).filter(s => s && s.trim());
    
    return skillsList.slice(0, 20).map(skill => ({
      name: skill.trim()
    })).filter(s => s.name); // Only return if has name
  } catch (error) {
    console.warn('Error parsing skills:', error);
    return [];
  }
};

// Parse projects
const parseProjects = (text) => {
  try {
    if (!text) return [];
    const projectsText = extractSection(text, 'PROJECTS');
    if (!projectsText) return [];
    
    const entries = projectsText.split(/(?=\n[A-Z][a-zA-Z\s]+\n)/g);
    
    return entries.filter(e => e && e.trim()).slice(0, 5).map(entry => {
      const lines = entry.trim().split('\n').filter(l => l && l.trim());
      return {
        name: lines[0] || '',
        description: lines.slice(1).join(' '),
        technologies: '',
        link: ''
      };
    }).filter(p => p.name); // Only return if has name
  } catch (error) {
    console.warn('Error parsing projects:', error);
    return [];
  }
};

// Main parsing function
export const parseResumeFromPDF = async (file) => {
  try {
    console.log('Starting PDF parsing...');
    
    // Extract text from PDF
    let text = '';
    try {
      text = await extractTextFromPDF(file);
      console.log('Text extracted successfully, length:', text.length);
    } catch (extractError) {
      console.error('Error extracting text from PDF:', extractError);
      throw new Error('Could not read PDF file. The file may be corrupted or password-protected.');
    }
    
    // If no text extracted, return empty structure
    if (!text || text.trim().length === 0) {
      console.warn('No text found in PDF');
      return {
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
        colorTheme: 'blue'
      };
    }
    
    // Extract data with individual try-catch for each field
    const extractedData = {
      personalInfo: {
        fullName: extractName(text) || '',
        email: extractEmail(text) || '',
        phone: extractPhone(text) || '',
        address: '',
        linkedin: extractLinkedIn(text) || '',
        portfolio: extractPortfolio(text) || '',
        summary: extractSection(text, 'PROFESSIONAL SUMMARY|SUMMARY|ABOUT') || ''
      },
      education: parseEducation(text) || [],
      experience: parseExperience(text) || [],
      skills: parseSkills(text) || [],
      projects: parseProjects(text) || [],
      customSections: [],
      colorTheme: 'blue'
    };
    
    console.log('Data extracted:', {
      name: extractedData.personalInfo.fullName,
      email: extractedData.personalInfo.email,
      phone: extractedData.personalInfo.phone,
      educationCount: extractedData.education.length,
      experienceCount: extractedData.experience.length,
      skillsCount: extractedData.skills.length,
      projectsCount: extractedData.projects.length
    });
    
    return extractedData;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    // Return partial data instead of throwing error
    return {
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
      colorTheme: 'blue'
    };
  }
};

// Alternative: Load from localStorage (auto-save feature)
export const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem('resume_builder_data');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Save to localStorage (auto-save feature)
export const saveToLocalStorage = (formData, resumeType, photo) => {
  try {
    const dataToSave = {
      formData,
      resumeType,
      photo,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('resume_builder_data', JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Clear saved data
export const clearSavedData = () => {
  try {
    localStorage.removeItem('resume_builder_data');
    return true;
  } catch (error) {
    console.error('Error clearing saved data:', error);
    return false;
  }
};
