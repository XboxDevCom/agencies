const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function setupGitHooks() {
  console.log('🔧 Setting up Git hooks...\n');

  const gitHooksDir = path.join(__dirname, '../.git/hooks');
  
  // Check if .git directory exists
  if (!fs.existsSync(path.join(__dirname, '../.git'))) {
    console.log('ℹ️  Not a Git repository, skipping Git hooks setup.');
    return;
  }

  // Ensure hooks directory exists
  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir, { recursive: true });
  }

  // Pre-commit hook
  const preCommitHook = `#!/bin/sh
# Pre-commit hook for Creator Agencies Directory

echo "🔍 Running pre-commit checks..."

# Run linting
echo "📝 Checking code style..."
npm run lint:check
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix the issues and try again."
  exit 1
fi

# Run type checking
echo "🔍 Checking TypeScript types..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Please fix the issues and try again."
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test:ci
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix the issues and try again."
  exit 1
fi

# Validate translations
echo "🌍 Validating translations..."
npm run validate:translations
if [ $? -ne 0 ]; then
  echo "❌ Translation validation failed. Please fix the issues and try again."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
`;

  // Commit message hook
  const commitMsgHook = `#!/bin/sh
# Commit message hook for Creator Agencies Directory

commit_regex='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|security|i18n|a11y)(\\(.+\\))?: .{1,50}'

error_msg="❌ Invalid commit message format!

Commit message should follow conventional commits format:
  <type>[optional scope]: <description>

Examples:
  feat: add language switcher component
  fix(i18n): resolve translation parameter interpolation
  docs: update README with accessibility information
  style: improve button focus indicators
  refactor(search): optimize filtering performance
  perf: implement virtual scrolling for large datasets
  test: add unit tests for translation validation
  build: update dependencies to latest versions
  ci: add accessibility testing to pipeline
  chore: update git hooks configuration
  security: fix XSS vulnerability in search input
  i18n: add Italian translations
  a11y: improve screen reader announcements

Types:
  feat:     ✨ A new feature
  fix:      🐛 A bug fix
  docs:     📚 Documentation only changes
  style:    💄 Changes that do not affect the meaning of the code
  refactor: ♻️  A code change that neither fixes a bug nor adds a feature
  perf:     ⚡ A code change that improves performance
  test:     ✅ Adding missing tests or correcting existing tests
  build:    👷 Changes that affect the build system or external dependencies
  ci:       🔧 Changes to our CI configuration files and scripts
  chore:    🔨 Other changes that don't modify src or test files
  revert:   ⏪ Reverts a previous commit
  security: 🔒 A code change that fixes a security issue
  i18n:     🌍 Internationalization and localization changes
  a11y:     ♿ Accessibility improvements

Scope (optional):
  The scope should be the name of the component/feature affected:
  - search, filter, modal, i18n, a11y, etc.

Breaking changes:
  Add '!' after the type/scope: feat!: remove deprecated API
  Or include 'BREAKING CHANGE:' in the commit body.
"

if ! grep -qE "$commit_regex" "$1"; then
    echo "$error_msg" >&2
    exit 1
fi
`;

  // Pre-push hook
  const prePushHook = `#!/bin/sh
# Pre-push hook for Creator Agencies Directory

echo "🚀 Running pre-push checks..."

# Run accessibility tests
echo "♿ Running accessibility tests..."
npm run test:a11y
if [ $? -ne 0 ]; then
  echo "❌ Accessibility tests failed. Please fix the issues and try again."
  exit 1
fi

# Check bundle size
echo "📦 Analyzing bundle size..."
npm run analyze > /dev/null 2>&1

echo "✅ Pre-push checks passed!"
`;

  // Write hooks
  const hooks = [
    { name: 'pre-commit', content: preCommitHook },
    { name: 'commit-msg', content: commitMsgHook },
    { name: 'pre-push', content: prePushHook }
  ];

  hooks.forEach(hook => {
    const hookPath = path.join(gitHooksDir, hook.name);
    fs.writeFileSync(hookPath, hook.content);
    
    // Make executable
    try {
      execSync(`chmod +x "${hookPath}"`);
      console.log(`✅ ${hook.name} hook installed`);
    } catch (error) {
      console.warn(`⚠️  Could not make ${hook.name} hook executable:`, error.message);
    }
  });

  console.log('\n🎉 Git hooks setup completed!\n');
  console.log('📋 Installed hooks:');
  console.log('   • pre-commit: Runs linting, type checking, tests, and translation validation');
  console.log('   • commit-msg: Validates commit message format (conventional commits)');
  console.log('   • pre-push: Runs accessibility tests and bundle analysis\n');
}

// Run if called directly
if (require.main === module) {
  try {
    setupGitHooks();
  } catch (error) {
    console.error('❌ Error setting up Git hooks:', error.message);
    process.exit(1);
  }
}

module.exports = { setupGitHooks };
