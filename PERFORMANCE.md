# Performance Configuration Guide

## Quick Performance Fixes

### Option 1: Disable Tab Suspension (Maximum Performance)
Edit `background.js` and change line 6:
```javascript
const DISABLE_SUSPENSION = true; // Set to true to disable suspension entirely
```

**Benefits:**
- No lag when opening new tabs
- All tabs remain active and responsive
- Maximum compatibility with all websites

**Trade-offs:**
- Higher memory usage
- More battery consumption on laptops

### Option 2: Optimized Suspension (Balanced)
The current settings are already optimized:
- **Delay**: 500ms (reduced from 2000ms)
- **Batch processing**: Parallel processing for speed
- **Protected sites**: YouTube, Instacart, etc. won't be suspended

### Option 3: Custom Configuration
Edit the `SUSPENSION_CONFIG` in `background.js`:

```javascript
const SUSPENSION_CONFIG = {
  enabled: true,
  delayBeforeSuspension: 200, // Even faster - 200ms delay
  batchSize: 10, // Larger batches
  delayBetweenBatches: 25, // Shorter delays
  sitesToNeverSuspend: [
    // Add your frequently used sites here
    'youtube.com',
    'instacart.com',
    'github.com',
    'stackoverflow.com'
  ]
};
```

## Performance Tips

### 1. **For Maximum Speed**
```javascript
const DISABLE_SUSPENSION = true; // Disable suspension entirely
```

### 2. **For Balanced Performance**
```javascript
const DISABLE_SUSPENSION = false;
// Use current optimized settings
```

### 3. **For Memory Efficiency**
```javascript
const DISABLE_SUSPENSION = false;
const SUSPENSION_CONFIG = {
  enabled: true,
  delayBeforeSuspension: 1000, // Longer delay
  batchSize: 3, // Smaller batches
  delayBetweenBatches: 100, // Longer delays
  // ... rest of config
};
```

## Troubleshooting Performance Issues

### Lag When Opening New Tabs
**Cause:** Tab suspension is interfering with new tab creation
**Solution:** Set `DISABLE_SUSPENSION = true`

### Slow Session Restoration
**Cause:** Too many tabs being processed sequentially
**Solution:** Current settings already use parallel processing

### High Memory Usage
**Cause:** Too many active tabs
**Solution:** Enable suspension with longer delays

### Browser Freezing
**Cause:** Too many tabs suspended at once
**Solution:** Reduce batch size and increase delays

## Recommended Settings by Use Case

### **Developer/Heavy Browser Usage**
```javascript
const DISABLE_SUSPENSION = true; // Keep all tabs active
```

### **Casual Browsing**
```javascript
const DISABLE_SUSPENSION = false;
// Use current optimized settings
```

### **Low Memory Systems**
```javascript
const DISABLE_SUSPENSION = false;
const SUSPENSION_CONFIG = {
  enabled: true,
  delayBeforeSuspension: 300,
  batchSize: 3,
  delayBetweenBatches: 100,
  // ... rest of config
};
```

### **Battery-Sensitive (Laptops)**
```javascript
const DISABLE_SUSPENSION = false;
const SUSPENSION_CONFIG = {
  enabled: true,
  delayBeforeSuspension: 1000,
  batchSize: 5,
  delayBetweenBatches: 200,
  // ... rest of config
};
```

## Testing Performance

1. **Test new tab creation:** Open new tabs and check for lag
2. **Test session restoration:** Restore a session with many tabs
3. **Monitor memory usage:** Check Chrome's Task Manager (Shift+Esc)
4. **Check battery impact:** Monitor battery usage on laptops

## Quick Commands

### Disable Suspension (Copy & Paste)
```javascript
const DISABLE_SUSPENSION = true;
```

### Enable Suspension (Copy & Paste)
```javascript
const DISABLE_SUSPENSION = false;
```

### Ultra-Fast Mode (Copy & Paste)
```javascript
const DISABLE_SUSPENSION = true;
const SUSPENSION_CONFIG = {
  enabled: false,
  delayBeforeSuspension: 0,
  batchSize: 1,
  delayBetweenBatches: 0,
  sitesToNeverSuspend: []
};
```

After making changes, reload the extension in `chrome://extensions/` for the changes to take effect. 