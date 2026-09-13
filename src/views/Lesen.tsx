import React from 'react';
import { QuizEngine } from './QuizEngine';
import { QUESTIONS } from '../data/content';

export function LesenView() {
  const lesenQuestions = QUESTIONS.filter(q => q.topic === 'lesen');

  return (
    <QuizEngine 
      title="Lesen (Reading)" 
      description="Practice reading comprehension with short A1 texts."
      topic="lesen"
      questions={lesenQuestions}
    />
  );
}
