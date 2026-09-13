import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { Mic, Square, Check, RotateCcw, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';
import { speakGerman } from '../utils/speech';

interface SpeakingTopic {
  id: number;
  title: string;
  translation: string;
  requirements: { label: string; sub?: string }[];
  examplePhrases: string[];
}

const SPEAKING_TOPICS: SpeakingTopic[] = [
  {
    id: 1,
    title: 'Stellen Sie sich vor.',
    translation: 'Introduce yourself (Name, Age, Country, City, Languages)',
    requirements: [
      { label: 'Name', sub: 'Mein Name ist... / Ich heiße...' },
      { label: 'Alter', sub: 'Ich bin ... Jahre alt.' },
      { label: 'Land', sub: 'Ich komme aus...' },
      { label: 'Wohnort', sub: 'Ich wohne in...' },
      { label: 'Sprachen', sub: 'Ich spreche Englisch und ein bisschen Deutsch.' }
    ],
    examplePhrases: [
      'Guten Tag, mein Name ist Alex.',
      'Ich bin 25 Jahre alt und komme aus Spanien.',
      'Jetzt wohne ich in Berlin.',
      'Ich spreche Englisch und lerne Deutsch.'
    ]
  },
  {
    id: 2,
    title: 'Im Restaurant bestellen',
    translation: 'Ordering food and drinks at a restaurant or café',
    requirements: [
      { label: 'Begrüßung', sub: 'Guten Tag / Hallo' },
      { label: 'Bestellung', sub: 'Ich möchte gerne... / Ich hätte gern...' },
      { label: 'Frage', sub: 'Was kostet das? / Haben Sie noch...?' },
      { label: 'Bezahlung', sub: 'Die Rechnung, bitte! / Ich möchte zahlen.' }
    ],
    examplePhrases: [
      'Guten Tag, ich möchte gerne einen Kaffee und ein Stück Kuchen.',
      'Was kostet ein Mineralwasser?',
      'Wir möchten bitte zahlen, zusammen.'
    ]
  },
  {
    id: 3,
    title: 'Nach dem Weg fragen',
    translation: 'Asking for directions in a German city',
    requirements: [
      { label: 'Entschuldigung', sub: 'Entschuldigen Sie bitte...' },
      { label: 'Ziel', sub: 'Wo ist der Bahnhof / die Apotheke?' },
      { label: 'Verkehrsmittel', sub: 'Fährt dieser Bus zum Zentrum?' },
      { label: 'Dank', sub: 'Vielen Dank für Ihre Hilfe!' }
    ],
    examplePhrases: [
      'Entschuldigung, wo ist die nächste U-Bahn-Station?',
      'Gehen Sie geradeaus und dann nach rechts.',
      'Vielen Dank und einen schönen Tag noch!'
    ]
  },
  {
    id: 4,
    title: 'Über Hobbys und Freizeit sprechen',
    translation: 'Talking about your hobbies and weekend plans',
    requirements: [
      { label: 'Hobbys', sub: 'In meiner Freizeit spiele ich gerne...' },
      { label: 'Wochenende', sub: 'Am Wochenende treffe ich Freunde.' },
      { label: 'Sport / Musik', sub: 'Ich höre Musik / Ich fahre gern Fahrrad.' }
    ],
    examplePhrases: [
      'Mein Hobby ist Kochen und ich lese sehr gern Bücher.',
      'Am Samstag fahre ich oft mit dem Fahrrad.',
      'Was machen Sie gern am Wochenende?'
    ]
  },
  {
    id: 5,
    title: 'Im Geschäft / Beim Einkaufen',
    translation: 'Shopping for clothes, groceries, or essentials',
    requirements: [
      { label: 'Suche', sub: 'Ich suche ein T-Shirt / zwei Kilo Äpfel.' },
      { label: 'Größe / Farbe', sub: 'Haben Sie das in Größe M / in Blau?' },
      { label: 'Preis', sub: 'Wie viel kostet das?' }
    ],
    examplePhrases: [
      'Guten Tag, haben Sie diese Jacke auch in Schwarz?',
      'Wie viel kostet ein Kilo Orangen?',
      'Ich nehme das, danke sehr!'
    ]
  }
];

export function SprechenView() {
  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [finished, setFinished] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  const { addStudySession, recordAnswer, addXP } = useProgress();

  const currentTopic = SPEAKING_TOPICS[currentTopicIdx];

  useEffect(() => {
    if (recording) {
      setRecordSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  const handleToggleRecord = () => {
    if (recording) {
      setRecording(false);
      setFinished(true);
      recordAnswer('sprechen', true);
      addXP(15);
      addStudySession({
        durationMinutes: 2,
        topics: ['sprechen'],
        questionsAnswered: 1,
        correctAnswers: 1
      });
    } else {
      setRecording(true);
      setFinished(false);
    }
  };

  const handleNextTopic = () => {
    setFinished(false);
    setRecording(false);
    setRecordSeconds(0);
    setCurrentTopicIdx((prev) => (prev + 1) % SPEAKING_TOPICS.length);
  };

  const handlePrevTopic = () => {
    setFinished(false);
    setRecording(false);
    setRecordSeconds(0);
    setCurrentTopicIdx((prev) => (prev - 1 + SPEAKING_TOPICS.length) % SPEAKING_TOPICS.length);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto mt-4 md:mt-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
            Sprechen <span className="text-neutral-400 dark:text-neutral-500 font-normal">/ Speaking</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">Practice German speaking prompts for the Goethe A1 exam.</p>
        </div>

        {/* Topic navigation buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevTopic}
            disabled={currentTopicIdx === 0}
            className="p-2 min-w-[36px] min-h-[36px]"
            aria-label="Previous topic"
          >
            <ArrowLeft size={16} />
          </Button>
          <span className="text-xs font-semibold text-neutral-500 px-2">
            {currentTopicIdx + 1} / {SPEAKING_TOPICS.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextTopic}
            disabled={currentTopicIdx === SPEAKING_TOPICS.length - 1}
            className="p-2 min-w-[36px] min-h-[36px]"
            aria-label="Next topic"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </header>

      <Card className="p-4 sm:p-8 md:p-12 text-center shadow-sm border-neutral-200/60 dark:border-neutral-800/80 relative overflow-hidden">
        {recording && (
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
        )}
        
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-primary-100 dark:border-primary-900/30">
          Thema {currentTopic.id}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight break-words">
            {currentTopic.title}
          </h2>
          <button
            onClick={() => speakGerman(currentTopic.title)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Pronounce title"
            aria-label="Pronounce title"
          >
            <Volume2 className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        <p className="text-neutral-500 dark:text-neutral-400 mb-6 sm:mb-8 text-sm sm:text-base">
          ({currentTopic.translation})
        </p>
        
        {/* Requirements */}
        <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-6 max-w-md mx-auto text-left bg-neutral-50/50 dark:bg-neutral-800/50 p-4 sm:p-6 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
          <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 text-xs sm:text-sm uppercase tracking-wider">
            Sprechpunkte (Points to address):
          </div>
          <ul className="space-y-2.5 font-medium text-xs sm:text-sm">
            {currentTopic.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">{req.label}</span>
                  {req.sub && <span className="text-neutral-500 dark:text-neutral-400 ml-1.5">({req.sub})</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Audio Example Sentences */}
        <div className="max-w-md mx-auto mb-8 text-left bg-primary-50/40 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 p-4 rounded-xl">
          <div className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Volume2 size={14} /> Beispielsätze (Listen & Repeat):
          </div>
          <div className="space-y-2">
            {currentTopic.examplePhrases.map((phrase, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 py-1 border-b border-primary-100/50 dark:border-primary-900/30 last:border-0">
                <span>"{phrase}"</span>
                <button
                  onClick={() => speakGerman(phrase)}
                  className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:bg-primary-100/50 rounded"
                  aria-label={`Pronounce: ${phrase}`}
                >
                  <Volume2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {!finished ? (
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              {recording && (
                <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/10 rounded-full animate-ping scale-150" />
              )}
              <button
                onClick={handleToggleRecord}
                className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white dark:text-neutral-900 transition-all shadow-lg ${
                  recording 
                    ? 'bg-red-500 hover:bg-red-600 text-white dark:text-white shadow-red-500/30' 
                    : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-primary-600/30'
                }`}
                aria-label={recording ? 'Stop recording' : 'Start speaking'}
              >
                {recording ? <Square size={30} className="fill-current sm:w-9 sm:h-9" /> : <Mic size={30} className="sm:w-9 sm:h-9" />}
              </button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className={`font-semibold text-base sm:text-lg ${recording ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-neutral-700 dark:text-neutral-300'}`}>
                {recording ? `Recording in progress... (${recordSeconds}s) Click to stop` : 'Click the microphone to start speaking'}
              </span>
              <span className="text-xs text-neutral-400">
                Aim for 20–30 seconds of spoken German
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-in zoom-in-95 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-500">
                <Check size={32} className="mt-1 sm:w-10 sm:h-10" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl sm:text-2xl mb-2 text-neutral-900 dark:text-neutral-100">Ausgezeichnet! (+15 XP)</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">Speaking practice successfully recorded for {currentTopic.title}.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
              <Button onClick={() => setFinished(false)} size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-8 shadow-sm justify-center">
                <RotateCcw size={18} /> Try Again
              </Button>
              <Button onClick={handleNextTopic} size="lg" className="w-full sm:w-auto gap-2 px-8 shadow-sm justify-center">
                <span>Next Topic</span> <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

