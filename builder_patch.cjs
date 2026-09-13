const fs = require('fs');
let content = fs.readFileSync('src/views/QuizEngine.tsx', 'utf8');

// I need to add state for sentence building words
content = content.replace("const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);", "const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);\n  const [builtSentence, setBuiltSentence] = useState<string[]>([]);");

// Reset builtSentence when starting or going to next question
content = content.replace("setSelectedAnswer(null);", "setSelectedAnswer(null);\n    setBuiltSentence([]);");
content = content.replace("setSelectedAnswer(null);", "setSelectedAnswer(null);\n      setBuiltSentence([]);");

// Add logic to submitAnswer to use builtSentence if it's sentence-building
content = content.replace(/const isCorrect = Array\.isArray\(question\.correctAnswer\)\n\s+\? question\.correctAnswer\.includes\(selectedAnswer\.trim\(\)\)\n\s+: question\.correctAnswer === selectedAnswer\.trim\(\);/, 
`const finalAnswer = question.questionType === 'sentence-building' 
      ? builtSentence.join(' ').trim() 
      : (selectedAnswer?.trim() || '');
    
    // For sentence-building, compare lowercase without punctuation
    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?'" ]/g, '');
    const isCorrect = question.questionType === 'sentence-building'
      ? Array.isArray(question.correctAnswer)
        ? question.correctAnswer.some(ans => normalize(ans) === normalize(finalAnswer))
        : normalize(question.correctAnswer) === normalize(finalAnswer)
      : Array.isArray(question.correctAnswer) 
        ? question.correctAnswer.includes(finalAnswer) 
        : question.correctAnswer === finalAnswer;`);

content = content.replace("userAnswer: selectedAnswer,", "userAnswer: finalAnswer,");
content = content.replace("disabled={!selectedAnswer}", "disabled={question.questionType === 'sentence-building' ? builtSentence.length === 0 : !selectedAnswer}");

const builderJSX = `
          ) : question.questionType === 'sentence-building' ? (
            <div className="space-y-6">
              {/* Build Area */}
              <div className="min-h-[60px] p-4 flex flex-wrap gap-2 border-b-2 border-neutral-200 dark:border-neutral-700 items-center bg-neutral-50/50 dark:bg-neutral-900/50 rounded-t-xl">
                {builtSentence.length === 0 && (
                  <span className="text-neutral-400 dark:text-neutral-600 font-medium">Tap words to build the sentence...</span>
                )}
                {builtSentence.map((word, idx) => (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => {
                      setBuiltSentence(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl font-medium shadow-sm hover:border-neutral-400 active:scale-95 transition-all text-neutral-900 dark:text-neutral-100"
                  >
                    {word}
                  </button>
                ))}
              </div>
              
              {/* Word Bank */}
              <div className="flex flex-wrap gap-3 p-2">
                {question.question.split('/').map(w => w.trim()).filter(w => !builtSentence.includes(w)).map((word, idx) => (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => {
                      setBuiltSentence(prev => [...prev, word]);
                    }}
                    className="px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 rounded-xl font-bold shadow-sm hover:border-primary-400 hover:text-primary-600 active:scale-95 transition-all text-neutral-800 dark:text-neutral-200"
                  >
                    {word}
                  </button>
                ))}
              </div>
              
              {isSubmitted && (
                <div className={\`p-4 rounded-xl font-medium border-2 \${
                  (() => {
                    const finalAnswer = builtSentence.join(' ').trim();
                    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?'" ]/g, '');
                    const isCorrect = Array.isArray(question.correctAnswer)
                      ? question.correctAnswer.some(ans => normalize(ans) === normalize(finalAnswer))
                      : normalize(question.correctAnswer) === normalize(finalAnswer);
                    return isCorrect ? 'bg-green-50 border-green-500 text-green-900' : 'bg-red-50 border-red-500 text-red-900';
                  })()
                }\`}>
                  <div className="text-sm opacity-80 uppercase tracking-wider mb-1">Your sentence</div>
                  <div>{builtSentence.join(' ')}</div>
                  {/* Correct Answer Display (if wrong) */}
                  {!(() => {
                    const finalAnswer = builtSentence.join(' ').trim();
                    const normalize = (s: string) => s.toLowerCase().replace(/[.,!?'" ]/g, '');
                    return Array.isArray(question.correctAnswer)
                      ? question.correctAnswer.some(ans => normalize(ans) === normalize(finalAnswer))
                      : normalize(question.correctAnswer) === normalize(finalAnswer);
                  })() && (
                    <div className="mt-3 pt-3 border-t border-current">
                      <div className="text-sm opacity-80 uppercase tracking-wider mb-1">Correct solution</div>
                      <div className="font-bold">{Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
`;

content = content.replace("          ) : (\n            <div>\n              <input", builderJSX + "              <input");

fs.writeFileSync('src/views/QuizEngine.tsx', content);
