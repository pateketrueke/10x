import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('node_modules/convert-units/lib/definitions');
const outDir = path.resolve('src/lib/units/definitions');

if (!fs.existsSync(srcDir)) {
  throw new Error(`Missing source definitions at ${srcDir}`);
}

fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(srcDir)) {
  if (!file.endsWith('.js')) continue;

  const srcPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file);
  let content = fs.readFileSync(srcPath, 'utf8');

  content = content.replace(/module\.exports\s*=\s*/g, 'export default ');

  fs.writeFileSync(outPath, content);
}

console.log(`Vendored convert-units definitions to ${outDir}`);
