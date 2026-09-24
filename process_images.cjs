const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const creatorsDir = path.join(__dirname, 'public', 'images', 'creators');

const mappings = [
  { file: 'Elvish-Yadav.jpg', out: 'elvish-yadav.webp' },
  { file: 'Rajat-Dalal.jpg', out: 'rajat-dalal.webp' }, // There is also rajat-dalal-profile.jpg, let's use the larger one
  { file: 'pawan-singh-profile.jpg', out: 'pawan-singh.webp' },
  { file: 'dinesh-lal-yadav-profile.jpg', out: 'dinesh-lal-yadav.webp' },
  { file: 'Kajal-Raghwani.jpg', out: 'kajal-raghwani.webp' },
  { file: 'Neelam Giri.jpg', out: 'neelam-giri.webp' },
  { file: 'sanjay-pandey-profile.jpg', out: 'sanjay-pandey.webp' },
  { file: 'avdhesh-mishra-profile.jpg', out: 'avdhesh-mishra.webp' },
  { file: 'Amarpali Dubay.jpg', out: 'amrapali-dubey.webp' },
  { file: 'wamiqa-gabbi-profile.jpg', out: 'wamiqa-gabbi.webp' },
];

async function processImages() {
  const results = [];
  
  // Check which rajat-dalal image is bigger
  const rajat1 = fs.statSync(path.join(creatorsDir, 'Rajat-Dalal.jpg')).size;
  const rajat2 = fs.statSync(path.join(creatorsDir, 'rajat-dalal-profile.jpg')).size;
  if (rajat2 > rajat1) {
    mappings[1].file = 'rajat-dalal-profile.jpg';
  }

  for (const m of mappings) {
    const inputPath = path.join(creatorsDir, m.file);
    const outputPath = path.join(creatorsDir, m.out);
    
    if (!fs.existsSync(inputPath)) {
      results.push(`${m.file} NOT FOUND`);
      continue;
    }
    
    try {
      const metadata = await sharp(inputPath).metadata();
      const minDim = Math.min(metadata.width, metadata.height);
      
      // We want to generate 800x800 if possible, but if the original is smaller, we don't upscale it aggressively.
      // E.g., if the min dimension is 400, we crop to 400x400.
      const targetSize = minDim >= 800 ? 800 : minDim;
      
      await sharp(inputPath)
        .resize({
          width: targetSize,
          height: targetSize,
          fit: 'cover',
          position: sharp.strategy.attention // focus on the most detailed part (face)
        })
        .webp({ quality: 90 })
        .toFile(outputPath);
      
      results.push(`Processed ${m.file} -> ${m.out} (${targetSize}x${targetSize})`);
    } catch (e) {
      results.push(`ERROR ${m.file}: ${e.message}`);
    }
  }
  
  console.log(results.join('\n'));
}

processImages();
