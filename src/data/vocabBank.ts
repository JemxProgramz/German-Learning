import { VocabularyWord, Difficulty, Question, QuestionType } from '../types';

export const CEFR_LEVELS: Difficulty[] = ['A1', 'A2', 'B1'];

export const VOCAB_TOPICS = [
  { id: 'all', label: 'All Topics', icon: '🌟' },
  { id: 'greetings', label: 'Greetings & Introductions', icon: '👋' },
  { id: 'family', label: 'Family & Friends', icon: '👨‍👩‍👧‍👦' },
  { id: 'food', label: 'Food & Groceries', icon: '🍎' },
  { id: 'travel', label: 'Travel & Transport', icon: '🚆' },
  { id: 'shopping', label: 'Shopping & Clothes', icon: '🛍️' },
  { id: 'work', label: 'Work & Profession', icon: '💼' },
  { id: 'routine', label: 'Daily Routine & Time', icon: '⏰' },
  { id: 'health', label: 'Health & Body', icon: '🏥' },
  { id: 'hobbies', label: 'Hobbies & Free Time', icon: '⚽' },
  { id: 'housing', label: 'Home & Living', icon: '🏠' },
  { id: 'weather', label: 'Weather & Nature', icon: '☀️' },
  { id: 'technology', label: 'Media & Technology', icon: '💻' }
] as const;

export const ORIGINAL_VOCAB_BANK: VocabularyWord[] = [
  // --- A1: Greetings & Introductions ---
  {
    id: 'vb-a1-gr1',
    german: 'Begrüßung',
    article: 'die',
    plural: 'die Begrüßungen',
    english: 'greeting, welcome',
    example: 'Eine freundliche Begrüßung ist wichtig.',
    exampleEnglish: 'A friendly greeting is important.',
    difficulty: 'A1',
    topic: 'greetings'
  },
  {
    id: 'vb-a1-gr2',
    german: 'Vorname',
    article: 'der',
    plural: 'die Vornamen',
    english: 'first name',
    example: 'Mein Vorname ist Lukas.',
    exampleEnglish: 'My first name is Lukas.',
    difficulty: 'A1',
    topic: 'greetings'
  },
  {
    id: 'vb-a1-gr3',
    german: 'Nachname',
    article: 'der',
    plural: 'die Nachnamen',
    english: 'last name, surname',
    example: 'Wie ist Ihr Nachname, bitte?',
    exampleEnglish: 'What is your last name, please?',
    difficulty: 'A1',
    topic: 'greetings'
  },
  {
    id: 'vb-a1-gr4',
    german: 'kennenlernen',
    english: 'to get to know, to meet',
    example: 'Schön, Sie kennenzulernen!',
    exampleEnglish: 'Nice to meet you!',
    difficulty: 'A1',
    topic: 'greetings'
  },
  {
    id: 'vb-a1-gr5',
    german: 'Herkunft',
    article: 'die',
    plural: 'die Herkünfte',
    english: 'origin, heritage',
    example: 'Meine Herkunft ist Österreich.',
    exampleEnglish: 'My origin is Austria.',
    difficulty: 'A1',
    topic: 'greetings'
  },

  // --- A1: Family & Friends ---
  {
    id: 'vb-a1-fam1',
    german: 'Familie',
    article: 'die',
    plural: 'die Familien',
    english: 'family',
    example: 'Meine Familie lebt in Hamburg.',
    exampleEnglish: 'My family lives in Hamburg.',
    difficulty: 'A1',
    topic: 'family'
  },
  {
    id: 'vb-a1-fam2',
    german: 'Eltern',
    article: 'die',
    english: 'parents',
    example: 'Meine Eltern besuchen mich am Sonntag.',
    exampleEnglish: 'My parents are visiting me on Sunday.',
    difficulty: 'A1',
    topic: 'family'
  },
  {
    id: 'vb-a1-fam3',
    german: 'Sohn',
    article: 'der',
    plural: 'die Söhne',
    english: 'son',
    example: 'Ihr Sohn geht schon in die Schule.',
    exampleEnglish: 'Her son already goes to school.',
    difficulty: 'A1',
    topic: 'family'
  },
  {
    id: 'vb-a1-fam4',
    german: 'Tochter',
    article: 'die',
    plural: 'die Töchter',
    english: 'daughter',
    example: 'Unsere Tochter lernt fleißig Deutsch.',
    exampleEnglish: 'Our daughter is diligently learning German.',
    difficulty: 'A1',
    topic: 'family'
  },
  {
    id: 'vb-a1-fam5',
    german: 'Freund',
    article: 'der',
    plural: 'die Freunde',
    english: 'friend, boyfriend',
    example: 'Mein bester Freund heißt Jonas.',
    exampleEnglish: 'My best friend is called Jonas.',
    difficulty: 'A1',
    topic: 'family'
  },

  // --- A1: Food & Groceries ---
  {
    id: 'vb-a1-fd1',
    german: 'Apfel',
    article: 'der',
    plural: 'die Äpfel',
    english: 'apple',
    example: 'Ich esse jeden Tag einen frischen Apfel.',
    exampleEnglish: 'I eat a fresh apple every day.',
    difficulty: 'A1',
    topic: 'food'
  },
  {
    id: 'vb-a1-fd2',
    german: 'Käse',
    article: 'der',
    english: 'cheese',
    example: 'Möchtest du Käse auf das Brot?',
    exampleEnglish: 'Would you like cheese on the bread?',
    difficulty: 'A1',
    topic: 'food'
  },
  {
    id: 'vb-a1-fd3',
    german: 'Gemüse',
    article: 'das',
    english: 'vegetables',
    example: 'Frisches Gemüse ist sehr gesund.',
    exampleEnglish: 'Fresh vegetables are very healthy.',
    difficulty: 'A1',
    topic: 'food'
  },
  {
    id: 'vb-a1-fd4',
    german: 'Milch',
    article: 'die',
    english: 'milk',
    example: 'Trinkst du Kaffee mit Milch oder ohne?',
    exampleEnglish: 'Do you drink coffee with milk or without?',
    difficulty: 'A1',
    topic: 'food'
  },
  {
    id: 'vb-a1-fd5',
    german: 'Rechnung',
    article: 'die',
    plural: 'die Rechnungen',
    english: 'bill, check',
    example: 'Zahlen, bitte! Wir hätten gern die Rechnung.',
    exampleEnglish: 'Pay please! We would like the bill.',
    difficulty: 'A1',
    topic: 'food'
  },

  // --- A1: Travel & Transport ---
  {
    id: 'vb-a1-tr1',
    german: 'Fahrkarte',
    article: 'die',
    plural: 'die Fahrkarten',
    english: 'ticket (for travel)',
    example: 'Ich kaufe eine Fahrkarte am Automaten.',
    exampleEnglish: 'I buy a ticket at the machine.',
    difficulty: 'A1',
    topic: 'travel'
  },
  {
    id: 'vb-a1-tr2',
    german: 'Gleis',
    article: 'das',
    plural: 'die Gleise',
    english: 'platform, track',
    example: 'Der Zug nach Frankfurt fährt auf Gleis 4 ab.',
    exampleEnglish: 'The train to Frankfurt departs from track 4.',
    difficulty: 'A1',
    topic: 'travel'
  },
  {
    id: 'vb-a1-tr3',
    german: 'Koffer',
    article: 'der',
    plural: 'die Koffer',
    english: 'suitcase',
    example: 'Mein Koffer wiegt zwanzig Kilo.',
    exampleEnglish: 'My suitcase weighs twenty kilograms.',
    difficulty: 'A1',
    topic: 'travel'
  },
  {
    id: 'vb-a1-tr4',
    german: 'Haltestelle',
    article: 'die',
    plural: 'die Haltestellen',
    english: 'bus/tram stop',
    example: 'Die nächste Haltestelle ist der Marktplatz.',
    exampleEnglish: 'The next stop is the market square.',
    difficulty: 'A1',
    topic: 'travel'
  },
  {
    id: 'vb-a1-tr5',
    german: 'einsteigen',
    english: 'to board, to get in',
    example: 'Bitte alle einsteigen, die Türen schließen!',
    exampleEnglish: 'All board please, doors are closing!',
    difficulty: 'A1',
    topic: 'travel'
  },

  // --- A1: Daily Routine & Time ---
  {
    id: 'vb-a1-rt1',
    german: 'Wecker',
    article: 'der',
    plural: 'die Wecker',
    english: 'alarm clock',
    example: 'Mein Wecker klingelt um sechs Uhr morgens.',
    exampleEnglish: 'My alarm clock rings at six in the morning.',
    difficulty: 'A1',
    topic: 'routine'
  },
  {
    id: 'vb-a1-rt2',
    german: 'duschen',
    english: 'to take a shower',
    example: 'Ich dusche jeden Morgen warm.',
    exampleEnglish: 'I take a warm shower every morning.',
    difficulty: 'A1',
    topic: 'routine'
  },
  {
    id: 'vb-a1-rt3',
    german: 'Mittagessen',
    article: 'das',
    plural: 'die Mittagessen',
    english: 'lunch',
    example: 'Um zwölf Uhr mache ich eine Pause für das Mittagessen.',
    exampleEnglish: 'At twelve o’clock I take a break for lunch.',
    difficulty: 'A1',
    topic: 'routine'
  },
  {
    id: 'vb-a1-rt4',
    german: 'schlafen',
    english: 'to sleep',
    example: 'Am Wochenende schlafe ich gern lange.',
    exampleEnglish: 'On weekends I like to sleep in late.',
    difficulty: 'A1',
    topic: 'routine'
  },
  {
    id: 'vb-a1-rt5',
    german: 'Feierabend',
    article: 'der',
    english: 'end of the workday / closing time',
    example: 'Endlich Feierabend! Ich fahre nach Hause.',
    exampleEnglish: 'Finally off work! I am going home.',
    difficulty: 'A1',
    topic: 'routine'
  },

  // --- A2: Work & Profession ---
  {
    id: 'vb-a2-wk1',
    german: 'Bewerbung',
    article: 'die',
    plural: 'die Bewerbungen',
    english: 'job application',
    example: 'Ich habe gestern eine Bewerbung per E-Mail geschickt.',
    exampleEnglish: 'I sent a job application via email yesterday.',
    difficulty: 'A2',
    topic: 'work'
  },
  {
    id: 'vb-a2-wk2',
    german: 'Kollege',
    article: 'der',
    plural: 'die Kollegen',
    english: 'colleague, coworker (male)',
    example: 'Meine Kollegen sind hilfsbereit und freundlich.',
    exampleEnglish: 'My colleagues are helpful and friendly.',
    difficulty: 'A2',
    topic: 'work'
  },
  {
    id: 'vb-a2-wk3',
    german: 'Erfahrung',
    article: 'die',
    plural: 'die Erfahrungen',
    english: 'experience',
    example: 'Ich habe drei Jahre Berufserfahrung im Verkauf.',
    exampleEnglish: 'I have three years of professional experience in sales.',
    difficulty: 'A2',
    topic: 'work'
  },
  {
    id: 'vb-a2-wk4',
    german: 'Besprechung',
    article: 'die',
    plural: 'die Besprechungen',
    english: 'meeting, conference',
    example: 'Die Besprechung beginnt pünktlich um zehn Uhr.',
    exampleEnglish: 'The meeting starts punctually at ten o’clock.',
    difficulty: 'A2',
    topic: 'work'
  },
  {
    id: 'vb-a2-wk5',
    german: 'Gehalt',
    article: 'das',
    plural: 'die Gehälter',
    english: 'salary, wage',
    example: 'Das Gehalt wird am Monatsende überwiesen.',
    exampleEnglish: 'The salary is transferred at the end of the month.',
    difficulty: 'A2',
    topic: 'work'
  },

  // --- A2: Shopping & Clothes ---
  {
    id: 'vb-a2-sh1',
    german: 'Kleidung',
    article: 'die',
    english: 'clothing, clothes',
    example: 'Im Winter brauche ich warme Kleidung.',
    exampleEnglish: 'In winter I need warm clothing.',
    difficulty: 'A2',
    topic: 'shopping'
  },
  {
    id: 'vb-a2-sh2',
    german: 'Größe',
    article: 'die',
    plural: 'die Größen',
    english: 'size',
    example: 'Haben Sie diese Jacke in Größe M?',
    exampleEnglish: 'Do you have this jacket in size M?',
    difficulty: 'A2',
    topic: 'shopping'
  },
  {
    id: 'vb-a2-sh3',
    german: 'anprobieren',
    english: 'to try on (clothes)',
    example: 'Darf ich die Hose in der Umkleidekabine anprobieren?',
    exampleEnglish: 'May I try on the pants in the fitting room?',
    difficulty: 'A2',
    topic: 'shopping'
  },
  {
    id: 'vb-a2-sh4',
    german: 'Rabatt',
    article: 'der',
    plural: 'die Rabatte',
    english: 'discount',
    example: 'Heute gibt es zwanzig Prozent Rabatt auf Schuhe.',
    exampleEnglish: 'Today there is a twenty percent discount on shoes.',
    difficulty: 'A2',
    topic: 'shopping'
  },
  {
    id: 'vb-a2-sh5',
    german: 'umtauschen',
    english: 'to exchange (an item)',
    example: 'Kann ich das Hemd mit dem Kassenzettel umtauschen?',
    exampleEnglish: 'Can I exchange the shirt with the receipt?',
    difficulty: 'A2',
    topic: 'shopping'
  },

  // --- A2: Health & Body ---
  {
    id: 'vb-a2-hl1',
    german: 'Kopfschmerzen',
    article: 'die',
    english: 'headache',
    example: 'Ich habe seit heute Morgen starke Kopfschmerzen.',
    exampleEnglish: 'I have had a bad headache since this morning.',
    difficulty: 'A2',
    topic: 'health'
  },
  {
    id: 'vb-a2-hl2',
    german: 'Medikament',
    article: 'das',
    plural: 'die Medikamente',
    english: 'medicine, medication',
    example: 'Der Arzt hat mir ein gutes Medikament verschrieben.',
    exampleEnglish: 'The doctor prescribed me good medication.',
    difficulty: 'A2',
    topic: 'health'
  },
  {
    id: 'vb-a2-hl3',
    german: 'Apotheke',
    article: 'die',
    plural: 'die Apotheken',
    english: 'pharmacy',
    example: 'Die Notdienst-Apotheke hat auch nachts geöffnet.',
    exampleEnglish: 'The on-duty emergency pharmacy is also open at night.',
    difficulty: 'A2',
    topic: 'health'
  },
  {
    id: 'vb-a2-hl4',
    german: 'untersuchen',
    english: 'to examine (medically)',
    example: 'Die Ärztin untersucht das verletzte Knie.',
    exampleEnglish: 'The doctor examines the injured knee.',
    difficulty: 'A2',
    topic: 'health'
  },
  {
    id: 'vb-a2-hl5',
    german: 'Besserung',
    article: 'die',
    english: 'recovery, improvement',
    example: 'Gute Besserung! Werde schnell wieder gesund.',
    exampleEnglish: 'Get well soon! Recover quickly.',
    difficulty: 'A2',
    topic: 'health'
  },

  // --- A2: Housing & Home ---
  {
    id: 'vb-a2-hs1',
    german: 'Wohnung',
    article: 'die',
    plural: 'die Wohnungen',
    english: 'apartment, flat',
    example: 'Wir suchen eine Dreizimmerwohnung im Zentrum.',
    exampleEnglish: 'We are looking for a three-room apartment in the center.',
    difficulty: 'A2',
    topic: 'housing'
  },
  {
    id: 'vb-a2-hs2',
    german: 'Miete',
    article: 'die',
    plural: 'die Mieten',
    english: 'rent',
    example: 'Die Miete beträgt achthundert Euro inklusive Nebenkosten.',
    exampleEnglish: 'The rent is eight hundred euros including utilities.',
    difficulty: 'A2',
    topic: 'housing'
  },
  {
    id: 'vb-a2-hs3',
    german: 'Vermieter',
    article: 'der',
    plural: 'die Vermieter',
    english: 'landlord',
    example: 'Unser Vermieter repariert die Heizung schnell.',
    exampleEnglish: 'Our landlord repairs the heating quickly.',
    difficulty: 'A2',
    topic: 'housing'
  },
  {
    id: 'vb-a2-hs4',
    german: 'Möbel',
    article: 'die',
    english: 'furniture',
    example: 'Wir kaufen moderne Holzmöbel für das Wohnzimmer.',
    exampleEnglish: 'We are buying modern wooden furniture for the living room.',
    difficulty: 'A2',
    topic: 'housing'
  },
  {
    id: 'vb-a2-hs5',
    german: 'umziehen',
    english: 'to move (houses / residence)',
    example: 'Nächsten Monat ziehen wir nach Köln um.',
    exampleEnglish: 'Next month we are moving to Cologne.',
    difficulty: 'A2',
    topic: 'housing'
  },

  // --- B1: Work, Education & Society ---
  {
    id: 'vb-b1-wk1',
    german: 'Verantwortung',
    article: 'die',
    plural: 'die Verantwortungen',
    english: 'responsibility',
    example: 'Als Projektleiter trage ich große Verantwortung.',
    exampleEnglish: 'As project leader, I bear great responsibility.',
    difficulty: 'B1',
    topic: 'work'
  },
  {
    id: 'vb-b1-wk2',
    german: 'Weiterbildung',
    article: 'die',
    plural: 'die Weiterbildungen',
    english: 'further training, professional development',
    example: 'Die Firma unterstützt kontinuierliche Weiterbildung.',
    exampleEnglish: 'The company supports continuous professional development.',
    difficulty: 'B1',
    topic: 'work'
  },
  {
    id: 'vb-b1-wk3',
    german: 'Vereinbarung',
    article: 'die',
    plural: 'die Vereinbarungen',
    english: 'agreement, arrangement',
    example: 'Wir haben eine schriftliche Vereinbarung getroffen.',
    exampleEnglish: 'We have made a written agreement.',
    difficulty: 'B1',
    topic: 'work'
  },
  {
    id: 'vb-b1-wk4',
    german: 'Voraussetzung',
    article: 'die',
    plural: 'die Voraussetzungen',
    english: 'requirement, prerequisite',
    example: 'Gute Deutschkenntnisse sind eine wichtige Voraussetzung.',
    exampleEnglish: 'Good German skills are an important prerequisite.',
    difficulty: 'B1',
    topic: 'work'
  },
  {
    id: 'vb-b1-wk5',
    german: 'selbstständig',
    english: 'independent, self-employed',
    example: 'Sie arbeitet seit zwei Jahren selbstständig als Designerin.',
    exampleEnglish: 'She has been working self-employed as a designer for two years.',
    difficulty: 'B1',
    topic: 'work'
  },

  // --- B1: Technology & Communication ---
  {
    id: 'vb-b1-tc1',
    german: 'Datenschutz',
    article: 'der',
    english: 'data protection, privacy',
    example: 'Datenschutz hat in Europa eine hohe Priorität.',
    exampleEnglish: 'Data protection has a high priority in Europe.',
    difficulty: 'B1',
    topic: 'technology'
  },
  {
    id: 'vb-b1-tc2',
    german: 'Herunterladen',
    article: 'das',
    english: 'downloading',
    example: 'Das Herunterladen der Datei dauert nur wenige Sekunden.',
    exampleEnglish: 'Downloading the file only takes a few seconds.',
    difficulty: 'B1',
    topic: 'technology'
  },
  {
    id: 'vb-b1-tc3',
    german: 'künstliche Intelligenz',
    article: 'die',
    english: 'artificial intelligence',
    example: 'Künstliche Intelligenz verändert viele Arbeitsbereiche.',
    exampleEnglish: 'Artificial intelligence is changing many fields of work.',
    difficulty: 'B1',
    topic: 'technology'
  },
  {
    id: 'vb-b1-tc4',
    german: 'Netzwerk',
    article: 'das',
    plural: 'die Netzwerke',
    english: 'network',
    example: 'Ein berufliches Netzwerk hilft bei der Jobsuche.',
    exampleEnglish: 'A professional network helps with the job search.',
    difficulty: 'B1',
    topic: 'technology'
  },

  // --- B1: Weather & Environment ---
  {
    id: 'vb-b1-wt1',
    german: 'Umweltschutz',
    article: 'der',
    english: 'environmental protection',
    example: 'Mülltrennung ist ein wichtiger Beitrag zum Umweltschutz.',
    exampleEnglish: 'Waste separation is an important contribution to environmental protection.',
    difficulty: 'B1',
    topic: 'weather'
  },
  {
    id: 'vb-b1-wt2',
    german: 'Klimawandel',
    article: 'der',
    english: 'climate change',
    example: 'Erneuerbare Energien helfen im Kampf gegen den Klimawandel.',
    exampleEnglish: 'Renewable energies help in the fight against climate change.',
    difficulty: 'B1',
    topic: 'weather'
  },
  {
    id: 'vb-b1-wt3',
    german: 'Gewitter',
    article: 'das',
    plural: 'die Gewitter',
    english: 'thunderstorm',
    example: 'Nach der Hitze gab es gestern ein kräftiges Gewitter.',
    exampleEnglish: 'After the heat, there was a strong thunderstorm yesterday.',
    difficulty: 'B1',
    topic: 'weather'
  }
];

/**
 * Procedural original word generator that provides unlimited fresh vocabulary
 * if the network or LLM API is unavailable.
 */
export function generateProceduralVocab(topic: string, level: Difficulty, count: number = 5): VocabularyWord[] {
  const timeId = Date.now();
  const pool = ORIGINAL_VOCAB_BANK.filter(w => 
    (topic === 'all' || w.topic === topic) && 
    (w.difficulty === level || !w.difficulty)
  );

  const baseWords = pool.length > 0 ? pool : ORIGINAL_VOCAB_BANK;
  const result: VocabularyWord[] = [];
  
  for (let i = 0; i < count; i++) {
    const pick = baseWords[(i + Math.floor(Math.random() * baseWords.length)) % baseWords.length];
    result.push({
      ...pick,
      id: `proc-v-${timeId}-${i}`,
      isCustom: true
    });
  }

  return result;
}

/**
 * Generates dynamic quiz questions on-the-fly directly from any vocabulary list.
 * Supports:
 * - multiple-choice (Pick the correct German or English translation)
 * - fill-in-blank (Fill in the missing German word in the example sentence)
 * - translation-de-en (Translate German word/sentence to English)
 * - translation-en-de (Translate English word into German with article)
 */
export function generateQuizFromVocab(
  vocabList: VocabularyWord[],
  count: number,
  config: {
    types?: QuestionType[];
    topic?: string;
    level?: Difficulty | 'all';
  }
): Question[] {
  const allowedTypes: QuestionType[] = config.types && config.types.length > 0 
    ? config.types 
    : ['multiple-choice', 'fill-in-blank', 'translation-de-en', 'translation-en-de'];

  let candidateVocab = vocabList;
  if (config.topic && config.topic !== 'all') {
    candidateVocab = candidateVocab.filter(w => w.topic === config.topic);
  }
  if (config.level && config.level !== 'all') {
    candidateVocab = candidateVocab.filter(w => w.difficulty === config.level);
  }

  if (candidateVocab.length === 0) {
    candidateVocab = vocabList;
  }

  const shuffled = [...candidateVocab].sort(() => Math.random() - 0.5);
  const questions: Question[] = [];
  const totalToMake = Math.min(count, Math.max(shuffled.length * 2, 50));

  for (let i = 0; i < totalToMake; i++) {
    const word = shuffled[i % shuffled.length];
    const qType = allowedTypes[i % allowedTypes.length];
    const qId = `dyn-q-${Date.now()}-${i}`;
    const fullGerman = word.article ? `${word.article} ${word.german}` : word.german;

    if (qType === 'multiple-choice') {
      // Pick 3 distractors from candidateVocab
      const otherWords = candidateVocab.filter(w => w.id !== word.id);
      const distractors = otherWords.sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.english);
      const options = [word.english, ...distractors].sort(() => Math.random() - 0.5);

      questions.push({
        id: qId,
        lesson: 1,
        topic: 'quiz',
        difficulty: word.difficulty || 'A1',
        questionType: 'multiple-choice',
        question: `Was bedeutet "${fullGerman}" auf Englisch?`,
        options,
        correctAnswer: word.english,
        explanation: `"${fullGerman}" bedeutet "${word.english}". Beispiel: ${word.example}`,
        englishMeaning: word.exampleEnglish
      });
    } else if (qType === 'fill-in-blank') {
      // Blank out the target word in its example sentence
      const targetRegex = new RegExp(`\\b${word.german}\\b`, 'i');
      let blankedSentence = word.example;
      if (targetRegex.test(word.example)) {
        blankedSentence = word.example.replace(targetRegex, '_____');
      } else {
        blankedSentence = `Das deutsche Wort für "${word.english}" ist _____.`;
      }

      questions.push({
        id: qId,
        lesson: 1,
        topic: 'quiz',
        difficulty: word.difficulty || 'A1',
        questionType: 'fill-in-blank',
        question: `${blankedSentence} (${word.english})`,
        correctAnswer: word.german,
        explanation: `Richtig ist "${word.german}". Ganzer Satz: "${word.example}" (${word.exampleEnglish})`,
        englishMeaning: word.exampleEnglish
      });
    } else if (qType === 'translation-de-en') {
      questions.push({
        id: qId,
        lesson: 1,
        topic: 'quiz',
        difficulty: word.difficulty || 'A1',
        questionType: 'translation-de-en',
        question: `Übersetze ins Englische: "${word.example}"`,
        correctAnswer: word.exampleEnglish,
        explanation: `Die Bedeutung ist: "${word.exampleEnglish}"`,
        englishMeaning: `Vokabel: ${fullGerman} = ${word.english}`
      });
    } else { // translation-en-de
      questions.push({
        id: qId,
        lesson: 1,
        topic: 'quiz',
        difficulty: word.difficulty || 'A1',
        questionType: 'translation-en-de',
        question: `Übersetze ins Deutsche: "${word.english}" (mit Artikel falls Nomen)`,
        correctAnswer: fullGerman,
        explanation: `Auf Deutsch heißt es "${fullGerman}". Beispiel: ${word.example}`,
        englishMeaning: word.exampleEnglish
      });
    }
  }

  return questions.sort(() => Math.random() - 0.5);
}
