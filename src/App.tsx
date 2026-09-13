/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProgressProvider } from './store/ProgressContext';
import { ThemeProvider } from './store/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { LearningPathView } from './views/LearningPath';
import { VocabularyView } from './views/Vocabulary';
import { ArtikelView } from './views/Artikel';
import { SatzbildungView } from './views/Satzbildung';
import { GrammatikView } from './views/Grammatik';
import { HorenView } from './views/Horen';
import { LesenView } from './views/Lesen';
import { SchreibenView } from './views/Schreiben';
import { SprechenView } from './views/Sprechen';
import { QuizView } from './views/QuizView';
import { MockTestView } from './views/MockTest';
import { MistakesView } from './views/Mistakes';
import { ProgressView } from './views/Progress';
import { SettingsView } from './views/Settings';

function MainApp() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentView} />;
      case 'learning-path': return <LearningPathView onNavigate={setCurrentView} />;
      case 'vocabulary': return <VocabularyView />;
      case 'artikel': return <ArtikelView />;
      case 'satzbildung': return <SatzbildungView />;
      case 'grammatik': return <GrammatikView />;
      case 'quiz': return <QuizView />;
      case 'hören': 
      case 'horen': return <HorenView />;
      case 'lesen': return <LesenView />;
      case 'schreiben': return <SchreibenView />;
      case 'sprechen': return <SprechenView />;
      case 'mocktest': return <MockTestView />;
      case 'mistakes': return <MistakesView />;
      case 'progress': return <ProgressView />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <MainApp />
      </ProgressProvider>
    </ThemeProvider>
  );
}

