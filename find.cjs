const fs = require('fs');
const transcriptPath = 'C:\\Users\\vyper\\.gemini\\antigravity-ide\\brain\\770d8181-1e02-4464-b584-b173dea588f6\\.system_generated\\logs\\transcript_full.jsonl';
const data = fs.readFileSync(transcriptPath, 'utf8');

const regex = /export default function TopInfluencers|const TopInfluencers = /g;
let match;
while ((match = regex.exec(data)) !== null) {
  // get 2000 chars before and after to see where this is
  const start = Math.max(0, match.index - 500);
  const end = Math.min(data.length, match.index + 2000);
  console.log("MATCH FOUND AT: ", match.index);
  console.log(data.substring(start, end));
  console.log("-----------------------------------------");
  break; // just show the first one, or maybe all? Let's just break after 2
}
