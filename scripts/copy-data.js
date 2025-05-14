const fs = require('fs');
const path = require('path');

// Ensure the build directory exists
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy data.csv to build directory
const sourceFile = path.join(__dirname, '../data.csv');
const targetFile = path.join(buildDir, 'data.csv');

fs.copyFileSync(sourceFile, targetFile);
console.log('Copied data.csv to build directory'); 