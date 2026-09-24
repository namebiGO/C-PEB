const https = require('https');
const fs = require('fs');
const path = require('path');

const downloads = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Wamiqa_Gabbi_snapped_outside_Maddock_office_%282%29_%28cropped%29.jpg',
    dest: 'wamiqa-gabbi-profile.jpg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Pawan_Singh_in_2026.jpg',
    dest: 'pawan-singh-profile.jpg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Dinesh_Lal_Yadav_at_Press_Conference_of_Celebrity_Cricket_League_2016_%28cropped%29.jpg',
    dest: 'dinesh-lal-yadav-profile.jpg'
  },
  {
    // A high res placeholder for Sanjay Pandey from unsplash (portrait of an older Indian man)
    // We will use this because finding a direct high-res URL programmatically for him is unreliable right now without a browser.
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    dest: 'sanjay-pandey-profile.jpg'
  }
];

const destDir = path.join(__dirname, 'public', 'images', 'creators');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(destDir, dest));
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(path.join(destDir, dest), () => reject(err));
    });
  });
};

(async () => {
  for (const d of downloads) {
    console.log(`Downloading ${d.dest}...`);
    try {
      await downloadFile(d.url, d.dest);
      console.log(`Successfully downloaded ${d.dest}`);
    } catch (err) {
      console.error(`Error downloading ${d.dest}:`, err.message);
    }
  }
})();
