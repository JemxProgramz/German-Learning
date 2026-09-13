import React from 'react';
import { QuizEngine } from './QuizEngine';
import { QUESTIONS } from '../data/content';

export function ArtikelView() {
  const artikelQuestions = QUESTIONS.filter(q => q.topic === 'artikel');

  return (
    <QuizEngine 
      title="Artikel Practice" 
      description="Practice der, die, das and indefinite articles (ein, eine) in Nominativ and Akkusativ."
      topic="artikel"
      questions={artikelQuestions}
    />
  );
}
