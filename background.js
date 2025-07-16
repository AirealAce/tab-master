// Tab & Group Saver - Background Service Worker
// Handles saving sessions on browser closure and restoring via keyboard shortcut

console.log('Background service worker loaded');

// QUICK CONFIGURATION - Set this to true to disable tab suspension entirely
const DISABLE_SUSPENSION = false; // Set to true to disable suspension for maximum performance

// ULTRA-FAST MODE - Set this to true for zero lag (no suspension at all)
const ULTRA_FAST_MODE = false; // Set to true for maximum performance, no memory optimization

// Import configuration
// Note: In Chrome extensions, we need to include config.js in manifest.json
// For now, we'll keep the config inline but reference the external file structure

// Configuration for tab suspension (matching config.js structure)
const SUSPENSION_CONFIG = {
  enabled: !DISABLE_SUSPENSION && !ULTRA_FAST_MODE, // Disabled if either flag is true
  delayBeforeSuspension: 500, // Much longer delay - 500ms to allow URLs to load properly
  batchSize: 10, // Larger batches for faster processing
  delayBetweenBatches: 25, // Minimal delay between batches
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
};

// Helper function to check if a URL should never be suspended
function shouldNeverSuspend(url) {
  if (!url) return false;
  return SUSPENSION_CONFIG.sitesToNeverSuspend.some(site => url.includes(site));
}

// --- Autosave Timer Logic (chrome.alarms version) ---

// Set up or update the autosave alarm
async function setupAutosaveAlarm() {
  // Clear any existing alarm
  await chrome.alarms.clear('autosave');
  // Get interval from storage
  const result = await chrome.storage.local.get('autosaveInterval');
  const interval = typeof result.autosaveInterval === 'number' ? result.autosaveInterval : 0;
  if (interval > 0) {
    chrome.alarms.create('autosave', { periodInMinutes: interval });
    console.log(`[autosave] Alarm set: every ${interval} min`);
  } else {
    console.log('[autosave] Autosave disabled');
  }
}

// Listen for popup message to update autosave interval
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateAutosaveInterval') {
    setupAutosaveAlarm();
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'test') {
    console.log('Handling test action');
    sendResponse({ success: true, message: 'Background script is working!' });
    return false; // No async response needed
  }
  
  if (request.action === 'restoreSession') {
    console.log('Handling restoreSession action');
    
    (async () => {
      try {
        await restoreSession();
        console.log('Restore session completed successfully, sending success response');
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error in restore session message handler:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'saveSession') {
    console.log('Handling saveSession action');
    
    (async () => {
      try {
        await saveSession();
        console.log('Save session completed successfully, sending success response');
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error in save session message handler:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'getSessionData') {
    console.log('Handling getSessionData action');
    
    (async () => {
      try {
        const sessionData = await getSessionData();
        console.log('Session data retrieved for preview');
        sendResponse({ sessionData: sessionData });
      } catch (error) {
        console.error('Error in get session data message handler:', error);
        sendResponse({ sessionData: null, error: error.message });
      }
    })();
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'checkSession') {
    console.log('Handling checkSession action');
    
    (async () => {
      try {
        const hasSession = await checkSession();
        console.log('Session check completed, hasSession:', hasSession);
        sendResponse({ hasSession: hasSession });
      } catch (error) {
        console.error('Error in check session message handler:', error);
        sendResponse({ hasSession: false, error: error.message });
      }
    })();
    return true; // Keep the message channel open for async response
  }
  
  console.log('Unknown action received:', request.action);
});

// On service worker startup, set up autosave alarm
setupAutosaveAlarm();

// Listen for the alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'autosave') {
    console.log('[autosave] Alarm triggered, saving session');
    saveSession();
  }
});
// --- End Autosave Timer Logic ---

/**
 * Get the saved session data
 */
async function getSessionData() {
  console.log('getSessionData function called');
  
  try {
    const result = await chrome.storage.local.get('lastSavedSession');
    console.log('Storage get result for session data:', result);
    
    return result.lastSavedSession || null;
  } catch (error) {
    console.error('Error getting session data:', error);
    return null;
  }
}

/**
 * Check if there's a saved session available
 */
async function checkSession() {
  console.log('checkSession function called');
  
  try {
    const result = await chrome.storage.local.get('lastSavedSession');
    console.log('Storage get result:', result);
    
    const hasSession = !!result.lastSavedSession;
    console.log('Has session:', hasSession);
    
    if (hasSession) {
      console.log('Session data found:', result.lastSavedSession);
    }
    
    return hasSession;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
}

/**
 * Saves the current browser session state
 */
async function saveSession() {
  try {
    console.log('[saveSession] Called');
    // Get all normal windows
    const windows = await chrome.windows.getAll({ windowTypes: ['normal'] });
    console.log('[saveSession] Found windows:', windows.length);
    if (windows.length === 0) {
      console.log('[saveSession] No windows found, skipping save.');
      return;
    }
    const allTabs = await chrome.tabs.query({});
    if (allTabs.length === 0) {
      console.log('[saveSession] No tabs found, skipping save.');
      return;
    }
    const sessionData = {
      timestamp: Date.now(),
      windows: []
    };
    for (const window of windows) {
      console.log('[saveSession] Processing window:', window.id);
      const windowData = {
        id: window.id,
        type: window.type,
        incognito: window.incognito,
        groups: [],
        tabs: []
      };
      const tabs = await chrome.tabs.query({ windowId: window.id });
      console.log('[saveSession] Found tabs in window', window.id, ':', tabs.length);
      const groups = await chrome.tabGroups.query({ windowId: window.id });
      console.log('[saveSession] Found groups in window', window.id, ':', groups.length);
      const groupFirstTabIndex = new Map();
      for (const group of groups) {
        const groupTabs = tabs.filter(tab => tab.groupId === group.id);
        if (groupTabs.length > 0) {
          const firstTab = groupTabs.sort((a, b) => a.index - b.index)[0];
          groupFirstTabIndex.set(group.id, firstTab.index);
          console.log('[saveSession] Group', group.id, 'starts at tab index', firstTab.index);
        }
      }
      for (const group of groups) {
        const groupIndex = groupFirstTabIndex.get(group.id);
        windowData.groups.push({
          id: group.id,
          title: group.title,
          color: group.color,
          collapsed: group.collapsed,
          index: groupIndex || group.index
        });
      }
      for (const tab of tabs) {
        windowData.tabs.push({
          id: tab.id,
          url: tab.url,
          title: tab.title,
          index: tab.index,
          pinned: tab.pinned,
          groupId: tab.groupId || -1
        });
      }
      sessionData.windows.push(windowData);
    }
    console.log('[saveSession] Removing old session before saving new one...');
    await chrome.storage.local.remove('lastSavedSession');
    console.log('[saveSession] Old session removed. Saving new session data to storage:', sessionData);
    await chrome.storage.local.set({ 'lastSavedSession': sessionData });
    console.log('[saveSession] Session saved successfully and overwritten.');
  } catch (error) {
    console.error('[saveSession] Error saving session:', error);
    throw error;
  }
}

/**
 * Restores the saved browser session
 */
async function restoreSession() {
  try {
    console.log('Starting session restoration...');
    
    // Get saved session data
    const result = await chrome.storage.local.get('lastSavedSession');
    console.log('Retrieved session data from storage:', result);
    
    const savedSession = result.lastSavedSession;
    
    if (!savedSession) {
      console.log('No saved session found.');
      return;
    }

    console.log('Found saved session:', savedSession);
    console.log('Number of windows to restore:', savedSession.windows.length);

    // Process each saved window
    for (let windowIndex = 0; windowIndex < savedSession.windows.length; windowIndex++) {
      const savedWindow = savedSession.windows[windowIndex];
      console.log('Processing saved window', windowIndex, ':', savedWindow);
      
      // Create new window if multiple windows or use current window for first one
      let targetWindowId;
      if (savedSession.windows.length > 1) {
        console.log('Creating new window for multi-window session');
        const newWindow = await chrome.windows.create({ 
          type: 'normal',
          incognito: savedWindow.incognito 
        });
        targetWindowId = newWindow.id;
        console.log('Created new window with ID:', targetWindowId);
      } else {
        // Use current active window
        console.log('Using current active window');
        const currentWindow = await chrome.windows.getCurrent();
        targetWindowId = currentWindow.id;
        console.log('Using current window with ID:', targetWindowId);
      }

      // Create mapping for group IDs (original -> new)
      const groupMapping = new Map();
      
      // Track created tabs for suspension
      const createdTabs = [];
      
      // Sort tabs by their index to ensure correct order
      const sortedTabs = savedWindow.tabs.sort((a, b) => a.index - b.index);
      console.log('Sorted tabs for restoration:', sortedTabs.map(t => ({ index: t.index, title: t.title, groupId: t.groupId })));
      
      // Create all tabs first (this is faster than creating them one by one)
      console.log('Creating all tabs...');
      const tabCreationPromises = sortedTabs.map(async (savedTab, index) => {
        console.log('Creating tab at index', savedTab.index, ':', savedTab.title);
        
        const newTab = await chrome.tabs.create({
          url: savedTab.url,
          pinned: savedTab.pinned,
          index: savedTab.index,
          windowId: targetWindowId
        });
        
        console.log('Created tab with new ID:', newTab.id);
        return { newTab, savedTab };
      });
      
      // Wait for all tabs to be created
      const createdTabData = await Promise.all(tabCreationPromises);
      
      // Extract the created tabs and maintain order
      for (const { newTab, savedTab } of createdTabData) {
        createdTabs.push(newTab);
        
        // If this tab belongs to a group, handle grouping
        if (savedTab.groupId !== -1) {
          // Check if we've already created this group
          if (!groupMapping.has(savedTab.groupId)) {
            // Create the group for the first time
            const groupData = savedWindow.groups.find(g => g.id === savedTab.groupId);
            if (groupData) {
              console.log('Creating new group for tab:', groupData);
              
              // Create the group by adding this tab to a new group
              const newGroupId = await chrome.tabs.group({
                tabIds: newTab.id
              });
              console.log('Created group with new ID:', newGroupId);
              
              // Store the mapping
              groupMapping.set(savedTab.groupId, newGroupId);
              console.log('Mapped group', savedTab.groupId, 'to', newGroupId);
              
              // Update group properties (but don't set collapsed yet)
              await chrome.tabGroups.update(newGroupId, {
                title: groupData.title,
                color: groupData.color
              });
              console.log('Updated group properties for', newGroupId);
            }
          } else {
            // Group already exists, add this tab to it
            const newGroupId = groupMapping.get(savedTab.groupId);
            console.log('Adding tab', newTab.id, 'to existing group', newGroupId);
            await chrome.tabs.group({
              tabIds: newTab.id,
              groupId: newGroupId
            });
          }
        }
        // If tab doesn't belong to a group, it stays ungrouped (which is correct)
      }
      
      // Set the collapsed state for groups after all tabs are created and grouped
      for (const groupData of savedWindow.groups) {
        const newGroupId = groupMapping.get(groupData.id);
        if (newGroupId && groupData.collapsed) {
          console.log('Setting group', newGroupId, 'to collapsed state');
          await chrome.tabGroups.update(newGroupId, {
            collapsed: true
          });
        }
      }
      
      // Suspend all tabs except the first one to reduce memory usage
      if (!SUSPENSION_CONFIG.enabled) {
        console.log('Tab suspension is disabled in configuration');
      } else {
        console.log('Suspending tabs to reduce memory usage...');
        
        // Minimal delay for maximum performance
        await new Promise(resolve => setTimeout(resolve, SUSPENSION_CONFIG.delayBeforeSuspension));
        
        // Prioritize collapsed groups and optimize suspension
        const tabsToSuspend = [];
        const collapsedGroupIds = new Set();
        
        // First, identify collapsed groups
        for (const groupData of savedWindow.groups) {
          if (groupData.collapsed) {
            collapsedGroupIds.add(groupData.id);
          }
        }
        
        // Suspend all tabs except the first one - prioritize collapsed groups
        for (let i = 1; i < createdTabs.length; i++) {
          const tab = createdTabs[i];
          const savedTab = sortedTabs[i]; // Get the saved tab data
          
          try {
            const tabInfo = await chrome.tabs.get(tab.id);
            
            // Check if tab is in a collapsed group
            const isInCollapsedGroup = tab.groupId && collapsedGroupIds.has(tab.groupId);
            
            // Check if it's a protected site using the SAVED URL (not current tab URL)
            const isProtected = shouldNeverSuspend(savedTab.url);
            
            // Suspend all tabs except protected sites, prioritize collapsed groups
            if (!isProtected) {
              if (isInCollapsedGroup) {
                tabsToSuspend.unshift(tab); // Add to front for immediate suspension
                console.log('Prioritizing suspension for collapsed group tab:', tab.id);
              } else {
                tabsToSuspend.push(tab); // Add to end for later suspension
              }
            } else {
              console.log('Skipping suspension for protected site tab:', tab.id, 'saved URL:', savedTab.url);
            }
          } catch (error) {
            console.log('Could not check tab status for', tab.id, ':', error.message);
            // Still try to suspend even if we can't get tab info
            tabsToSuspend.push(tab);
          }
        }
        
        // Suspend tabs in batches for faster processing
        const batchSize = SUSPENSION_CONFIG.batchSize;
        const delayBetweenBatches = SUSPENSION_CONFIG.delayBetweenBatches;
        
        // Process all tabs in parallel for maximum speed
        const suspendPromises = tabsToSuspend.map(async (tab) => {
          try {
            console.log('Suspending tab:', tab.id, tab.title);
            await chrome.tabs.discard(tab.id);
          } catch (error) {
            console.log('Could not suspend tab', tab.id, ':', error.message);
            // Some tabs (like chrome:// URLs) cannot be suspended, which is normal
          }
        });
        
        // Wait for all suspensions to complete
        await Promise.all(suspendPromises);
        
        console.log('Tab suspension completed. First tab remains active for immediate use.');
      }
    }
    
    console.log('Session restoration completed successfully');
    
  } catch (error) {
    console.error('Error restoring session:', error);
    throw error; // Re-throw to be caught by the message handler
  }
} 