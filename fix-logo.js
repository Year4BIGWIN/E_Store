import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'src/assets/image');
const inputPath = path.join(inputDir, 'Logo.png');
const outputPath = path.join(inputDir, 'Logo-small.webp');

async function fixLogoSize() {
  console.log('🔧 Fixing logo to exact 48x48 dimensions...\n');
  
  try {
    await sharp(inputPath)
      .resize({
        width: 48,
        height: 48,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    console.log(`✓ Logo-small.webp created: ${(stats.size / 1024).toFixed(1)}KB`);
    console.log('✓ Dimensions: 48x48 (exact)');
    
  } catch (error) {
    console.error(`✗ Failed to fix logo:`, error.message);
  }
}

fixLogoSize();
