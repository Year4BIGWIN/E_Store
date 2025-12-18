import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'src/assets/image');
const outputDir = path.join(__dirname, 'src/assets/image');

// Image configurations with responsive sizes
const imageConfigs = [
  {
    name: 'image2.png',
    sizes: [
      { width: 375, suffix: '-mobile' },   // Mobile carousel
      { width: 1920, suffix: '-desktop' }, // Desktop carousel
    ],
    quality: 80
  },
  {
    name: 'Logo.png',
    sizes: [
      { width: 48, suffix: '-small' },     // Navbar
      { width: 150, suffix: '-medium' },   // Footer/larger displays
    ],
    quality: 85
  },
  {
    name: 'avatar.webp',
    sizes: [
      { width: 60, suffix: '' },           // Profile display
    ],
    quality: 85,
    inputFormat: 'webp'
  },
  // Carousel images
  {
    name: 'image.png',
    sizes: [
      { width: 375, suffix: '-mobile' },
      { width: 1920, suffix: '-desktop' },
    ],
    quality: 80
  },
  {
    name: 'image copy.png',
    sizes: [
      { width: 375, suffix: '-mobile' },
      { width: 1920, suffix: '-desktop' },
    ],
    quality: 80
  },
  {
    name: 'image copy 2.png',
    sizes: [
      { width: 375, suffix: '-mobile' },
      { width: 1920, suffix: '-desktop' },
    ],
    quality: 80
  },
];

async function convertImages() {
  console.log('🖼️  Starting image conversion...\n');
  
  for (const config of imageConfigs) {
    const inputPath = path.join(inputDir, config.name);
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${config.name} (file not found)`);
      continue;
    }
    
    const baseName = path.basename(config.name, path.extname(config.name));
    
    for (const size of config.sizes) {
      const outputName = `${baseName}${size.suffix}.webp`;
      const outputPath = path.join(outputDir, outputName);
      
      try {
        await sharp(inputPath)
          .resize({
            width: size.width,
            withoutEnlargement: true,
            fit: 'cover'
          })
          .webp({
            quality: config.quality,
            effort: 6
          })
          .toFile(outputPath);
        
        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
        
        console.log(
          `✓ ${outputName}: ${(inputStats.size / 1024).toFixed(0)}KB → ${(outputStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`
        );
      } catch (error) {
        console.error(`✗ Failed to convert ${config.name}:`, error.message);
      }
    }
  }
  
  console.log('\n✅ Image conversion complete!');
  console.log('📊 Run "ls -lh src/assets/image/*.webp" to see all WebP files');
}

convertImages();
