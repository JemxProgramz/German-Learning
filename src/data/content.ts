import { Question, VocabularyWord, GrammarTopic } from '../types';

export const VOCABULARY: VocabularyWord[] = [
  // Lesson 1
  { id: 'v1', lesson: 1, german: 'Hallo', english: 'Hello', example: 'Hallo, wie geht es dir?', exampleEnglish: 'Hello, how are you?' },
  { id: 'v2', lesson: 1, german: 'Tschüss', english: 'Bye', example: 'Tschüss, bis morgen!', exampleEnglish: 'Bye, see you tomorrow!' },
  { id: 'v3', lesson: 1, german: 'Name', article: 'der', english: 'name', plural: 'die Namen', example: 'Mein Name ist Anna.', exampleEnglish: 'My name is Anna.' },
  { id: 'v4', lesson: 1, german: 'kommen', english: 'to come', example: 'Ich komme aus Deutschland.', exampleEnglish: 'I come from Germany.' },
  { id: 'v5', lesson: 1, german: 'wohnen', english: 'to live', example: 'Ich wohne in Berlin.', exampleEnglish: 'I live in Berlin.' },
  { id: 'v6', lesson: 1, german: 'Land', article: 'das', english: 'country', plural: 'die Länder', example: 'Deutschland ist ein Land.', exampleEnglish: 'Germany is a country.' },
  { id: 'v7', lesson: 1, german: 'Stadt', article: 'die', english: 'city', plural: 'die Städte', example: 'Berlin ist eine Stadt.', exampleEnglish: 'Berlin is a city.' },
  { id: 'v8', lesson: 1, german: 'sprechen', english: 'to speak', example: 'Ich spreche Deutsch.', exampleEnglish: 'I speak German.' },
  { id: 'v9', lesson: 1, german: 'Sprache', article: 'die', english: 'language', plural: 'die Sprachen', example: 'Deutsch ist meine Sprache.', exampleEnglish: 'German is my language.' },
  { id: 'v10', lesson: 1, german: 'lernen', english: 'to learn', example: 'Ich lerne Deutsch.', exampleEnglish: 'I am learning German.' },
  // Lesson 2
  { id: 'v11', lesson: 2, german: 'Tisch', article: 'der', english: 'table', plural: 'die Tische', example: 'Der Tisch ist groß.', exampleEnglish: 'The table is big.' },
  { id: 'v12', lesson: 2, german: 'Stuhl', article: 'der', english: 'chair', plural: 'die Stühle', example: 'Der Stuhl ist bequem.', exampleEnglish: 'The chair is comfortable.' },
  { id: 'v13', lesson: 2, german: 'Buch', article: 'das', english: 'book', plural: 'die Bücher', example: 'Das Buch ist interessant.', exampleEnglish: 'The book is interesting.' },
  { id: 'v14', lesson: 2, german: 'Tasche', article: 'die', english: 'bag', plural: 'die Taschen', example: 'Die Tasche ist schwer.', exampleEnglish: 'The bag is heavy.' },
  { id: 'v15', lesson: 2, german: 'Auto', article: 'das', english: 'car', plural: 'die Autos', example: 'Das Auto ist schnell.', exampleEnglish: 'The car is fast.' },
  { id: 'v16', lesson: 2, german: 'groß', english: 'big', example: 'Das Haus ist groß.', exampleEnglish: 'The house is big.' },
  { id: 'v17', lesson: 2, german: 'klein', english: 'small', example: 'Das Kind ist klein.', exampleEnglish: 'The child is small.' },
  { id: 'v18', lesson: 2, german: 'schön', english: 'beautiful', example: 'Die Blume ist schön.', exampleEnglish: 'The flower is beautiful.' },
  { id: 'v19', lesson: 2, german: 'gut', english: 'good', example: 'Das Essen ist gut.', exampleEnglish: 'The food is good.' },
  { id: 'v20', lesson: 2, german: 'schlecht', english: 'bad', example: 'Das Wetter ist schlecht.', exampleEnglish: 'The weather is bad.' },
  // Lesson 3
  { id: 'v21', lesson: 3, german: 'Essen', article: 'das', english: 'food', example: 'Das Essen schmeckt gut.', exampleEnglish: 'The food tastes good.' },
  { id: 'v22', lesson: 3, german: 'trinken', english: 'to drink', example: 'Ich trinke Wasser.', exampleEnglish: 'I drink water.' },
  { id: 'v23', lesson: 3, german: 'Wasser', article: 'das', english: 'water', example: 'Das Wasser ist kalt.', exampleEnglish: 'The water is cold.' },
  { id: 'v24', lesson: 3, german: 'Brot', article: 'das', english: 'bread', plural: 'die Brote', example: 'Ich esse Brot.', exampleEnglish: 'I eat bread.' },
  { id: 'v25', lesson: 3, german: 'Kaffee', article: 'der', english: 'coffee', example: 'Der Kaffee ist heiß.', exampleEnglish: 'The coffee is hot.' },
  // Lesson 4
  { id: 'v26', lesson: 4, german: 'Tag', article: 'der', english: 'day', plural: 'die Tage', example: 'Der Tag ist schön.', exampleEnglish: 'The day is beautiful.' },
  { id: 'v27', lesson: 4, german: 'Woche', article: 'die', english: 'week', plural: 'die Wochen', example: 'Die Woche hat sieben Tage.', exampleEnglish: 'The week has seven days.' },
  { id: 'v28', lesson: 4, german: 'Montag', article: 'der', english: 'Monday', example: 'Heute ist Montag.', exampleEnglish: 'Today is Monday.' },
  { id: 'v29', lesson: 4, german: 'arbeiten', english: 'to work', example: 'Ich arbeite heute.', exampleEnglish: 'I am working today.' },
  { id: 'v30', lesson: 4, german: 'frei', english: 'free (time)', example: 'Ich habe heute frei.', exampleEnglish: 'I have today off.' },
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'g1',
    lesson: 1,
    title: 'Personal Pronouns (Nominative)',
    explanation: 'Personal pronouns replace nouns. In the nominative case, they act as the subject of the sentence.',
    examples: [
      { german: 'Ich bin Anna.', english: 'I am Anna.' },
      { german: 'Du kommst aus Spanien.', english: 'You (informal) come from Spain.' },
      { german: 'Er/Sie/Es lernt Deutsch.', english: 'He/She/It learns German.' },
      { german: 'Wir wohnen in Berlin.', english: 'We live in Berlin.' },
      { german: 'Ihr sprecht gut.', english: 'You (plural) speak well.' },
      { german: 'Sie/Sie sind nett.', english: 'They / You (formal) are nice.' }
    ]
  },
  {
    id: 'g2',
    lesson: 1,
    title: 'Verb Conjugation (Regular Verbs)',
    explanation: 'Regular verbs take predictable endings based on the subject pronoun: -e, -st, -t, -en, -t, -en.',
    examples: [
      { german: 'ich lerne', english: 'I learn' },
      { german: 'du lernst', english: 'you learn' },
      { german: 'er/sie/es lernt', english: 'he/she/it learns' },
      { german: 'wir lernen', english: 'we learn' },
      { german: 'ihr lernt', english: 'you (pl.) learn' },
      { german: 'sie/Sie lernen', english: 'they / you (formal) learn' }
    ]
  },
  {
    id: 'g3',
    lesson: 2,
    title: 'Definite Articles (Nominative)',
    explanation: 'Nouns in German have genders: masculine (der), feminine (die), and neuter (das). The plural is always "die".',
    examples: [
      { german: 'der Tisch (masculine)', english: 'the table' },
      { german: 'die Tasche (feminine)', english: 'the bag' },
      { german: 'das Buch (neuter)', english: 'the book' },
      { german: 'die Tische (plural)', english: 'the tables' }
    ]
  },
  {
    id: 'g4',
    lesson: 3,
    title: 'Indefinite Articles (Nominative)',
    explanation: 'The indefinite articles ("a" or "an") are "ein" for masculine and neuter, and "eine" for feminine. There is no plural indefinite article.',
    examples: [
      { german: 'ein Tisch', english: 'a table' },
      { german: 'eine Tasche', english: 'a bag' },
      { german: 'ein Buch', english: 'a book' }
    ]
  },
  {
    id: 'g5',
    lesson: 4,
    title: 'Sentence Structure: Verb Position 2',
    explanation: 'In a normal statement or W-question, the conjugated verb is always in position 2.',
    examples: [
      { german: 'Ich lerne heute Deutsch.', english: 'I am learning German today.' },
      { german: 'Heute lerne ich Deutsch.', english: 'Today I am learning German.' },
      { german: 'Woher kommst du?', english: 'Where do you come from?' }
    ]
  }
];

export const QUESTIONS: Question[] = [
  // Artikel
  {
    id: 'q1', lesson: 2, topic: 'artikel', difficulty: 'A1', questionType: 'multiple-choice',
    question: '___ Tisch ist groß.', options: ['der', 'die', 'das'], correctAnswer: 'der',
    explanation: '"Tisch" is masculine (der Tisch).', englishMeaning: 'The table is big.'
  },
  {
    id: 'q2', lesson: 2, topic: 'artikel', difficulty: 'A1', questionType: 'multiple-choice',
    question: '___ Buch ist interessant.', options: ['der', 'die', 'das'], correctAnswer: 'das',
    explanation: '"Buch" is neuter (das Buch).', englishMeaning: 'The book is interesting.'
  },
  {
    id: 'q3', lesson: 2, topic: 'artikel', difficulty: 'A1', questionType: 'multiple-choice',
    question: '___ Tasche ist neu.', options: ['der', 'die', 'das'], correctAnswer: 'die',
    explanation: '"Tasche" is feminine (die Tasche).', englishMeaning: 'The bag is new.'
  },
  {
    id: 'q4', lesson: 3, topic: 'artikel', difficulty: 'A1', questionType: 'fill-in-blank',
    question: 'Das ist ___ Auto. (a car)', correctAnswer: 'ein',
    explanation: '"Auto" is neuter, so the indefinite article in Nominative is "ein".', englishMeaning: 'That is a car.'
  },
  
  // Satzbildung
  {
    id: 'q5', lesson: 1, topic: 'satzbildung', difficulty: 'A1', questionType: 'sentence-building',
    question: 'aus / ich / komme / Deutschland', correctAnswer: 'Ich komme aus Deutschland.',
    explanation: 'The subject "Ich" goes first, the verb "komme" is in position 2.', englishMeaning: 'I come from Germany.'
  },
  {
    id: 'q6', lesson: 1, topic: 'satzbildung', difficulty: 'A1', questionType: 'typing',
    question: 'I live in Berlin.', correctAnswer: ['Ich wohne in Berlin.', 'ich wohne in berlin'],
    explanation: 'Capitalize "Ich" and nouns like "Berlin". Verb "wohnen" conjugated for "ich" is "wohne".', englishMeaning: 'I live in Berlin.'
  },
  {
    id: 'q7', lesson: 4, topic: 'satzbildung', difficulty: 'A1', questionType: 'sentence-building',
    question: 'lerne / heute / ich / Deutsch', correctAnswer: 'Heute lerne ich Deutsch.',
    explanation: 'If "Heute" is position 1, the verb "lerne" must be in position 2, followed by the subject "ich". ("Ich lerne heute Deutsch." is also correct structurally but building typically expects one form if guided).', englishMeaning: 'Today I learn German.'
  },

  // Grammatik
  {
    id: 'q8', lesson: 1, topic: 'grammatik', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Woher ___ du?', options: ['komme', 'kommst', 'kommt', 'kommen'], correctAnswer: 'kommst',
    explanation: 'The verb "kommen" takes the ending "-st" for "du".', englishMeaning: 'Where do you come from?'
  },
  {
    id: 'q9', lesson: 1, topic: 'grammatik', difficulty: 'A1', questionType: 'multiple-choice',
    question: '___ bin Anna.', options: ['Ich', 'Du', 'Er', 'Wir'], correctAnswer: 'Ich',
    explanation: '"bin" is the "ich" form of the verb "sein" (to be).', englishMeaning: 'I am Anna.'
  },
  {
    id: 'q10', lesson: 4, topic: 'grammatik', difficulty: 'A1', questionType: 'true-false',
    question: 'In a German main clause, the verb is always at the end.', options: ['True', 'False'], correctAnswer: 'False',
    explanation: 'In a normal main clause, the conjugated verb is in position 2.', englishMeaning: ''
  },
  
  // Hören (Simulated with text for now, but configured for audio)
  {
    id: 'q11', lesson: 1, topic: 'hören', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'What is the person\'s name? (Audio: "Hallo, mein Name ist Thomas und ich komme aus Österreich.")',
    options: ['Anna', 'Thomas', 'Lukas', 'Markus'], correctAnswer: 'Thomas',
    explanation: 'He says "mein Name ist Thomas".', englishMeaning: 'Hello, my name is Thomas and I come from Austria.'
  },

  // Lesen
  {
    id: 'q12', lesson: 2, topic: 'lesen', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Read: "Das ist mein Zimmer. Der Tisch ist klein, aber der Stuhl ist sehr groß. Das Bett ist schön." - What is small?',
    options: ['Das Zimmer', 'Der Tisch', 'Der Stuhl', 'Das Bett'], correctAnswer: 'Der Tisch',
    explanation: 'The text says "Der Tisch ist klein" (The table is small).', englishMeaning: 'This is my room. The table is small, but the chair is very big. The bed is beautiful.'
  },
];
