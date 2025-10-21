const fs = require('fs');
const path = require('path');

// Import translation files
const translationsDir = path.join(__dirname, '../src/i18n/translations');

async function validateTranslations() {
  console.log('🌍 Validating translations...\n');

  try {
    // Get all translation files
    const files = fs.readdirSync(translationsDir).filter(file => file.endsWith('.ts'));
    
    if (files.length === 0) {
      console.error('❌ No translation files found!');
      process.exit(1);
    }

    console.log(`Found ${files.length} translation files: ${files.join(', ')}\n`);

    // Load all translations
    const translations = {};
    const allKeys = new Set();

    for (const file of files) {
      const lang = path.basename(file, '.ts');
      const filePath = path.join(translationsDir, file);
      
      try {
        // Read and parse the TypeScript file
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract the translation object (simplified parsing)
        const match = content.match(/export const \w+: TranslationKeys = ({[\s\S]*?});/);
        if (!match) {
          console.error(`❌ Could not parse translation object in ${file}`);
          continue;
        }

        // Convert to JSON-like format for parsing
        const objString = match[1]
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":')
          .replace(/,\s*}/g, '}');

        const translationObj = JSON.parse(objString);
        translations[lang] = translationObj;

        // Collect all keys
        Object.keys(translationObj).forEach(key => allKeys.add(key));
        
        console.log(`✅ Loaded ${Object.keys(translationObj).length} keys for ${lang}`);
      } catch (error) {
        console.error(`❌ Error loading ${file}:`, error.message);
      }
    }

    console.log(`\n📊 Total unique keys: ${allKeys.size}\n`);

    // Validation checks
    let hasErrors = false;
    const languages = Object.keys(translations);

    // Check 1: All languages have the same keys
    console.log('🔍 Checking key consistency across languages...');
    
    for (const lang of languages) {
      const langKeys = new Set(Object.keys(translations[lang]));
      const missingKeys = [...allKeys].filter(key => !langKeys.has(key));
      const extraKeys = [...langKeys].filter(key => !allKeys.has(key));

      if (missingKeys.length > 0) {
        console.error(`❌ ${lang} is missing keys: ${missingKeys.join(', ')}`);
        hasErrors = true;
      }

      if (extraKeys.length > 0) {
        console.error(`❌ ${lang} has extra keys: ${extraKeys.join(', ')}`);
        hasErrors = true;
      }

      if (missingKeys.length === 0 && extraKeys.length === 0) {
        console.log(`✅ ${lang} has all required keys`);
      }
    }

    // Check 2: No empty translations
    console.log('\n🔍 Checking for empty translations...');
    
    for (const [lang, langTranslations] of Object.entries(translations)) {
      const emptyKeys = Object.entries(langTranslations)
        .filter(([key, value]) => !value || value.trim() === '')
        .map(([key]) => key);

      if (emptyKeys.length > 0) {
        console.error(`❌ ${lang} has empty translations: ${emptyKeys.join(', ')}`);
        hasErrors = true;
      } else {
        console.log(`✅ ${lang} has no empty translations`);
      }
    }

    // Check 3: Parameter consistency
    console.log('\n🔍 Checking parameter consistency...');
    
    for (const key of allKeys) {
      const parameterSets = languages.map(lang => {
        const text = translations[lang][key] || '';
        const params = text.match(/\{\{(\w+)\}\}/g) || [];
        return new Set(params);
      });

      // Check if all languages have the same parameters for each key
      const firstParamSet = parameterSets[0];
      const inconsistent = parameterSets.some(paramSet => {
        if (paramSet.size !== firstParamSet.size) return true;
        for (const param of paramSet) {
          if (!firstParamSet.has(param)) return true;
        }
        return false;
      });

      if (inconsistent) {
        console.error(`❌ Parameter mismatch for key "${key}":`);
        languages.forEach((lang, index) => {
          const params = [...parameterSets[index]].join(', ') || 'none';
          console.error(`   ${lang}: ${params}`);
        });
        hasErrors = true;
      }
    }

    // Check 4: Common translation issues
    console.log('\n🔍 Checking for common translation issues...');
    
    const commonIssues = {
      'Double spaces': /\s{2,}/,
      'Leading/trailing spaces': /^\s|\s$/,
      'Inconsistent quotes': /[""'']/,
      'HTML entities': /&\w+;/,
      'Unescaped HTML': /<[^>]+>/
    };

    for (const [lang, langTranslations] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(langTranslations)) {
        for (const [issueName, pattern] of Object.entries(commonIssues)) {
          if (pattern.test(value)) {
            console.warn(`⚠️  ${lang}.${key}: ${issueName} - "${value}"`);
          }
        }
      }
    }

    // Check 5: Translation length warnings
    console.log('\n🔍 Checking translation lengths...');
    
    for (const key of allKeys) {
      const lengths = languages.map(lang => (translations[lang][key] || '').length);
      const maxLength = Math.max(...lengths);
      const minLength = Math.min(...lengths);
      
      // Warn if there's a significant length difference (more than 50% difference)
      if (maxLength > 0 && (maxLength - minLength) / maxLength > 0.5) {
        console.warn(`⚠️  Significant length difference for "${key}":`);
        languages.forEach((lang, index) => {
          console.warn(`   ${lang}: ${lengths[index]} chars`);
        });
      }
    }

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      languages: languages,
      totalKeys: allKeys.size,
      summary: {
        totalTranslations: languages.reduce((sum, lang) => sum + Object.keys(translations[lang]).length, 0),
        averageKeysPerLanguage: Math.round(languages.reduce((sum, lang) => sum + Object.keys(translations[lang]).length, 0) / languages.length),
        hasErrors: hasErrors
      },
      keysByLanguage: Object.fromEntries(
        languages.map(lang => [lang, Object.keys(translations[lang]).length])
      )
    };

    // Save report
    const reportPath = path.join(__dirname, '../translation-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Validation report saved to: ${reportPath}`);

    // Summary
    console.log('\n📊 Validation Summary:');
    console.log(`   Languages: ${languages.join(', ')}`);
    console.log(`   Total keys: ${allKeys.size}`);
    console.log(`   Total translations: ${report.summary.totalTranslations}`);
    console.log(`   Average keys per language: ${report.summary.averageKeysPerLanguage}`);

    if (hasErrors) {
      console.log('\n❌ Translation validation failed due to errors.');
      process.exit(1);
    } else {
      console.log('\n✅ All translation validations passed!');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Error during validation:', error);
    process.exit(1);
  }
}

// Run validation
validateTranslations().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
