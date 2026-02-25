// Spell Check and Grammar utilities

// Common resume writing mistakes and suggestions
export const commonMistakes = {
  // Passive voice to active voice
  'was responsible for': 'managed',
  'was in charge of': 'led',
  'helped to': 'assisted',
  'worked on': 'developed',
  
  // Weak verbs to strong action verbs
  'did': 'executed',
  'made': 'created',
  'got': 'achieved',
  'had': 'possessed',
  
  // Common typos
  'recieve': 'receive',
  'occured': 'occurred',
  'seperate': 'separate',
  'definately': 'definitely',
  'accomodate': 'accommodate',
  'acheive': 'achieve',
  'beleive': 'believe',
  'calender': 'calendar',
  'collegue': 'colleague',
  'concious': 'conscious',
  'embarass': 'embarrass',
  'existance': 'existence',
  'goverment': 'government',
  'independant': 'independent',
  'occassion': 'occasion',
  'persue': 'pursue',
  'recomend': 'recommend',
  'succesful': 'successful',
  'untill': 'until'
};

// Strong action verbs for resumes
export const actionVerbs = {
  leadership: ['Led', 'Managed', 'Directed', 'Supervised', 'Coordinated', 'Orchestrated', 'Spearheaded', 'Championed'],
  achievement: ['Achieved', 'Accomplished', 'Exceeded', 'Surpassed', 'Attained', 'Delivered', 'Completed'],
  improvement: ['Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Upgraded', 'Modernized', 'Transformed'],
  creation: ['Created', 'Developed', 'Designed', 'Built', 'Established', 'Launched', 'Implemented', 'Initiated'],
  analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Examined', 'Studied'],
  communication: ['Presented', 'Communicated', 'Collaborated', 'Negotiated', 'Persuaded', 'Advocated'],
  technical: ['Programmed', 'Engineered', 'Architected', 'Configured', 'Deployed', 'Integrated', 'Automated'],
  financial: ['Budgeted', 'Forecasted', 'Allocated', 'Reduced costs', 'Increased revenue', 'Maximized profits']
};

// Check for common resume mistakes
export const checkResumeContent = (text) => {
  const issues = [];
  const lowerText = text.toLowerCase();

  // Check for passive voice
  const passiveIndicators = ['was', 'were', 'been', 'being', 'is', 'are', 'am'];
  passiveIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) {
      issues.push({
        type: 'passive_voice',
        severity: 'warning',
        message: `Consider using active voice instead of passive voice (found "${indicator}")`,
        suggestion: 'Use strong action verbs like "Led", "Developed", "Achieved"'
      });
    }
  });

  // Check for weak phrases
  const weakPhrases = ['responsible for', 'duties included', 'worked on', 'helped with'];
  weakPhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      issues.push({
        type: 'weak_phrase',
        severity: 'warning',
        message: `Weak phrase detected: "${phrase}"`,
        suggestion: 'Use specific action verbs to show impact'
      });
    }
  });

  // Check for personal pronouns (should avoid in resumes)
  const pronouns = ['i ', 'me ', 'my ', 'we ', 'our '];
  pronouns.forEach(pronoun => {
    if (lowerText.includes(pronoun)) {
      issues.push({
        type: 'pronoun',
        severity: 'error',
        message: `Avoid personal pronouns in resumes (found "${pronoun.trim()}")`,
        suggestion: 'Remove pronouns and start with action verbs'
      });
    }
  });

  // Check for common typos
  Object.keys(commonMistakes).forEach(mistake => {
    if (lowerText.includes(mistake)) {
      issues.push({
        type: 'typo',
        severity: 'error',
        message: `Possible typo: "${mistake}"`,
        suggestion: `Did you mean "${commonMistakes[mistake]}"?`
      });
    }
  });

  // Check for missing quantification
  const hasNumbers = /\d/.test(text);
  if (!hasNumbers && text.length > 50) {
    issues.push({
      type: 'missing_metrics',
      severity: 'info',
      message: 'Consider adding numbers or metrics to quantify your achievements',
      suggestion: 'Example: "Increased sales by 30%" or "Managed team of 5"'
    });
  }

  return issues;
};

// Suggest action verbs based on context
export const suggestActionVerbs = (context = 'general') => {
  const contextMap = {
    'lead': actionVerbs.leadership,
    'manage': actionVerbs.leadership,
    'achieve': actionVerbs.achievement,
    'improve': actionVerbs.improvement,
    'create': actionVerbs.creation,
    'build': actionVerbs.creation,
    'analyze': actionVerbs.analysis,
    'communicate': actionVerbs.communication,
    'develop': actionVerbs.technical,
    'code': actionVerbs.technical,
    'budget': actionVerbs.financial,
    'cost': actionVerbs.financial
  };

  const lowerContext = context.toLowerCase();
  for (const [key, verbs] of Object.entries(contextMap)) {
    if (lowerContext.includes(key)) {
      return verbs;
    }
  }

  // Return random category if no match
  const categories = Object.values(actionVerbs);
  return categories[Math.floor(Math.random() * categories.length)];
};

// Enable browser spell check on element
export const enableSpellCheck = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('spellcheck', 'true');
    element.setAttribute('lang', 'en-US');
  }
};

// Get spell check suggestions (uses browser API if available)
export const getSpellingSuggestions = async (word) => {
  // This is a placeholder - browser spell check API is limited
  // In production, you might want to use a service like:
  // - LanguageTool API
  // - Grammarly API
  // - Microsoft Cognitive Services
  
  // For now, check against common mistakes
  const lowerWord = word.toLowerCase();
  if (commonMistakes[lowerWord]) {
    return [commonMistakes[lowerWord]];
  }
  
  return [];
};

// Calculate readability score (Flesch Reading Ease)
export const calculateReadability = (text) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences.length === 0 || words.length === 0) {
    return { score: 0, level: 'N/A' };
  }

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  let level;
  if (score >= 90) level = 'Very Easy';
  else if (score >= 80) level = 'Easy';
  else if (score >= 70) level = 'Fairly Easy';
  else if (score >= 60) level = 'Standard';
  else if (score >= 50) level = 'Fairly Difficult';
  else if (score >= 30) level = 'Difficult';
  else level = 'Very Difficult';

  return { score: Math.round(score), level };
};

// Count syllables in a word (approximate)
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}
