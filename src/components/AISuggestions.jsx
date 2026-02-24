import React, { useState } from 'react';
import { Sparkles, Lightbulb, Copy, Check, AlertCircle } from 'lucide-react';

// AI Suggestion Templates (can be replaced with actual AI API later)
const SUGGESTION_TEMPLATES = {
  summary: {
    software: [
      "Results-driven Software Engineer with {years}+ years of experience in full-stack development, specializing in {technologies}. Proven track record of delivering scalable solutions and improving system performance.",
      "Innovative Software Developer with expertise in {technologies}. Passionate about creating efficient, user-centric applications and collaborating with cross-functional teams.",
      "Detail-oriented programmer with strong problem-solving skills and {years} years of experience in {technologies}. Committed to writing clean, maintainable code and continuous learning."
    ],
    marketing: [
      "Creative Marketing Professional with {years}+ years of experience driving brand awareness and customer engagement. Skilled in digital marketing, content strategy, and data-driven campaign optimization.",
      "Strategic marketer with proven success in developing and executing multi-channel campaigns. Expert in SEO, social media, and analytics with a track record of increasing ROI.",
      "Dynamic marketing specialist combining creativity with analytical thinking. Experienced in brand development, content creation, and performance marketing."
    ],
    general: [
      "Dedicated professional with {years}+ years of experience in {field}. Strong track record of achieving results through collaboration, innovation, and continuous improvement.",
      "Motivated {role} with expertise in {skills}. Proven ability to manage multiple priorities while maintaining high-quality standards.",
      "Accomplished professional bringing {years} years of experience and a passion for excellence. Known for strong communication skills and ability to drive projects to successful completion."
    ]
  },
  
  bulletPoints: {
    achievement: [
      "Increased {metric} by {percentage}% through {action}",
      "Led team of {number} to successfully {achievement}",
      "Reduced {metric} by {percentage}% by implementing {solution}",
      "Achieved {result} by {action}, resulting in {impact}",
      "Spearheaded {initiative} that generated {result}"
    ],
    responsibility: [
      "Managed {responsibility} including {details}",
      "Collaborated with {team} to {achievement}",
      "Developed and maintained {deliverable} using {technology}",
      "Conducted {activity} to ensure {outcome}",
      "Coordinated {task} across {scope}"
    ],
    technical: [
      "Designed and implemented {solution} using {technology}",
      "Optimized {system} resulting in {improvement}",
      "Built {product} that {impact}",
      "Integrated {technology} to enhance {feature}",
      "Automated {process} reducing {metric} by {percentage}%"
    ]
  },
  
  skills: {
    technical: [
      "Programming Languages: JavaScript, Python, Java, C++",
      "Web Technologies: React, Node.js, HTML5, CSS3, TypeScript",
      "Databases: MySQL, PostgreSQL, MongoDB, Redis",
      "Tools & Platforms: Git, Docker, AWS, Azure, Jenkins",
      "Methodologies: Agile, Scrum, TDD, CI/CD"
    ],
    soft: [
      "Leadership & Team Management",
      "Communication & Presentation",
      "Problem Solving & Critical Thinking",
      "Project Management & Planning",
      "Collaboration & Teamwork"
    ],
    marketing: [
      "Digital Marketing: SEO, SEM, Social Media, Email Marketing",
      "Analytics: Google Analytics, Data Analysis, A/B Testing",
      "Content: Content Strategy, Copywriting, Storytelling",
      "Tools: HubSpot, Salesforce, Adobe Creative Suite",
      "Strategy: Brand Development, Campaign Management"
    ]
  }
};

// Action verbs for different contexts
const ACTION_VERBS = {
  leadership: ['Led', 'Directed', 'Managed', 'Coordinated', 'Supervised', 'Mentored', 'Guided'],
  achievement: ['Achieved', 'Exceeded', 'Delivered', 'Accomplished', 'Attained', 'Surpassed'],
  creation: ['Developed', 'Created', 'Designed', 'Built', 'Established', 'Launched', 'Implemented'],
  improvement: ['Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Increased', 'Reduced', 'Transformed'],
  analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Examined'],
  collaboration: ['Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Contributed']
};

function AISuggestions({ context, onApply, currentText = '' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showActionVerbs, setShowActionVerbs] = useState(false);

  // Generate suggestions based on context
  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      let newSuggestions = [];
      
      switch (context.type) {
        case 'summary':
          const category = context.role?.toLowerCase().includes('software') || context.role?.toLowerCase().includes('developer') 
            ? 'software' 
            : context.role?.toLowerCase().includes('marketing') 
            ? 'marketing' 
            : 'general';
          
          newSuggestions = SUGGESTION_TEMPLATES.summary[category].map(template => 
            template
              .replace('{years}', context.years || '3')
              .replace('{technologies}', context.technologies || 'modern technologies')
              .replace('{field}', context.field || 'your field')
              .replace('{role}', context.role || 'professional')
              .replace('{skills}', context.skills || 'various skills')
          );
          break;
          
        case 'bullet':
          const bulletCategory = context.category || 'achievement';
          newSuggestions = SUGGESTION_TEMPLATES.bulletPoints[bulletCategory];
          break;
          
        case 'skills':
          const skillCategory = context.category || 'technical';
          newSuggestions = SUGGESTION_TEMPLATES.skills[skillCategory];
          break;
          
        default:
          newSuggestions = ['Start typing to get AI suggestions...'];
      }
      
      setSuggestions(newSuggestions);
      setIsGenerating(false);
    }, 800);
  };

  const copySuggestion = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const applySuggestion = (text) => {
    if (onApply) {
      onApply(text);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-gray-800">AI Writing Assistant</h4>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Ideas
            </>
          )}
        </button>
      </div>

      {/* Info */}
      {suggestions.length === 0 && !isGenerating && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Get AI-powered suggestions!</p>
            <p className="text-xs">Click "Generate Ideas" to get professional writing suggestions tailored to your role.</p>
          </div>
        </div>
      )}

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <div className="space-y-2 mb-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 bg-white border border-purple-200 rounded-lg hover:border-purple-400 transition-all group"
            >
              <p className="text-sm text-gray-700 mb-2">{suggestion}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => applySuggestion(suggestion)}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                >
                  Use This
                </button>
                <button
                  onClick={() => copySuggestion(suggestion, index)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Verbs Section */}
      <div className="border-t border-purple-200 pt-3">
        <button
          onClick={() => setShowActionVerbs(!showActionVerbs)}
          className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800 transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          {showActionVerbs ? 'Hide' : 'Show'} Power Action Verbs
        </button>
        
        {showActionVerbs && (
          <div className="mt-3 space-y-2">
            {Object.entries(ACTION_VERBS).map(([category, verbs]) => (
              <div key={category} className="text-xs">
                <span className="font-semibold text-gray-700 capitalize">{category}: </span>
                <span className="text-gray-600">{verbs.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Pro tip:</strong> Customize these suggestions with your specific achievements, metrics, and technologies for best results!
        </p>
      </div>
    </div>
  );
}

export default AISuggestions;
