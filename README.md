# Tab & Group Saver Chrome Extension

A Chrome extension that automatically saves your browser session (tabs and tab groups) when Chrome closes and allows you to restore them with a keyboard shortcut.

## Features

- **Automatic Session Saving**: Captures all open tabs and tab groups when Chrome is closed
- **Complete State Preservation**: Maintains tab order, group organization, and collapsed/expanded states
- **Multi-Window Support**: Handles sessions across multiple browser windows
- **Keyboard Shortcut Restoration**: Restore your session instantly with Ctrl+Shift+T (or Cmd+Shift+T on Mac)
- **Persistent Storage**: Session data survives browser restarts and cache clearing

## Installation

### Development Installation

1. **Download or Clone** this repository to your local machine

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** by toggling the switch in the top-right corner

4. **Click "Load unpacked"** and select the folder containing this extension

5. **Verify Installation** - You should see "Tab & Group Saver" in your extensions list

### Production Installation

Once the extension is published to the Chrome Web Store, you can install it directly from there.

## Usage

### Automatic Saving
- The extension automatically saves your session whenever you close the last Chrome window
- No manual intervention required - it works seamlessly in the background

### Manual Restoration
- **Keyboard Shortcut**: Press `Ctrl+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (Mac)
- The extension will restore all your previously saved tabs and tab groups
- Tab groups will maintain their collapsed/expanded state
- Tabs will appear in their original order

### What Gets Saved
- All open tabs with their URLs, titles, and positions
- Tab groups with their titles, colors, and collapsed states
- Pinned tabs
- Multi-window layouts
- Tab order within each window

## Technical Details

### Manifest V3 Compliance
This extension is built using Chrome's Manifest V3 specification, ensuring:
- Enhanced security and privacy
- Better performance with service workers
- Future compatibility with Chrome's extension platform

### Permissions Required
- **tabs**: To read and create tabs
- **tabGroups**: To manage tab groups and their properties
- **storage**: To persistently save session data
- **unlimitedStorage**: To handle large sessions without storage limits

### Data Storage
Session data is stored locally using `chrome.storage.local` and includes:
- Timestamp of when the session was saved
- Window information (type, incognito status)
- Tab groups with all properties (title, color, collapsed state)
- Individual tabs with URLs, titles, positions, and group associations

## File Structure

```
tab-master/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (main logic)
├── README.md             # This file
└── icons/                # Extension icons (to be added)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Development

### Prerequisites
- Chrome browser (version 88+ for Manifest V3 support)
- Basic knowledge of JavaScript and Chrome Extensions API

### Testing
1. Load the extension in developer mode
2. Open multiple tabs and create tab groups
3. Collapse some groups and expand others
4. Close Chrome completely
5. Reopen Chrome and press Ctrl+Shift+T to restore

### Debugging
- Open Chrome DevTools for the extension by clicking "service worker" in the extensions page
- Check the console for detailed logs of save/restore operations
- Use `chrome.storage.local.get()` in the console to inspect saved data

## Limitations

- **Keyboard Shortcut**: Chrome doesn't allow Ctrl+Alt combinations, so Ctrl+Shift+T is used instead
- **Service Worker Lifecycle**: The extension uses service workers which may be suspended after inactivity
- **Chrome API Limitations**: Some tab properties (like scroll position) cannot be preserved

## Troubleshooting

### Extension Not Saving Sessions
- Ensure the extension has the required permissions
- Check that you're closing the last Chrome window (not just individual tabs)
- Verify the extension is enabled in `chrome://extensions/`

### Restoration Not Working
- Confirm you're using the correct keyboard shortcut (Ctrl+Shift+T)
- Check if there's saved session data in the extension's storage
- Look for error messages in the extension's service worker console

### Performance Issues
- Large numbers of tabs may take longer to restore
- Consider using the unlimitedStorage permission for very large sessions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue in the repository. 