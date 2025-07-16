# Setup Guide - Tab & Group Saver

## Quick Fix for "Manifest file is missing or unreadable"

The manifest.json file has been recreated. To get your extension working:

### Step 1: Create Icons (Required)

You need PNG icon files for the extension to load properly. Here are your options:

#### Option A: Use the Quick Icon Generator (Easiest)
1. Open `quick-icons.html` in your browser
2. Right-click each icon and "Save image as..." to the `icons/` folder
3. Save them as:
   - `icon16.png`
   - `icon32.png` 
   - `icon48.png`
   - `icon128.png`

#### Option B: Use the Advanced Icon Generator
1. Open `generate-icons.html` in your browser
2. Click "Generate All Icons" 
3. Click "Download All Icons"
4. Move the downloaded files to the `icons/` folder

#### Option C: Use Online Converter
1. Copy the SVG content from `icons/icon.svg`
2. Use https://convertio.co/svg-png/ or similar
3. Generate sizes: 16x16, 32x32, 48x48, 128x128
4. Save to `icons/` folder

### Step 2: Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select your `tab-master` folder
5. The extension should now load without errors

### Step 3: Test the Extension

1. Click the extension icon in your toolbar
2. You should see the popup with "Save Current Session" and "Restore Session" buttons
3. Test saving and restoring a session

## File Structure

Your extension should have this structure:
```
tab-master/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── popup.html            # Extension popup
├── popup.js              # Popup functionality
├── config.js             # Configuration file
├── icons/                # Icon directory
│   ├── icon16.png        # 16x16 icon
│   ├── icon32.png        # 32x32 icon
│   ├── icon48.png        # 48x48 icon
│   ├── icon128.png       # 128x128 icon
│   └── icon.svg          # Source SVG
├── TROUBLESHOOTING.md    # Troubleshooting guide
├── SETUP.md              # This file
├── quick-icons.html      # Quick icon generator
├── generate-icons.html   # Advanced icon generator
└── create-icons.js       # Node.js icon script
```

## Troubleshooting

### "Manifest file is missing or unreadable"
- Make sure `manifest.json` exists in the root folder
- Check that the file is not corrupted
- Verify all required files are present

### "Could not load manifest"
- Ensure all PNG icons exist in the `icons/` folder
- Check that icon filenames match exactly: `icon16.png`, `icon32.png`, etc.
- Verify the manifest.json syntax is correct

### Extension not working
- Check the browser console for errors (F12 → Console)
- Look for any JavaScript errors in the background script
- Verify all permissions are granted

## Features

Once loaded, your extension provides:
- **Automatic session saving** when browser closes
- **Manual session saving** via popup button
- **Session restoration** via popup or keyboard shortcut (Ctrl+Shift+R)
- **Tab group preservation** with collapsed states
- **Tab order preservation** 
- **Memory optimization** with intelligent tab suspension
- **Protected sites** that won't be suspended (YouTube, Instacart, etc.)

## Configuration

You can customize the extension behavior by editing the `SUSPENSION_CONFIG` in `background.js`:

- `enabled`: Set to `false` to disable tab suspension entirely
- `delayBeforeSuspension`: Time to wait before suspending tabs (milliseconds)
- `sitesToNeverSuspend`: List of sites that should never be suspended

## Support

If you encounter issues:
1. Check the `TROUBLESHOOTING.md` file
2. Look at browser console logs for error messages
3. Verify all files are in the correct locations
4. Make sure you have the required PNG icons 