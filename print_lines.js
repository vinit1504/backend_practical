const fs = require('fs');
const lines = fs.readFileSync('d:\\hrms_frontned\\hrms_frontend\\app\\(authenticated)\\dashboard\\page.tsx', 'utf8').split('\n');
for (let i = 445; i < 480; i++) {
  console.log(`${i + 1}: ${JSON.stringify(lines[i])}`);
}
