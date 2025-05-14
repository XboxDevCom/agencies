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
  // Ensure the source file exists
  if (!fs.existsSync(sourcePath)) {
    console.error('Source file not found:', sourcePath);
    process.exit(1);
  }

  // Copy the file
  fs.copyFileSync(sourcePath, destPath);
  console.log('Successfully copied data.csv to build directory');

  // Verify the file was copied
  if (!fs.existsSync(destPath)) {
    console.error('Failed to copy data.csv to build directory');
    process.exit(1);
  }
} catch (err) {
  console.error('Error copying data.csv:', err);
  process.exit(1);
} 