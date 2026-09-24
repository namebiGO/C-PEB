const fs = require('fs');
const transcriptPath = 'C:\\Users\\vyper\\.gemini\\antigravity-ide\\brain\\770d8181-1e02-4464-b584-b173dea588f6\\.system_generated\\logs\\transcript_full.jsonl';
const data = fs.readFileSync(transcriptPath, 'utf8');
const lines = data.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.name === 'write_to_file' || call.function?.name === 'write_to_file') {
          console.log("Found write_to_file in step", obj.step_index);
          const args = call.args || (call.function && call.function.arguments);
          const argsStr = typeof args === 'string' ? args : JSON.stringify(args);
          if (argsStr.includes('TopInfluencers.jsx')) {
            console.log("YES TopInfluencers");
            console.log(argsStr.substring(0, 200));
          }
        }
      }
    }
  } catch (e) { }
}