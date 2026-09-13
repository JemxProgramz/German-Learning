import { WritingPrompt, WritingFeedback, WritingCorrection, Difficulty } from '../types';

export const ORIGINAL_WRITING_PROMPTS: WritingPrompt[] = [
  // --- A1 Prompts ---
  {
    id: 'wp-a1-1',
    title: 'Sich vorstellen (Introducing Yourself)',
    level: 'A1',
    topic: 'greetings',
    prompt: 'Schreiben Sie eine kurze Vorstellung über sich selbst für Ihren neuen Deutschkurs.',
    promptEnglish: 'Write a short self-introduction for your new German class.',
    guidingPoints: [
      'Name und Alter (Name and age)',
      'Herkunftsland und Wohnort (Country of origin and residence)',
      'Sprachen, die Sie sprechen (Languages you speak)',
      'Ein oder zwei Hobbys (One or two hobbies)'
    ],
    minWords: 20,
    targetGrammar: 'Präsens von sein/heißen/wohnen/sprechen'
  },
  {
    id: 'wp-a1-2',
    title: 'Einladung zum Geburtstag (Birthday Invitation)',
    level: 'A1',
    topic: 'routine',
    prompt: 'Schreiben Sie eine kurze Nachricht an Ihre Freunde und laden Sie sie zu Ihrer Geburtstagsparty ein.',
    promptEnglish: 'Write a short message to your friends inviting them to your birthday party.',
    guidingPoints: [
      'Wann ist die Party? (Tag und Uhrzeit)',
      'Wo findet die Feier statt? (Ort/Adresse)',
      'Was sollen die Gäste mitbringen?',
      'Bitten Sie um eine Antwort bis Freitag.'
    ],
    minWords: 25,
    targetGrammar: 'W-Fragen und Aufforderungssätze'
  },
  {
    id: 'wp-a1-3',
    title: 'Postkarte aus dem Urlaub (Vacation Postcard)',
    level: 'A1',
    topic: 'travel',
    prompt: 'Sie machen Urlaub am Meer oder in den Bergen. Schreiben Sie eine Postkarte an Ihre Familie.',
    promptEnglish: 'You are on vacation at the sea or in the mountains. Write a postcard to your family.',
    guidingPoints: [
      'Wo sind Sie gerade?',
      'Wie ist das Wetter?',
      'Was machen Sie jeden Tag?',
      'Wann kommen Sie zurück?'
    ],
    minWords: 25,
    targetGrammar: 'Akkusativ und Ortsangaben'
  },

  // --- A2 Prompts ---
  {
    id: 'wp-a2-1',
    title: 'Mein gestriger Tag im Perfekt (Yesterday in the Perfect Tense)',
    level: 'A2',
    topic: 'routine',
    prompt: 'Beschreiben Sie Ihren gestrigen Tag. Verwenden Sie dabei das Perfekt (haben/sein + Partizip II).',
    promptEnglish: 'Describe your day yesterday. Use the Perfekt tense (haben/sein + Partizip II).',
    guidingPoints: [
      'Wann sind Sie aufgestanden?',
      'Was haben Sie gefrühstückt oder gearbeitet?',
      'Wen haben Sie getroffen oder angerufen?',
      'Was haben Sie am Abend gemacht?'
    ],
    minWords: 35,
    targetGrammar: 'Perfekt mit haben und sein'
  },
  {
    id: 'wp-a2-2',
    title: 'Wohnungsbesichtigung (Apartment Viewing Request)',
    level: 'A2',
    topic: 'housing',
    prompt: 'Sie haben eine interessante Wohnungsanzeige in Berlin gesehen. Schreiben Sie eine formelle E-Mail an den Vermieter Herrn Schneider.',
    promptEnglish: 'You saw an interesting apartment ad in Berlin. Write a formal email to the landlord, Mr. Schneider.',
    guidingPoints: [
      'Höfliche Anrede und Grund des Schreibens',
      'Kurze Information über Ihren Beruf und Ihr Einkommen',
      'Frage nach einem Besichtigungstermin',
      'Höflicher Gruß am Ende'
    ],
    minWords: 35,
    targetGrammar: 'Höflichkeitsform (Sie/Ihr) und Modalverben'
  },

  // --- B1 Prompts ---
  {
    id: 'wp-b1-1',
    title: 'Homeoffice: Vor- und Nachteile (Remote Work: Pros & Cons)',
    level: 'B1',
    topic: 'work',
    prompt: 'Schreiben Sie einen kurzen Beitrag für ein Diskussionsforum zum Thema "Homeoffice und flexibles Arbeiten".',
    promptEnglish: 'Write a short forum post on the topic of "Home office and flexible working".',
    guidingPoints: [
      'Nennen Sie Ihre persönliche Meinung',
      'Erklären Sie mindestens zwei Vorteile (z.B. Zeitersparnis)',
      'Erklären Sie mindestens einen Nachteil (z.B. weniger sozialer Kontakt)',
      'Ziehen Sie ein kurzes Fazit'
    ],
    minWords: 50,
    targetGrammar: 'Nebensätze mit weil, dass, obwohl und Konnektoren'
  },
  {
    id: 'wp-b1-2',
    title: 'Beschwerdebrief über eine verspätete Lieferung (Formal Complaint)',
    level: 'B1',
    topic: 'shopping',
    prompt: 'Sie haben online ein elektronisches Gerät bestellt. Die Lieferung kam zwei Wochen zu spät und das Gerät ist defekt. Schreiben Sie eine Beschwerde-E-Mail.',
    promptEnglish: 'You ordered an electronic device online. It arrived two weeks late and is defective. Write a complaint email.',
    guidingPoints: [
      'Angabe der Bestellnummer und des Datums',
      'Genaue Beschreibung der Probleme (Verspätung, Defekt)',
      'Aufforderung zur Nachbesserung oder Rückerstattung mit Fristsetzung'
    ],
    minWords: 50,
    targetGrammar: 'Passiv oder Passiversatzformen und formeller Schreibstil'
  }
];

/**
 * Local rule-based German writing evaluator fallback
 * Ensures instant evaluation, feedback, and mistake categorization
 * even when offline or before configuring an API key.
 */
export function evaluateGermanWritingLocally(
  userText: string,
  prompt: WritingPrompt
): WritingFeedback {
  const text = userText.trim();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const corrections: WritingCorrection[] = [];
  const strengths: string[] = [];
  const mistakeCategories: string[] = [];

  // Check 1: Minimum word count
  if (wordCount < prompt.minWords) {
    corrections.push({
      original: `Textlänge (${wordCount} Wörter)`,
      corrected: `Mindestens ${prompt.minWords} Wörter`,
      explanation: `Ihr Text ist mit ${wordCount} Wörtern etwas zu kurz für diese Aufgabe (Soll: ${prompt.minWords}+ Wörter). Fügen Sie noch Details hinzu.`,
      mistakeType: 'Vocabulary'
    });
    mistakeCategories.push('Length & Elaboration');
  } else {
    strengths.push(`Sehr gut! Ausreichender Textumfang (${wordCount} Wörter, Ziel: ${prompt.minWords}).`);
  }

  // Check 2: German Noun Capitalization (Substantive werden großgeschrieben!)
  // Detect lowercase words that are common German nouns
  const knownNouns = [
    'name', 'vorname', 'nachname', 'stadt', 'land', 'familie', 'eltern', 'freund', 'freundin',
    'tag', 'woche', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag',
    'morgen', 'abend', 'uhr', 'zeit', 'arbeit', 'wohnung', 'haus', 'essen', 'wasser', 'kaffee',
    'sprache', 'deutsch', 'englisch', 'hobby', 'party', 'geburtstag', 'kino', 'film', 'brief', 'termin'
  ];

  for (const word of words) {
    const cleanWord = word.replace(/[.,!?;:()"]/g, '');
    if (knownNouns.includes(cleanWord)) {
      const capitalized = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      corrections.push({
        original: cleanWord,
        corrected: capitalized,
        explanation: `Im Deutschen werden alle Nomen/Substantive großgeschrieben: "${cleanWord}" → "${capitalized}".`,
        mistakeType: 'Noun Capitalization'
      });
      if (!mistakeCategories.includes('Noun Capitalization')) {
        mistakeCategories.push('Noun Capitalization');
      }
    }
  }

  // Check 3: Missing punctuation at sentence ends
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (!/[.!?]$/.test(text)) {
    corrections.push({
      original: text.slice(-10),
      corrected: text.slice(-10) + '.',
      explanation: 'Vergessen Sie nicht das Satzzeichen am Satzende (Punkt, Ausrufezeichen oder Fragezeichen).',
      mistakeType: 'Spelling'
    });
  }

  // Check 4: Check if Perfekt auxiliary is used for A2 prompt
  if (prompt.targetGrammar?.includes('Perfekt')) {
    const hasPerfektAux = /\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b/i.test(text);
    const hasPartizip = /\bge[a-z]+(t|en)\b/i.test(text);
    if (hasPerfektAux && hasPartizip) {
      strengths.push('Gute Anwendung des Perfekts mit Hilfsverb (haben/sein) und Partizip II.');
    } else {
      corrections.push({
        original: 'Vergangenheit / Zeitform',
        corrected: 'haben/sein + Partizip II (z.B. "Ich habe gearbeitet" / "Ich bin gefahren")',
        explanation: 'In dieser Aufgabe soll das Perfekt geübt werden. Achten Sie auf die Verbklammer: Hilfsverb auf Position 2 und Partizip II am Satzende.',
        mistakeType: 'Verb Conjugation'
      });
      if (!mistakeCategories.includes('Verb Conjugation')) {
        mistakeCategories.push('Verb Conjugation');
      }
    }
  }

  if (strengths.length === 0) {
    strengths.push('Guter Versuch! Der Sinn des Textes ist verständlich.');
  }

  // Calculate score
  let score = 85;
  if (wordCount < prompt.minWords) score -= 15;
  score -= Math.min(30, corrections.length * 7);
  score = Math.max(50, Math.min(100, score));

  // Determine feedback text
  let summary = '';
  if (score >= 85) {
    summary = 'Ausgezeichnete Arbeit! Ihr Text ist flüssig formuliert, verständlich und erfüllt die Aufgabenstellung sehr gut.';
  } else if (score >= 70) {
    summary = 'Gute Leistung! Der Inhalt ist klar und nachvollziehbar. Beachten Sie die markierten Hinweise zu Groß-/Kleinschreibung und Grammatik.';
  } else {
    summary = 'Ein solider Schritt! Überprüfen Sie insbesondere die Großschreibung von Nomen und Satzstrukturen, um Ihre Treffsicherheit weiter zu steigern.';
  }

  // Build corrected text suggestion
  let correctedText = text;
  for (const noun of knownNouns) {
    const regex = new RegExp(`\\b${noun}\\b`, 'g');
    const cap = noun.charAt(0).toUpperCase() + noun.slice(1);
    correctedText = correctedText.replace(regex, cap);
  }

  return {
    score,
    cefrRating: prompt.level,
    summary,
    correctedText,
    corrections,
    strengths,
    mistakeCategories
  };
}
