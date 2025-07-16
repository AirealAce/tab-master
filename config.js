// Configuration file for Tab & Group Saver
// Modify these settings to customize the extension behavior

const EXTENSION_CONFIG = {
  // Tab Suspension Settings
  suspension: {
    enabled: true, // Set to false to disable tab suspension entirely
    delayBeforeSuspension: 2000, // Milliseconds to wait before suspending tabs
    batchSize: 3, // Number of tabs to suspend in each batch
    delayBetweenBatches: 100, // Milliseconds between suspension batches
    
    // Sites that should never be suspended (will remain active)
    sitesToNeverSuspend: [
      'youtube.com',
      'instacart.com', 
      'netflix.com',
      'spotify.com',
      'twitch.tv',
      'discord.com',
      'zoom.us',
      'teams.microsoft.com',
      'meet.google.com',
      'webex.com'
    ]
  },
  
  // Session Saving Settings
  saving: {
    // Minimum number of tabs required to save a session (prevents saving empty sessions)
    minTabsToSave: 1,
    
    // Whether to save sessions when browser closes
    saveOnBrowserClose: true
  },
  
  // Debug Settings
  debug: {
    // Enable detailed console logging
    verboseLogging: true,
    
    // Log tab suspension decisions
    logSuspensionDecisions: true
  }
};

// Export for use in background.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXTENSION_CONFIG;
} 