// Accessibility testing and validation utilities

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: Element;
  message: string;
  rule: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

// Check for common accessibility issues
export const checkAccessibility = (): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];

  // Check for missing alt text on images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'error',
        element: img,
        message: 'Image missing alt attribute',
        rule: 'WCAG 1.1.1',
        severity: 'serious'
      });
    } else if (img.getAttribute('alt') === '') {
      const isDecorative = img.hasAttribute('role') && img.getAttribute('role') === 'presentation';
      if (!isDecorative) {
        issues.push({
          type: 'warning',
          element: img,
          message: 'Image has empty alt text but is not marked as decorative',
          rule: 'WCAG 1.1.1',
          severity: 'moderate'
        });
      }
    }
  });

  // Check for missing form labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`) !== null;
    const hasAriaLabel = input.hasAttribute('aria-label');
    const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        element: input,
        message: 'Form control missing accessible label',
        rule: 'WCAG 1.3.1',
        severity: 'serious'
      });
    }
  });

  // Check for missing heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    if (currentLevel > previousLevel + 1) {
      issues.push({
        type: 'warning',
        element: heading,
        message: `Heading level skipped from h${previousLevel} to h${currentLevel}`,
        rule: 'WCAG 1.3.1',
        severity: 'moderate'
      });
    }
    previousLevel = currentLevel;
  });

  // Check for insufficient color contrast (simplified check)
  const textElements = document.querySelectorAll('p, span, div, a, button, label');
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // This is a simplified check - in production, you'd use a proper contrast ratio calculator
    if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
      issues.push({
        type: 'warning',
        element: element,
        message: 'Potential color contrast issue detected',
        rule: 'WCAG 1.4.3',
        severity: 'moderate'
      });
    }
  });

  // Check for missing focus indicators
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusableElements.forEach(element => {
    const styles = window.getComputedStyle(element, ':focus');
    const outline = styles.outline;
    const boxShadow = styles.boxShadow;
    
    if (outline === 'none' && boxShadow === 'none') {
      issues.push({
        type: 'warning',
        element: element,
        message: 'Focusable element missing visible focus indicator',
        rule: 'WCAG 2.4.7',
        severity: 'serious'
      });
    }
  });

  // Check for missing ARIA landmarks
  const landmarks = document.querySelectorAll('main, nav, aside, header, footer, [role="main"], [role="navigation"], [role="complementary"], [role="banner"], [role="contentinfo"]');
  if (landmarks.length === 0) {
    issues.push({
      type: 'warning',
      element: document.body,
      message: 'Page missing ARIA landmarks for navigation',
      rule: 'WCAG 1.3.6',
      severity: 'moderate'
    });
  }

  // Check for missing skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  const hasSkipToMain = Array.from(skipLinks).some(link => 
    link.textContent?.toLowerCase().includes('skip') || 
    link.textContent?.toLowerCase().includes('main')
  );
  
  if (!hasSkipToMain) {
    issues.push({
      type: 'info',
      element: document.body,
      message: 'Consider adding skip links for keyboard navigation',
      rule: 'WCAG 2.4.1',
      severity: 'minor'
    });
  }

  return issues;
};

// Keyboard navigation testing
export const testKeyboardNavigation = (): Promise<AccessibilityIssue[]> => {
  return new Promise((resolve) => {
    const issues: AccessibilityIssue[] = [];
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    let currentIndex = 0;
    const testNextElement = () => {
      if (currentIndex >= focusableElements.length) {
        resolve(issues);
        return;
      }

      const element = focusableElements[currentIndex] as HTMLElement;
      element.focus();

      // Check if element actually received focus
      if (document.activeElement !== element) {
        issues.push({
          type: 'error',
          element: element,
          message: 'Element cannot receive keyboard focus',
          rule: 'WCAG 2.1.1',
          severity: 'serious'
        });
      }

      // Check if focused element is visible
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        issues.push({
          type: 'warning',
          element: element,
          message: 'Focusable element is not visible',
          rule: 'WCAG 2.4.3',
          severity: 'moderate'
        });
      }

      currentIndex++;
      setTimeout(testNextElement, 10);
    };

    testNextElement();
  });
};

// Screen reader testing simulation
export const getScreenReaderText = (element: Element): string => {
  let text = '';

  // Get aria-label if present
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    text += ariaLabel + ' ';
  }

  // Get aria-labelledby content
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElements = ariaLabelledBy.split(' ')
      .map(id => document.getElementById(id))
      .filter(el => el !== null);
    
    labelElements.forEach(labelEl => {
      if (labelEl) {
        text += labelEl.textContent + ' ';
      }
    });
  }

  // Get text content
  text += element.textContent || '';

  // Get aria-describedby content
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  if (ariaDescribedBy) {
    const descElements = ariaDescribedBy.split(' ')
      .map(id => document.getElementById(id))
      .filter(el => el !== null);
    
    descElements.forEach(descEl => {
      if (descEl) {
        text += ' ' + descEl.textContent;
      }
    });
  }

  return text.trim();
};

// Color contrast calculation
export const calculateContrastRatio = (foreground: string, background: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return 0;

  const fgLuminance = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

// ARIA validation
export const validateAria = (element: Element): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];

  // Check for invalid ARIA attributes
  const ariaAttributes = Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('aria-'));

  const validAriaAttributes = [
    'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
    'aria-expanded', 'aria-selected', 'aria-checked', 'aria-disabled',
    'aria-required', 'aria-invalid', 'aria-live', 'aria-atomic',
    'aria-relevant', 'aria-busy', 'aria-controls', 'aria-owns',
    'aria-flowto', 'aria-activedescendant', 'aria-level', 'aria-posinset',
    'aria-setsize', 'aria-orientation', 'aria-sort', 'aria-readonly',
    'aria-multiline', 'aria-multiselectable', 'aria-autocomplete',
    'aria-haspopup', 'aria-pressed', 'aria-current'
  ];

  ariaAttributes.forEach(attr => {
    if (!validAriaAttributes.includes(attr.name)) {
      issues.push({
        type: 'error',
        element: element,
        message: `Invalid ARIA attribute: ${attr.name}`,
        rule: 'WCAG 4.1.2',
        severity: 'serious'
      });
    }
  });

  // Check for required ARIA attributes based on role
  const role = element.getAttribute('role');
  if (role) {
    const requiredAttributes: Record<string, string[]> = {
      'button': [],
      'checkbox': ['aria-checked'],
      'radio': ['aria-checked'],
      'slider': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      'spinbutton': ['aria-valuenow'],
      'progressbar': ['aria-valuenow'],
      'tab': ['aria-selected'],
      'tabpanel': ['aria-labelledby'],
      'listbox': [],
      'option': ['aria-selected']
    };

    const required = requiredAttributes[role];
    if (required) {
      required.forEach(attr => {
        if (!element.hasAttribute(attr)) {
          issues.push({
            type: 'error',
            element: element,
            message: `Role "${role}" requires attribute "${attr}"`,
            rule: 'WCAG 4.1.2',
            severity: 'serious'
          });
        }
      });
    }
  }

  return issues;
};

// Generate accessibility report
export const generateAccessibilityReport = async (): Promise<{
  issues: AccessibilityIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
}> => {
  const staticIssues = checkAccessibility();
  const keyboardIssues = await testKeyboardNavigation();
  
  const allIssues = [...staticIssues, ...keyboardIssues];

  const summary = {
    total: allIssues.length,
    errors: allIssues.filter(i => i.type === 'error').length,
    warnings: allIssues.filter(i => i.type === 'warning').length,
    info: allIssues.filter(i => i.type === 'info').length,
    critical: allIssues.filter(i => i.severity === 'critical').length,
    serious: allIssues.filter(i => i.severity === 'serious').length,
    moderate: allIssues.filter(i => i.severity === 'moderate').length,
    minor: allIssues.filter(i => i.severity === 'minor').length,
  };

  return { issues: allIssues, summary };
};

// Development helper to log accessibility issues
export const logAccessibilityIssues = async () => {
  if (process.env.NODE_ENV === 'development') {
    const report = await generateAccessibilityReport();
    
    // eslint-disable-next-line no-console
    console.group('🔍 Accessibility Report');
    // eslint-disable-next-line no-console
    console.log('Summary:', report.summary);
    
    if (report.issues.length > 0) {
      // eslint-disable-next-line no-console
      console.group('Issues:');
      report.issues.forEach((issue, index) => {
        // eslint-disable-next-line no-console
        console.group(`${index + 1}. ${issue.type.toUpperCase()}: ${issue.message}`);
        // eslint-disable-next-line no-console
        console.log('Element:', issue.element);
        // eslint-disable-next-line no-console
        console.log('Rule:', issue.rule);
        // eslint-disable-next-line no-console
        console.log('Severity:', issue.severity);
        // eslint-disable-next-line no-console
        console.groupEnd();
      });
      // eslint-disable-next-line no-console
      console.groupEnd();
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ No accessibility issues found!');
    }
    
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
};
