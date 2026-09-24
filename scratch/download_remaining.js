import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/creators');

const pending = [
  {
    name: 'Rajat Dalal',
    filename: 'rajat-dalal-profile.jpg',
    urls: [
      'https://s9.imginn.com/484527073_951231240559500_5565014204175869400_n.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_45uY68g0Dsq9dC7l9E_c2b9a7v6w3_x8yA&s'
    ]
  },
  {
    name: 'Dinesh Lal Yadav',
    filename: 'dinesh-lal-yadav-profile.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/e/e3/Dinesh_Lal_Yadav_at_Press_Conference_of_Celebrity_Cricket_League_2016_%28cropped%29.jpg',
      'https://s9.imginn.com/474752732_3052591994917814_2535103615493086487_n.jpg'
    ]
  },
  {
    name: 'Sanjay Pandey',
    filename: 'sanjay-pandey-profile.jpg',
    urls: [
      'https://s5.imginn.com/774593651_18485314237103265_5141001238455047702_n.jpg',
      'https://bhojpurigallery.com/wp-content/uploads/2018/06/Sanjay-Pandey-Bhojpuri-Actor-Biography-Photos.jpg'
    ]
  },
  {
    name: 'Avdhesh Mishra',
    filename: 'avdhesh-mishra-profile.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/f/f9/Awdhesh_Mishra.jpg',
      'https://s8.imginn.com/300430678_633152221422376_7715906992989429200_n.jpg'
    ]
  }
];

async function run() {
  for (const item of pending) {
    const dest = path.join(outDir, item.filename);
    let success = false;
    for (const url of item.urls) {
      try {
        console.log(`Trying ${item.name} from ${url}...`);
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://en.wikipedia.org/'
          }
        });
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length > 1000) {
            fs.writeFileSync(dest, buf);
            console.log(`SUCCESS ${item.filename}: ${buf.length} bytes`);
            success = true;
            break;
          }
        } else {
          console.log(`HTTP ${res.status}`);
        }
      } catch (err) {
        console.log('Error', err.message);
      }
    }
    if (!success) {
      console.error(`FAILED TO DOWNLOAD ${item.name}`);
    }
  }
}

run();
