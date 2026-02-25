// Local Storage utility for auto-saving resume data

const STORAGE_KEY = 'resume_builder_data';
const AUTO_SAVE_KEY = 'resume_builder_autosave';
const LAST_SAVE_KEY = 'resume_builder_last_save';

// Save resume data to localStorage
export const saveResumeData = (formData, autoSave = false) => {
  try {
    const dataToSave = {
      formData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const key = autoSave ? AUTO_SAVE_KEY : STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(dataToSave));
    localStorage.setItem(LAST_SAVE_KEY, new Date().toISOString());
    
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Load resume data from localStorage
export const loadResumeData = (autoSave = false) => {
  try {
    const key = autoSave ? AUTO_SAVE_KEY : STORAGE_KEY;
    const savedData = localStorage.getItem(key);
    
    if (!savedData) return null;
    
    const parsed = JSON.parse(savedData);
    return parsed.formData;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Get last save timestamp
export const getLastSaveTime = () => {
  try {
    const timestamp = localStorage.getItem(LAST_SAVE_KEY);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    return null;
  }
};

// Check if auto-save data exists
export const hasAutoSaveData = () => {
  try {
    return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  } catch (error) {
    return false;
  }
};

// Clear all saved data
export const clearSavedData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTO_SAVE_KEY);
    localStorage.removeItem(LAST_SAVE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Export resume data as JSON file
export const exportResumeJSON = (formData, filename = 'resume-data.json') => {
  try {
    const dataToExport = {
      formData,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      appName: 'Resume Builder by Himanshu Dwivedi'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting JSON:', error);
    return false;
  }
};

// Import resume data from JSON file
export const importResumeJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate data structure
        if (data.formData) {
          resolve(data.formData);
        } else {
          reject(new Error('Invalid resume data format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Get storage usage info
export const getStorageInfo = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const autoSave = localStorage.getItem(AUTO_SAVE_KEY);
    
    return {
      hasData: !!data,
      hasAutoSave: !!autoSave,
      dataSize: data ? new Blob([data]).size : 0,
      autoSaveSize: autoSave ? new Blob([autoSave]).size : 0,
      lastSave: getLastSaveTime()
    };
  } catch (error) {
    return null;
  }
};
