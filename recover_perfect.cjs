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
    
    // Stop at 2026-09-19T09:25:00Z (which is 14:55 local time, when I did the destructive revert)
    if (obj.created_at && new Date(obj.created_at) > new Date('2026-09-19T09:25:00Z')) {
      continue;
    }

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
    
    // Handle multi_replace_file_content
    // Actually, multi_replace_file_content gives us the diff, but in `output` we sometimes see the full file if it's printed.
    // Wait, the output of multi_replace_file_content does NOT print the full file, just 3 lines of context.
    // So we need to apply the replacement chunks manually.
    if (obj.tool_calls) {
      for (const call of obj.tool_calls) {
        if (call.function && call.function.name === 'multi_replace_file_content') {
          try {
            const args = JSON.parse(call.function.arguments);
            for (const f of filesToFind) {
              if (args.TargetFile && args.TargetFile.endsWith(f) && fileStates[f]) {
                let currentLines = fileStates[f].split('\n');
                
                // We should sort the chunks by StartLine descending so we don't mess up line numbers as we replace
                let chunks = args.ReplacementChunks.sort((a, b) => b.StartLine - a.StartLine);
                
                for (let chunk of chunks) {
                  // Replace lines from StartLine to EndLine (1-indexed)
                  const startIdx = chunk.StartLine - 1;
                  const count = chunk.EndLine - chunk.StartLine + 1;
                  const replacementLines = chunk.ReplacementContent.split('\n');
                  currentLines.splice(startIdx, count, ...replacementLines);
                }
                fileStates[f] = currentLines.join('\n');
              }
            }
          } catch(e) {}
        }
      }
    }
    
  } catch (e) {}
}

for (const [f, content] of Object.entries(fileStates)) {
  fs.writeFileSync(`e:\\work\\C-peb\\src\\components\\${f}`, content);
  console.log('Restored perfect state for:', f);
}
