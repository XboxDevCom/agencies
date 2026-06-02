# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-06-02

### 🚀 Build & Tooling

- **build**: Migrated from Create React App (react-scripts, unmaintained) to **Vite 8** — dev start and production builds are dramatically faster
- **test**: Replaced Jest with **Vitest 4** (jsdom environment, v8 coverage)
- **lint**: Migrated ESLint to flat config (ESLint 9, typescript-eslint 8) while keeping the full `jsx-a11y` ruleset
- **deps**: TypeScript 4.9 → 5.9, React Router 6 → 7, papaparse/testing-library and other dependencies updated
- **security**: Removed CRA's transitive vulnerability chain — `npm audit` now reports **0 vulnerabilities**
- **ci**: Updated GitHub Actions to Node 22; build output keeps the `build/static/{js,css}` layout for compatibility

### ⚡ Performance

- **bundle**: Code-split the `/investor-tips` and `/dividend-calculator` routes via `React.lazy` so they no longer load on first paint
- **bundle**: Split long-lived vendor code (React, React Router) and papaparse into separately cacheable chunks

### 🔍 SEO

- **seo**: Default document language set to `de`; language-aware `og:locale` and `hreflang` alternates
- **seo**: Added schema.org JSON-LD structured data, `robots.txt` and `sitemap.xml`
- **seo**: Per-route canonical URLs and meta tags (incl. the previously meta-less secondary routes), `og:image` tags

## [1.1.0] - 2025-07-27

### ✨ Features

- **ui**: Added top horizontal scrollbar for better table navigation
- **ui**: Increased scrollbar thickness for improved usability (14px vertical, 6px horizontal)
- **ui**: Enhanced scrollbar styling with gradient effects and hover animations
- **ui**: Improved scrollbar integration with dark green theme
- **a11y**: Maintained full accessibility compliance with thicker, more visible scrollbars

### 🐛 Bug Fixes

- **ui**: Fixed vertical scrollbars not functioning due to CSS conflicts
- **ui**: Resolved duplicate horizontal scrollbars issue
- **ui**: Corrected scrollbar visibility logic with 5px tolerance

### 🎨 Styling

- **scrollbars**: Added 3D shadow effects and rounded corners (8px radius)
- **scrollbars**: Implemented smooth hover transitions with scale effects
- **scrollbars**: Enhanced visual feedback with gradient backgrounds
- **scrollbars**: Improved contrast and visibility in dark theme

## [1.0.0] - 2025-01-27

### ✨ Features

- **core**: Initial release of Creator Agencies Directory
- **i18n**: Multi-language support (German, English, French, Italian)
- **a11y**: Full WCAG 2.1 AA accessibility compliance
- **search**: Advanced search and filtering capabilities
- **ui**: Responsive design with dark theme
- **data**: CSV-based agency data management
- **modal**: Detailed agency information modals
- **table**: Sortable and filterable data table
- **performance**: Optimized rendering with memoization
- **seo**: Search engine optimization with React Helmet

### ♿ Accessibility

- **keyboard**: Complete keyboard navigation support
- **screen-reader**: Screen reader optimizations with ARIA labels
- **focus**: Visible focus indicators and focus management
- **contrast**: High color contrast ratios (4.5:1 minimum)
- **landmarks**: Semantic HTML structure with ARIA landmarks
- **live-regions**: Dynamic content announcements
- **skip-links**: Skip navigation links for keyboard users
- **testing**: Automated accessibility testing with axe-core

### 🌍 Internationalization

- **translations**: Complete translations for 4 languages
- **localization**: Locale-specific number and date formatting
- **language-switcher**: Accessible language selection component
- **browser-detection**: Automatic language detection
- **persistence**: Language preference persistence
- **url-params**: Language selection via URL parameters

### 🛠️ Development

- **typescript**: Full TypeScript support with strict typing
- **testing**: Comprehensive test suite with Jest
- **linting**: ESLint with accessibility rules
- **git-hooks**: Pre-commit and pre-push validation
- **semantic-versioning**: Automated versioning and changelog generation
- **ci-cd**: Continuous integration and deployment pipeline
- **performance-monitoring**: Bundle size analysis and optimization

### 📚 Documentation

- **readme**: Comprehensive README with setup instructions
- **accessibility**: Detailed accessibility documentation
- **i18n**: Internationalization guide and best practices
- **contributing**: Contribution guidelines and code standards
- **changelog**: Automated changelog generation

### 🔧 Technical

- **react**: React 18 with modern hooks and patterns
- **tailwind**: Tailwind CSS for styling and responsive design
- **csv-parsing**: PapaParse for CSV data processing
- **helmet**: React Helmet Async for SEO optimization
- **build**: Optimized build process with code splitting
- **deployment**: Automated deployment to GitHub Pages

---

**Full Changelog**: https://github.com/xboxdevcom/creator-agencies/commits/v1.0.0
