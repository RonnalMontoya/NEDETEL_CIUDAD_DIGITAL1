const fs = require('fs');
const path = require('path');
const { transformSync } = require('@swc/core');

const root = process.cwd();
const wwwDir = path.join(root, 'www');

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (entry.isFile() && fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

if (!fs.existsSync(wwwDir)) {
  throw new Error('No se encontró la carpeta www para downleveling.');
}

const jsFiles = walk(wwwDir).filter((file) => !file.endsWith('cordova.js'));
let transformedCount = 0;

for (const filePath of jsFiles) {
  const source = fs.readFileSync(filePath, 'utf8');
  const output = transformSync(source, {
    sourceMaps: false,
    minify: false,
    jsc: {
      target: 'es2017',
      parser: {
        syntax: 'ecmascript'
      }
    }
  });

  if (output && typeof output.code === 'string' && output.code !== source) {
    fs.writeFileSync(filePath, output.code, 'utf8');
    transformedCount += 1;
  }
}

console.log(`Downlevel completado. Archivos procesados: ${transformedCount}/${jsFiles.length}`);
