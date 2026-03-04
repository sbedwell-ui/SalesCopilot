import { pdfToPng } from 'pdf-to-png-converter';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const pdfPath = path.join(projectRoot, 'Copilot for Sales tip time V8.1.pdf');
// pdf-to-png-converter resolves outputFolder relative to cwd(), so use a relative path
const outputFolder = path.join('public', 'pdf-pages');

console.log(`Extracting pages from: ${pdfPath}`);
console.log(`Output folder: ${outputFolder}`);

const pages = await pdfToPng(pdfPath, {
  viewportScale: 2.0,
  outputFolder,
  outputFileMaskFunc: (pageNumber: number) =>
    `page-${String(pageNumber).padStart(3, '0')}.png`,
  returnPageContent: false,
});

console.log(`Extracted ${pages.length} pages`);
for (const page of pages.slice(0, 3)) {
  console.log(`  ${page.name} — ${page.width}x${page.height}`);
}
if (pages.length > 3) {
  console.log(`  ... and ${pages.length - 3} more`);
}
console.log('Done!');
