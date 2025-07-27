#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📦 Bundle Analysis Report\n');

const buildDir = path.join(__dirname, '../build/static');

// Analyze JS files
const jsDir = path.join(buildDir, 'js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
  
  console.log('📄 JavaScript Files:');
  let totalJSSize = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(jsDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalJSSize += stats.size;
    
    console.log(`   ${file}: ${sizeKB} KB`);
  });
  
  console.log(`   Total JS: ${(totalJSSize / 1024).toFixed(2)} KB\n`);
}

// Analyze CSS files
const cssDir = path.join(buildDir, 'css');
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
  
  console.log('🎨 CSS Files:');
  let totalCSSSize = 0;
  
  cssFiles.forEach(file => {
    const filePath = path.join(cssDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalCSSSize += stats.size;
    
    console.log(`   ${file}: ${sizeKB} KB`);
  });
  
  console.log(`   Total CSS: ${(totalCSSSize / 1024).toFixed(2)} KB\n`);
}

// Check for large files
const allFiles = [];
function scanDirectory(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      scanDirectory(filePath, prefix + file + '/');
    } else {
      allFiles.push({
        name: prefix + file,
        size: stats.size,
        path: filePath
      });
    }
  });
}

scanDirectory(buildDir);

// Find largest files
const largeFiles = allFiles
  .filter(file => file.size > 10 * 1024) // > 10KB
  .sort((a, b) => b.size - a.size)
  .slice(0, 10);

if (largeFiles.length > 0) {
  console.log('📊 Largest Files (>10KB):');
  largeFiles.forEach(file => {
    const sizeKB = (file.size / 1024).toFixed(2);
    console.log(`   ${file.name}: ${sizeKB} KB`);
  });
  console.log('');
}

// Total build size
const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
console.log(`📦 Total Build Size: ${(totalSize / 1024).toFixed(2)} KB`);

// Performance recommendations
console.log('\n💡 Performance Recommendations:');
if (totalSize > 500 * 1024) {
  console.log('   ⚠️  Build size is large (>500KB). Consider code splitting.');
} else {
  console.log('   ✅ Build size is reasonable.');
}

const mainJSFile = allFiles.find(f => f.name.includes('main.') && f.name.endsWith('.js'));
if (mainJSFile && mainJSFile.size > 300 * 1024) {
  console.log('   ⚠️  Main JS bundle is large (>300KB). Consider lazy loading.');
} else {
  console.log('   ✅ Main JS bundle size is good.');
}

console.log('\n✅ Bundle analysis completed!');
