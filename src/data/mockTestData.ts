export interface MockQuestion {
  id: string;
  section: 'Wortschatz' | 'Grammatik' | 'Lesen' | 'Hören';
  questionNumber: number;
  question: string;
  context?: string; // For reading texts or dialogue scenarios
  audioScript?: string; // For listening questions
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const MOCK_EXAM_QUESTIONS: MockQuestion[] = [
  // ==========================================
  // Teil 1 – Wortschatz (Questions 1 - 10)
  // ==========================================
  {
    id: 'm-w1',
    section: 'Wortschatz',
    questionNumber: 1,
    question: 'Was ist das Gegenteil von "groß"?',
    options: ['schön', 'klein', 'gut', 'schlecht'],
    correctAnswer: 'klein',
    explanation: '"groß" means big/tall, and "klein" means small/short.'
  },
  {
    id: 'm-w2',
    section: 'Wortschatz',
    questionNumber: 2,
    question: 'Welches Wort passt? "Ich trinke morgens gerne eine Tasse ___."',
    options: ['Kaffee', 'Brot', 'Tisch', 'Zeitung'],
    correctAnswer: 'Kaffee',
    explanation: 'Kaffee is a drink, whereas Brot (bread), Tisch (table), and Zeitung (newspaper) are not.'
  },
  {
    id: 'm-w3',
    section: 'Wortschatz',
    questionNumber: 3,
    question: 'Wie heißt der Tag nach Donnerstag?',
    options: ['Mittwoch', 'Freitag', 'Samstag', 'Dienstag'],
    correctAnswer: 'Freitag',
    explanation: 'Freitag (Friday) comes immediately after Donnerstag (Thursday).'
  },
  {
    id: 'm-w4',
    section: 'Wortschatz',
    questionNumber: 4,
    question: 'Was gehört NICHT zu den Jahreszeiten?',
    options: ['Sommer', 'Herbst', 'Montag', 'Winter'],
    correctAnswer: 'Montag',
    explanation: 'Montag is a day of the week, while Sommer, Herbst, and Winter are seasons.'
  },
  {
    id: 'm-w5',
    section: 'Wortschatz',
    questionNumber: 5,
    question: 'Was ist ein "Termin"?',
    options: ['An appointment', 'A train station', 'A vegetable', 'A suitcase'],
    correctAnswer: 'An appointment',
    explanation: 'Ein "Termin" is an appointment or scheduled meeting.'
  },
  {
    id: 'm-w6',
    section: 'Wortschatz',
    questionNumber: 6,
    question: 'Ergänzen Sie: "Ich habe zwei ___, einen Bruder und eine Schwester."',
    options: ['Kinder', 'Geschwister', 'Eltern', 'Freunde'],
    correctAnswer: 'Geschwister',
    explanation: '"Geschwister" means siblings (brother and sister together).'
  },
  {
    id: 'm-w7',
    section: 'Wortschatz',
    questionNumber: 7,
    question: 'Was bedeutet "billig"?',
    options: ['expensive', 'cheap', 'fast', 'heavy'],
    correctAnswer: 'cheap',
    explanation: '"billig" (or preiswert) means cheap or inexpensive. Its opposite is "teuer".'
  },
  {
    id: 'm-w8',
    section: 'Wortschatz',
    questionNumber: 8,
    question: 'Wo kauft man Brot und Brötchen?',
    options: ['In der Bäckerei', 'In der Apotheke', 'Im Kino', 'Am Bahnhof'],
    correctAnswer: 'In der Bäckerei',
    explanation: 'Bread and bread rolls are bought in the bakery (Bäckerei).'
  },
  {
    id: 'm-w9',
    section: 'Wortschatz',
    questionNumber: 9,
    question: 'Welches Verb bedeutet "to buy"?',
    options: ['kaufen', 'verkaufen', 'bezahlen', 'kosten'],
    correctAnswer: 'kaufen',
    explanation: '"kaufen" is to buy. "verkaufen" is to sell.'
  },
  {
    id: 'm-w10',
    section: 'Wortschatz',
    questionNumber: 10,
    question: 'Was ist das Gegenteil von "hell"?',
    options: ['dunkel', 'kalt', 'warm', 'schwer'],
    correctAnswer: 'dunkel',
    explanation: '"hell" (bright/light) contrasts with "dunkel" (dark).'
  },

  // ==========================================
  // Teil 2 – Grammatik (Questions 11 - 25)
  // ==========================================
  {
    id: 'm-g11',
    section: 'Grammatik',
    questionNumber: 11,
    question: 'Woher ___ du?',
    options: ['komme', 'kommst', 'kommt', 'kommen'],
    correctAnswer: 'kommst',
    explanation: 'The verb "kommen" conjugates as "du kommst" with the "-st" ending.'
  },
  {
    id: 'm-g12',
    section: 'Grammatik',
    questionNumber: 12,
    question: '___ Tisch ist sehr modern.',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswer: 'Der',
    explanation: '"Tisch" is masculine nominative, so the definite article is "Der".'
  },
  {
    id: 'm-g13',
    section: 'Grammatik',
    questionNumber: 13,
    question: 'Hast du ___ Buch?',
    options: ['ein', 'einen', 'eine', 'einem'],
    correctAnswer: 'ein',
    explanation: '"Buch" is neuter (das Buch). In the accusative case, neuter remains "ein".'
  },
  {
    id: 'm-g14',
    section: 'Grammatik',
    questionNumber: 14,
    question: 'Ich kaufe ___ Apfel.',
    options: ['der', 'den', 'das', 'dem'],
    correctAnswer: 'den',
    explanation: '"Apfel" is masculine (der Apfel). Direct objects in accusative change "der" to "den".'
  },
  {
    id: 'm-g15',
    section: 'Grammatik',
    questionNumber: 15,
    question: 'Wir ___ heute leider nicht schwimmen gehen. Wir haben keine Zeit.',
    options: ['können', 'kann', 'könnt', 'kannst'],
    correctAnswer: 'können',
    explanation: 'The plural 1st person pronoun "wir" takes "können".'
  },
  {
    id: 'm-g16',
    section: 'Grammatik',
    questionNumber: 16,
    question: 'Wohin fahrt ihr am Wochenende? – Wir fahren ___ München.',
    options: ['nach', 'in', 'zu', 'aus'],
    correctAnswer: 'nach',
    explanation: 'For cities and most countries without articles, we use "nach".'
  },
  {
    id: 'm-g17',
    section: 'Grammatik',
    questionNumber: 17,
    question: 'Er ___ jeden Tag um sieben Uhr auf.',
    options: ['steht', 'stehe', 'stehen', 'stehst'],
    correctAnswer: 'steht',
    explanation: 'The separable verb "aufstehen": "Er steht ... auf".'
  },
  {
    id: 'm-g18',
    section: 'Grammatik',
    questionNumber: 18,
    question: 'Das ist ___ Tasche von Maria.',
    options: ['die', 'der', 'das', 'den'],
    correctAnswer: 'die',
    explanation: '"Tasche" is feminine (die Tasche).'
  },
  {
    id: 'm-g19',
    section: 'Grammatik',
    questionNumber: 19,
    question: 'Welcher Satz hat die richtige Wortstellung?',
    options: [
      'Heute ich lerne Deutsch.',
      'Heute lerne ich Deutsch.',
      'Ich heute lerne Deutsch.',
      'Deutsch heute ich lerne.'
    ],
    correctAnswer: 'Heute lerne ich Deutsch.',
    explanation: 'Verb-second rule (V2): If the adverb "Heute" occupies position 1, the verb "lerne" must be position 2, followed by the subject "ich".'
  },
  {
    id: 'm-g20',
    section: 'Grammatik',
    questionNumber: 20,
    question: 'Peter, ___ bitte die Tür zu!',
    options: ['mach', 'machst', 'macht', 'machen'],
    correctAnswer: 'mach',
    explanation: 'Informal singular imperative (du) of "machen" is "mach!".'
  },
  {
    id: 'm-g21',
    section: 'Grammatik',
    questionNumber: 21,
    question: 'Entschuldigung, wie viel Uhr ___ es?',
    options: ['ist', 'hat', 'macht', 'gibt'],
    correctAnswer: 'ist',
    explanation: 'The standard idiom for asking the time is "Wie viel Uhr ist es?" (or "Wie spät ist es?").'
  },
  {
    id: 'm-g22',
    section: 'Grammatik',
    questionNumber: 22,
    question: 'Mein Geburtstag ist ___ 15. Mai.',
    options: ['am', 'im', 'um', 'an'],
    correctAnswer: 'am',
    explanation: 'Days and specific calendar dates take the preposition "am" (an dem).'
  },
  {
    id: 'm-g23',
    section: 'Grammatik',
    questionNumber: 23,
    question: 'Ich habe gestern einen Brief ___.',
    options: ['geschrieben', 'schreiben', 'schrieb', 'geschreibt'],
    correctAnswer: 'geschrieben',
    explanation: 'The past participle (Partizip II) of "schreiben" is irregular: "geschrieben".'
  },
  {
    id: 'm-g24',
    section: 'Grammatik',
    questionNumber: 24,
    question: 'Ist das dein Fahrrad? – Ja, das ist ___ Fahrrad.',
    options: ['mein', 'meine', 'meinen', 'meines'],
    correctAnswer: 'mein',
    explanation: '"Fahrrad" is neuter (das Fahrrad), so the possessive article in nominative is "mein".'
  },
  {
    id: 'm-g25',
    section: 'Grammatik',
    questionNumber: 25,
    question: 'Ich trinke keinen Kaffee, ___ ich trinke Tee.',
    options: ['sondern', 'aber', 'und', 'oder'],
    correctAnswer: 'sondern',
    explanation: 'After a negative ("keinen Kaffee"), we use "sondern" to state the positive replacement ("but rather").'
  },

  // ==========================================
  // Teil 3 – Lesen (Questions 26 - 30)
  // ==========================================
  {
    id: 'm-l26',
    section: 'Lesen',
    questionNumber: 26,
    context: 'Liebe Julia, danke für die Einladung zu deiner Geburtstagsparty am Samstag. Ich komme sehr gerne! Ich bringe einen Schokoladenkuchen mit. Bis Samstag! Dein Markus',
    question: 'Was bringt Markus zur Party mit?',
    options: ['Einen Salat', 'Einen Schokoladenkuchen', 'Getränke', 'Ein Buch'],
    correctAnswer: 'Einen Schokoladenkuchen',
    explanation: 'Markus explicitly writes: "Ich bringe einen Schokoladenkuchen mit."'
  },
  {
    id: 'm-l27',
    section: 'Lesen',
    questionNumber: 27,
    context: 'Hinweisschild am Supermarkt: "Öffnungszeiten: Montag bis Freitag von 08:00 bis 20:00 Uhr. Samstag von 08:00 bis 18:00 Uhr. Sonntag geschlossen."',
    question: 'Kann man am Samstag um 19:00 Uhr einkaufen?',
    options: ['Nein, der Supermarkt schließt um 18:00 Uhr', 'Ja, bis 20:00 Uhr', 'Ja, rund um die Uhr', 'Nur mit Voranmeldung'],
    correctAnswer: 'Nein, der Supermarkt schließt um 18:00 Uhr',
    explanation: 'The notice states Saturday is open from 08:00 to 18:00, so at 19:00 it is closed.'
  },
  {
    id: 'm-l28',
    section: 'Lesen',
    questionNumber: 28,
    context: 'Aushang am Sprachinstitut: "Der Deutschkurs A1 findet im Raum 204 statt. Beginn: Montag, 9:00 Uhr. Bitte bringen Sie das Kursbuch und ein Notizheft mit."',
    question: 'In welchem Raum findet der Kurs statt?',
    options: ['Raum 104', 'Raum 204', 'Raum 304', 'Im Sekretariat'],
    correctAnswer: 'Raum 204',
    explanation: 'The announcement clearly states: "findet im Raum 204 statt".'
  },
  {
    id: 'm-l29',
    section: 'Lesen',
    questionNumber: 29,
    context: 'E-Mail von Frau Weber: "Sehr geehrter Herr Meyer, leider muss ich unseren Termin am Donnerstag absagen, weil ich krank bin. Können wir uns am Freitag um 14:00 Uhr treffen?"',
    question: 'Warum sagt Frau Weber den Termin am Donnerstag ab?',
    options: ['Sie hat keine Zeit', 'Sie ist krank', 'Sie hat Urlaub', 'Sie ist verreist'],
    correctAnswer: 'Sie ist krank',
    explanation: 'Frau Weber writes: "weil ich krank bin" (because I am sick).'
  },
  {
    id: 'm-l30',
    section: 'Lesen',
    questionNumber: 30,
    context: 'Speisekarte im Café Sonnenschein: "Frühstücksangebot bis 11:30 Uhr: Kaffee oder Tee mit zwei Brötchen, Butter, Marmelade und Käse für nur 6,50 Euro."',
    question: 'Bis wie viel Uhr gilt das Frühstücksangebot?',
    options: ['Bis 10:00 Uhr', 'Bis 11:30 Uhr', 'Bis 12:00 Uhr', 'Den ganzen Tag'],
    correctAnswer: 'Bis 11:30 Uhr',
    explanation: 'The menu says: "Frühstücksangebot bis 11:30 Uhr".'
  },

  // ==========================================
  // Teil 4 – Hören (Questions 31 - 35)
  // ==========================================
  {
    id: 'm-h31',
    section: 'Hören',
    questionNumber: 31,
    audioScript: 'Achtung an Gleis 3: Der Intercity-Express nach Berlin Hauptbahnhof über Leipzig hat etwa fünfzehn Minuten Verspätung.',
    question: 'Wie viele Minuten Verspätung hat der Zug nach Berlin?',
    options: ['5 Minuten', '10 Minuten', '15 Minuten', '50 Minuten'],
    correctAnswer: '15 Minuten',
    explanation: 'The announcement says: "hat etwa fünfzehn (15) Minuten Verspätung".'
  },
  {
    id: 'm-h32',
    section: 'Hören',
    questionNumber: 32,
    audioScript: 'Guten Tag! Ich hätte gerne zwei Kilo Äpfel und ein Pfund Erdbeeren, bitte.',
    question: 'Was möchte die Person kaufen?',
    options: [
      '2 Kilo Äpfel und 1 Pfund Erdbeeren',
      '1 Kilo Äpfel und 2 Kilo Orangen',
      'Nur Erdbeeren',
      '3 Kilo Bananen'
    ],
    correctAnswer: '2 Kilo Äpfel und 1 Pfund Erdbeeren',
    explanation: 'The speaker asks for "zwei Kilo Äpfel und ein Pfund Erdbeeren".'
  },
  {
    id: 'm-h33',
    section: 'Hören',
    questionNumber: 33,
    audioScript: 'Hallo Sarah! Hier ist Tim. Wir treffen uns heute Abend nicht im Restaurant, sondern im Kino um 20 Uhr. Bis später!',
    question: 'Wo treffen sich Sarah und Tim?',
    options: ['Im Restaurant', 'Im Kino', 'Zu Hause', 'Am Bahnhof'],
    correctAnswer: 'Im Kino',
    explanation: 'Tim clarifies: "nicht im Restaurant, sondern im Kino um 20 Uhr".'
  },
  {
    id: 'm-h34',
    section: 'Hören',
    questionNumber: 34,
    audioScript: 'Entschuldigung, die Buchhandlung schließt heute um 18:30 Uhr. Sie haben noch zwanzig Minuten Zeit zum Einkaufen.',
    question: 'Um wie viel Uhr schließt die Buchhandlung?',
    options: ['18:00 Uhr', '18:30 Uhr', '19:00 Uhr', '17:30 Uhr'],
    correctAnswer: '18:30 Uhr',
    explanation: 'The store speaker announces: "schließt heute um 18:30 Uhr".'
  },
  {
    id: 'm-h35',
    section: 'Hören',
    questionNumber: 35,
    audioScript: 'Praxis Dr. Schmidt: Guten Tag. Unsere Telefonzeiten sind Montag bis Freitag von 8 bis 12 Uhr.',
    question: 'Wann kann man die Praxis telefonisch erreichen?',
    options: ['Von 8 bis 12 Uhr', 'Von 14 bis 18 Uhr', 'Den ganzen Tag', 'Nur samstags'],
    correctAnswer: 'Von 8 bis 12 Uhr',
    explanation: 'The answering machine states: "von 8 bis 12 Uhr".'
  }
];
