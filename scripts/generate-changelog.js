const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Conventional commit types
const COMMIT_TYPES = {
  feat: { title: '✨ Features', emoji: '✨' },
  fix: { title: '🐛 Bug Fixes', emoji: '🐛' },
  docs: { title: '📚 Documentation', emoji: '📚' },
  style: { title: '💄 Styles', emoji: '💄' },
  refactor: { title: '♻️ Code Refactoring', emoji: '♻️' },
  perf: { title: '⚡ Performance Improvements', emoji: '⚡' },
  test: { title: '✅ Tests', emoji: '✅' },
  build: { title: '👷 Build System', emoji: '👷' },
  ci: { title: '🔧 Continuous Integration', emoji: '🔧' },
  chore: { title: '🔨 Chores', emoji: '🔨' },
  revert: { title: '⏪ Reverts', emoji: '⏪' },
  security: { title: '🔒 Security', emoji: '🔒' },
  i18n: { title: '🌍 Internationalization', emoji: '🌍' },
  a11y: { title: '♿ Accessibility', emoji: '♿' }
};

function parseCommitMessage(message) {
  // Parse conventional commit format: type(scope): description
  const conventionalRegex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;
  const match = message.match(conventionalRegex);
  
  if (match) {
    const [, type, scope, description] = match;
    return {
      type: type.toLowerCase(),
      scope: scope || null,
      description: description,
      isBreaking: message.includes('BREAKING CHANGE') || message.includes('!:'),
      isConventional: true
    };
  }
  
  // Fallback for non-conventional commits
  return {
    type: 'chore',
    scope: null,
    description: message,
    isBreaking: false,
    isConventional: false
  };
}

function getCommitsSinceLastTag() {
  try {
    // Get the last tag
    const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    console.log(`📋 Generating changelog since last tag: ${lastTag}`);
    
    // Get commits since last tag
    const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%H|%s|%an|%ad" --date=short`, { encoding: 'utf8' })
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, message, author, date] = line.split('|');
        return {
          hash: hash.substring(0, 7),
          message: message.trim(),
          author,
          date,
          ...parseCommitMessage(message.trim())
        };
      });
    
    return { lastTag, commits };
  } catch (error) {
    console.log('📋 No previous tags found, generating changelog for all commits');
    
    // Get all commits if no tags exist
    const commits = execSync('git log --pretty=format:"%H|%s|%an|%ad" --date=short', { encoding: 'utf8' })
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, message, author, date] = line.split('|');
        return {
          hash: hash.substring(0, 7),
          message: message.trim(),
          author,
          date,
          ...parseCommitMessage(message.trim())
        };
      });
    
    return { lastTag: null, commits };
  }
}

function groupCommitsByType(commits) {
  const grouped = {};
  
  commits.forEach(commit => {
    const type = commit.type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(commit);
  });
  
  return grouped;
}

function generateChangelogSection(version, date, commits) {
  const grouped = groupCommitsByType(commits);
  const breakingChanges = commits.filter(c => c.isBreaking);
  
  let section = `## [${version}] - ${date}\n\n`;
  
  // Breaking changes first
  if (breakingChanges.length > 0) {
    section += `### 💥 BREAKING CHANGES\n\n`;
    breakingChanges.forEach(commit => {
      section += `- **${commit.scope ? `${commit.scope}: ` : ''}${commit.description}** ([${commit.hash}](../../commit/${commit.hash}))\n`;
    });
    section += '\n';
  }
  
  // Group by type
  Object.keys(COMMIT_TYPES).forEach(type => {
    if (grouped[type] && grouped[type].length > 0) {
      const typeInfo = COMMIT_TYPES[type];
      section += `### ${typeInfo.title}\n\n`;
      
      grouped[type].forEach(commit => {
        if (!commit.isBreaking) { // Don't duplicate breaking changes
          const scopeText = commit.scope ? `**${commit.scope}**: ` : '';
          section += `- ${scopeText}${commit.description} ([${commit.hash}](../../commit/${commit.hash}))\n`;
        }
      });
      section += '\n';
    }
  });
  
  // Other commits (non-conventional)
  const otherCommits = commits.filter(c => !c.isConventional && !Object.keys(COMMIT_TYPES).includes(c.type));
  if (otherCommits.length > 0) {
    section += `### 🔨 Other Changes\n\n`;
    otherCommits.forEach(commit => {
      section += `- ${commit.description} ([${commit.hash}](../../commit/${commit.hash}))\n`;
    });
    section += '\n';
  }
  
  return section;
}

function generateFullChangelog() {
  console.log('📝 Generating complete changelog...\n');
  
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  const currentVersion = packageJson.version;
  const currentDate = new Date().toISOString().split('T')[0];
  
  const { lastTag, commits } = getCommitsSinceLastTag();
  
  if (commits.length === 0) {
    console.log('ℹ️  No new commits found since last release.');
    return;
  }
  
  console.log(`📊 Found ${commits.length} commits to include in changelog\n`);
  
  // Generate statistics
  const stats = {
    total: commits.length,
    features: commits.filter(c => c.type === 'feat').length,
    fixes: commits.filter(c => c.type === 'fix').length,
    breaking: commits.filter(c => c.isBreaking).length,
    contributors: [...new Set(commits.map(c => c.author))].length
  };
  
  console.log('📈 Changelog Statistics:');
  console.log(`   Total commits: ${stats.total}`);
  console.log(`   Features: ${stats.features}`);
  console.log(`   Bug fixes: ${stats.fixes}`);
  console.log(`   Breaking changes: ${stats.breaking}`);
  console.log(`   Contributors: ${stats.contributors}\n`);
  
  // Read existing changelog or create header
  const changelogPath = path.join(__dirname, '../CHANGELOG.md');
  let existingChangelog = '';
  
  if (fs.existsSync(changelogPath)) {
    existingChangelog = fs.readFileSync(changelogPath, 'utf8');
    // Remove the header to add it back later
    existingChangelog = existingChangelog.replace(/^# Changelog[\s\S]*?(?=##)/m, '');
  }
  
  // Generate new section
  const newSection = generateChangelogSection(currentVersion, currentDate, commits);
  
  // Create complete changelog
  const header = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
  
  const fullChangelog = header + newSection + existingChangelog;
  
  // Write changelog
  fs.writeFileSync(changelogPath, fullChangelog);
  
  console.log(`✅ Changelog updated successfully!`);
  console.log(`📄 File: ${changelogPath}`);
  
  // Generate release notes for GitHub
  const releaseNotesPath = path.join(__dirname, '../RELEASE_NOTES.md');
  fs.writeFileSync(releaseNotesPath, newSection);
  
  console.log(`📄 Release notes: ${releaseNotesPath}\n`);
  
  return {
    version: currentVersion,
    date: currentDate,
    stats,
    commits: commits.length
  };
}

// Run if called directly
if (require.main === module) {
  try {
    generateFullChangelog();
  } catch (error) {
    console.error('❌ Error generating changelog:', error.message);
    process.exit(1);
  }
}

module.exports = { generateFullChangelog, parseCommitMessage };
