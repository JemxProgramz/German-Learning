import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { VocabularyWord, Difficulty } from '../types';
import { VOCABULARY } from '../data/content';
import { ORIGINAL_VOCAB_BANK, VOCAB_TOPICS, generateProceduralVocab } from '../data/vocabBank';
import { useProgress } from '../store/ProgressContext';
import { Volume2, Sparkles, RefreshCw, BookOpen, Clock, Layers, Search, Filter } from 'lucide-react';
import { speakGerman } from '../utils/speech';
import { prioritizeItemsBySRS } from '../utils/srs';
import { SessionSummary } from '../components/SessionSummary';

export function VocabularyView() {
  const { 
    progress, 
    recordAnswer, 
    addMistake, 
    addStudySession, 
    addCustomVocabWords, 
    recordVocabSRSReview,
    addXP 
  } = useProgress();

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<'study' | 'srs' | 'browse'>('study');
  const [selectedLevel, setSelectedLevel] = useState<Difficulty | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Active Session state
  const [activeSession, setActiveSession] = useState(false);
  const [cards, setCards] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, xp: 0 });
  const [sessionSummaryData, setSessionSummaryData] = useState<{ xp: number; correct: number; total: number } | null>(null);

  // Combine all vocab sources: legacy content + original expanded bank + custom generated words
  const allVocab = useMemo<VocabularyWord[]>(() => {
    const combined = [...ORIGINAL_VOCAB_BANK, ...VOCABULARY];
    if (progress.customVocabWords && progress.customVocabWords.length > 0) {
      combined.unshift(...progress.customVocabWords);
    }
    // Remove duplicates by German word lowercase
    const seen = new Set<string>();
    return combined.filter(w => {
      const key = w.german.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [progress.customVocabWords]);

  // Filtered vocab based on selections
  const filteredVocab = useMemo(() => {
    return allVocab.filter(word => {
      if (selectedLevel !== 'all') {
        const wordLevel = word.difficulty || 'A1';
        if (wordLevel !== selectedLevel) return false;
      }
      if (selectedTopic !== 'all' && word.topic) {
        if (word.topic !== selectedTopic) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesGerman = word.german.toLowerCase().includes(q);
        const matchesEnglish = word.english.toLowerCase().includes(q);
        return matchesGerman || matchesEnglish;
      }
      return true;
    });
  }, [allVocab, selectedLevel, selectedTopic, searchQuery]);

  // Spaced-repetition due words
  const dueWords = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const srs = progress.vocabularySRS || {};
    return allVocab.filter(word => {
      const item = srs[word.id];
      if (!item) return false;
      return item.dueDate <= today || (item.mistakesCount > 0 && item.consecutiveCorrect < 3);
    });
  }, [allVocab, progress.vocabularySRS]);

  // Handle LLM / procedural word generation
  const handleGenerateMore = async () => {
    setIsGenerating(true);
    setGenerationNotice(null);

    const targetTopic = selectedTopic === 'all' ? 'general' : selectedTopic;
    const targetLevel = selectedLevel === 'all' ? 'A1' : selectedLevel;

    try {
      const res = await fetch('/api/gemini/generate-vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          level: targetLevel,
          count: 5
        })
      });

      const data = await res.json();
      let generated: VocabularyWord[] = [];

      if (data.success && data.words && data.words.length > 0) {
        generated = data.words;
        setGenerationNotice(`Generated ${generated.length} fresh original words with Gemini!`);
      } else {
        // High quality procedural fallback
        generated = generateProceduralVocab(targetTopic, targetLevel, 5);
        setGenerationNotice(`Generated ${generated.length} fresh practice words from the procedural bank!`);
      }

      addCustomVocabWords(generated);
      addXP(10);
    } catch (err) {
      console.warn('Network error when calling generate-vocab API, using procedural fallback', err);
      const generated = generateProceduralVocab(targetTopic, targetLevel, 5);
      addCustomVocabWords(generated);
      setGenerationNotice(`Generated ${generated.length} fresh practice words!`);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationNotice(null), 4000);
    }
  };

  const startSession = (wordList: VocabularyWord[], count?: number) => {
    // Surface items that are due for spaced repetition review first
    const prioritized = prioritizeItemsBySRS(wordList, progress.vocabularySRS).sorted;
    const pool = count ? prioritized.slice(0, count) : prioritized;
    if (pool.length === 0) return;

    setCards(pool);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, total: 0, xp: 0 });
    setSessionSummaryData(null);
    setActiveSession(true);
    setSessionStartTime(Date.now());
  };

  const endSession = (finalCorrect?: number, finalTotal?: number, finalXP?: number) => {
    const durationMinutes = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));
    const c = finalCorrect !== undefined ? finalCorrect : sessionStats.correct;
    const t = finalTotal !== undefined ? finalTotal : sessionStats.total;
    const sessionBonusXP = t >= 5 ? 10 : 0;
    const earnedXP = (finalXP !== undefined ? finalXP : sessionStats.xp) + sessionBonusXP;

    if (t > 0) {
      addStudySession({
        durationMinutes,
        topics: ['vocabulary'],
        questionsAnswered: t,
        correctAnswers: c
      });
      addXP(earnedXP);
      setSessionSummaryData({
        xp: earnedXP,
        correct: c,
        total: t
      });
    }
    setActiveSession(false);
  };

  const handleResponse = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    const currentCard = cards[currentIndex];
    const isSuccess = quality !== 'again';
    const cardXP = isSuccess ? (quality === 'easy' ? 6 : quality === 'good' ? 5 : 3) : 1;

    recordAnswer('vocabulary', isSuccess);
    recordVocabSRSReview(currentCard.id, quality);

    const nextCorrect = sessionStats.correct + (isSuccess ? 1 : 0);
    const nextTotal = sessionStats.total + 1;
    const nextXP = sessionStats.xp + cardXP;

    setSessionStats({
      correct: nextCorrect,
      total: nextTotal,
      xp: nextXP
    });

    if (quality === 'again') {
      addMistake({
        questionId: `vocab-${currentCard.id}`,
        questionText: currentCard.english,
        topic: 'vocabulary',
        userAnswer: 'Forgot',
        correctAnswer: currentCard.german,
        explanation: `Vocabulary review: ${currentCard.german} (${currentCard.english})`
      });
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      endSession(nextCorrect, nextTotal, nextXP);
    }
  };

  // Sound pronunciation helper
  const handlePronounce = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakGerman(text);
  };

  // Render Session Summary if completed
  if (sessionSummaryData) {
    return (
      <div className="py-8 animate-in fade-in">
        <SessionSummary
          title="Vocabulary Practice Complete!"
          subtitle="Flashcard retention recorded into your Spaced Repetition queue."
          xpEarned={sessionSummaryData.xp}
          correctAnswers={sessionSummaryData.correct}
          totalQuestions={sessionSummaryData.total}
          onContinue={() => setSessionSummaryData(null)}
          onRetry={() => {
            setSessionSummaryData(null);
            startSession(filteredVocab, 10);
          }}
        />
      </div>
    );
  }

  // Render Active Flashcard Session
  if (activeSession) {
    const card = cards[currentIndex];
    const articleColors = {
      der: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      die: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      das: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
    };

    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in fade-in mt-4 md:mt-8">
        <div className="flex justify-between items-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
          <span className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
            Card {currentIndex + 1} <span className="opacity-50">/ {cards.length}</span>
          </span>
          <button 
            onClick={endSession} 
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm font-medium px-3 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            End Practice ✕
          </button>
        </div>

        <div 
          className="relative w-full min-h-[360px] cursor-pointer group"
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Card Front */}
          <Card className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 transition-all duration-300 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl ${isFlipped ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-4">
              {card.difficulty && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                  {card.difficulty}
                </span>
              )}
              {card.topic && (
                <span className="text-xs text-neutral-500 capitalize">{card.topic}</span>
              )}
            </div>

            <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight text-neutral-900 dark:text-neutral-100 flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-2 break-words">
              {card.article && (
                <span className={`text-xl sm:text-2xl md:text-3xl px-2.5 py-1 rounded-lg border font-normal ${articleColors[card.article] || 'text-neutral-600'}`}>
                  {card.article}
                </span>
              )}
              <span className="break-words">{card.german}</span>
            </div>

            <button
              onClick={(e) => handlePronounce(e, card.article ? `${card.article} ${card.german}` : card.german)}
              aria-label="Pronounce German word"
              className="mt-6 p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 sm:bottom-6 text-neutral-400 text-xs font-medium tracking-wide">
              Click anywhere to flip
            </div>
          </Card>

          {/* Card Back */}
          <Card className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 transition-all duration-300 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl ${isFlipped ? 'opacity-100 shadow-sm' : 'opacity-0 pointer-events-none scale-95'}`}>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-center gap-2 px-2 max-w-full">
              <span className="break-words text-center">{card.article ? `${card.article} ${card.german}` : card.german}</span>
              <button
                onClick={(e) => handlePronounce(e, card.article ? `${card.article} ${card.german}` : card.german)}
                aria-label="Pronounce word"
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-lg sm:text-xl font-medium text-primary-600 dark:text-primary-400 mb-4 sm:mb-6 text-center break-words px-2">
              {card.english}
            </div>

            <div className="w-full max-w-md space-y-2.5 sm:space-y-3 text-left bg-neutral-50 dark:bg-neutral-800/50 p-3 sm:p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
              {card.plural && (
                <div className="flex justify-between items-center text-xs sm:text-sm pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-500">Plural</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 break-words">{card.plural}</span>
                </div>
              )}
              <div>
                <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between gap-2">
                  <span className="break-words flex-1">{card.example}</span>
                  <button
                    onClick={(e) => handlePronounce(e, card.example)}
                    aria-label="Pronounce example sentence"
                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-700 shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 break-words">{card.exampleEnglish}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Response grading buttons */}
        {isFlipped && (
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-2 animate-in fade-in">
            <Button onClick={() => handleResponse('again')} variant="danger" className="flex-col h-14 py-1 sm:py-1.5 px-1">
              <span className="text-[11px] sm:text-xs font-semibold">Again</span>
              <span className="text-[9px] sm:text-[10px] opacity-75">1 day</span>
            </Button>
            <Button onClick={() => handleResponse('hard')} variant="outline" className="flex-col h-14 py-1 sm:py-1.5 px-1 border-orange-200 dark:border-orange-900/50 text-orange-600 dark:text-orange-400">
              <span className="text-[11px] sm:text-xs font-semibold">Hard</span>
              <span className="text-[9px] sm:text-[10px] opacity-75">2 days</span>
            </Button>
            <Button onClick={() => handleResponse('good')} variant="outline" className="flex-col h-14 py-1 sm:py-1.5 px-1 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400">
              <span className="text-[11px] sm:text-xs font-semibold">Good</span>
              <span className="text-[9px] sm:text-[10px] opacity-75">4 days</span>
            </Button>
            <Button onClick={() => handleResponse('easy')} variant="secondary" className="flex-col h-14 py-1 sm:py-1.5 px-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] sm:text-xs font-semibold">Easy</span>
              <span className="text-[9px] sm:text-[10px] opacity-75">7 days</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Render Main Hub
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-600 shrink-0" />
            Wortschatz (Vocabulary)
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-0.5">
            Structured vocabulary across CEFR levels with spaced repetition and AI generation.
          </p>
        </div>

        {/* Generate More Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={handleGenerateMore}
            disabled={isGenerating}
            className="w-full sm:w-auto justify-center flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-sm text-sm"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating Words...' : 'Generate More Words'}</span>
          </Button>
        </div>
      </div>

      {generationNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-sm flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{generationNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('study')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'study'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Practice Sessions
        </button>

        <button
          onClick={() => setActiveTab('srs')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 relative ${
            activeTab === 'srs'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          SRS Due Review
          {dueWords.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
              {dueWords.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('browse')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'browse'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Search className="w-4 h-4" />
          Word Bank ({allVocab.length})
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-1">
          {(['all', 'A1', 'A2', 'B1'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedLevel === lvl
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {lvl === 'all' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>

        {/* Topic dropdown */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          aria-label="Select vocabulary topic"
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 focus:outline-none"
        >
          {VOCAB_TOPICS.map(t => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.label}
            </option>
          ))}
        </select>

        {/* Search input (if browse) */}
        {activeTab === 'browse' && (
          <div className="flex-1 min-w-[200px] ml-auto">
            <input
              type="text"
              placeholder="Search German or English..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Tab Content: Study Sessions */}
      {activeTab === 'study' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-6 flex flex-col justify-between border border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                Quick Sprint
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-3 mb-1">
                10 Cards Session
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                Fast review of 10 words filtered by your selected topic and CEFR level. Perfect for daily practice.
              </p>
            </div>
            <Button
              onClick={() => startSession(filteredVocab, 10)}
              disabled={filteredVocab.length === 0}
              className="w-full justify-center"
            >
              Start 10 Cards
            </Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between border border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                Deep Dive
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-3 mb-1">
                25 Cards Session
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                Comprehensive practice round to build retention and reinforce recall in your target level.
              </p>
            </div>
            <Button
              onClick={() => startSession(filteredVocab, 25)}
              disabled={filteredVocab.length === 0}
              variant="secondary"
              className="w-full justify-center"
            >
              Start 25 Cards
            </Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between border border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                All Filtered
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-3 mb-1">
                {filteredVocab.length} Words Deck
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                Review all cards currently matching your level and topic filters without limitations.
              </p>
            </div>
            <Button
              onClick={() => startSession(filteredVocab)}
              disabled={filteredVocab.length === 0}
              variant="outline"
              className="w-full justify-center"
            >
              Study All ({filteredVocab.length})
            </Button>
          </Card>
        </div>
      )}

      {/* Tab Content: SRS Due Review */}
      {activeTab === 'srs' && (
        <div className="space-y-4">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Spaced Repetition Queue
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Words you struggle with or that are due for memory reinforcement based on the SM-2 algorithm.
              </p>
            </div>
            {dueWords.length > 0 ? (
              <Button
                onClick={() => startSession(dueWords)}
                className="bg-primary-600 text-white"
              >
                Review {dueWords.length} Due Words
              </Button>
            ) : (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                All caught up! 🎉
              </span>
            )}
          </div>

          {dueWords.length === 0 ? (
            <Card className="p-8 text-center text-neutral-500 dark:text-neutral-400">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary-500" />
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">No words due for review right now!</p>
              <p className="text-xs mt-1 text-neutral-400 max-w-sm mx-auto">
                As you practice cards and mark items as "Again" or "Hard", they will automatically appear here when due.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dueWords.map(word => (
                <div 
                  key={word.id} 
                  className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {word.article ? `${word.article} ${word.german}` : word.german}
                    </div>
                    <div className="text-xs text-neutral-500">{word.english}</div>
                  </div>
                  <button
                    onClick={(e) => handlePronounce(e, word.german)}
                    aria-label={`Pronounce ${word.german}`}
                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Word Bank Browser */}
      {activeTab === 'browse' && (
        <div className="space-y-3">
          <div className="text-xs text-neutral-500">
            Showing {filteredVocab.length} words
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredVocab.map(word => (
              <div 
                key={word.id}
                className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {word.article && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          word.article === 'der' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                          word.article === 'die' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
                          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}>
                          {word.article}
                        </span>
                      )}
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 text-base">
                        {word.german}
                      </span>
                      {word.difficulty && (
                        <span className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                          {word.difficulty}
                        </span>
                      )}
                      {word.isCustom && (
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded font-medium">
                          AI
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
                      {word.english}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handlePronounce(e, word.article ? `${word.article} ${word.german}` : word.german)}
                    aria-label={`Pronounce ${word.german}`}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {word.example && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
                    <p className="text-neutral-800 dark:text-neutral-200 font-medium">{word.example}</p>
                    <p className="text-neutral-400 mt-0.5">{word.exampleEnglish}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
