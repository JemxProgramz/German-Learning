const fs = require('fs');
let content = fs.readFileSync('src/views/QuizEngine.tsx', 'utf8');

content = content.replace(/\{sessionScore\.total > 0 && \([\s\S]*?\}\)%\)<\/span>\n\s+<\/div>\n\s+<\/Card>\n\s+\)\}/, `{sessionScore.total > 0 && (
          <Card className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-none p-6 text-center shadow-lg">
            <h2 className="font-semibold text-sm uppercase tracking-wider mb-2 opacity-80">Previous Session Result</h2>
            <div className="text-5xl font-bold mb-3 tracking-tight">
              {sessionScore.correct} <span className="opacity-50 mx-1">/</span> {sessionScore.total} 
              <span className="text-2xl font-normal opacity-75 ml-4">({Math.round((sessionScore.correct / sessionScore.total) * 100)}%)</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-black/10 rounded-full font-bold text-yellow-400 dark:text-yellow-600">
              <Zap size={20} className="fill-current" /> +{sessionScore.correct * 10} XP Earned!
            </div>
          </Card>
        )}`);

fs.writeFileSync('src/views/QuizEngine.tsx', content);
