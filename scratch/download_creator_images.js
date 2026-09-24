import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/creators');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const creators = [
  {
    name: 'Elvish Yadav',
    slug: 'elvish-yadav',
    username: 'elvish_yadav',
    filename: 'elvish-yadav-profile.jpg',
    url: 'https://s3.imginn.com/649199543_18453805858108947_6922612589716272127_n.jpg?t51.82787-19/649199543_18453805858108947_6922612589716272127_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy45MDkuQzMifQ%3D%3D'
  },
  {
    name: 'Rajat Dalal',
    slug: 'rajat-dalal',
    username: 'rajat_9629',
    filename: 'rajat-dalal-profile.jpg',
    url: 'https://s9.imginn.com/484527073_951231240559500_5565014204175869400_n.jpg?t51.2885-19/484527073_951231240559500_5565014204175869400_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D'
  },
  {
    name: 'Pawan Singh',
    slug: 'pawan-singh',
    username: 'singhpawan999',
    filename: 'pawan-singh-profile.jpg',
    url: 'https://s4.imginn.com/753192575_18473018803106084_4932449616241819457_n.jpg?t51.82787-19/753192575_18473018803106084_4932449616241819457_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D'
  },
  {
    name: 'Dinesh Lal Yadav',
    slug: 'dinesh-lal-yadav',
    username: 'dineshlalyadav',
    filename: 'dinesh-lal-yadav-profile.jpg',
    url: 'https://s9.imginn.com/474752732_3052591994917814_2535103615493086487_n.jpg?t51.2885-19/474752732_3052591994917814_2535103615493086487_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy42NjkuQzMifQ%3D%3D'
  },
  {
    name: 'Kajal Raghwani',
    slug: 'kajal-raghwani',
    username: 'kajalraghwani',
    filename: 'kajal-raghwani-profile.jpg',
    url: 'https://s10.imginn.com/584956545_18543989896014594_2084001168856872179_n.jpg?t51.82787-19/584956545_18543989896014594_2084001168856872179_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D'
  },
  {
    name: 'Neelam Giri',
    slug: 'neelam-giri',
    username: 'neelamgiri_',
    filename: 'neelam-giri-profile.jpg',
    url: 'https://s11.imginn.com/362099930_1016783579732902_8274081984626073218_n.jpg?t51.2885-19/362099930_1016783579732902_8274081984626073218_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D'
  },
  {
    name: 'Sanjay Pandey',
    slug: 'sanjay-pandey',
    username: 'sanjaypandeyofficial',
    filename: 'sanjay-pandey-profile.jpg',
    url: 'https://s5.imginn.com/774593651_18485314237103265_5141001238455047702_n.jpg?t51.82787-19/774593651_18485314237103265_5141001238455047702_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDI0LkMzIn0%3D'
  },
  {
    name: 'Avdhesh Mishra',
    slug: 'avdhesh-mishra',
    username: 'awdheshmishraofficial',
    filename: 'avdhesh-mishra-profile.jpg',
    url: 'https://s8.imginn.com/300430678_633152221422376_7715906992989429200_n.jpg?t51.2885-19/300430678_633152221422376_7715906992989429200_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy42OTIuQzMifQ%3D%3D'
  },
  {
    name: 'Amrapali Dubey',
    slug: 'amrapali-dubey',
    username: 'aamrapali1101',
    filename: 'amrapali-dubey-profile.jpg',
    url: 'https://s9.imginn.com/528732830_18524386342017421_4960053060181160731_n.jpg?t51.82787-19/528732830_18524386342017421_4960053060181160731_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D'
  },
  {
    name: 'Wamiqa Gabbi',
    slug: 'wamiqa-gabbi',
    username: 'wamiqagabbi',
    filename: 'wamiqa-gabbi-profile.jpg',
    url: 'https://s11.imginn.com/525215747_18517359205020367_5119854870672556878_n.jpg?t51.82787-19/525215747_18517359205020367_5119854870672556878_n.jpg?stp=dst-jpg_s320x320&_nc_cat=1&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D'
  }
];

async function downloadAll() {
  for (const c of creators) {
    const dest = path.join(outDir, c.filename);
    try {
      const res = await fetch(c.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) {
        console.error(`Failed ${c.name}: HTTP ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Saved: ${c.filename} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${c.name}:`, err.message);
    }
  }
}

downloadAll();
