import React from 'react';
import { QuizEngine } from './QuizEngine';
import { QUESTIONS } from '../data/content';

export function HorenView() {
  const horenQuestions = QUESTIONS.filter(q => q.topic === 'hören');

  return (
    <QuizEngine 
      title="Hören (Listening)" 
      description="Practice listening comprehension with A1 audio exercises."
      topic="hören"
      questions={horenQuestions}
    />
  );
}
