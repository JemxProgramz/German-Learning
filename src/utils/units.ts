export interface UnitLesson {
  id: number;
  lessonNumber: number;
  title: string;
  description: string;
  topic: 'vocabulary' | 'artikel' | 'grammatik' | 'satzbildung' | 'hören' | 'lesen' | 'schreiben' | 'sprechen' | 'quiz' | 'mocktest';
  viewTarget: string;
  isCheckpoint?: boolean;
  xpReward: number;
}

export interface Unit {
  id: number;
  unitNumber: number;
  title: string;
  germanTitle: string;
  description: string;
  cefrLevel: 'A1.1' | 'A1.2';
  theme: string;
  lessons: UnitLesson[];
}

export const CURRICULUM_UNITS: Unit[] = [
  {
    id: 1,
    unitNumber: 1,
    title: 'First Contacts & Basics',
    germanTitle: 'Erste Kontakte',
    description: 'Master greetings, self-introductions, alphabet, and numbers 1-20.',
    cefrLevel: 'A1.1',
    theme: 'Basics & Greetings',
    lessons: [
      {
        id: 1,
        lessonNumber: 1,
        title: 'Hallo & Auf Wiedersehen',
        description: 'Common greetings, goodbyes, and polite phrases.',
        topic: 'vocabulary',
        viewTarget: 'vocabulary',
        xpReward: 20
      },
      {
        id: 2,
        lessonNumber: 2,
        title: 'Wer bist du?',
        description: 'Personal pronouns (ich, du, Sie) and verb "sein".',
        topic: 'grammatik',
        viewTarget: 'grammatik',
        xpReward: 25
      },
      {
        id: 3,
        lessonNumber: 3,
        title: 'Zahlen & Alphabet',
        description: 'Pronunciation, numbers 1-20, and phone numbers.',
        topic: 'hören',
        viewTarget: 'horen',
        xpReward: 25
      },
      {
        id: 4,
        lessonNumber: 4,
        title: 'Länder & Sprachen',
        description: 'Where you come from, where you live, and languages you speak.',
        topic: 'sprechen',
        viewTarget: 'sprechen',
        xpReward: 25
      },
      {
        id: 5,
        lessonNumber: 5,
        title: 'Unit 1 Checkpoint Exam',
        description: 'Test all your skills from Unit 1 to unlock Unit 2.',
        topic: 'mocktest',
        viewTarget: 'mocktest',
        isCheckpoint: true,
        xpReward: 50
      }
    ]
  },
  {
    id: 2,
    unitNumber: 2,
    title: 'Café, Food & Shopping',
    germanTitle: 'Im Café & Restaurant',
    description: 'Order food and drinks, learn articles (der/die/das), and ask for prices.',
    cefrLevel: 'A1.1',
    theme: 'Ordering & Shopping',
    lessons: [
      {
        id: 6,
        lessonNumber: 6,
        title: 'Essen & Trinken',
        description: 'Key food and beverage vocabulary.',
        topic: 'vocabulary',
        viewTarget: 'vocabulary',
        xpReward: 20
      },
      {
        id: 7,
        lessonNumber: 7,
        title: 'Der, Die oder Das?',
        description: 'Definite and indefinite articles (ein/eine/kein).',
        topic: 'artikel',
        viewTarget: 'artikel',
        xpReward: 25
      },
      {
        id: 8,
        lessonNumber: 8,
        title: 'Was möchten Sie?',
        description: 'Ordering politely with "Ich möchte" and "Ich hätte gern".',
        topic: 'sprechen',
        viewTarget: 'sprechen',
        xpReward: 25
      },
      {
        id: 9,
        lessonNumber: 9,
        title: 'Zahlen & Preise',
        description: 'Prices in Euros, cent amounts, and restaurant bills.',
        topic: 'satzbildung',
        viewTarget: 'satzbildung',
        xpReward: 25
      },
      {
        id: 10,
        lessonNumber: 10,
        title: 'Unit 2 Checkpoint Exam',
        description: 'Comprehensive test of food, articles, and ordering.',
        topic: 'mocktest',
        viewTarget: 'mocktest',
        isCheckpoint: true,
        xpReward: 50
      }
    ]
  },
  {
    id: 3,
    unitNumber: 3,
    title: 'Family, Friends & People',
    germanTitle: 'Familie & Freunde',
    description: 'Describe family members, use possessive pronouns (mein/dein), and form plurals.',
    cefrLevel: 'A1.1',
    theme: 'Family & Plurals',
    lessons: [
      {
        id: 11,
        lessonNumber: 11,
        title: 'Meine Familie',
        description: 'Parents, siblings, and relations.',
        topic: 'vocabulary',
        viewTarget: 'vocabulary',
        xpReward: 20
      },
      {
        id: 12,
        lessonNumber: 12,
        title: 'Mein & Dein',
        description: 'Possessive articles in nominative case.',
        topic: 'grammatik',
        viewTarget: 'grammatik',
        xpReward: 25
      },
      {
        id: 13,
        lessonNumber: 13,
        title: 'Die Pluralformen',
        description: 'Common plural endings (-e, -er, -en, -s).',
        topic: 'quiz',
        viewTarget: 'quiz',
        xpReward: 25
      },
      {
        id: 14,
        lessonNumber: 14,
        title: 'Kurze Nachrichten',
        description: 'Writing simple messages and postcards to friends.',
        topic: 'schreiben',
        viewTarget: 'schreiben',
        xpReward: 25
      },
      {
        id: 15,
        lessonNumber: 15,
        title: 'Unit 3 Checkpoint Exam',
        description: 'Evaluate mastery of family vocabulary and possessives.',
        topic: 'mocktest',
        viewTarget: 'mocktest',
        isCheckpoint: true,
        xpReward: 50
      }
    ]
  },
  {
    id: 4,
    unitNumber: 4,
    title: 'Daily Routine & Appointments',
    germanTitle: 'Alltag & Termine',
    description: 'Tell time, discuss your daily schedule, and use separable verbs.',
    cefrLevel: 'A1.2',
    theme: 'Time & Daily Routine',
    lessons: [
      {
        id: 16,
        lessonNumber: 16,
        title: 'Wie spät ist es?',
        description: 'Telling time formally and informally.',
        topic: 'vocabulary',
        viewTarget: 'vocabulary',
        xpReward: 20
      },
      {
        id: 17,
        lessonNumber: 17,
        title: 'Trennbaare Verben',
        description: 'Separable verbs in present tense (aufstehen, einkaufen).',
        topic: 'grammatik',
        viewTarget: 'grammatik',
        xpReward: 25
      },
      {
        id: 18,
        lessonNumber: 18,
        title: 'Wochentage & Termine',
        description: 'Prepositions with time (am Montag, um 8 Uhr).',
        topic: 'hören',
        viewTarget: 'horen',
        xpReward: 25
      },
      {
        id: 19,
        lessonNumber: 19,
        title: 'Ein Treffen vereinbaren',
        description: 'Scheduling appointments and making plans.',
        topic: 'sprechen',
        viewTarget: 'sprechen',
        xpReward: 25
      },
      {
        id: 20,
        lessonNumber: 20,
        title: 'Unit 4 Checkpoint Exam',
        description: 'Prove your command of daily time and separable verbs.',
        topic: 'mocktest',
        viewTarget: 'mocktest',
        isCheckpoint: true,
        xpReward: 50
      }
    ]
  },
  {
    id: 5,
    unitNumber: 5,
    title: 'Living, Housing & City',
    germanTitle: 'Wohnen & In der Stadt',
    description: 'Rooms, furniture, asking for directions, and accusative prepositions.',
    cefrLevel: 'A1.2',
    theme: 'Housing & Navigation',
    lessons: [
      {
        id: 21,
        lessonNumber: 21,
        title: 'Die Wohnung & Möbel',
        description: 'Rooms in the house and essential furniture.',
        topic: 'vocabulary',
        viewTarget: 'vocabulary',
        xpReward: 20
      },
      {
        id: 22,
        lessonNumber: 22,
        title: 'Der Akkusativ',
        description: 'Direct objects and "den" masculine accusative form.',
        topic: 'artikel',
        viewTarget: 'artikel',
        xpReward: 25
      },
      {
        id: 23,
        lessonNumber: 23,
        title: 'Nach dem Weg fragen',
        description: 'Directions: geradeaus, links, rechts, an der Ecke.',
        topic: 'lesen',
        viewTarget: 'lesen',
        xpReward: 25
      },
      {
        id: 24,
        lessonNumber: 24,
        title: 'Wohnungsanzeigen',
        description: 'Reading real estate ads and rental requests.',
        topic: 'schreiben',
        viewTarget: 'schreiben',
        xpReward: 25
      },
      {
        id: 25,
        lessonNumber: 25,
        title: 'Unit 5 Checkpoint Exam',
        description: 'Review housing, directions, and the accusative case.',
        topic: 'mocktest',
        viewTarget: 'mocktest',
        isCheckpoint: true,
        xpReward: 50
      }
    ]
  },
  {
    id: 6,
    unitNumber: 6,
    title: 'Free Time & Goethe A1 Final',
    germanTitle: 'Freizeit & Goethe A1 Vorbereitung',
    description: 'Hobbies, modal verbs (können, wollen), and full exam readiness.',
    cefrLevel: 'A1.2',
    theme: 'Hobbies & Graduation',
    lessons: [
      {
        id: 26,
        lessonNumber: 26,
        title: 'Hobbys & Sport',
        description: 'Talking about what you like to do in your free time.',
        topic: 'vocabulary',
        viewTarget: 'vocabulary',
        xpReward: 20
      },
      {
        id: 27,
        lessonNumber: 27,
        title: 'Modalverben: können & müssen',
        description: 'Conjugating modal verbs with an infinitive at the end.',
        topic: 'grammatik',
        viewTarget: 'grammatik',
        xpReward: 25
      },
      {
        id: 28,
        lessonNumber: 28,
        title: 'Satzstellung: Verb am Ende',
        description: 'German word order with modal verbs and conjunctions.',
        topic: 'satzbildung',
        viewTarget: 'satzbildung',
        xpReward: 25
      },
      {
        id: 29,
        lessonNumber: 29,
        title: 'Freizeit & Pläne',
        description: 'Expressing wishes and suggestions with "möchten".',
        topic: 'sprechen',
        viewTarget: 'sprechen',
        xpReward: 25
      },
      {
        id: 30,
        lessonNumber: 30,
        title: 'A1 Goethe Abschlussprüfung',
        description: 'Complete Goethe-Zertifikat A1 simulated examination.',
        topic: 'mocktest',
        viewTarget: 'mocktest',
        isCheckpoint: true,
        xpReward: 100
      }
    ]
  }
];

/**
 * Checks if a specific unit is unlocked for the user.
 * Unit 1 is always unlocked.
 * Unit N is unlocked if all lessons in Unit N - 1 are completed (100%).
 */
export function isUnitUnlocked(unitId: number, lessonProgress: Record<number, number> = {}): boolean {
  if (unitId <= 1) return true;
  const previousUnit = CURRICULUM_UNITS.find(u => u.id === unitId - 1);
  if (!previousUnit) return true;

  // The previous unit is complete if all its lessons or its checkpoint are completed (>= 100)
  return previousUnit.lessons.every(lesson => (lessonProgress[lesson.lessonNumber] || 0) >= 100);
}

/**
 * Returns summary stats for a unit: completed lessons, total lessons, completion percentage.
 */
export function getUnitProgress(unit: Unit, lessonProgress: Record<number, number> = {}): {
  completedCount: number;
  totalCount: number;
  percentage: number;
  isCompleted: boolean;
} {
  const totalCount = unit.lessons.length;
  const completedCount = unit.lessons.filter(l => (lessonProgress[l.lessonNumber] || 0) >= 100).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  return {
    completedCount,
    totalCount,
    percentage,
    isCompleted: completedCount === totalCount
  };
}

/**
 * Checks if a specific lesson within a unit is unlocked:
 * - The unit itself must be unlocked.
 * - If it's the first lesson in the unit, it is unlocked.
 * - Otherwise, the preceding lesson must be completed (>= 100).
 */
export function isLessonUnlocked(
  lessonNumber: number,
  lessonProgress: Record<number, number> = {}
): boolean {
  if (lessonNumber <= 1) return true;

  // Find the unit this lesson belongs to
  const unit = CURRICULUM_UNITS.find(u => u.lessons.some(l => l.lessonNumber === lessonNumber));
  if (!unit) return true;

  // If unit is locked, the lesson is locked
  if (!isUnitUnlocked(unit.id, lessonProgress)) return false;

  const lessonIndex = unit.lessons.findIndex(l => l.lessonNumber === lessonNumber);
  if (lessonIndex <= 0) return true; // first lesson of unlocked unit

  // Preceding lesson in unit must be completed
  const prevLesson = unit.lessons[lessonIndex - 1];
  return (lessonProgress[prevLesson.lessonNumber] || 0) >= 100;
}
