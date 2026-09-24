const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const downloads = [
  {
    url: 'https://images.bhaskarassets.com/web2images/521/2021/04/23/sanjay-pandey-interview-5_1619163273.jpg',
    dest: 'sanjay-pandey-profile.jpg'
  },
  {
    url: 'https://static.toiimg.com/thumb/msid-69864239,width-800,height-600,resizemode-75/69864239.jpg',
    dest: 'dinesh-lal-yadav-profile.jpg'
  }
];

const destDir = path.join(__dirname, 'public', 'images', 'creators');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const d of downloads) {
    try {
      console.log(`Downloading ${d.url}...`);
      const response = await page.goto(d.url, { waitUntil: 'networkidle2' });
      const buffer = await response.buffer();
      fs.writeFileSync(path.join(destDir, d.dest), buffer);
      console.log(`Saved ${d.dest}`);
    } catch (err) {
      console.error(`Failed ${d.dest}:`, err.message);
    }
  }

  await browser.close();
})();
