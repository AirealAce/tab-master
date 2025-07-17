// Popup script for Tab & Group Saver
document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup DOM loaded');
    
    const testBtn = document.getElementById('testBtn');
    const restoreBtn = document.getElementById('restoreBtn');
    const saveBtn = document.getElementById('saveBtn');
    const collapseBtn = document.getElementById('collapseBtn');
    const statusDiv = document.getElementById('status');
    const dropdownContent = document.getElementById('dropdownContent');
    const autosaveInput = document.getElementById('autosaveInterval');
    const saveAutosaveBtn = document.getElementById('saveAutosaveBtn');
    const autosaveStatus = document.getElementById('autosaveStatus');
    
    console.log('Elements found:', { testBtn: !!testBtn, restoreBtn: !!restoreBtn, saveBtn: !!saveBtn, collapseBtn: !!collapseBtn, statusDiv: !!statusDiv, dropdownContent: !!dropdownContent });
    
    // Check if there's a saved session when popup opens
    checkSavedSession();
    
    // Load current autosave interval
    chrome.storage.local.get('autosaveInterval', (result) => {
        const interval = typeof result.autosaveInterval === 'number' ? result.autosaveInterval : 0;
        autosaveInput.value = interval;
        autosaveStatus.textContent = interval > 0 ? `Autosave is ON (${interval} min)` : 'Autosave is OFF';
    });

    saveAutosaveBtn.addEventListener('click', () => {
        const interval = parseInt(autosaveInput.value, 10) || 0;
        chrome.storage.local.set({ autosaveInterval: interval }, () => {
            autosaveStatus.textContent = interval > 0 ? `Autosave is ON (${interval} min)` : 'Autosave is OFF';
            // Notify background to update timer
            chrome.runtime.sendMessage({ action: 'updateAutosaveInterval', interval });
        });
    });
    
    // Add click event listener to test button
    testBtn.addEventListener('click', function() {
        console.log('=== EXTENSION TEST STARTED ===');
        console.log('Test button clicked');
        console.log('Chrome runtime available:', typeof chrome !== 'undefined' && chrome.runtime);
        console.log('Chrome tabs available:', typeof chrome !== 'undefined' && chrome.tabs);
        console.log('Chrome storage available:', typeof chrome !== 'undefined' && chrome.storage);
        
        // Test basic message sending
        try {
            chrome.runtime.sendMessage({ action: 'test' }, function(response) {
                console.log('Test message response:', response);
                if (chrome.runtime.lastError) {
                    console.error('Test message error:', chrome.runtime.lastError);
                }
            });
        } catch (error) {
            console.error('Error sending test message:', error);
        }
        
        showStatus('Test completed - check console for results', 'info');
        console.log('=== EXTENSION TEST COMPLETED ===');
    });
    
    // Add hover event listeners for dropdown preview
    restoreBtn.addEventListener('mouseenter', function() {
        console.log('Restore button hovered - loading session preview');
        loadSessionPreview();
    });
    
    // Add click event listener to restore button
    restoreBtn.addEventListener('click', async function() {
        console.log('Restore button clicked');
        
        try {
            // Debug: Check what session data we have
            console.log('Debug: Checking session data before restore...');
            const debugResponse = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            console.log('Debug: Session data available:', debugResponse);
            
            // Disable button and show loading state
            restoreBtn.disabled = true;
            restoreBtn.textContent = 'Restoring...';
            showStatus('Restoring your session...', 'info');
            
            console.log('Sending restoreSession message to background script');
            
            // Send message to background script to restore session
            const response = await chrome.runtime.sendMessage({ action: 'restoreSession' });
            
            console.log('Received response from background script:', response);
            
            if (response && response.success) {
                console.log('Session restoration successful');
                showStatus('Session restored successfully!', 'success');
                restoreBtn.textContent = 'Session Restored';
            } else {
                console.log('Session restoration failed or no session found');
                showStatus('No saved session found to restore.', 'error');
                restoreBtn.textContent = 'Restore Session';
                restoreBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Error in restore button click handler:', error);
            showStatus('Error restoring session. Please try again.', 'error');
            restoreBtn.textContent = 'Restore Session';
            restoreBtn.disabled = false;
        }
    });
    
    // Add click event listener to save button
    saveBtn.addEventListener('click', async function() {
        console.log('Save button clicked');
        
        try {
            // Disable button and show loading state
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            showStatus('Saving current session...', 'info');
            
            console.log('Sending saveSession message to background script');
            
            // Send message to background script to save session
            const response = await chrome.runtime.sendMessage({ action: 'saveSession' });
            
            console.log('Received save response from background script:', response);
            
            if (response && response.success) {
                console.log('Session save successful');
                showStatus('Current session saved successfully!', 'success');
                saveBtn.textContent = 'Session Saved';
                
                // Re-check for saved session to update restore button state
                setTimeout(() => {
                    checkSavedSession();
                }, 1000);
            } else {
                console.log('Session save failed');
                showStatus('Error saving session.', 'error');
                saveBtn.textContent = 'Save Current Session (Test)';
                saveBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Error in save button click handler:', error);
            showStatus('Error saving session. Please try again.', 'error');
            saveBtn.textContent = 'Save Current Session (Test)';
            saveBtn.disabled = false;
        }
    });
    
    // Add click event listener to collapse button
    collapseBtn.addEventListener('click', async function() {
        console.log('Collapse button clicked');
        
        try {
            // Disable button and show loading state
            collapseBtn.disabled = true;
            collapseBtn.textContent = 'Collapsing...';
            showStatus('Collapsing groups and suspending tabs...', 'info');
            
            console.log('Sending collapseAndSuspend message to background script');
            
            // Send message to background script to collapse groups and suspend tabs
            const response = await chrome.runtime.sendMessage({ action: 'collapseAndSuspend' });
            
            console.log('Received collapse response from background script:', response);
            
            if (response && response.success) {
                console.log('Collapse and suspend successful');
                showStatus('Groups collapsed and tabs suspended successfully!', 'success');
                collapseBtn.textContent = 'Completed';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    collapseBtn.disabled = false;
                    collapseBtn.textContent = 'Collapse Groups & Suspend Tabs';
                }, 2000);
            } else {
                console.log('Collapse and suspend failed');
                showStatus('Error collapsing groups or suspending tabs.', 'error');
                collapseBtn.textContent = 'Collapse Groups & Suspend Tabs';
                collapseBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Error in collapse button click handler:', error);
            showStatus('Error collapsing groups and suspending tabs. Please try again.', 'error');
            collapseBtn.textContent = 'Collapse Groups & Suspend Tabs';
            collapseBtn.disabled = false;
        }
    });
    
    /**
     * Load session preview data for the dropdown
     */
    async function loadSessionPreview() {
        try {
            console.log('[popup] Loading session preview...');
            const response = await chrome.runtime.sendMessage({ action: 'getSessionData' });
            console.log('[popup] Session data response:', response);
            
            if (response && response.sessionData) {
                console.log('[popup] Session data received for preview:', response.sessionData);
                populateDropdown(response.sessionData);
            } else {
                console.log('[popup] No session data for preview');
                showNoSessionInDropdown();
            }
        } catch (error) {
            console.error('[popup] Error loading session preview:', error);
            showNoSessionInDropdown();
        }
    }
    
    /**
     * Populate dropdown with session data
     */
    function populateDropdown(sessionData) {
        console.log('[popup] Populating dropdown with session data:', sessionData);
        
        let html = '';
        
        // Process each window
        sessionData.windows.forEach((window, windowIndex) => {
            if (windowIndex > 0) {
                html += '<div style="padding: 8px 15px; background: #e8f0fe; font-size: 11px; color: #1a73e8; font-weight: 500;">Window ' + (windowIndex + 1) + '</div>';
            }
            
            // Group tabs by their group
            const groupedTabs = {};
            const ungroupedTabs = [];
            
            window.tabs.forEach(tab => {
                if (tab.groupId !== -1) {
                    if (!groupedTabs[tab.groupId]) {
                        groupedTabs[tab.groupId] = [];
                    }
                    groupedTabs[tab.groupId].push(tab);
                } else {
                    ungroupedTabs.push(tab);
                }
            });
            
            // Add grouped tabs
            window.groups.forEach(group => {
                const groupTabs = groupedTabs[group.id] || [];
                if (groupTabs.length > 0) {
                    html += '<div class="group-item">';
                    html += '<div class="group-header">';
                    html += '<div class="group-color" style="background-color: ' + getGroupColor(group.color) + ';"></div>';
                    html += '<div class="group-title">' + (group.title || 'Untitled Group') + '</div>';
                    if (group.collapsed) {
                        html += '<div class="group-collapsed">(collapsed)</div>';
                    }
                    html += '</div>';
                    
                    groupTabs.forEach(tab => {
                        html += '<div class="tab-item">';
                        html += '<div class="tab-favicon"></div>';
                        html += '<div class="tab-title">' + escapeHtml(tab.title || tab.url) + '</div>';
                        if (tab.pinned) {
                            html += '<div class="tab-pinned">(pinned)</div>';
                        }
                        html += '</div>';
                    });
                    
                    html += '</div>';
                }
            });
            
            // Add ungrouped tabs
            ungroupedTabs.forEach(tab => {
                html += '<div class="tab-item">';
                html += '<div class="tab-favicon"></div>';
                html += '<div class="tab-title">' + escapeHtml(tab.title || tab.url) + '</div>';
                if (tab.pinned) {
                    html += '<div class="tab-pinned">(pinned)</div>';
                }
                html += '</div>';
            });
        });
        
        if (html === '') {
            html = '<div class="no-session">No tabs found in saved session</div>';
        }
        
        dropdownContent.innerHTML = html;
    }
    
    /**
     * Show no session message in dropdown
     */
    function showNoSessionInDropdown() {
        dropdownContent.innerHTML = '<div class="no-session">No saved session found</div>';
    }
    
    /**
     * Get CSS color for group color
     */
    function getGroupColor(color) {
        const colorMap = {
            'grey': '#9aa0a6',
            'blue': '#1a73e8',
            'red': '#d93025',
            'yellow': '#f9ab00',
            'green': '#137333',
            'pink': '#c2185b',
            'purple': '#8e63ce',
            'cyan': '#0f9d58'
        };
        return colorMap[color] || '#9aa0a6';
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Check if there's a saved session available
     */
    async function checkSavedSession() {
        console.log('Checking for saved session...');
        
        try {
            console.log('Sending checkSession message to background script');
            const response = await chrome.runtime.sendMessage({ action: 'checkSession' });
            
            console.log('Received checkSession response:', response);
            
            if (response && response.hasSession) {
                console.log('Saved session found');
                showStatus('Saved session found. Click to restore.', 'info');
                restoreBtn.disabled = false;
            } else {
                console.log('No saved session found');
                showStatus('No saved session found.', 'error');
                restoreBtn.disabled = true;
                restoreBtn.textContent = 'No Session to Restore';
            }
        } catch (error) {
            console.error('Error in checkSavedSession:', error);
            showStatus('Error checking for saved session.', 'error');
        }
    }
    
    /**
     * Show status message with appropriate styling
     */
    function showStatus(message, type) {
        console.log('Showing status:', { message, type });
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
    }
}); 