const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const creatorsDir = path.join(__dirname, 'public', 'images', 'creators');

const mappings = [
  { file: 'Elvish-Yadav.jpg', out: 'elvish-yadav.webp' },
  { file: 'Rajat-Dalal.jpg', out: 'rajat-dalal.webp' },
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
      
      // If the image is large enough, resize so the smallest dimension is 800.
      // This preserves the original aspect ratio.
      let resizeOpts = {};
      if (minDim > 800) {
        if (metadata.width < metadata.height) {
          resizeOpts = { width: 800 };
        } else {
          resizeOpts = { height: 800 };
        }
      }
      
      let img = sharp(inputPath);
      if (Object.keys(resizeOpts).length > 0) {
        img = img.resize(resizeOpts);
      }
      
      await img
        .webp({ quality: 90 })
        .toFile(outputPath);
      
      results.push(`Processed ${m.file} -> ${m.out} (original ${metadata.width}x${metadata.height})`);
    } catch (e) {
      results.push(`ERROR ${m.file}: ${e.message}`);
    }
  }
  
  console.log(results.join('\n'));
}

processImages();
