import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../store/ProgressContext';
import { Download, Upload, RefreshCw } from 'lucide-react';

export function SettingsView() {
  const { progress, updateDailyGoal, resetProgress, importProgress } = useProgress();
  const [goal, setGoal] = useState(progress.dailyGoalMinutes);

  const handleSaveGoal = () => {
    updateDailyGoal(goal);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "german_a1_backup.json");
    dlAnchorElem.click();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure? This will delete your learning history entirely.")) {
      resetProgress();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto mt-4 md:mt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Manage your learning preferences and local data.</p>
      </header>

      <Card className="p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Learning Goals</h2>
        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl border border-neutral-100 dark:border-neutral-700/50 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Daily Study Target</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">Aim for consistency over intensity.</div>
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
      </Card>

      <Card className="p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Data Management</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">This app stores your progress locally in your browser. Export it to back it up.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={handleExport} variant="outline" size="lg" className="justify-center gap-3 h-14">
            <Download size={18} /> Backup Progress
          </Button>
          <Button variant="outline" size="lg" className="justify-center gap-3 h-14" onClick={() => alert('Import requires file selection in a full implementation.')}>
            <Upload size={18} /> Import Backup
          </Button>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">Danger Zone</h3>
              <p className="text-sm text-red-600/80 dark:text-red-300/80">This action will delete your learning history entirely and cannot be undone.</p>
            </div>
            <Button onClick={handleReset} variant="danger" className="shrink-0">
              <RefreshCw size={18} className="mr-2" /> Reset Progress
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
