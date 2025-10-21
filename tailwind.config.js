/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Accessibility-focused color palette
      colors: {
        // High contrast colors for better readability
        'a11y': {
          'focus': '#3B82F6', // Blue focus ring
          'error': '#EF4444', // Red for errors
          'success': '#10B981', // Green for success
          'warning': '#F59E0B', // Amber for warnings
          'info': '#06B6D4', // Cyan for info
        }
      },
      // Focus ring utilities
      ringWidth: {
        '3': '3px',
      },
      ringOffsetWidth: {
        '3': '3px',
      },
      // Animation for reduced motion
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Screen reader utilities
      screens: {
        'reduce-motion': { 'raw': '(prefers-reduced-motion: reduce)' },
        'high-contrast': { 'raw': '(prefers-contrast: high)' },
      },
    },
  },
  plugins: [
    // Custom plugin for accessibility utilities
    function({ addUtilities, addComponents, theme }) {
      // Screen reader only utility
      addUtilities({
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        '.not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal',
        },
        // Focus visible utility
        '.focus-visible': {
          '&:focus-visible': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 2px ${theme('colors.white')}, 0 0 0 4px ${theme('colors.blue.500')}`,
          },
        },
        // Skip link utility
        '.skip-link': {
          position: 'absolute',
          top: '-40px',
          left: '6px',
          background: theme('colors.blue.600'),
          color: theme('colors.white'),
          padding: '8px',
          textDecoration: 'none',
          borderRadius: '4px',
          zIndex: '100',
          '&:focus': {
            top: '6px',
          },
        },
        // High contrast mode utilities
        '@media (prefers-contrast: high)': {
          '.high-contrast-border': {
            borderColor: theme('colors.black'),
            borderWidth: '2px',
          },
          '.high-contrast-text': {
            color: theme('colors.black'),
          },
          '.high-contrast-bg': {
            backgroundColor: theme('colors.white'),
          },
        },
        // Reduced motion utilities
        '@media (prefers-reduced-motion: reduce)': {
          '.motion-reduce': {
            animation: 'none',
            transition: 'none',
          },
        },
      });

      // Accessible button components
      addComponents({
        '.btn-accessible': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.md'),
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${theme('colors.white')}, 0 0 0 4px ${theme('colors.blue.500')}`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.green.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.green.700'),
          },
          '&:active:not(:disabled)': {
            backgroundColor: theme('colors.green.800'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.gray.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.gray.700'),
          },
          '&:active:not(:disabled)': {
            backgroundColor: theme('colors.gray.800'),
          },
        },
        '.btn-danger': {
          backgroundColor: theme('colors.red.600'),
          color: theme('colors.white'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.red.700'),
          },
          '&:active:not(:disabled)': {
            backgroundColor: theme('colors.red.800'),
          },
        },
      });
    },
  ],
}
