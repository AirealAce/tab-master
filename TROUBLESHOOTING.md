# Troubleshooting Guide

## About:Blank Issue

### Problem Description
Some websites (particularly YouTube videos, Instacart, and other dynamic content sites) may show as "about:blank" instead of their proper URLs when restored.

### Root Causes

1. **Tab Suspension**: The extension suspends tabs to reduce memory usage, which can cause dynamic sites to lose their state.

2. **Dynamic Content Sites**: Sites like YouTube, Instacart, Netflix, etc. use:
   - Single Page Applications (SPAs) with client-side routing
   - Dynamic URL updates via JavaScript
   - Session-based content requiring user interaction
   - Anti-bot measures that detect automated access

3. **Chrome Security Restrictions**: Some sites have strict Content Security Policies (CSP) that prevent extensions from accessing their content.

### Solutions

#### Option 1: Disable Tab Suspension (Recommended)
Edit `background.js` and set:
```javascript
const SUSPENSION_CONFIG = {
  enabled: false, // Disable tab suspension entirely
  // ... other settings
};
```

#### Option 2: Add Sites to Never-Suspend List
Add problematic sites to the `sitesToNeverSuspend` array in `background.js`:
```javascript
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
  'webex.com',
  // Add your problematic sites here
  'your-problematic-site.com'
]
```

#### Option 3: Increase Suspension Delay
Increase the delay before suspending tabs to allow pages to load properly:
```javascript
delayBeforeSuspension: 5000, // 5 seconds instead of 2
```

#### Option 4: Manual Configuration
1. Open the extension popup
2. Click "Save Current Session" to save your current state
3. Restore the session
4. For problematic tabs, manually navigate to the correct URL

### Prevention Tips

1. **Save Sessions When Active**: Save sessions while tabs are fully loaded, not when they're in a loading state.

2. **Avoid Suspending Active Tabs**: The extension already keeps the first tab active - use that tab for important sites.

3. **Check Tab Status**: Before saving, ensure all tabs have loaded completely (status should be "complete").

### Debugging

Enable verbose logging in the browser console to see which tabs are being suspended and why:

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for messages like:
   - "Skipping suspension for tab X reason: protected site"
   - "Suspending tab: X"
   - "Could not suspend tab X"

### Common Problematic Sites

- **YouTube**: Videos and playlists
- **Instacart**: Shopping carts and product pages
- **Netflix**: Video streaming pages
- **Spotify**: Music player and playlists
- **Twitch**: Live streams
- **Discord**: Chat applications
- **Video conferencing**: Zoom, Teams, Google Meet

### Performance Considerations

- **Memory Usage**: Disabling suspension will use more memory but provide better reliability
- **Browser Performance**: More active tabs may slow down the browser
- **Battery Life**: On laptops, more active tabs will use more battery

### Alternative Solutions

If the above solutions don't work, consider:

1. **Manual Session Management**: Use the extension to save/restore most tabs, then manually handle problematic ones
2. **Browser Bookmarks**: For critical sites, use browser bookmarks as backup
3. **Session Managers**: Use other session management tools for specific problematic sites 