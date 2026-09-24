const fs = require('fs');

const transcriptPath = 'C:\\Users\\vyper\\.gemini\\antigravity-ide\\brain\\770d8181-1e02-4464-b584-b173dea588f6\\.system_generated\\logs\\transcript_full.jsonl';

const filesToFind = [
  'TopInfluencers.jsx', 'TopInfluencers.css',
  'LatestServices.jsx', 'LatestServices.css',
  'WorkingProcess.jsx', 'WorkingProcess.css'
];

const fileStates = {};

const data = fs.readFileSync(transcriptPath, 'utf8');
const lines = data.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    
    // Stop processing if we reach the point where I started overwriting things today (around step 1000 or timestamp 14:55)
    // Actually, I can just look at the timestamps. 14:50 +0530 is 2026-09-19T09:20:00Z.
    if (obj.created_at && new Date(obj.created_at) > new Date('2026-09-19T09:20:00Z')) {
      continue; // skip the destructive overwrites
    }

    if (!obj.content && !obj.output && !obj.tool_calls) continue;
    
    const text = obj.content || obj.output || JSON.stringify(obj.tool_calls) || '';

    // Check for write_to_file
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.function && call.function.name === 'write_to_file') {
          try {
            const args = JSON.parse(call.function.arguments);
            for (const f of filesToFind) {
              if (args.TargetFile && args.TargetFile.endsWith(f)) {
                fileStates[f] = args.CodeContent;
              }
            }
          } catch(e){}
        }
      }
    }
  } catch (e) {}
}

for (const [f, content] of Object.entries(fileStates)) {
  fs.writeFileSync(`e:\\work\\C-peb\\src\\components\\${f}.recovered`, content);
  console.log('Recovered latest write_to_file for:', f);
}

// NOTE: TopInfluencers.jsx and LatestServices.jsx were modified via multi_replace_file_content.
// Their last FULL content might have been written by the previous agent via write_to_file!
// Let's check if the previous agent used write_to_file to completely rewrite them. If so, fileStates will have them.
// If I modified them via multi_replace_file_content afterwards (which I did, to add socket.io), 
// I will just re-apply that small change manually, or I can extract the socket.io version from memory.
