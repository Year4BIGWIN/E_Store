import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'src/assets/image');
const outputDir = path.join(__dirname, 'src/assets/image');

// Resize avatar.webp to actual display size (60x60)
async function resizeAvatar() {
  console.log('🖼️  Resizing avatar.webp...\n');
  
  const inputPath = path.join(inputDir, 'avatar.webp');
  const outputPath = path.join(outputDir, 'avatar-resized.webp');
  
  if (!fs.existsSync(inputPath)) {
    console.log('⚠️  avatar.webp not found, skipping');
    return;
  }
  
  try {
    await sharp(inputPath)
      .resize({
        width: 60,
        height: 60,
        fit: 'cover'
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(
      `✓ avatar-resized.webp: ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${savings}% smaller)`
    );
    
    // Rename to replace original
    fs.renameSync(outputPath, inputPath);
    console.log('✓ Replaced original avatar.webp with resized version');
    
  } catch (error) {
    console.error(`✗ Failed to resize avatar:`, error.message);
  }
  
  console.log('\n✅ Avatar resize complete!');
}

resizeAvatar();
