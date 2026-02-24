import React, { useState, useEffect } from 'react';
import { BarChart3, CheckCircle, AlertTriangle, XCircle, TrendingUp, Award } from 'lucide-react';

function ResumeAnalyzer({ formData }) {
  const [score, setScore] = useState(0);
  const [analysis, setAnalysis] = useState({
    strengths: [],
    warnings: [],
    errors: [],
    suggestions: []
  });

  useEffect(() => {
    analyzeResume();
  }, [formData]);

  const analyzeResume = () => {
    const strengths = [];
    const warnings = [];
    const errors = [];
    const suggestions = [];
    let totalScore = 0;

    // Personal Info Analysis (25 points)
    const { personalInfo } = formData;
    
    if (personalInfo.fullName && personalInfo.fullName.trim()) {
      totalScore += 5;
      strengths.push('Full name provided');
    } else {
      errors.push('Missing full name');
    }

    if (personalInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      totalScore += 5;
      strengths.push('Valid email address');
    } else {
      errors.push('Missing or invalid email address');
    }

    if (personalInfo.phone && personalInfo.phone.trim()) {
      totalScore += 5;
      strengths.push('Phone number provided');
    } else {
      warnings.push('Consider adding a phone number');
    }

    if (personalInfo.linkedin || personalInfo.portfolio) {
      totalScore += 5;
      strengths.push('Professional links included');
    } else {
      suggestions.push('Add LinkedIn or portfolio link to stand out');
    }

    if (personalInfo.summary && personalInfo.summary.trim()) {
      const wordCount = personalInfo.summary.trim().split(/\s+/).length;
      if (wordCount >= 30 && wordCount <= 100) {
        totalScore += 5;
        strengths.push('Well-written professional summary');
      } else if (wordCount < 30) {
        warnings.push('Professional summary is too short (aim for 30-100 words)');
        totalScore += 2;
      } else {
        warnings.push('Professional summary is too long (aim for 30-100 words)');
        totalScore += 3;
      }
    } else {
      errors.push('Missing professional summary');
    }

    // Experience Analysis (30 points)
    const experiences = formData.experience.filter(exp => exp.title || exp.company);
    
    if (experiences.length === 0) {
      errors.push('No work experience added');
    } else if (experiences.length >= 2) {
      totalScore += 10;
      strengths.push(`${experiences.length} work experiences listed`);
    } else {
      totalScore += 5;
      warnings.push('Consider adding more work experiences');
    }

    // Check experience descriptions
    let experiencesWithDesc = 0;
    let experiencesWithMetrics = 0;
    
    experiences.forEach(exp => {
      if (exp.description && exp.description.trim()) {
        experiencesWithDesc++;
        
        // Check for metrics/numbers
        if (/\d+%|\d+\+|increased|decreased|reduced|improved/i.test(exp.description)) {
          experiencesWithMetrics++;
        }
        
        // Check for bullet points
        if (exp.description.includes('•') || exp.description.includes('-')) {
          // Good formatting
        } else {
          suggestions.push('Use bullet points in experience descriptions for better readability');
        }
      }
    });

    if (experiencesWithDesc === experiences.length) {
      totalScore += 10;
      strengths.push('All experiences have descriptions');
    } else {
      warnings.push('Some experiences are missing descriptions');
      totalScore += 5;
    }

    if (experiencesWithMetrics > 0) {
      totalScore += 10;
      strengths.push('Quantifiable achievements included');
    } else {
      suggestions.push('Add metrics and numbers to showcase impact (e.g., "Increased sales by 25%")');
    }

    // Education Analysis (15 points)
    const education = formData.education.filter(edu => edu.degree || edu.institution);
    
    if (education.length === 0) {
      errors.push('No education added');
    } else {
      totalScore += 10;
      strengths.push('Education information provided');
      
      if (education.some(edu => edu.gpa)) {
        totalScore += 5;
        strengths.push('GPA included (good for recent graduates)');
      }
    }

    // Skills Analysis (15 points)
    const skills = formData.skills.filter(skill => skill.category || skill.items);
    
    if (skills.length === 0) {
      errors.push('No skills added');
    } else if (skills.length >= 3) {
      totalScore += 10;
      strengths.push(`${skills.length} skill categories listed`);
    } else {
      totalScore += 5;
      warnings.push('Add more skill categories');
    }

    // Check total number of skills
    let totalSkillCount = 0;
    skills.forEach(skill => {
      if (skill.items) {
        totalSkillCount += skill.items.split(',').length;
      }
    });

    if (totalSkillCount >= 8) {
      totalScore += 5;
      strengths.push('Comprehensive skills list');
    } else {
      suggestions.push('Add more relevant skills (aim for 8-15)');
    }

    // Projects Analysis (10 points)
    const projects = formData.projects.filter(proj => proj.name);
    
    if (projects.length > 0) {
      totalScore += 5;
      strengths.push('Projects showcase practical experience');
      
      if (projects.some(proj => proj.link)) {
        totalScore += 5;
        strengths.push('Project links provided for verification');
      }
    } else {
      suggestions.push('Add projects to demonstrate hands-on experience');
    }

    // ATS Compatibility Checks (5 points)
    let atsScore = 0;
    
    // Check for common ATS-friendly elements
    if (personalInfo.fullName && !personalInfo.fullName.includes('|') && !personalInfo.fullName.includes('/')) {
      atsScore += 1;
    }
    
    // Check for standard section names
    if (experiences.length > 0) atsScore += 1;
    if (education.length > 0) atsScore += 1;
    if (skills.length > 0) atsScore += 1;
    
    // Check for keywords
    const allText = JSON.stringify(formData).toLowerCase();
    const commonKeywords = ['managed', 'developed', 'led', 'created', 'improved', 'achieved'];
    const keywordCount = commonKeywords.filter(keyword => allText.includes(keyword)).length;
    
    if (keywordCount >= 3) {
      atsScore += 1;
      strengths.push('Good use of action verbs');
    } else {
      suggestions.push('Use more action verbs (managed, developed, led, etc.)');
    }
    
    totalScore += atsScore;

    // Length Check
    const estimatedLength = 
      (personalInfo.summary ? 1 : 0) +
      experiences.length * 0.3 +
      education.length * 0.2 +
      skills.length * 0.1 +
      projects.length * 0.2;

    if (estimatedLength < 0.8) {
      warnings.push('Resume might be too short - add more details');
    } else if (estimatedLength > 2.5) {
      warnings.push('Resume might be too long - keep it concise (1-2 pages)');
    } else {
      strengths.push('Good resume length');
    }

    setScore(Math.min(100, totalScore));
    setAnalysis({ strengths, warnings, errors, suggestions });
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white">
      {/* Header with Score - Horizontal Layout */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Resume Score Analysis</h3>
              <p className="text-sm text-purple-100">ATS Compatibility & Quality Check</p>
            </div>
          </div>
          
          {/* Score Badge - Larger */}
          <div className="text-center bg-white rounded-xl px-8 py-4 shadow-lg">
            <div className={`text-5xl font-bold ${getScoreColor()}`}>
              {score}
            </div>
            <div className="text-sm text-gray-600 font-semibold mt-1">{getScoreGrade()}</div>
          </div>
        </div>
      </div>

      {/* Content - Grid Layout */}
      <div className="p-6 max-w-7xl mx-auto">

        {/* Score Bar - Wider */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Progress:</span>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
            <span className={`text-sm font-bold ${getScoreColor()}`}>{score}%</span>
          </div>
        </div>

        {/* Analysis Sections - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-sm text-gray-800">Strengths ({analysis.strengths.length})</h4>
            </div>
            <ul className="space-y-1 ml-6">
              {analysis.strengths.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <h4 className="font-semibold text-sm text-gray-800">Warnings ({analysis.warnings.length})</h4>
            </div>
            <ul className="space-y-1 ml-6">
              {analysis.warnings.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Errors */}
        {analysis.errors.length > 0 && (
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <h4 className="font-semibold text-sm text-gray-800">Critical Issues ({analysis.errors.length})</h4>
            </div>
            <ul className="space-y-1 ml-6">
              {analysis.errors.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-600 mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-sm text-gray-800">Suggestions ({analysis.suggestions.length})</h4>
            </div>
            <ul className="space-y-1 ml-6">
              {analysis.suggestions.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">💡</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>

        {/* ATS Tips - Full Width */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-purple-900 mb-3 text-lg">ATS Optimization Tips</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-sm text-purple-800">Use standard section headings (Experience, Education, Skills)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-sm text-purple-800">Include relevant keywords from job descriptions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-sm text-purple-800">Use simple formatting without tables or graphics</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-sm text-purple-800">Quantify achievements with numbers and percentages</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-sm text-purple-800">Save as PDF to preserve formatting</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-sm text-purple-800">Tailor resume for each job application</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
