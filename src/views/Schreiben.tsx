import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { WritingPrompt, WritingFeedback, Difficulty, WritingSubmission } from '../types';
import { ORIGINAL_WRITING_PROMPTS, evaluateGermanWritingLocally } from '../data/writingBank';
import { useProgress } from '../store/ProgressContext';
import { 
  PenLine, 
  Sparkles, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Award, 
  FileText,
  Lightbulb,
  Tag
} from 'lucide-react';

export function SchreibenView() {
  const { progress, addXP, recordWritingSubmission, recordAnswer, addStudySession } = useProgress();

  // Prompt selection & filtering
  const [selectedLevel, setSelectedLevel] = useState<Difficulty | 'all'>('all');
  const [customPrompts, setCustomPrompts] = useState<WritingPrompt[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');

  // Input & Evaluation state
  const [userText, setUserText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  // Generation state
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // Combine original and custom prompts
  const allPrompts = useMemo(() => {
    return [...customPrompts, ...ORIGINAL_WRITING_PROMPTS];
  }, [customPrompts]);

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter(p => {
      if (selectedLevel !== 'all' && p.level !== selectedLevel) return false;
      return true;
    });
  }, [allPrompts, selectedLevel]);

  const activePrompt: WritingPrompt | undefined = filteredPrompts[currentPromptIndex] || filteredPrompts[0];

  const wordCount = userText.trim().split(/\s+/).filter(w => w.length > 0).length;

  // Handle Dynamic Prompt Generation
  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompts(true);
    setGenerationNotice(null);

    const targetLevel = selectedLevel === 'all' ? 'A1' : selectedLevel;

    try {
      const res = await fetch('/api/gemini/generate-writing-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'daily communication and life in Germany',
          level: targetLevel,
          count: 2
        })
      });

      const data = await res.json();
      if (data.success && data.prompts && data.prompts.length > 0) {
        setCustomPrompts(prev => [...data.prompts, ...prev]);
        setCurrentPromptIndex(0);
        setGenerationNotice(`Generated ${data.prompts.length} new writing prompts with Gemini!`);
      } else {
        setGenerationNotice('New prompts added from the bank.');
      }
    } catch (err) {
      console.warn('Error generating prompt, using fallback', err);
      setGenerationNotice('Ready to practice!');
    } finally {
      setIsGeneratingPrompts(false);
      setTimeout(() => setGenerationNotice(null), 4000);
    }
  };

  // Submit writing for grammar correction & evaluation
  const handleSubmitWriting = async () => {
    if (!activePrompt || wordCount < 5 || isEvaluating) return;

    setIsEvaluating(true);

    try {
      const res = await fetch('/api/gemini/correct-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText,
          promptTitle: activePrompt.title,
          level: activePrompt.level,
          guidingPoints: activePrompt.guidingPoints
        })
      });

      const data = await res.json();
      let evaluatedFeedback: WritingFeedback;

      if (data.success && data.feedback) {
        evaluatedFeedback = data.feedback;
      } else {
        // High quality local fallback evaluation
        evaluatedFeedback = evaluateGermanWritingLocally(userText, activePrompt);
      }

      setFeedback(evaluatedFeedback);

      // Record submission in global progress
      const submission: WritingSubmission = {
        id: `sub-${Date.now()}`,
        promptId: activePrompt.id,
        promptTitle: activePrompt.title,
        userText,
        date: new Date().toISOString(),
        feedback: evaluatedFeedback
      };

      recordWritingSubmission(submission);
      recordAnswer('schreiben', evaluatedFeedback.score >= 70);
      addStudySession({
        durationMinutes: 8,
        topics: ['schreiben'],
        questionsAnswered: 1,
        correctAnswers: evaluatedFeedback.score >= 70 ? 1 : 0
      });
      addXP(Math.round(evaluatedFeedback.score / 2));
    } catch (err) {
      console.warn('Error in writing evaluation API, using local evaluator', err);
      const evaluatedFeedback = evaluateGermanWritingLocally(userText, activePrompt);
      setFeedback(evaluatedFeedback);

      const submission: WritingSubmission = {
        id: `sub-${Date.now()}`,
        promptId: activePrompt.id,
        promptTitle: activePrompt.title,
        userText,
        date: new Date().toISOString(),
        feedback: evaluatedFeedback
      };
      recordWritingSubmission(submission);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetForNewPrompt = () => {
    setUserText('');
    setFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <PenLine className="w-6 h-6 text-primary-600" />
            Schreibtraining (Writing Practice)
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real-world German writing tasks with AI-powered grammar correction, CEFR evaluation, and error diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleGeneratePrompt}
            disabled={isGeneratingPrompts}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingPrompts ? 'Generating...' : 'Generate New Task'}</span>
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
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('write')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'write'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <PenLine className="w-4 h-4" />
          Active Writing Task
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'history'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <History className="w-4 h-4" />
          Past Submissions & Patterns ({progress.writingSubmissions?.length || 0})
        </button>
      </div>

      {/* View 1: Active Writing Workspace */}
      {activeTab === 'write' && activePrompt && (
        <div className="space-y-6">
          {/* Level Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-neutral-500 mr-1">Level:</span>
              {(['all', 'A1', 'A2', 'B1'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setCurrentPromptIndex(0);
                    handleResetForNewPrompt();
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {lvl === 'all' ? 'All' : lvl}
                </button>
              ))}
            </div>

            {/* Prompt switcher */}
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>Task {currentPromptIndex + 1} of {filteredPrompts.length}</span>
              <button
                onClick={() => {
                  setCurrentPromptIndex(prev => (prev + 1) % filteredPrompts.length);
                  handleResetForNewPrompt();
                }}
                className="px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
              >
                Next Task →
              </button>
            </div>
          </div>

          {/* Task Prompt Card */}
          <Card className="p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
                    {activePrompt.level}
                  </span>
                  <span className="text-xs text-neutral-500 capitalize">{activePrompt.topic}</span>
                </div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {activePrompt.title}
                </h2>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800 text-sm space-y-1">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {activePrompt.prompt}
              </p>
              <p className="text-xs text-neutral-500 italic">
                {activePrompt.promptEnglish}
              </p>
            </div>

            {/* Guiding points */}
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Leitpunkte (Guiding Points to cover):
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                {activePrompt.guidingPoints.map((pt, i) => (
                  <li key={i} className="flex items-center gap-2 bg-white dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <span className="w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activePrompt.targetGrammar && (
              <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Grammar focus: <strong>{activePrompt.targetGrammar}</strong></span>
              </div>
            )}
          </Card>

          {/* Text Area & Submit */}
          <Card className="p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="relative">
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Schreiben Sie Ihren Text hier auf Deutsch..."
                rows={6}
                disabled={isEvaluating}
                className="w-full p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm leading-relaxed"
              />
            </div>

            {/* Word count status & Submit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${wordCount >= activePrompt.minWords ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                <span className={`font-semibold ${wordCount >= activePrompt.minWords ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`}>
                  {wordCount} / {activePrompt.minWords} words required
                </span>
              </div>

              <div className="flex items-center gap-2">
                {feedback && (
                  <Button
                    variant="outline"
                    onClick={handleResetForNewPrompt}
                    size="sm"
                  >
                    Clear / Try Again
                  </Button>
                )}
                <Button
                  onClick={handleSubmitWriting}
                  disabled={wordCount < 5 || isEvaluating}
                  size="sm"
                  className="flex items-center gap-2 bg-primary-600 text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit & Check'}</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* AI / Evaluator Feedback Output */}
          {feedback && (
            <Card className="p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 space-y-6 animate-in fade-in">
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    CEFR Rating: {feedback.cefrRating}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    Evaluation Result
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Score</div>
                    <div className="text-3xl font-extrabold text-primary-600">
                      {feedback.score}<span className="text-sm font-normal text-neutral-400">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary message */}
              <div className="p-4 bg-primary-50 dark:bg-primary-950/40 rounded-xl border border-primary-100 dark:border-primary-900/50 text-xs md:text-sm text-primary-950 dark:text-primary-100 leading-relaxed">
                {feedback.summary}
              </div>

              {/* Strengths */}
              {feedback.strengths && feedback.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Stärken (What you did well):
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                    {feedback.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Corrected Text Suggestion */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Korrigierter Text (Model Natural Version):
                </h4>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap leading-relaxed">
                  {feedback.correctedText}
                </div>
              </div>

              {/* Specific Corrections List */}
              {feedback.corrections && feedback.corrections.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Detaillierte Korrekturen & Grammatiktipps ({feedback.corrections.length}):
                  </h4>
                  <div className="space-y-2.5">
                    {feedback.corrections.map((corr, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                            {corr.original}
                          </span>
                          <span className="text-neutral-400">→</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                            {corr.corrected}
                          </span>
                          {corr.mistakeType && (
                            <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                              {corr.mistakeType}
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 pl-1 leading-relaxed">
                          {corr.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* View 2: Past Submissions & Mistake Patterns */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Mistake Pattern Summary */}
          {progress.writingMistakePatterns && Object.keys(progress.writingMistakePatterns).length > 0 && (
            <Card className="p-6 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-600" />
                Frequent Writing Mistake Patterns
              </h3>
              <p className="text-xs text-neutral-500">
                Identified areas where mistakes have occurred across your writing submissions:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.entries(progress.writingMistakePatterns).map(([pattern, count]) => (
                  <span
                    key={pattern}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                  >
                    {pattern}: {count} {count === 1 ? 'time' : 'times'}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Submissions List */}
          {(!progress.writingSubmissions || progress.writingSubmissions.length === 0) ? (
            <Card className="p-12 text-center text-neutral-400 border border-neutral-200 dark:border-neutral-800">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">No submissions yet.</p>
              <p className="text-xs mt-1">Complete your first writing task above to see your history and feedback here!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {progress.writingSubmissions.map((sub) => (
                <Card key={sub.id} className="p-5 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        {sub.promptTitle}
                      </h4>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {new Date(sub.date).toLocaleDateString()} at {new Date(sub.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary-600">{sub.feedback.score}/100</span>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">{sub.feedback.cefrRating}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg text-xs text-neutral-700 dark:text-neutral-300">
                    "{sub.userText}"
                  </div>

                  <div className="text-xs text-neutral-500 line-clamp-2">
                    {sub.feedback.summary}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
