import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgBuffer = readFileSync(join(__dirname, '../static/icon.svg'));

// Generate 192x192 icon
await sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile(join(__dirname, '../static/icon-192.png'));

// Generate 512x512 icon
await sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile(join(__dirname, '../static/icon-512.png'));

// Generate favicon
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(__dirname, '../static/favicon.png'));

console.log('Icons generated successfully!');
