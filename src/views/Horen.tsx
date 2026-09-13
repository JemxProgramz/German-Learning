import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ListeningExercise, Difficulty } from '../types';
import { ORIGINAL_LISTENING_EXERCISES, generateProceduralListening } from '../data/listeningBank';
import { useProgress } from '../store/ProgressContext';
import { speakGerman } from '../utils/speech';
import { 
  Headphones, 
  Volume2, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Play, 
  Settings2,
  Layers,
  Award
} from 'lucide-react';

export function HorenView() {
  const { progress, addXP, recordListeningResult, recordAnswer } = useProgress();

  // Filters & generation state
  const [selectedLevel, setSelectedLevel] = useState<Difficulty | 'all'>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Custom generated exercises state
  const [customExercises, setCustomExercises] = useState<ListeningExercise[]>([]);

  // Active workout state
  const [activeSession, setActiveSession] = useState(false);
  const [exercisePool, setExercisePool] = useState<ListeningExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Answering state
  const [userTranscription, setUserTranscription] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // All combined exercises
  const allExercises = useMemo(() => {
    return [...customExercises, ...ORIGINAL_LISTENING_EXERCISES];
  }, [customExercises]);

  const filteredExercises = useMemo(() => {
    return allExercises.filter(ex => {
      if (selectedLevel !== 'all' && ex.level !== selectedLevel) return false;
      return true;
    });
  }, [allExercises, selectedLevel]);

  // Generate more exercises dynamically
  const handleGenerateMore = async () => {
    setIsGenerating(true);
    setGenerationNotice(null);

    const targetLevel = selectedLevel === 'all' ? 'A1' : selectedLevel;

    try {
      const res = await fetch('/api/gemini/generate-listening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'everyday life',
          level: targetLevel,
          count: 3
        })
      });

      const data = await res.json();
      let generated: ListeningExercise[] = [];

      if (data.success && data.exercises && data.exercises.length > 0) {
        generated = data.exercises;
        setGenerationNotice(`Generated ${generated.length} fresh listening exercises with Gemini!`);
      } else {
        generated = generateProceduralListening(targetLevel, 'general', 3);
        setGenerationNotice(`Generated ${generated.length} fresh listening exercises from procedural bank!`);
      }

      setCustomExercises(prev => [...generated, ...prev]);
      addXP(10);
    } catch (err) {
      console.warn('Network error when calling generate-listening, using procedural fallback', err);
      const generated = generateProceduralListening(targetLevel, 'general', 3);
      setCustomExercises(prev => [...generated, ...prev]);
      setGenerationNotice(`Generated ${generated.length} fresh listening exercises!`);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationNotice(null), 4000);
    }
  };

  const startSession = (customPool?: ListeningExercise[], count?: number) => {
    const base = customPool && customPool.length > 0 ? customPool : filteredExercises;
    const pool = count ? [...base].sort(() => Math.random() - 0.5).slice(0, count) : [...base];
    if (pool.length === 0) return;

    setExercisePool(pool);
    setCurrentIndex(0);
    setUserTranscription('');
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setScoreCount(0);
    setIsSessionComplete(false);
    setActiveSession(true);

    // Auto-play first audio after 300ms
    setTimeout(() => {
      speakGerman(pool[0].germanText, playbackSpeed);
    }, 300);
  };

  const currentEx = exercisePool[currentIndex];

  const handlePlayAudio = (rate?: number) => {
    if (!currentEx) return;
    speakGerman(currentEx.germanText, rate !== undefined ? rate : playbackSpeed);
  };

  const handleSubmit = () => {
    if (!currentEx || isSubmitted) return;

    let correct = false;
    if (currentEx.type === 'transcription') {
      const cleanUser = userTranscription.trim().toLowerCase().replace(/[.,!?;:()"-]/g, '');
      const cleanTarget = currentEx.correctAnswer.trim().toLowerCase().replace(/[.,!?;:()"-]/g, '');
      correct = cleanUser === cleanTarget;
    } else {
      correct = selectedOption === currentEx.correctAnswer;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScoreCount(prev => prev + 1);
      addXP(12);
    }

    recordListeningResult(currentEx.id, currentEx.type, correct);
    recordAnswer('hören', correct);
  };

  const handleNext = () => {
    if (currentIndex + 1 < exercisePool.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setUserTranscription('');
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);

      // Auto-play audio for next exercise
      setTimeout(() => {
        speakGerman(exercisePool[nextIdx].germanText, playbackSpeed);
      }, 300);
    } else {
      setIsSessionComplete(true);
    }
  };

  // Completed Session Screen
  if (isSessionComplete) {
    const total = exercisePool.length;
    const pct = total > 0 ? Math.round((scoreCount / total) * 100) : 0;

    return (
      <div className="max-w-md mx-auto py-12 text-center animate-in fade-in space-y-6">
        <Card className="p-8 border border-neutral-200 dark:border-neutral-800">
          <Award className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Hörübung abgeschlossen!
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            You scored {scoreCount} out of {total} ({pct}%)
          </p>

          <div className="grid grid-cols-2 gap-3 my-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-xs text-neutral-500">Correct Answers</div>
              <div className="text-2xl font-bold text-emerald-600">{scoreCount}</div>
            </div>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-xs text-neutral-500">XP Gained</div>
              <div className="text-2xl font-bold text-primary-600">+{scoreCount * 12}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={() => startSession(exercisePool.length)} className="w-full justify-center">
              Practice Again
            </Button>
            <Button onClick={() => setActiveSession(false)} variant="outline" className="w-full justify-center">
              Back to Listening Hub
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active Session Screen
  if (activeSession && currentEx) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in py-4">
        {/* Top Header */}
        <div className="flex items-center justify-between text-sm font-medium text-neutral-500">
          <span>Exercise {currentIndex + 1} of {exercisePool.length}</span>
          <button 
            onClick={() => setActiveSession(false)} 
            className="text-xs hover:text-neutral-900 dark:hover:text-neutral-100 px-2 py-1 rounded"
          >
            Exit ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / exercisePool.length) * 100}%` }}
          />
        </div>

        {/* Exercise Card */}
        <Card className="p-4 sm:p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300">
                {currentEx.type === 'transcription' ? 'Diktat (Dictation)' : currentEx.type === 'meaning' ? 'Situation Comprehension' : 'Dialogue Comprehension'}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {currentEx.level}
              </span>
            </div>

            {currentEx.speakerRole && (
              <span className="text-xs text-neutral-500 font-medium italic">
                {currentEx.speakerRole}
              </span>
            )}
          </div>

          {/* Large Audio Control Box */}
          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-center space-y-3 sm:space-y-4">
            <button
              onClick={() => handlePlayAudio()}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center mx-auto shadow-md hover:scale-105 transition-transform"
              aria-label="Play German audio"
            >
              <Volume2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            <div className="text-xs text-neutral-500 font-medium">
              Click to listen to the German audio
            </div>

            {/* Playback speed selector */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] text-neutral-400 mr-1">Speed:</span>
              {[
                { label: '0.6x Slow', val: 0.6 },
                { label: '0.8x Medium', val: 0.8 },
                { label: '1.0x Normal', val: 1.0 }
              ].map(speed => (
                <button
                  key={speed.val}
                  onClick={() => {
                    setPlaybackSpeed(speed.val);
                    handlePlayAudio(speed.val);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    playbackSpeed === speed.val
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question / Prompt */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 break-words">
              {currentEx.type === 'transcription' 
                ? 'Type what you hear in German (Achten Sie auf die Rechtschreibung):' 
                : (currentEx.question || 'What is the message or situation?')}
            </h3>
          </div>

          {/* Interactive input */}
          {currentEx.type === 'transcription' ? (
            <div className="space-y-2">
              <input
                type="text"
                disabled={isSubmitted}
                value={userTranscription}
                onChange={(e) => setUserTranscription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitted && userTranscription.trim()) {
                    handleSubmit();
                  }
                }}
                placeholder="Schreiben Sie hier auf Deutsch..."
                className="w-full p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {currentEx.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                let btnClass = 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400';

                if (isSubmitted) {
                  if (option === currentEx.correctAnswer) {
                    btnClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    btnClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  btnClass = 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-medium';
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(option)}
                    className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnClass}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && option === currentEx.correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isSubmitted && isSelected && option !== currentEx.correctAnswer && (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback & Transcript reveal on submission */}
          {isSubmitted && (
            <div className={`p-4 rounded-xl border animate-in fade-in space-y-2 ${
              isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                <span>{isCorrect ? 'Ausgezeichnet! (Correct!)' : 'Nicht ganz richtig'}</span>
              </div>

              {/* Full German Transcript */}
              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 text-xs space-y-1">
                <div className="font-semibold">German Transcript:</div>
                <div className="font-medium text-sm whitespace-pre-line">{currentEx.germanText}</div>
                <div className="text-neutral-500 dark:text-neutral-400 mt-1">
                  English: {currentEx.englishTranslation}
                </div>
              </div>

              {currentEx.explanation && (
                <p className="text-xs text-neutral-600 dark:text-neutral-300 pt-1 leading-relaxed">
                  {currentEx.explanation}
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-end pt-2">
            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={currentEx.type === 'transcription' ? !userTranscription.trim() : !selectedOption}
                className="w-full sm:w-auto px-6 py-2.5 justify-center"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2.5 justify-center flex items-center gap-2"
              >
                <span>Next Exercise</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Default Hub View
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-primary-600 shrink-0" />
            Hörverstehen (Listening Comprehension)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Dictation, situational announcements, and realistic German dialogues powered by Web Speech and generative AI.
          </p>
        </div>

        <Button
          onClick={handleGenerateMore}
          disabled={isGenerating}
          className="w-full sm:w-auto justify-center flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-sm text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Generating Audio Tasks...' : 'Generate More Tasks'}</span>
        </Button>
      </div>

      {generationNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-sm flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{generationNotice}</span>
        </div>
      )}

      {/* Filter by Level */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-500 mr-2">Level:</span>
        {(['all', 'A1', 'A2', 'B1'] as const).map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              selectedLevel === lvl
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900'
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100'
            }`}
          >
            {lvl === 'all' ? 'All Levels' : lvl}
          </button>
        ))}
      </div>

      {/* Exercise Types Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              Diktat
            </span>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Transcription Tasks
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Listen to native-paced German sentences and practice typing exactly what you hear to sharpen orthography and phonetics.
            </p>
          </div>
          <Button
            onClick={() => {
              const transPool = filteredExercises.filter(e => e.type === 'transcription');
              startSession(transPool, transPool.length);
            }}
            className="w-full justify-center mt-6"
          >
            Start Dictation
          </Button>
        </Card>

        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
              Verstehen
            </span>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Situations & Meaning
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Listen to train announcements, café orders, and shop prices, then deduce the key takeaway and meaning.
            </p>
          </div>
          <Button
            onClick={() => {
              const meaningPool = filteredExercises.filter(e => e.type === 'meaning');
              startSession(meaningPool, meaningPool.length);
            }}
            variant="secondary"
            className="w-full justify-center mt-6"
          >
            Start Meaning Quiz
          </Button>
        </Card>

        <Card className="p-6 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
              Dialoge
            </span>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Conversations
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Two-person conversations at the bakery, the doctor's office, or the train station with multiple-choice questions.
            </p>
          </div>
          <Button
            onClick={() => {
              const dialoguePool = filteredExercises.filter(e => e.type === 'dialogue-comprehension');
              startSession(dialoguePool, dialoguePool.length);
            }}
            variant="outline"
            className="w-full justify-center mt-6"
          >
            Start Dialogues
          </Button>
        </Card>
      </div>

      {/* Listening Stats Summary */}
      <div className="p-5 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Listening Stats</h4>
          <p className="text-xs text-neutral-500">
            {progress.listeningStats?.completed || 0} exercises completed ({progress.listeningStats?.correct || 0} correct)
          </p>
        </div>
        <Button onClick={() => startSession()} className="bg-primary-600 text-white">
          Start Full Listening Workout ({filteredExercises.length})
        </Button>
      </div>
    </div>
  );
}
