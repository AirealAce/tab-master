const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#4285f4');
    gradient.addColorStop(1, '#34a853');
    
    // Main background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Inner white area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(size * 0.08, size * 0.16, size * 0.84, size * 0.68);
    
    // Tab 1 (blue)
    ctx.fillStyle = '#4285f4';
    ctx.fillRect(size * 0.16, size * 0.23, size * 0.20, size * 0.12);
    ctx.fillStyle = 'white';
    ctx.fillRect(size * 0.17, size * 0.25, size * 0.18, size * 0.08);
    
    // Tab 2 (green)
    ctx.fillStyle = '#34a853';
    ctx.fillRect(size * 0.39, size * 0.23, size * 0.20, size * 0.12);
    ctx.fillStyle = 'white';
    ctx.fillRect(size * 0.40, size * 0.25, size * 0.18, size * 0.08);
    
    // Tab 3 (red)
    ctx.fillStyle = '#ea4335';
    ctx.fillRect(size * 0.62, size * 0.23, size * 0.20, size * 0.12);
    ctx.fillStyle = 'white';
    ctx.fillRect(size * 0.63, size * 0.25, size * 0.18, size * 0.08);
    
    // Group indicator (yellow)
    ctx.fillStyle = '#fbbc04';
    ctx.fillRect(size * 0.20, size * 0.43, size * 0.60, size * 0.06);
    ctx.fillStyle = 'white';
    ctx.fillRect(size * 0.21, size * 0.44, size * 0.58, size * 0.04);
    
    // Content lines
    ctx.fillStyle = '#5f6368';
    ctx.fillRect(size * 0.20, size * 0.55, size * 0.47, size * 0.02);
    ctx.fillRect(size * 0.20, size * 0.61, size * 0.35, size * 0.02);
    ctx.fillRect(size * 0.20, size * 0.67, size * 0.55, size * 0.02);
    ctx.fillRect(size * 0.20, size * 0.73, size * 0.27, size * 0.02);
    
    return canvas;
}

function generateIcons() {
    const sizes = [16, 32, 48, 128];
    
    console.log('Generating PNG icons...');
    
    sizes.forEach(size => {
        const canvas = createIcon(size);
        const buffer = canvas.toBuffer('image/png');
        const filename = `icon${size}.png`;
        const filepath = path.join(iconsDir, filename);
        
        fs.writeFileSync(filepath, buffer);
        console.log(`✓ Created ${filename} (${size}x${size})`);
    });
    
    console.log('\nAll icons generated successfully!');
    console.log('You can now load the extension in Chrome.');
}

// Generate the icons
generateIcons(); 