const https = require('https');
const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'public', 'images', 'creators');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(destDir, dest));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
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
  const url = "https://upload.wikimedia.org/wikipedia/commons/1/18/Wamiqa_Gabbi_snapped_at_Kalayanaraman_Family%E2%80%99s_Navrati_2024_celebrations_%28cropped%29.jpg";
  await downloadFile(url, "wamiqa-gabbi-profile.jpg");
  console.log("Downloaded Wamiqa new image");
})();
