const fs = require('fs');
const path = require('path');

// A simple 1x1 pixel blue PNG base64
const bluePixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwL+MgXpZgAAAABJRU5ErkJggg==';
// A simple 1x1 pixel blue PNG buffer
const buffer = Buffer.from(bluePixelBase64, 'base64');

const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate placeholder icons
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), buffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), buffer);

console.log('Placeholder icons generated in public/icons/');
