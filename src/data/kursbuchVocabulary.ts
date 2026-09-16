import { VocabularyWord } from '../types';

type Entry = Omit<VocabularyWord, 'id' | 'difficulty'>;

const entries: Record<number, Entry[]> = {
  1: [
    { german: 'Name', article: 'der', plural: 'die Namen', english: 'name', example: 'Mein Name ist Anna.', exampleEnglish: 'My name is Anna.', topic: 'greetings', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'Beruf', article: 'der', plural: 'die Berufe', english: 'profession', example: 'Was sind Sie von Beruf?', exampleEnglish: 'What is your profession?', topic: 'work', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'sprechen', english: 'to speak', example: 'Ich spreche Deutsch.', exampleEnglish: 'I speak German.', topic: 'greetings', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'heißen', english: 'to be called', example: 'Ich heiße Ali.', exampleEnglish: 'My name is Ali.', topic: 'greetings', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'ledig', english: 'single', example: 'Er ist ledig.', exampleEnglish: 'He is single.', topic: 'greetings', wordType: 'adjective', source: 'kursbuch-1-4' },
    { german: 'bitte', english: 'please, you are welcome', example: 'Bitte sprechen Sie langsam.', exampleEnglish: 'Please speak slowly.', topic: 'greetings', wordType: 'other', source: 'kursbuch-1-4' },
    { german: 'Woher kommen Sie?', english: 'Where are you from?', example: 'Woher kommen Sie? - Aus Polen.', exampleEnglish: 'Where are you from? - From Poland.', topic: 'greetings', wordType: 'expression', source: 'kursbuch-1-4' },
  ],
  2: [
    { german: 'Adresse', article: 'die', plural: 'die Adressen', english: 'address', example: 'Wie ist Ihre Adresse?', exampleEnglish: 'What is your address?', topic: 'greetings', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'Telefonnummer', article: 'die', plural: 'die Telefonnummern', english: 'telephone number', example: 'Meine Telefonnummer ist neu.', exampleEnglish: 'My phone number is new.', topic: 'greetings', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'buchstabieren', english: 'to spell', example: 'Buchstabieren Sie bitte Ihren Namen.', exampleEnglish: 'Please spell your name.', topic: 'greetings', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'trinken', english: 'to drink', example: 'Ich trinke einen Kaffee.', exampleEnglish: 'I drink a coffee.', topic: 'food', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'verheiratet', english: 'married', example: 'Sie sind verheiratet.', exampleEnglish: 'They are married.', topic: 'family', wordType: 'adjective', source: 'kursbuch-1-4' },
    { german: 'auch', english: 'also, too', example: 'Ich spreche auch Englisch.', exampleEnglish: 'I also speak English.', topic: 'greetings', wordType: 'other', source: 'kursbuch-1-4' },
    { german: 'Wie bitte?', english: 'Pardon?', example: 'Wie bitte? Buchstabieren Sie das bitte.', exampleEnglish: 'Pardon? Please spell that.', topic: 'greetings', wordType: 'expression', source: 'kursbuch-1-4' },
  ],
  3: [
    { german: 'Apfelsaft', article: 'der', plural: 'die Apfelsäfte', english: 'apple juice', example: 'Ich möchte einen Apfelsaft.', exampleEnglish: 'I would like an apple juice.', topic: 'food', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'Speisekarte', article: 'die', plural: 'die Speisekarten', english: 'menu', example: 'Die Speisekarte, bitte.', exampleEnglish: 'The menu, please.', topic: 'food', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'möchten', english: 'would like', example: 'Möchten Sie noch etwas?', exampleEnglish: 'Would you like anything else?', topic: 'food', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'nehmen', english: 'to take, have', example: 'Dann nehme ich eine Cola.', exampleEnglish: 'Then I will have a cola.', topic: 'food', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'hungrig', english: 'hungry', example: 'Ich bin hungrig.', exampleEnglish: 'I am hungry.', topic: 'food', wordType: 'adjective', source: 'kursbuch-1-4' },
    { german: 'noch', english: 'still, another', example: 'Möchten Sie noch etwas?', exampleEnglish: 'Would you like anything else?', topic: 'food', wordType: 'other', source: 'kursbuch-1-4' },
    { german: 'Noch einmal, bitte.', english: 'Once again, please.', example: 'Noch einmal, bitte. Ich verstehe nicht.', exampleEnglish: 'Once again, please. I do not understand.', topic: 'greetings', wordType: 'expression', source: 'kursbuch-1-4' },
  ],
  4: [
    { german: 'Möbel', article: 'die', english: 'furniture', example: 'Die Möbel sind modern.', exampleEnglish: 'The furniture is modern.', topic: 'housing', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'Teppich', article: 'der', plural: 'die Teppiche', english: 'carpet', example: 'Der Teppich ist neu.', exampleEnglish: 'The carpet is new.', topic: 'housing', wordType: 'noun', source: 'kursbuch-1-4' },
    { german: 'finden', english: 'to find, think', example: 'Wie findest du den Tisch?', exampleEnglish: 'What do you think of the table?', topic: 'housing', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'kosten', english: 'to cost', example: 'Wie viel kostet das Sofa?', exampleEnglish: 'How much does the sofa cost?', topic: 'shopping', wordType: 'verb', source: 'kursbuch-1-4' },
    { german: 'bequem', english: 'comfortable', example: 'Der Sessel ist bequem.', exampleEnglish: 'The armchair is comfortable.', topic: 'housing', wordType: 'adjective', source: 'kursbuch-1-4' },
    { german: 'sehr', english: 'very', example: 'Das Sofa ist sehr bequem.', exampleEnglish: 'The sofa is very comfortable.', topic: 'housing', wordType: 'other', source: 'kursbuch-1-4' },
    { german: 'zu teuer', english: 'too expensive', example: 'Das Sofa ist zu teuer.', exampleEnglish: 'The sofa is too expensive.', topic: 'shopping', wordType: 'expression', source: 'kursbuch-1-4' },
  ],
  5: [
    { german: 'Termin', article: 'der', plural: 'die Termine', english: 'appointment', example: 'Ich habe morgen einen Termin.', exampleEnglish: 'I have an appointment tomorrow.', topic: 'work', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'Freizeit', article: 'die', english: 'free time', example: 'Was machst du in deiner Freizeit?', exampleEnglish: 'What do you do in your free time?', topic: 'hobbies', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'sich verabreden', english: 'to arrange to meet', example: 'Wir verabreden uns für Samstag.', exampleEnglish: 'We arrange to meet on Saturday.', topic: 'hobbies', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'müssen', english: 'to have to', example: 'Ich muss heute arbeiten.', exampleEnglish: 'I have to work today.', topic: 'work', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'beschäftigt', english: 'busy', example: 'Am Montag bin ich beschäftigt.', exampleEnglish: 'I am busy on Monday.', topic: 'work', wordType: 'adjective', source: 'kursbuch-5-8' },
    { german: 'heute', english: 'today', example: 'Heute arbeite ich.', exampleEnglish: 'I am working today.', topic: 'routine', wordType: 'other', source: 'kursbuch-5-8' },
    { german: 'Hast du Zeit?', english: 'Do you have time?', example: 'Hast du am Samstag Zeit?', exampleEnglish: 'Do you have time on Saturday?', topic: 'hobbies', wordType: 'expression', source: 'kursbuch-5-8' },
  ],
  6: [
    { german: 'Haushalt', article: 'der', plural: 'die Haushalte', english: 'household', example: 'Im Haushalt gibt es viel Arbeit.', exampleEnglish: 'There is a lot of work in the household.', topic: 'housing', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'Wecker', article: 'der', plural: 'die Wecker', english: 'alarm clock', example: 'Der Wecker klingelt um sechs Uhr.', exampleEnglish: 'The alarm rings at six o clock.', topic: 'routine', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'aufstehen', english: 'to get up', example: 'Ich stehe um sieben Uhr auf.', exampleEnglish: 'I get up at seven o clock.', topic: 'routine', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'aufräumen', english: 'to tidy up', example: 'Wir räumen die Küche auf.', exampleEnglish: 'We tidy the kitchen.', topic: 'housing', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'ruhig', english: 'quiet, calm', example: 'Annette ist ruhig.', exampleEnglish: 'Annette is calm.', topic: 'family', wordType: 'adjective', source: 'kursbuch-5-8' },
    { german: 'dann', english: 'then', example: 'Dann mache ich das Frühstück.', exampleEnglish: 'Then I make breakfast.', topic: 'routine', wordType: 'other', source: 'kursbuch-5-8' },
    { german: 'Das macht mir Spaß.', english: 'I enjoy that.', example: 'Kochen macht mir Spaß.', exampleEnglish: 'I enjoy cooking.', topic: 'hobbies', wordType: 'expression', source: 'kursbuch-5-8' },
  ],
  7: [
    { german: 'Brandenburger Tor', article: 'das', english: 'Brandenburg Gate', example: 'Das Brandenburger Tor ist in Berlin.', exampleEnglish: 'The Brandenburg Gate is in Berlin.', topic: 'travel', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'U-Bahn', article: 'die', plural: 'die U-Bahnen', english: 'underground train', example: 'Wir fahren mit der U-Bahn.', exampleEnglish: 'We travel by underground train.', topic: 'travel', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'aussteigen', english: 'to get off', example: 'Sie müssen an der Station aussteigen.', exampleEnglish: 'You must get off at the station.', topic: 'travel', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'geradeaus gehen', english: 'to go straight ahead', example: 'Gehen Sie immer geradeaus.', exampleEnglish: 'Go straight ahead.', topic: 'travel', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'weit', english: 'far', example: 'Das Museum ist nicht weit.', exampleEnglish: 'The museum is not far.', topic: 'travel', wordType: 'adjective', source: 'kursbuch-5-8' },
    { german: 'links', english: 'left', example: 'Gehen Sie links.', exampleEnglish: 'Go left.', topic: 'travel', wordType: 'other', source: 'kursbuch-5-8' },
    { german: 'Entschuldigung, wie komme ich zu ...?', english: 'Excuse me, how do I get to ...?', example: 'Entschuldigung, wie komme ich zum Zoo?', exampleEnglish: 'Excuse me, how do I get to the zoo?', topic: 'travel', wordType: 'expression', source: 'kursbuch-5-8' },
  ],
  8: [
    { german: 'Auskunft', article: 'die', plural: 'die Auskünfte', english: 'information', example: 'Können Sie mir Auskunft geben?', exampleEnglish: 'Can you give me information?', topic: 'travel', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'Hilfe', article: 'die', english: 'help', example: 'Ich brauche Hilfe.', exampleEnglish: 'I need help.', topic: 'greetings', wordType: 'noun', source: 'kursbuch-5-8' },
    { german: 'bestellen', english: 'to order', example: 'Ich möchte einen Tee bestellen.', exampleEnglish: 'I would like to order tea.', topic: 'food', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'wünschen', english: 'to wish', example: 'Ich wünsche Ihnen einen schönen Tag.', exampleEnglish: 'I wish you a nice day.', topic: 'greetings', wordType: 'verb', source: 'kursbuch-5-8' },
    { german: 'freundlich', english: 'friendly', example: 'Die Verkäuferin ist freundlich.', exampleEnglish: 'The shop assistant is friendly.', topic: 'shopping', wordType: 'adjective', source: 'kursbuch-5-8' },
    { german: 'gern', english: 'gladly, like to', example: 'Ich helfe Ihnen gern.', exampleEnglish: 'I am happy to help you.', topic: 'greetings', wordType: 'other', source: 'kursbuch-5-8' },
    { german: 'Kann ich Ihnen helfen?', english: 'Can I help you?', example: 'Kann ich Ihnen helfen? - Ja, bitte.', exampleEnglish: 'Can I help you? - Yes, please.', topic: 'greetings', wordType: 'expression', source: 'kursbuch-5-8' },
  ],
};

export const KURSBUCH_VOCABULARY: VocabularyWord[] = Object.entries(entries).flatMap(([lesson, words]) =>
  words.map((word, index) => ({ ...word, id: `kursbuch-${lesson}-${index + 1}`, lesson: Number(lesson), difficulty: Number(lesson) <= 4 ? 'A1' : 'A2' }))
);
