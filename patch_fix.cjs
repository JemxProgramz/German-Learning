const fs = require('fs');
let content = fs.readFileSync('src/views/QuizEngine.tsx', 'utf8');

content = content.replace(/explanation: question\.explanation\n\s+\} else \{\n\s+playSound\('success'\);\n\s+\}\);\n\s+\}/, `explanation: question.explanation
      });
    } else {
      playSound('success');
    }`);

fs.writeFileSync('src/views/QuizEngine.tsx', content);
