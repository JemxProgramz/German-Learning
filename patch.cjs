const fs = require('fs');
let content = fs.readFileSync('src/store/ProgressContext.tsx', 'utf8');

content = content.replace(/mockTestResults: \[\],\n  mistakes: \[\],/g, `mockTestResults: [],
  mistakes: [],
  xp: 0,
  hearts: 5,
  lastHeartRegenTime: null,`);

content = content.replace(/importProgress: \(data: string\) => void;\n\}/g, `importProgress: (data: string) => void;
  loseHeart: () => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: number) => void;
  refillHearts: () => void;
}`);

const providerBlock = `  const [progress, setProgress] = useState<UserProgress>(() => {`;
const newProviderBlock = `  const [progress, setProgress] = useState<UserProgress>(() => {`;

content = content.replace(/export function ProgressProvider\(\{[^\}]+\}\) \{([\s\S]*?)useEffect\(\(\) => \{/g, `export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultProgress, ...parsed };
      } catch (e) {
        console.error('Failed to parse stored progress', e);
        return defaultProgress;
      }
    }
    return defaultProgress;
  });

  // Heart regeneration logic
  useEffect(() => {
    const checkHearts = () => {
      setProgress(prev => {
        if (prev.hearts >= 5) return prev;
        if (!prev.lastHeartRegenTime) {
          return { ...prev, lastHeartRegenTime: new Date().toISOString() };
        }
        
        const lastRegen = new Date(prev.lastHeartRegenTime).getTime();
        const now = new Date().getTime();
        const diffMs = now - lastRegen;
        const heartsToRegen = Math.floor(diffMs / (1000 * 60 * 60)); // 1 heart per hour
        
        if (heartsToRegen > 0) {
          const newHearts = Math.min(5, prev.hearts + heartsToRegen);
          const remainderMs = diffMs % (1000 * 60 * 60);
          const newRegenTime = new Date(now - remainderMs).toISOString();
          
          return {
            ...prev,
            hearts: newHearts,
            lastHeartRegenTime: newHearts === 5 ? null : newRegenTime
          };
        }
        return prev;
      });
    };
    
    checkHearts();
    const interval = setInterval(checkHearts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {`);

const importProgressBlock = `  const importProgress = (data: string) => {`;
const newMethodsBlock = `
  const loseHeart = () => {
    setProgress(prev => {
      if (prev.hearts <= 0) return prev;
      const newHearts = prev.hearts - 1;
      return {
        ...prev,
        hearts: newHearts,
        lastHeartRegenTime: newHearts < 5 && !prev.lastHeartRegenTime ? new Date().toISOString() : prev.lastHeartRegenTime
      };
    });
  };

  const addXP = (amount: number) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      let newProgress = updateStreak(prev, todayStr);
      newProgress.xp = (newProgress.xp || 0) + amount;
      return newProgress;
    });
  };

  const completeLesson = (lessonId: number) => {
    setProgress(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      let newProgress = updateStreak(prev, todayStr);
      newProgress.lessonProgress = {
        ...newProgress.lessonProgress,
        [lessonId]: 100
      };
      return newProgress;
    });
  };

  const refillHearts = () => {
    setProgress(prev => ({
      ...prev,
      hearts: 5,
      lastHeartRegenTime: null
    }));
  };

  const importProgress = (data: string) => {`;

content = content.replace(importProgressBlock, newMethodsBlock);

content = content.replace(/resetProgress,\n      importProgress\n    \}\}>/, `resetProgress,
      importProgress,
      loseHeart,
      addXP,
      completeLesson,
      refillHearts
    }}>`);

fs.writeFileSync('src/store/ProgressContext.tsx', content);
