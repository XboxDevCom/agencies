const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateFullChangelog } = require('./generate-changelog');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`🔄 ${description}...`, 'blue');
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`✅ ${description} completed`, 'green');
    return result;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    throw error;
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  return packageJson.version;
}

function validateReleaseType(type) {
  const validTypes = ['patch', 'minor', 'major'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid release type: ${type}. Must be one of: ${validTypes.join(', ')}`);
  }
}

function checkGitStatus() {
  log('🔍 Checking Git status...', 'blue');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      throw new Error('Working directory is not clean. Please commit or stash your changes.');
    }
    
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (branch !== 'main' && branch !== 'master') {
      log(`⚠️  You are on branch '${branch}'. Releases should typically be made from 'main' or 'master'.`, 'yellow');
      
      // Ask for confirmation (in a real scenario, you might want to use a proper prompt library)
      log('Continue anyway? (This script will continue automatically)', 'yellow');
    }
    
    log('✅ Git status check passed', 'green');
  } catch (error) {
    log(`❌ Git status check failed: ${error.message}`, 'red');
    throw error;
  }
}

function runPreReleaseChecks() {
  log('\n🧪 Running pre-release checks...', 'cyan');
  
  const checks = [
    { command: 'npm run lint:check', description: 'Code linting' },
    { command: 'npm run type-check', description: 'TypeScript type checking' },
    { command: 'npm run test:ci', description: 'Unit tests' },
    { command: 'npm run validate:translations', description: 'Translation validation' },
    { command: 'npm run test:a11y', description: 'Accessibility tests' }
  ];
  
  for (const check of checks) {
    execCommand(check.command, check.description);
  }
  
  log('✅ All pre-release checks passed!', 'green');
}

function updateVersion(releaseType) {
  log(`\n📦 Updating version (${releaseType})...`, 'cyan');
  
  const oldVersion = getCurrentVersion();
  execCommand(`npm version ${releaseType} --no-git-tag-version`, `Version bump (${releaseType})`);
  const newVersion = getCurrentVersion();
  
  log(`📈 Version updated: ${oldVersion} → ${newVersion}`, 'green');
  return { oldVersion, newVersion };
}

function generateChangelog() {
  log('\n📝 Generating changelog...', 'cyan');
  
  try {
    const changelogInfo = generateFullChangelog();
    log('✅ Changelog generated successfully', 'green');
    return changelogInfo;
  } catch (error) {
    log(`❌ Changelog generation failed: ${error.message}`, 'red');
    throw error;
  }
}

function commitAndTag(version) {
  log('\n🏷️  Creating commit and tag...', 'cyan');
  
  execCommand('git add .', 'Staging changes');
  execCommand(`git commit -m "chore(release): v${version}"`, 'Creating release commit');
  execCommand(`git tag -a v${version} -m "Release v${version}"`, 'Creating Git tag');
  
  log(`✅ Created commit and tag for v${version}`, 'green');
}

function pushToRemote() {
  log('\n🚀 Pushing to remote repository...', 'cyan');
  
  execCommand('git push', 'Pushing commits');
  execCommand('git push --tags', 'Pushing tags');
  
  log('✅ Successfully pushed to remote repository', 'green');
}

function buildAndDeploy() {
  log('\n🏗️  Building and deploying...', 'cyan');
  
  execCommand('npm run build', 'Building application');
  execCommand('npm run deploy', 'Deploying to GitHub Pages');
  
  log('✅ Build and deployment completed', 'green');
}

function generateReleaseReport(releaseInfo) {
  const { oldVersion, newVersion, changelogInfo } = releaseInfo;
  
  log('\n📊 Release Summary', 'cyan');
  log('═'.repeat(50), 'cyan');
  log(`🏷️  Version: ${oldVersion} → ${newVersion}`, 'bright');
  log(`📅 Date: ${new Date().toISOString().split('T')[0]}`, 'bright');
  
  if (changelogInfo && changelogInfo.stats) {
    log(`📈 Statistics:`, 'bright');
    log(`   • Total commits: ${changelogInfo.stats.total}`);
    log(`   • Features: ${changelogInfo.stats.features}`);
    log(`   • Bug fixes: ${changelogInfo.stats.fixes}`);
    log(`   • Breaking changes: ${changelogInfo.stats.breaking}`);
    log(`   • Contributors: ${changelogInfo.stats.contributors}`);
  }
  
  log('\n🔗 Next steps:', 'bright');
  log('   • Check the deployment at: https://agencies.xboxdev.com');
  log('   • Review the changelog: CHANGELOG.md');
  log('   • Create a GitHub release with the generated release notes');
  log('   • Announce the release to stakeholders');
  
  log('\n🎉 Release completed successfully!', 'green');
}

async function performRelease(releaseType) {
  const startTime = Date.now();
  
  try {
    log(`🚀 Starting ${releaseType} release process...`, 'cyan');
    log('═'.repeat(50), 'cyan');
    
    // Validation
    validateReleaseType(releaseType);
    checkGitStatus();
    
    // Pre-release checks
    runPreReleaseChecks();
    
    // Version update
    const versionInfo = updateVersion(releaseType);
    
    // Generate changelog
    const changelogInfo = generateChangelog();
    
    // Git operations
    commitAndTag(versionInfo.newVersion);
    pushToRemote();
    
    // Build and deploy
    buildAndDeploy();
    
    // Summary
    const releaseInfo = {
      ...versionInfo,
      changelogInfo,
      duration: Math.round((Date.now() - startTime) / 1000)
    };
    
    generateReleaseReport(releaseInfo);
    
    return releaseInfo;
    
  } catch (error) {
    log(`\n💥 Release failed: ${error.message}`, 'red');
    log('\n🔄 You may need to:', 'yellow');
    log('   • Fix the reported issues');
    log('   • Reset any partial changes: git reset --hard HEAD~1');
    log('   • Delete the created tag: git tag -d v<version>');
    log('   • Try the release again');
    
    process.exit(1);
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const releaseType = args[0];
  
  if (!releaseType) {
    log('❌ Release type is required!', 'red');
    log('\nUsage:', 'bright');
    log('  npm run release:patch   # Bug fixes (1.0.0 → 1.0.1)');
    log('  npm run release:minor   # New features (1.0.0 → 1.1.0)');
    log('  npm run release:major   # Breaking changes (1.0.0 → 2.0.0)');
    log('\nOr use the script directly:');
    log('  node scripts/release.js patch');
    log('  node scripts/release.js minor');
    log('  node scripts/release.js major');
    process.exit(1);
  }
  
  performRelease(releaseType);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { performRelease };
