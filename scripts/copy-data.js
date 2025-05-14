const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourcePath = path.join(__dirname, '..', 'public', 'data.csv');
const destPath = path.join(__dirname, '..', 'build', 'data.csv');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy data.csv to build directory
try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('Successfully copied data.csv to build directory');
} catch (err) {
  console.error('Error copying data.csv:', err);
  process.exit(1);
} 