// Simple icon generator for Tab & Group Saver Chrome extension
// Run this with Node.js to create the required PNG icons

const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Simple SVG icon data
const svgIcon = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#34a853;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect x="10" y="20" width="108" height="88" rx="8" fill="url(#grad1)" stroke="#1a73e8" stroke-width="2"/>
    <rect x="15" y="25" width="98" height="78" rx="4" fill="white" opacity="0.9"/>
    
    <!-- Tab 1 -->
    <rect x="20" y="30" width="25" height="15" rx="3" fill="#4285f4" opacity="0.8"/>
    <rect x="22" y="32" width="21" height="11" rx="2" fill="white"/>
    
    <!-- Tab 2 -->
    <rect x="50" y="30" width="25" height="15" rx="3" fill="#34a853" opacity="0.8"/>
    <rect x="52" y="32" width="21" height="11" rx="2" fill="white"/>
    
    <!-- Tab 3 -->
    <rect x="80" y="30" width="25" height="15" rx="3" fill="#ea4335" opacity="0.8"/>
    <rect x="82" y="32" width="21" height="11" rx="2" fill="white"/>
    
    <!-- Group indicator -->
    <rect x="25" y="55" width="78" height="8" rx="4" fill="#fbbc04" opacity="0.7"/>
    <rect x="27" y="57" width="74" height="4" rx="2" fill="white"/>
    
    <!-- Content lines -->
    <rect x="25" y="70" width="60" height="3" rx="1.5" fill="#5f6368" opacity="0.6"/>
    <rect x="25" y="78" width="45" height="3" rx="1.5" fill="#5f6368" opacity="0.4"/>
    <rect x="25" y="86" width="70" height="3" rx="1.5" fill="#5f6368" opacity="0.6"/>
    <rect x="25" y="94" width="35" height="3" rx="1.5" fill="#5f6368" opacity="0.4"/>
</svg>
`;

// Save the SVG icon
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

console.log('SVG icon created successfully!');
console.log('');
console.log('To create PNG icons, you have several options:');
console.log('');
console.log('1. Use the generate-icons.html file:');
console.log('   - Open generate-icons.html in your browser');
console.log('   - Click "Generate All Icons" and "Download All Icons"');
console.log('   - Move the downloaded PNG files to the icons/ directory');
console.log('');
console.log('2. Use an online SVG to PNG converter:');
console.log('   - Copy the SVG content from icons/icon.svg');
console.log('   - Use a tool like https://convertio.co/svg-png/');
console.log('   - Generate sizes: 16x16, 32x32, 48x48, 128x128');
console.log('');
console.log('3. Use a graphics editor:');
console.log('   - Open icons/icon.svg in Inkscape, GIMP, or Photoshop');
console.log('   - Export as PNG in the required sizes');
console.log('');
console.log('Required PNG files:');
console.log('- icons/icon16.png');
console.log('- icons/icon32.png');
console.log('- icons/icon48.png');
console.log('- icons/icon128.png');
console.log('');
console.log('Once you have the PNG files, the extension should load properly!'); 