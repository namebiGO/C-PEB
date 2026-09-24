import fs from 'fs';
import path from 'path';

const creators = [
  { name: 'Elvish Yadav', slug: 'elvish-yadav', username: 'elvish_yadav' },
  { name: 'Rajat Dalal', slug: 'rajat-dalal', username: 'rajat_9629' },
  { name: 'Pawan Singh', slug: 'pawan-singh', username: 'singhpawan999' },
  { name: 'Dinesh Lal Yadav', slug: 'dinesh-lal-yadav', username: 'dineshlalyadav' },
  { name: 'Kajal Raghwani', slug: 'kajal-raghwani', username: 'kajalraghwani' },
  { name: 'Neelam Giri', slug: 'neelam-giri', username: 'neelamgiri_' },
  { name: 'Sanjay Pandey', slug: 'sanjay-pandey', username: 'sanjaypandeyofficial' },
  { name: 'Avdhesh Mishra', slug: 'avdhesh-mishra', username: 'awdheshmishraofficial' },
  { name: 'Amrapali Dubey', slug: 'amrapali-dubey', username: 'aamrapali1101' },
  { name: 'Wamiqa Gabbi', slug: 'wamiqa-gabbi', username: 'wamiqagabbi' }
];

async function checkImginn(username) {
  try {
    const res = await fetch(`https://imginn.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) return null;
    const text = await res.text();
    // Look for avatar image
    const match = text.match(/<div class="user-avatar">\s*<img[^>]+src="([^"]+)"/i) ||
                  text.match(/<img class="avatar"[^>]+src="([^"]+)"/i) ||
                  text.match(/<img[^>]+src="([^"]+cdninstagram[^"]+)"/i) ||
                  text.match(/<img[^>]+src="([^"]+)" alt="[^"]*" class="[^"]*avatar[^"]*"/i);
    return match ? match[1] : null;
  } catch (err) {
    return null;
  }
}

async function run() {
  for (const c of creators) {
    const imgUrl = await checkImginn(c.username);
    console.log(`${c.name} (@${c.username}) =>`, imgUrl);
  }
}

run();
