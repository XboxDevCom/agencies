#!/bin/bash

# Git Setup Script for Creator Agencies Directory
# This script configures Git for optimal development workflow

set -e

echo "🔧 Setting up Git configuration for Creator Agencies Directory..."
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a Git repository
if [ ! -d ".git" ]; then
    print_error "Not a Git repository. Please run 'git init' first."
    exit 1
fi

# Set up commit message template
print_info "Setting up commit message template..."
git config commit.template .gitmessage
print_status "Commit message template configured"

# Configure Git hooks
print_info "Setting up Git hooks..."
node scripts/setup-git-hooks.js
print_status "Git hooks configured"

# Set up useful Git aliases
print_info "Setting up Git aliases..."

git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.st status
git config alias.unstage 'reset HEAD --'
git config alias.last 'log -1 HEAD'
git config alias.visual '!gitk'

# Semantic versioning aliases
git config alias.release-patch '!npm run release:patch'
git config alias.release-minor '!npm run release:minor'
git config alias.release-major '!npm run release:major'

# Changelog alias
git config alias.changelog '!npm run changelog'

# Pretty log aliases
git config alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config alias.lga "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all"

print_status "Git aliases configured"

# Configure line ending handling
print_info "Configuring line ending handling..."
git config core.autocrlf input
git config core.safecrlf true
print_status "Line ending configuration set"

# Configure merge and diff tools (optional)
print_info "Configuring merge and diff settings..."
git config merge.tool vimdiff
git config diff.tool vimdiff
git config difftool.prompt false
print_status "Merge and diff tools configured"

# Set up branch protection (local)
print_info "Setting up branch protection recommendations..."
git config branch.main.mergeoptions "--no-ff"
git config branch.master.mergeoptions "--no-ff"
print_status "Branch protection configured"

# Configure push behavior
print_info "Configuring push behavior..."
git config push.default simple
git config push.followTags true
print_status "Push behavior configured"

# Set up rerere (reuse recorded resolution)
print_info "Enabling rerere for conflict resolution..."
git config rerere.enabled true
print_status "Rerere enabled"

# Configure GPG signing (optional)
read -p "Do you want to set up GPG commit signing? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Setting up GPG signing..."
    
    # Check if GPG key exists
    if gpg --list-secret-keys --keyid-format LONG | grep -q "sec"; then
        GPG_KEY=$(gpg --list-secret-keys --keyid-format LONG | grep "sec" | head -1 | awk '{print $2}' | cut -d'/' -f2)
        git config user.signingkey $GPG_KEY
        git config commit.gpgsign true
        git config tag.gpgsign true
        print_status "GPG signing configured with key: $GPG_KEY"
    else
        print_warning "No GPG key found. Please generate one with 'gpg --gen-key' first."
    fi
fi

# Display current configuration
echo
print_info "Current Git configuration:"
echo "----------------------------------------"
echo "User name: $(git config user.name || echo 'Not set')"
echo "User email: $(git config user.email || echo 'Not set')"
echo "Commit template: $(git config commit.template || echo 'Not set')"
echo "GPG signing: $(git config commit.gpgsign || echo 'false')"
echo "Push default: $(git config push.default || echo 'Not set')"
echo

# Verify setup
print_info "Verifying setup..."

# Check if hooks are executable
if [ -x ".git/hooks/pre-commit" ]; then
    print_status "Pre-commit hook is executable"
else
    print_warning "Pre-commit hook is not executable"
fi

if [ -x ".git/hooks/commit-msg" ]; then
    print_status "Commit-msg hook is executable"
else
    print_warning "Commit-msg hook is not executable"
fi

if [ -x ".git/hooks/pre-push" ]; then
    print_status "Pre-push hook is executable"
else
    print_warning "Pre-push hook is not executable"
fi

echo
print_status "Git setup completed successfully!"
echo
print_info "Available Git aliases:"
echo "  git co          - checkout"
echo "  git br          - branch"
echo "  git ci          - commit"
echo "  git st          - status"
echo "  git lg          - pretty log"
echo "  git lga         - pretty log --all"
echo "  git changelog   - generate changelog"
echo "  git release-patch  - create patch release"
echo "  git release-minor  - create minor release"
echo "  git release-major  - create major release"
echo
print_info "Commit message template is now active. Use 'git commit' to see the template."
echo
print_info "Next steps:"
echo "  1. Make sure your user.name and user.email are set:"
echo "     git config user.name 'Your Name'"
echo "     git config user.email 'your.email@example.com'"
echo "  2. Test the setup with a commit"
echo "  3. Try the new aliases: git st, git lg, etc."
echo
print_status "Happy coding! 🚀"
