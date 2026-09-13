import { ListeningExercise, Difficulty } from '../types';

export const ORIGINAL_LISTENING_EXERCISES: ListeningExercise[] = [
  // --- A1: Transcription (Diktat) ---
  {
    id: 'lis-a1-tx1',
    type: 'transcription',
    level: 'A1',
    topic: 'greetings',
    germanText: 'Guten Tag, mein Name ist Lisa Müller.',
    correctAnswer: 'Guten Tag, mein Name ist Lisa Müller.',
    englishTranslation: 'Good day, my name is Lisa Müller.',
    explanation: 'A standard polite German introduction with name declaration.'
  },
  {
    id: 'lis-a1-tx2',
    type: 'transcription',
    level: 'A1',
    topic: 'food',
    germanText: 'Ich trinke gerne Tee mit Zitrone.',
    correctAnswer: 'Ich trinke gerne Tee mit Zitrone.',
    englishTranslation: 'I like drinking tea with lemon.',
    explanation: '"gerne" indicates doing something gladly or with pleasure.'
  },
  {
    id: 'lis-a1-tx3',
    type: 'transcription',
    level: 'A1',
    topic: 'travel',
    germanText: 'Der Zug nach Hamburg hat zehn Minuten Verspätung.',
    correctAnswer: 'Der Zug nach Hamburg hat zehn Minuten Verspätung.',
    englishTranslation: 'The train to Hamburg is ten minutes delayed.',
    explanation: '"Verspätung" is delay; common announcement phrase.'
  },
  {
    id: 'lis-a1-tx4',
    type: 'transcription',
    level: 'A1',
    topic: 'routine',
    germanText: 'Um wie viel Uhr beginnt der Deutschkurs?',
    correctAnswer: 'Um wie viel Uhr beginnt der Deutschkurs?',
    englishTranslation: 'At what time does the German course begin?',
    explanation: '"Um wie viel Uhr" is the standard question asking for clock time.'
  },

  // --- A1: Meaning Comprehension ---
  {
    id: 'lis-a1-mn1',
    type: 'meaning',
    level: 'A1',
    topic: 'food',
    germanText: 'Entschuldigung, kann ich bitte noch ein Glas Wasser haben?',
    question: 'What is the speaker asking for?',
    options: [
      'A glass of water',
      'The restaurant bill',
      'A cup of black coffee',
      'The dessert menu'
    ],
    correctAnswer: 'A glass of water',
    englishTranslation: 'Excuse me, can I please have another glass of water?',
    explanation: '"ein Glas Wasser" means a glass of water.'
  },
  {
    id: 'lis-a1-mn2',
    type: 'meaning',
    level: 'A1',
    topic: 'travel',
    germanText: 'Achtung an Gleis zwei: Der Intercity-Express fährt jetzt ein.',
    question: 'Where is this announcement taking place?',
    options: [
      'At a train station platform',
      'At an airport departure gate',
      'Inside a supermarket',
      'At a cinema ticket counter'
    ],
    correctAnswer: 'At a train station platform',
    englishTranslation: 'Attention on track two: The Intercity-Express is now arriving.',
    explanation: '"Gleis zwei" (track/platform 2) and "Intercity-Express" (ICE) indicate a train station.'
  },
  {
    id: 'lis-a1-mn3',
    type: 'meaning',
    level: 'A1',
    topic: 'shopping',
    germanText: 'Das rote T-Shirt kostet nur fünfzehn Euro und fünfzig Cent.',
    question: 'How much does the red shirt cost?',
    options: [
      '€15.50',
      '€50.15',
      '€5.50',
      '€15.00'
    ],
    correctAnswer: '€15.50',
    englishTranslation: 'The red t-shirt costs only fifteen euros and fifty cents.',
    explanation: '"fünfzehn" = 15, "fünfzig" = 50.'
  },

  // --- A1: Dialogue Comprehension ---
  {
    id: 'lis-a1-dg1',
    type: 'dialogue-comprehension',
    level: 'A1',
    topic: 'food',
    speakerRole: 'Bäckerei (Bakery)',
    germanText: 'Kunde: Guten Morgen! Ich hätte gerne drei Brötchen und ein Vollkornbrot.\nVerkäuferin: Sehr gerne! Das macht zusammen vier Euro zwanzig.',
    question: 'Was kauft der Kunde? (What does the customer buy?)',
    options: [
      'Drei Brötchen und ein Vollkornbrot',
      'Zwei Kuchen und einen Kaffee',
      'Vier Brötchen und ein Weißbrot',
      'Nur ein Glas Wasser'
    ],
    correctAnswer: 'Drei Brötchen und ein Vollkornbrot',
    englishTranslation: 'Customer: Good morning! I would like three bread rolls and one whole-grain bread.\nSeller: With pleasure! That comes to four euros twenty together.',
    explanation: 'The customer explicitly requests "drei Brötchen und ein Vollkornbrot".'
  },
  {
    id: 'lis-a1-dg2',
    type: 'dialogue-comprehension',
    level: 'A1',
    topic: 'routine',
    speakerRole: 'Verabredung (Meeting up)',
    germanText: 'Felix: Hallo Sarah, hast du am Samstagabend Zeit für das Kino?\nSarah: Am Samstag muss ich leider arbeiten, aber am Sonntag habe ich den ganzen Tag frei!',
    question: 'Wann hat Sarah Zeit für das Treffen? (When is Sarah free?)',
    options: [
      'Am Sonntag',
      'Am Samstagabend',
      'Am Freitagnachmittag',
      'Gar nicht am Wochenende'
    ],
    correctAnswer: 'Am Sonntag',
    englishTranslation: 'Felix: Hello Sarah, do you have time for the cinema on Saturday evening?\nSarah: On Saturday unfortunately I have to work, but on Sunday I am free all day!',
    explanation: 'Sarah says: "am Samstag muss ich arbeiten, aber am Sonntag habe ich ... frei".'
  },

  // --- A2: Dialogue Comprehension ---
  {
    id: 'lis-a2-dg1',
    type: 'dialogue-comprehension',
    level: 'A2',
    topic: 'health',
    speakerRole: 'Beim Arzt (At the Doctor)',
    germanText: 'Arzthelferin: Praxis Dr. Weber, guten Tag.\nPatient: Guten Tag, ich fühle mich seit gestern krank und habe hohes Fieber. Kann ich heute vorbeikommen?\nArzthelferin: Ja, kommen Sie bitte um elf Uhr dreißig in die Notfallsprechstunde.',
    question: 'Um wie viel Uhr soll der Patient in die Praxis kommen?',
    options: [
      'Um 11:30 Uhr',
      'Um 10:30 Uhr',
      'Um 12:00 Uhr',
      'Erst morgen früh'
    ],
    correctAnswer: 'Um 11:30 Uhr',
    englishTranslation: 'Receptionist: Dr. Weber practice, good day.\nPatient: Good day, I have been feeling sick since yesterday and have a high fever. Can I come by today?\nReceptionist: Yes, please come at 11:30 to the emergency consultation.',
    explanation: '"elf Uhr dreißig" corresponds to 11:30.'
  },

  // --- B1: Dialogue & Speech Comprehension ---
  {
    id: 'lis-b1-dg1',
    type: 'dialogue-comprehension',
    level: 'B1',
    topic: 'work',
    speakerRole: 'Bürobesprechung (Office Meeting)',
    germanText: 'Chefin: Wir müssen die Präsentation für den Kunden bis Donnerstag fertigstellen. Herr Meyer, können Sie die Grafiken bis morgen überarbeiten?\nMeyer: Kein Problem, ich kümmere mich heute Nachmittag sofort darum und schicke Ihnen den Entwurf.',
    question: 'Wann wird Herr Meyer den Entwurf für die Grafiken vorbereiten?',
    options: [
      'Heute Nachmittag',
      'Erst am Donnerstag',
      'Nächste Woche',
      'Gar nicht'
    ],
    correctAnswer: 'Heute Nachmittag',
    englishTranslation: 'Boss: We must finish the presentation for the customer by Thursday. Mr. Meyer, can you revise the graphics by tomorrow?\nMeyer: No problem, I will take care of it this afternoon right away and send you the draft.',
    explanation: 'Mr. Meyer says: "ich kümmere mich heute Nachmittag sofort darum".'
  }
];

export function generateProceduralListening(
  level: Difficulty,
  topic: string,
  count: number = 4
): ListeningExercise[] {
  const filtered = ORIGINAL_LISTENING_EXERCISES.filter(ex => 
    ex.level === level || (level === 'A1+' && ex.level === 'A1')
  );

  const pool = filtered.length > 0 ? filtered : ORIGINAL_LISTENING_EXERCISES;
  const exercises: ListeningExercise[] = [];
  const timeId = Date.now();

  for (let i = 0; i < count; i++) {
    const base = pool[(i + Math.floor(Math.random() * pool.length)) % pool.length];
    exercises.push({
      ...base,
      id: `proc-lis-${timeId}-${i}`,
    });
  }

  return exercises;
}
