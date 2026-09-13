import React from 'react';
import { QuizEngine } from './QuizEngine';
import { QUESTIONS } from '../data/content';

export function SatzbildungView() {
  const satzbildungQuestions = QUESTIONS.filter(q => q.topic === 'satzbildung');

  return (
    <QuizEngine 
      title="Satzbildung" 
      description="Practice sentence building, word order, and verb position."
      topic="satzbildung"
      questions={satzbildungQuestions}
    />
  );
}
