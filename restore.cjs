const fs = require('fs');
const transcriptPath = 'C:\\Users\\vyper\\.gemini\\antigravity-ide\\brain\\770d8181-1e02-4464-b584-b173dea588f6\\.system_generated\\logs\\transcript_full.jsonl';
const data = fs.readFileSync(transcriptPath, 'utf8');
const lines = data.split('\n');

const filesToFind = [
  'TopInfluencers.jsx', 'TopInfluencers.css',
  'LatestServices.jsx', 'LatestServices.css',
  'WorkingProcess.jsx', 'WorkingProcess.css'
];

const fileStates = {};

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index > 900) continue; // stop before any of my changes

    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'write_to_file' || call.function?.name === 'write_to_file') {
          const argsStr = call.args || (call.function && call.function.arguments);
          const args = typeof argsStr === 'string' ? JSON.parse(argsStr) : argsStr;
          
          for (const f of filesToFind) {
            if (args.TargetFile && args.TargetFile.endsWith(f)) {
              fileStates[f] = args.CodeContent;
            }
          }
        }
      }
    }
  } catch (e) {}
}

for (const [f, content] of Object.entries(fileStates)) {
  fs.writeFileSync(`e:\\work\\C-peb\\src\\components\\${f}`, content);
  console.log('Restored perfect state for:', f);
}
