// Analytics tracking utility using localStorage

const ANALYTICS_KEY = 'resume_builder_analytics';

// Initialize analytics if not exists
const initAnalytics = () => {
  const existing = localStorage.getItem(ANALYTICS_KEY);
  if (!existing) {
    const initialData = {
      totalDownloads: 0,
      totalPreviews: 0,
      downloadsHistory: [],
      previewsHistory: [],
      resumeTypes: {
        withPhoto: 0,
        withoutPhoto: 0
      },
      colorThemes: {},
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existing);
};

// Track download event
export const trackDownload = (resumeType, colorTheme) => {
  const analytics = initAnalytics();
  
  analytics.totalDownloads += 1;
  analytics.downloadsHistory.push({
    timestamp: new Date().toISOString(),
    resumeType,
    colorTheme
  });
  
  // Track resume type
  if (resumeType === 'with-photo') {
    analytics.resumeTypes.withPhoto += 1;
  } else {
    analytics.resumeTypes.withoutPhoto += 1;
  }
  
  // Track color theme
  analytics.colorThemes[colorTheme] = (analytics.colorThemes[colorTheme] || 0) + 1;
  
  analytics.lastUpdated = new Date().toISOString();
  
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
};

// Track preview event
export const trackPreview = (resumeType, colorTheme) => {
  const analytics = initAnalytics();
  
  analytics.totalPreviews += 1;
  analytics.previewsHistory.push({
    timestamp: new Date().toISOString(),
    resumeType,
    colorTheme
  });
  
  analytics.lastUpdated = new Date().toISOString();
  
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
};

// Get analytics data
export const getAnalytics = () => {
  return initAnalytics();
};

// Reset analytics (admin only)
export const resetAnalytics = () => {
  localStorage.removeItem(ANALYTICS_KEY);
  return initAnalytics();
};

// Get analytics for specific time period
export const getAnalyticsByPeriod = (days = 7) => {
  const analytics = initAnalytics();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentDownloads = analytics.downloadsHistory.filter(
    item => new Date(item.timestamp) >= cutoffDate
  );
  
  const recentPreviews = analytics.previewsHistory.filter(
    item => new Date(item.timestamp) >= cutoffDate
  );
  
  return {
    downloads: recentDownloads.length,
    previews: recentPreviews.length,
    downloadsHistory: recentDownloads,
    previewsHistory: recentPreviews
  };
};
