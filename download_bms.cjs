const https = require('https');
const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'public', 'images', 'creators');

const downloads = [
  { url: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/sanjay-pandey-36168-1697112332.jpg', dest: 'sanjay-pandey-profile.jpg' },
  { url: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/dinesh-lal-yadav-5603-19-12-2017-03-47-54.jpg', dest: 'dinesh-lal-yadav-profile.jpg' }
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(destDir, dest));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
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
      console.log(`Saved ${d.dest}`);
    } catch (err) {
      console.error(`Failed ${d.dest}`, err);
    }
  }
})();
