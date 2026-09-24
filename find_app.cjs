const fs = require('fs');
const transcriptPath = 'C:\\Users\\vyper\\.gemini\\antigravity-ide\\brain\\7ac81354-dd4d-4078-8451-414c29f3a010\\.system_generated\\logs\\transcript.jsonl';
const data = fs.readFileSync(transcriptPath, 'utf8');
const lines = data.split('\n');
for (const line of lines) {
  if (line.includes('App.jsx') && line.includes('VIEW_FILE')) {
    const obj = JSON.parse(line);
    console.log('App.jsx view at step:', obj.step_index);
    if (obj.content.includes('<Route')) {
      console.log(obj.content);
    }
  }
}
