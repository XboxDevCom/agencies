const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const fs = require('fs');
const path = require('path');

async function runAccessibilityTests() {
  console.log('🔍 Starting accessibility tests...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent testing
    await page.setViewport({ width: 1200, height: 800 });

    // Navigate to the built application
    const buildPath = path.join(__dirname, '../build/index.html');
    await page.goto(`file://${buildPath}`);

    // Wait for the app to load
    await page.waitForSelector('[data-testid="app"], body', { timeout: 10000 });

    // Inject axe-core
    await page.addScriptTag({
      content: axeCore.source
    });

    console.log('✅ Page loaded successfully');
    console.log('🔧 Running axe-core accessibility tests...\n');

    // Run axe-core tests
    const results = await page.evaluate(async () => {
      return await axe.run(document, {
        rules: {
          // Enable all WCAG 2.1 AA rules
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'button-name': { enabled: true },
          'bypass': { enabled: true },
          'document-title': { enabled: true },
          'duplicate-id': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'frame-title': { enabled: true },
          'html-has-lang': { enabled: true },
          'html-lang-valid': { enabled: true },
          'image-alt': { enabled: true },
          'input-image-alt': { enabled: true },
          'label': { enabled: true },
          'link-name': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
          'meta-refresh': { enabled: true },
          'meta-viewport': { enabled: true },
          'object-alt': { enabled: true },
          'role-img-alt': { enabled: true },
          'scrollable-region-focusable': { enabled: true },
          'server-side-image-map': { enabled: true },
          'svg-img-alt': { enabled: true },
          'td-headers-attr': { enabled: true },
          'th-has-data-cells': { enabled: true },
          'valid-lang': { enabled: true },
          'video-caption': { enabled: true }
        }
      });
    });

    // Process results
    const { violations, passes, incomplete, inapplicable } = results;

    console.log('📊 Test Results Summary:');
    console.log(`✅ Passed: ${passes.length} rules`);
    console.log(`❌ Violations: ${violations.length} rules`);
    console.log(`⚠️  Incomplete: ${incomplete.length} rules`);
    console.log(`➖ Inapplicable: ${inapplicable.length} rules\n`);

    // Report violations
    if (violations.length > 0) {
      console.log('❌ ACCESSIBILITY VIOLATIONS:\n');
      
      violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id.toUpperCase()}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Description: ${violation.description}`);
        console.log(`   Help: ${violation.help}`);
        console.log(`   Help URL: ${violation.helpUrl}`);
        console.log(`   Affected elements: ${violation.nodes.length}`);
        
        violation.nodes.forEach((node, nodeIndex) => {
          console.log(`     ${nodeIndex + 1}. ${node.target.join(' > ')}`);
          if (node.failureSummary) {
            console.log(`        Issue: ${node.failureSummary}`);
          }
        });
        console.log('');
      });
    }

    // Report incomplete tests
    if (incomplete.length > 0) {
      console.log('⚠️  INCOMPLETE TESTS (manual review needed):\n');
      
      incomplete.forEach((item, index) => {
        console.log(`${index + 1}. ${item.id.toUpperCase()}`);
        console.log(`   Description: ${item.description}`);
        console.log(`   Elements to review: ${item.nodes.length}`);
        console.log('');
      });
    }

    // Test keyboard navigation
    console.log('⌨️  Testing keyboard navigation...');
    
    const keyboardTestResults = await page.evaluate(() => {
      const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const results = {
        totalFocusable: focusableElements.length,
        focusableWithoutVisibleFocus: 0,
        elementsWithoutAccessibleName: 0
      };

      focusableElements.forEach(element => {
        // Test focus visibility
        element.focus();
        const styles = window.getComputedStyle(element, ':focus');
        if (styles.outline === 'none' && styles.boxShadow === 'none') {
          results.focusableWithoutVisibleFocus++;
        }

        // Test accessible name
        const hasAccessibleName = 
          element.getAttribute('aria-label') ||
          element.getAttribute('aria-labelledby') ||
          element.textContent?.trim() ||
          (element.tagName === 'INPUT' && element.getAttribute('placeholder'));
        
        if (!hasAccessibleName) {
          results.elementsWithoutAccessibleName++;
        }
      });

      return results;
    });

    console.log(`   Total focusable elements: ${keyboardTestResults.totalFocusable}`);
    console.log(`   Elements without visible focus: ${keyboardTestResults.focusableWithoutVisibleFocus}`);
    console.log(`   Elements without accessible name: ${keyboardTestResults.elementsWithoutAccessibleName}\n`);

    // Test different viewport sizes
    console.log('📱 Testing responsive accessibility...');
    
    const viewports = [
      { width: 320, height: 568, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.waitForTimeout(500); // Wait for reflow
      
      const responsiveResults = await page.evaluate(async () => {
        return await axe.run(document, {
          rules: {
            'color-contrast': { enabled: true },
            'target-size': { enabled: true }
          }
        });
      });

      console.log(`   ${viewport.name} (${viewport.width}x${viewport.height}): ${responsiveResults.violations.length} violations`);
    }

    // Generate detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: passes.length,
        violations: violations.length,
        incomplete: incomplete.length,
        inapplicable: inapplicable.length
      },
      violations: violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length
      })),
      keyboardNavigation: keyboardTestResults,
      url: page.url()
    };

    // Save report to file
    const reportPath = path.join(__dirname, '../accessibility-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    // Exit with error code if violations found
    if (violations.length > 0) {
      console.log('\n❌ Accessibility tests failed due to violations.');
      process.exit(1);
    } else {
      console.log('\n✅ All accessibility tests passed!');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Error running accessibility tests:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the tests
runAccessibilityTests().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
