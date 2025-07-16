# Quick Performance Fixes

## Current Settings (Optimized)

✅ **Delay**: 70ms (balanced - allows URLs to load)  
✅ **All tabs suspended**: Except first tab and protected sites  
✅ **Collapsed groups prioritized**: Tabs in collapsed groups suspend first  
✅ **Parallel processing**: All tabs suspend simultaneously  
✅ **Protected sites**: YouTube, Instacart, etc. won't be suspended  
✅ **Enhanced URL saving**: Better handling of YouTube and dynamic sites  
✅ **Larger batches**: 10 tabs at once for faster processing  

## If You're Still Experiencing Lag

### Option 1: Ultra-Fast Mode (Zero Lag)
Edit `background.js` line 7:
```javascript
const ULTRA_FAST_MODE = true; // Set to true for zero lag
```

### Option 2: Disable Suspension
Edit `background.js` line 6:
```javascript
const DISABLE_SUSPENSION = true; // Set to true to disable suspension
```

### Option 3: Adjust Delay
Edit `background.js` line 15:
```javascript
delayBeforeSuspension: 100, // Longer delay for more URL loading time
```

## Performance Hierarchy

1. **Ultra-Fast Mode**: `ULTRA_FAST_MODE = true` (No suspension at all)
2. **Disable Suspension**: `DISABLE_SUSPENSION = true` (No suspension)
3. **Balanced**: Current settings (70ms delay, allows URLs to load)
4. **Fast**: Previous settings (50ms delay)

## Memory vs Performance Trade-off

- **Ultra-Fast**: Maximum performance, higher memory usage
- **Balanced**: Good performance, moderate memory usage, better URL preservation
- **Fast**: Excellent performance, moderate memory usage

## Current Behavior

- **First tab**: Remains active for immediate use
- **All other tabs**: Suspended after 70ms delay (allows URLs to load)
- **Collapsed groups**: Suspended first (highest priority)
- **Protected sites**: Never suspended (YouTube, Instacart, etc.)
- **YouTube URLs**: Enhanced saving to prevent "about:blank" issues
- **Parallel processing**: All suspensions happen simultaneously

## YouTube URL Fix

The 70ms delay and enhanced URL saving should fix the "about:blank" issue with YouTube:
- Gives YouTube time to load its actual URL
- Enhanced URL validation during saving
- Better handling of pending URLs

## Quick Test

After making changes:
1. Reload extension in `chrome://extensions/`
2. Open new tabs to test for lag
3. Restore a session with YouTube tabs to test URL preservation

## Recommended for Your Use Case

Since you want fast performance and proper YouTube URL handling:
- Current settings (70ms delay) should be perfect
- If YouTube still shows "about:blank", try: `delayBeforeSuspension: 100`
- If still laggy, try: `ULTRA_FAST_MODE = true` 