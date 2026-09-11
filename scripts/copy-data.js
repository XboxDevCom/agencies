const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const build = path.join(root, 'build');
for (const asset of ['data.csv', 'CNAME']) fs.copyFileSync(path.join(root, 'public', asset), path.join(build, asset));
for (const route of ['investor-tips', 'dividend-calculator']) {
  fs.mkdirSync(path.join(build, route), { recursive: true });
  fs.copyFileSync(path.join(build, 'index.html'), path.join(build, route, 'index.html'));
}
fs.copyFileSync(path.join(build, 'index.html'), path.join(build, '404.html'));
console.log('Directory data, domain and route entrypoints ready.');
