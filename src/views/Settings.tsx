import React, { useState, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { Download, Upload, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export function SettingsView() {
  const { progress, updateDailyGoal, resetProgress, importProgress, refillHearts } = useProgress();
  const [goal, setGoal] = useState(progress.dailyGoalMinutes);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSaveGoal = () => {
    updateDailyGoal(goal);
    showToast('success', 'Daily study target updated successfully!');
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `german_a1_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    showToast('success', 'Progress backup downloaded successfully.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importProgress(content);
        if (success) {
          showToast('success', 'Progress restored successfully from backup!');
        } else {
          showToast('error', 'Failed to import backup. Please check that the file is valid JSON.');
        }
      }
    };
    reader.onerror = () => {
      showToast('error', 'Error reading file.');
    };
    reader.readAsText(file);
    // reset input value so re-importing same file triggers change
    e.target.value = '';
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    showToast('success', 'All learning progress has been reset.');
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto mt-4 md:mt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Manage your learning preferences, hearts, and local data.</p>
      </header>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in ${notification.type === 'success' ? 'bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 text-green-600" /> : <AlertCircle size={20} className="shrink-0 text-red-600" />}
          <div className="font-medium text-sm">{notification.message}</div>
        </div>
      )}

      <Card className="p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Learning Goals</h2>
        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-100 dark:border-neutral-700/50 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Daily Study Target</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">Consistency accelerates your exam readiness.</div>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={goal} 
                onChange={(e) => setGoal(Number(e.target.value))}
                className="p-2.5 px-4 font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
              <Button onClick={handleSaveGoal} className="px-6">Save</Button>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-100 dark:border-neutral-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Hearts System</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Currently: {progress.hearts} / 5 hearts available.</div>
          </div>
          <Button 
            onClick={() => {
              refillHearts();
              showToast('success', 'Hearts refilled to 5!');
            }}
            variant="outline"
            size="sm"
          >
            Refill to 5 Hearts
          </Button>
        </div>
      </Card>

      <Card className="p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Data Management</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">This app saves your progress locally in your browser. You can export a backup or restore from one anytime.</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json,application/json" 
          className="hidden" 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={handleExport} variant="outline" size="lg" className="justify-center gap-3 h-14">
            <Download size={18} /> Backup Progress (JSON)
          </Button>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline" 
            size="lg" 
            className="justify-center gap-3 h-14"
          >
            <Upload size={18} /> Import Backup
          </Button>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">Danger Zone</h3>
              <p className="text-sm text-red-600/80 dark:text-red-300/80">Reset all streaks, answers, mistake history, and lesson completion.</p>
            </div>
            
            {!showResetConfirm ? (
              <Button onClick={() => setShowResetConfirm(true)} variant="danger" className="shrink-0">
                <RefreshCw size={18} className="mr-2" /> Reset Progress
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={handleReset} variant="danger" size="sm">
                  Confirm Reset
                </Button>
                <Button onClick={() => setShowResetConfirm(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
