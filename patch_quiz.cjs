const fs = require('fs');
let content = fs.readFileSync('src/views/QuizEngine.tsx', 'utf8');

// Add the sound function at the top outside the component
const soundFn = `
const playSound = (type: 'success' | 'error') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio errors
  }
};
`;

content = content.replace("export function QuizEngine", soundFn + "\nexport function QuizEngine");

// Add shake state
content = content.replace("const [sessionStartTime, setSessionStartTime] = useState<number>(0);", "const [sessionStartTime, setSessionStartTime] = useState<number>(0);\n  const [shake, setShake] = useState(false);");

// Destructure new methods from useProgress
content = content.replace("const { recordAnswer, addMistake, addStudySession } = useProgress();", "const { progress, recordAnswer, addMistake, addStudySession, loseHeart, addXP, completeLesson } = useProgress();");

// Check hearts in render (if active and hearts === 0)
const outOfHeartsUi = `
  if (active && progress.hearts <= 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-8">
        <Card className="p-8 md:p-12 text-center shadow-sm border-neutral-200/60 dark:border-neutral-800/80">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-red-500 fill-red-500 opacity-50" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Out of Hearts!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">You need hearts to start a new lesson. Wait for them to refill or practice to earn more.</p>
          <Button onClick={() => setActive(false)} size="lg" className="w-full justify-center">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }
`;

content = content.replace("if (!active) {", outOfHeartsUi + "\n  if (!active) {");

// In startQuiz, do we prevent start? OutOfHeartsUi handles it.
// In handleFinish, give XP and complete lesson if we got some right
content = content.replace(/const durationMinutes = Math\.max\(1, Math\.round\(\(Date\.now\(\) \- sessionStartTime\) \/ 60000\)\);/, `const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));
    const xpGained = sessionScore.correct * 10;
    if (xpGained > 0) addXP(xpGained);
    if (questions.length > 0 && sessionScore.correct / questions.length >= 0.7) {
      completeLesson(questions[0].lesson);
    }`);

// In submitAnswer, play sounds and shake, lose heart
content = content.replace(/if \(\!isCorrect\) \{([\s\S]*?)\}/, `if (!isCorrect) {
      playSound('error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      loseHeart();
      $1
    } else {
      playSound('success');
    }`);

// Also we need to import Heart if we use it in OutOfHearts
content = content.replace("import { Play, RotateCcw }", "import { Play, RotateCcw, Heart }");

// Add shake class to the main Card
content = content.replace(/<Card className="p-6 md:p-10 shadow-sm border-neutral-200\/60 dark:border-neutral-800\/80">/, `<Card className={\`p-6 md:p-10 shadow-sm border-neutral-200/60 dark:border-neutral-800/80 transition-transform \${shake ? 'translate-x-[-10px] sm:translate-x-[-20px] shadow-red-500/20 shadow-xl' : ''}\`} style={{ animation: shake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none' }}>`);

fs.writeFileSync('src/views/QuizEngine.tsx', content);
