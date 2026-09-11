const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const languages = ['de', 'en', 'fr', 'it'];
// Read only literal dictionary objects with TypeScript's parser. No source execution.
function readDictionaries(file) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0, `Cannot parse ${file}`);
  const dictionaries = {};
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      const name = declaration.name.getText(source);
      if (!languages.includes(name)) continue;
      let value = declaration.initializer;
      if (value && ts.isAsExpression(value)) value = value.expression;
      assert(value && ts.isObjectLiteralExpression(value), `Missing dictionary ${name} in ${file}`);
      dictionaries[name] = {};
      for (const property of value.properties) {
        assert(ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer), `Non-literal translation in ${file}`);
        const key = property.name.text;
        assert(key && !Object.hasOwn(dictionaries[name], key), `Duplicate translation ${key}`);
        dictionaries[name][key] = property.initializer.text;
      }
    }
  }
  return dictionaries;
}
function validate(group) {
  const baseline = Object.keys(group.de || {}).sort();
  assert(baseline.length > 0, 'No translation keys loaded');
  for (const language of languages) {
    assert(group[language], `Missing ${language} dictionary`);
    assert.deepEqual(Object.keys(group[language]).sort(), baseline, `Mismatched keys for ${language}`);
    for (const key of baseline) {
      assert(group[language][key].trim(), `Empty translation: ${language}/${key}`);
      const placeholders = value => (value.match(/\{\{\w+\}\}/g) || []).sort();
      assert.deepEqual(placeholders(group[language][key]), placeholders(group.de[key]), `Mismatched placeholders: ${language}/${key}`);
    }
  }
  return baseline.length;
}
try {
  const core = {};
  for (const language of languages) Object.assign(core, readDictionaries(path.join(root, `src/i18n/translations/${language}.ts`)));
  const directory = readDictionaries(path.join(root, 'src/i18n/directory.ts'));
  const report = { languages, coreKeys: validate(core), directoryKeys: validate(directory), valid: true };
  fs.writeFileSync(path.join(root, 'translation-validation-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`Validated ${report.coreKeys + report.directoryKeys} keys in each of ${languages.length} languages.`);
} catch (error) {
  fs.writeFileSync(path.join(root, 'translation-validation-report.json'), JSON.stringify({ valid: false, error: error.message }, null, 2) + '\n');
  console.error(error.message);
  process.exitCode = 1;
}
