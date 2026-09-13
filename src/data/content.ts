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
  { id: 'v18', lesson: 2, german: 'schön', english: 'beautiful', example: 'Die Blume ist schön.', exampleEnglish: 'Die Blume ist schön.' },
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
  // Lesson 5 (Tangram aktuell 1, Lektion 5: Arbeit und Freizeit)
  { id: 'v31', lesson: 5, german: 'Arbeit', article: 'die', english: 'work, job', plural: 'die Arbeiten', example: 'Die Arbeit macht mir Spaß.', exampleEnglish: 'I enjoy the work.' },
  { id: 'v32', lesson: 5, german: 'Arbeitszeit', article: 'die', english: 'working hours', plural: 'die Arbeitszeiten', example: 'Meine Arbeitszeit ist von acht bis vier.', exampleEnglish: 'My working hours are from eight to four.' },
  { id: 'v33', lesson: 5, german: 'Chef', article: 'der', english: 'boss', plural: 'die Chefs', example: 'Mein Chef ist sehr nett.', exampleEnglish: 'My boss is very nice.' },
  { id: 'v34', lesson: 5, german: 'Freizeit', article: 'die', english: 'free time', example: 'Was machst du in deiner Freizeit?', exampleEnglish: 'What do you do in your free time?' },
  { id: 'v35', lesson: 5, german: 'Hausfrau', article: 'die', english: 'housewife', plural: 'die Hausfrauen', example: 'Meine Mutter ist Hausfrau.', exampleEnglish: 'My mother is a housewife.' },
  { id: 'v36', lesson: 5, german: 'Lehrer', article: 'der', english: 'teacher', plural: 'die Lehrer', example: 'Der Lehrer erklärt die Grammatik.', exampleEnglish: 'The teacher explains the grammar.' },
  { id: 'v37', lesson: 5, german: 'Termin', article: 'der', english: 'appointment', plural: 'die Termine', example: 'Ich habe morgen einen Termin beim Arzt.', exampleEnglish: "I have an appointment at the doctor's tomorrow." },
  { id: 'v38', lesson: 5, german: 'Uhrzeit', article: 'die', english: 'time (of day)', plural: 'die Uhrzeiten', example: 'Sag mir bitte die Uhrzeit.', exampleEnglish: 'Please tell me the time.' },
  { id: 'v39', lesson: 5, german: 'Urlaub', article: 'der', english: 'vacation, holiday', example: 'Wir machen im Sommer Urlaub.', exampleEnglish: "We're going on vacation in the summer." },
  { id: 'v40', lesson: 5, german: 'Wochenende', article: 'das', english: 'weekend', plural: 'die Wochenenden', example: 'Was machst du am Wochenende?', exampleEnglish: 'What are you doing on the weekend?' },
  { id: 'v41', lesson: 5, german: 'Frühling', article: 'der', english: 'spring', example: 'Im Frühling werden die Tage länger.', exampleEnglish: 'In spring, the days get longer.' },
  { id: 'v42', lesson: 5, german: 'Sommer', article: 'der', english: 'summer', plural: 'die Sommer', example: 'Im Sommer fahre ich ans Meer.', exampleEnglish: 'In summer, I go to the sea.' },
  { id: 'v43', lesson: 5, german: 'Herbst', article: 'der', english: 'autumn, fall', example: 'Der Herbst ist meine Lieblingsjahreszeit.', exampleEnglish: 'Autumn is my favorite season.' },
  { id: 'v44', lesson: 5, german: 'Winter', article: 'der', english: 'winter', plural: 'die Winter', example: 'Im Winter schneit es oft.', exampleEnglish: 'In winter it often snows.' },
  { id: 'v45', lesson: 5, german: 'können', english: 'can, to be able to', example: 'Ich kann gut schwimmen.', exampleEnglish: 'I can swim well.' },
  { id: 'v46', lesson: 5, german: 'müssen', english: 'must, to have to', example: 'Ich muss heute arbeiten.', exampleEnglish: 'I have to work today.' },
  { id: 'v47', lesson: 5, german: 'dürfen', english: 'to be allowed to, may', example: 'Darf ich hier rauchen?', exampleEnglish: 'Am I allowed to smoke here?' },
  { id: 'v48', lesson: 5, german: 'wollen', english: 'to want to', example: 'Ich will heute Abend tanzen gehen.', exampleEnglish: 'I want to go dancing tonight.' },
  { id: 'v49', lesson: 5, german: 'sollen', english: 'to be supposed to, should', example: 'Ich soll heute früh aufstehen.', exampleEnglish: "I'm supposed to get up early today." },
  { id: 'v50', lesson: 5, german: 'abholen', english: 'to pick up', example: 'Ich hole dich um sechs Uhr ab.', exampleEnglish: "I'll pick you up at six o'clock." },
  { id: 'v51', lesson: 5, german: 'anfangen', english: 'to begin, to start', example: 'Der Film fängt um acht an.', exampleEnglish: 'The film starts at eight.' },
  // Lesson 6 (Tangram aktuell 1, Lektion 6: Familie und Haushalt)
  { id: 'v52', lesson: 6, german: 'Brief', article: 'der', english: 'letter', plural: 'die Briefe', example: 'Ich schreibe meiner Oma einen Brief.', exampleEnglish: "I'm writing a letter to my grandma." },
  { id: 'v53', lesson: 6, german: 'Ehefrau', article: 'die', english: 'wife', plural: 'die Ehefrauen', example: 'Seine Ehefrau arbeitet als Ärztin.', exampleEnglish: 'His wife works as a doctor.' },
  { id: 'v54', lesson: 6, german: 'Ehemann', article: 'der', english: 'husband', plural: 'die Ehemänner', example: 'Ihr Ehemann kommt aus Italien.', exampleEnglish: 'Her husband is from Italy.' },
  { id: 'v55', lesson: 6, german: 'Frühstück', article: 'das', english: 'breakfast', example: 'Wir essen um acht Uhr Frühstück.', exampleEnglish: "We eat breakfast at eight o'clock." },
  { id: 'v56', lesson: 6, german: 'Geschwister', article: 'die', english: 'siblings', example: 'Hast du Geschwister?', exampleEnglish: 'Do you have siblings?' },
  { id: 'v57', lesson: 6, german: 'Großmutter', article: 'die', english: 'grandmother', plural: 'die Großmütter', example: 'Meine Großmutter wohnt in München.', exampleEnglish: 'My grandmother lives in Munich.' },
  { id: 'v58', lesson: 6, german: 'Großvater', article: 'der', english: 'grandfather', plural: 'die Großväter', example: 'Mein Großvater erzählt gern Geschichten.', exampleEnglish: 'My grandfather likes to tell stories.' },
  { id: 'v59', lesson: 6, german: 'Handy', article: 'das', english: 'mobile phone', plural: 'die Handys', example: 'Mein Handy ist kaputt.', exampleEnglish: 'My phone is broken.' },
  { id: 'v60', lesson: 6, german: 'Haushalt', article: 'der', english: 'household', example: 'Wer macht bei euch den Haushalt?', exampleEnglish: 'Who does the housework at your place?' },
  { id: 'v61', lesson: 6, german: 'Hund', article: 'der', english: 'dog', plural: 'die Hunde', example: 'Der Hund schläft auf dem Sofa.', exampleEnglish: 'The dog is sleeping on the sofa.' },
  { id: 'v62', lesson: 6, german: 'Onkel', article: 'der', english: 'uncle', plural: 'die Onkel', example: 'Mein Onkel wohnt in der Schweiz.', exampleEnglish: 'My uncle lives in Switzerland.' },
  { id: 'v63', lesson: 6, german: 'Tante', article: 'die', english: 'aunt', plural: 'die Tanten', example: 'Meine Tante besucht uns am Wochenende.', exampleEnglish: 'My aunt is visiting us this weekend.' },
  { id: 'v64', lesson: 6, german: 'Treppe', article: 'die', english: 'stairs, staircase', plural: 'die Treppen', example: 'Die Kinder laufen die Treppe hinauf.', exampleEnglish: 'The children run up the stairs.' },
  { id: 'v65', lesson: 6, german: 'Unterricht', article: 'der', english: 'lessons, class', example: 'Der Unterricht beginnt um neun Uhr.', exampleEnglish: "Class starts at nine o'clock." },
  { id: 'v66', lesson: 6, german: 'anziehen', english: 'to put on, to get dressed', example: 'Zieh bitte deine Jacke an, es ist kalt.', exampleEnglish: "Please put on your jacket, it's cold." },
  { id: 'v67', lesson: 6, german: 'aufstehen', english: 'to get up', example: 'Ich stehe jeden Tag um sieben auf.', exampleEnglish: 'I get up at seven every day.' },
  { id: 'v68', lesson: 6, german: 'kochen', english: 'to cook', example: 'Mein Vater kocht gern italienisch.', exampleEnglish: 'My father likes to cook Italian food.' },
  { id: 'v69', lesson: 6, german: 'waschen', english: 'to wash', example: 'Ich wasche am Samstag meine Wäsche.', exampleEnglish: 'I do my laundry on Saturday.' },
  // Lesson 7 (Tangram aktuell 1, Lektion 7: Berlin! Berlin!)
  { id: 'v70', lesson: 7, german: 'Bahnhof', article: 'der', english: 'train station', plural: 'die Bahnhöfe', example: 'Der Bahnhof ist ganz in der Nähe.', exampleEnglish: 'The train station is very close by.' },
  { id: 'v71', lesson: 7, german: 'Bus', article: 'der', english: 'bus', plural: 'die Busse', example: 'Ich fahre mit dem Bus zur Arbeit.', exampleEnglish: 'I take the bus to work.' },
  { id: 'v72', lesson: 7, german: 'Flugzeug', article: 'das', english: 'airplane', plural: 'die Flugzeuge', example: 'Wir fliegen mit dem Flugzeug nach Berlin.', exampleEnglish: "We're flying to Berlin by plane." },
  { id: 'v73', lesson: 7, german: 'Fest', article: 'das', english: 'party, celebration', plural: 'die Feste', example: 'Am Samstag feiern wir ein großes Fest.', exampleEnglish: "On Saturday we're celebrating a big party." },
  { id: 'v74', lesson: 7, german: 'Post', article: 'die', english: 'post office, mail', example: 'Ich muss noch zur Post gehen.', exampleEnglish: 'I still need to go to the post office.' },
  { id: 'v75', lesson: 7, german: 'Reise', article: 'die', english: 'trip, journey', plural: 'die Reisen', example: 'Die Reise nach Berlin war toll.', exampleEnglish: 'The trip to Berlin was great.' },
  { id: 'v76', lesson: 7, german: 'S-Bahn', article: 'die', english: 'suburban train', plural: 'die S-Bahnen', example: 'Wir nehmen die S-Bahn zum Alexanderplatz.', exampleEnglish: "We're taking the S-Bahn to Alexanderplatz." },
  { id: 'v77', lesson: 7, german: 'Stadtplan', article: 'der', english: 'city map', plural: 'die Stadtpläne', example: 'Hast du einen Stadtplan von Berlin?', exampleEnglish: 'Do you have a city map of Berlin?' },
  { id: 'v78', lesson: 7, german: 'Straßenbahn', article: 'die', english: 'tram', plural: 'die Straßenbahnen', example: 'Die Straßenbahn hält direkt vor dem Museum.', exampleEnglish: 'The tram stops right in front of the museum.' },
  { id: 'v79', lesson: 7, german: 'U-Bahn', article: 'die', english: 'subway, underground', plural: 'die U-Bahnen', example: 'Die U-Bahn fährt alle fünf Minuten.', exampleEnglish: 'The subway runs every five minutes.' },
  { id: 'v80', lesson: 7, german: 'Weg', article: 'der', english: 'way, path', plural: 'die Wege', example: 'Entschuldigung, ich finde den Weg zum Bahnhof nicht.', exampleEnglish: "Excuse me, I can't find the way to the station." },
  { id: 'v81', lesson: 7, german: 'abfahren', english: 'to depart', example: 'Der Zug fährt um zehn Uhr ab.', exampleEnglish: "The train departs at ten o'clock." },
  { id: 'v82', lesson: 7, german: 'ansehen', english: 'to look at', example: 'Wir haben uns gestern das Museum angesehen.', exampleEnglish: 'We looked at the museum yesterday.' },
  { id: 'v83', lesson: 7, german: 'bleiben', english: 'to stay', example: 'Wir bleiben noch eine Woche in Berlin.', exampleEnglish: "We're staying in Berlin for another week." },
  { id: 'v84', lesson: 7, german: 'essen', english: 'to eat', example: 'Wir haben gestern im Restaurant gegessen.', exampleEnglish: 'We ate at the restaurant yesterday.' },
  { id: 'v85', lesson: 7, german: 'fahren', english: 'to drive, to go, to travel', example: 'Wir sind mit dem Auto nach Berlin gefahren.', exampleEnglish: 'We drove to Berlin by car.' },
  { id: 'v86', lesson: 7, german: 'kaufen', english: 'to buy', example: 'Ich habe eine Postkarte gekauft.', exampleEnglish: 'I bought a postcard.' },
  { id: 'v87', lesson: 7, german: 'sehen', english: 'to see', example: 'Hast du den Fernsehturm schon gesehen?', exampleEnglish: 'Have you already seen the TV tower?' },
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
  },
  {
    id: 'g6',
    lesson: 5,
    title: 'Modal Verbs (Modalverben)',
    explanation: 'German has six modal verbs: dürfen, können, mögen (möchten), müssen, sollen, wollen. They are irregular in the singular (no ending for ich/er/sie/es) and combine with a second verb in the infinitive, which is pushed to the very end of the sentence (the "Verbklammer").',
    examples: [
      { german: 'Ich kann gut schwimmen.', english: 'I can swim well.' },
      { german: 'Ich muss heute arbeiten.', english: 'I have to work today.' },
      { german: 'Darf ich hier rauchen?', english: 'Am I allowed to smoke here?' },
      { german: 'Wir möchten Deutsch lernen.', english: 'We would like to learn German.' },
      { german: 'Ich will heute Abend tanzen gehen.', english: 'I want to go dancing tonight.' }
    ]
  },
  {
    id: 'g7',
    lesson: 5,
    title: 'Ordinal Numbers and Dates (Ordinalzahlen und Datum)',
    explanation: 'Ordinal numbers are used for dates. From 1-19, add "-te" to the number (der dritte); from 20 onward, add "-ste" (der zwanzigste). To say "on" a date, use "am" plus the ordinal number with the ending "-en".',
    examples: [
      { german: 'der erste Januar', english: 'the first of January' },
      { german: 'am ersten Januar', english: 'on the first of January' },
      { german: 'Mein Geburtstag ist am dritten März.', english: 'My birthday is on the third of March.' },
      { german: 'Heute ist der zehnte Oktober.', english: 'Today is the tenth of October.' }
    ]
  },
  {
    id: 'g8',
    lesson: 6,
    title: 'Possessive Articles (Possessiv-Artikel)',
    explanation: 'Possessive articles show ownership: mein (my), dein (your), sein (his/its), ihr (her), unser (our), euer (your, pl.), ihr (their), Ihr (formal your). They take the same case endings as "ein/kein", depending on the gender and case of the noun that follows.',
    examples: [
      { german: 'Das ist mein Fahrrad.', english: 'That is my bicycle.' },
      { german: 'Wo ist deine Tasche?', english: 'Where is your bag?' },
      { german: 'Sein Bruder wohnt in Berlin.', english: 'His brother lives in Berlin.' },
      { german: 'Unser Haus ist klein.', english: 'Our house is small.' }
    ]
  },
  {
    id: 'g9',
    lesson: 6,
    title: 'Separable and Inseparable Verbs (Trennbare und nicht-trennbare Verben)',
    explanation: 'Separable verbs (with prefixes like ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-) split apart in a main clause: the prefix jumps to the end of the sentence and carries the word stress. Inseparable verbs (with prefixes be-, ent-, er-, ge-, miss-, ver-, zer-, wider-) never split, and the stress stays on the verb stem.',
    examples: [
      { german: 'Ruth holt Anna vom Kindergarten ab.', english: 'Ruth picks Anna up from kindergarten.' },
      { german: 'Thomas steht um 7 Uhr auf.', english: 'Thomas gets up at 7 o\'clock.' },
      { german: 'Die Lehrerin erklärt die Verben.', english: 'The teacher explains the verbs.' }
    ]
  },
  {
    id: 'g10',
    lesson: 7,
    title: 'The Perfect Tense (Das Perfekt)',
    explanation: 'The Perfekt is the main past tense used in spoken German. It is formed with a conjugated form of "haben" or "sein" in position 2, plus the Partizip II of the main verb at the very end of the sentence (the "Verbklammer"). Use "sein" for verbs of movement toward a destination (gehen, fahren, kommen) and for sein/bleiben/werden; use "haben" for most other verbs.',
    examples: [
      { german: 'Wir sind nach Berlin gefahren.', english: 'We went (drove) to Berlin.' },
      { german: 'Ich habe eine Postkarte gekauft.', english: 'I bought a postcard.' },
      { german: 'Hast du den Fernsehturm gesehen?', english: 'Have you seen the TV tower?' },
      { german: 'Sie ist zu Hause geblieben.', english: 'She stayed at home.' }
    ]
  },
  {
    id: 'g11',
    lesson: 7,
    title: 'Accusative Personal Pronouns (Personalpronomen im Akkusativ)',
    explanation: 'Personal pronouns change form in the accusative case: ich→mich, du→dich, er→ihn, sie→sie, es→es, wir→uns, ihr→euch, sie/Sie→sie/Sie. They are used to replace a direct object that has already been mentioned.',
    examples: [
      { german: 'Kennst du Anna? – Ja, ich kenne sie gut.', english: 'Do you know Anna? – Yes, I know her well.' },
      { german: 'Siehst du mich?', english: 'Can you see me?' },
      { german: 'Wir besuchen ihn morgen.', english: 'We are visiting him tomorrow.' }
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

  // Lesson 5 (Arbeit und Freizeit)
  {
    id: 'q13', lesson: 5, topic: 'grammatik', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Ich ___ heute leider nicht kommen. Ich bin krank.', options: ['kann', 'kannst', 'könnt', 'können'], correctAnswer: 'kann',
    explanation: 'The modal verb "können" in the "ich" form is "kann".', englishMeaning: "Unfortunately I can't come today. I'm sick."
  },
  {
    id: 'q14', lesson: 5, topic: 'satzbildung', difficulty: 'A1', questionType: 'sentence-building',
    question: 'heute / ich / muss / arbeiten', correctAnswer: 'Ich muss heute arbeiten.',
    explanation: 'The subject "Ich" is in position 1, the modal verb "muss" in position 2, and the infinitive "arbeiten" goes to the very end.', englishMeaning: 'I have to work today.'
  },
  {
    id: 'q15', lesson: 5, topic: 'grammatik', difficulty: 'A1', questionType: 'fill-in-blank',
    question: 'Mein Geburtstag ist ___ dritten März. (on the third of March)', correctAnswer: 'am',
    explanation: 'Dates use "am" + ordinal number + month: "am dritten März".', englishMeaning: 'My birthday is on the third of March.'
  },
  {
    id: 'q16', lesson: 5, topic: 'vocabulary', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Was passt? Im Winter ist es oft ___.', options: ['heiß', 'kalt', 'warm', 'sonnig'], correctAnswer: 'kalt',
    explanation: '"Winter" is typically the cold season.', englishMeaning: 'What fits? In winter it is often cold.'
  },

  // Lesson 6 (Familie und Haushalt)
  {
    id: 'q17', lesson: 6, topic: 'artikel', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Das ist nicht mein Buch, das ist ___ Buch. (his)', options: ['sein', 'seine', 'ihr', 'ihre'], correctAnswer: 'sein',
    explanation: '"Buch" is neuter, so in the nominative "sein" (his) takes no extra ending.', englishMeaning: "That's not my book, that's his book."
  },
  {
    id: 'q18', lesson: 6, topic: 'grammatik', difficulty: 'A1', questionType: 'fill-in-blank',
    question: 'Ich stehe jeden Morgen um sieben Uhr ___. (aufstehen)', correctAnswer: 'auf',
    explanation: '"aufstehen" is a separable verb; the prefix "auf" moves to the end of the sentence.', englishMeaning: "I get up every morning at seven o'clock."
  },
  {
    id: 'q19', lesson: 6, topic: 'grammatik', difficulty: 'A1', questionType: 'fill-in-blank',
    question: 'Häng das Bild bitte an ___ Wand! (die – Wohin?)', correctAnswer: 'die',
    explanation: 'With Wechselpräpositionen, "Wohin?" takes the accusative: "an die Wand".', englishMeaning: 'Please hang the picture on the wall!'
  },
  {
    id: 'q20', lesson: 6, topic: 'satzbildung', difficulty: 'A1', questionType: 'sentence-building',
    question: 'meine / kocht / Tante / gern / italienisch', correctAnswer: 'Meine Tante kocht gern italienisch.',
    explanation: 'Subject "Meine Tante" is in position 1, the verb "kocht" in position 2.', englishMeaning: 'My aunt likes cooking Italian food.'
  },

  // Lesson 7 (Berlin! Berlin!)
  {
    id: 'q21', lesson: 7, topic: 'grammatik', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Wir ___ gestern nach Berlin gefahren.', options: ['haben', 'sind', 'hat', 'ist'], correctAnswer: 'sind',
    explanation: '"fahren" is a verb of movement toward a destination, so it forms the Perfekt with "sein".', englishMeaning: 'We went (drove) to Berlin yesterday.'
  },
  {
    id: 'q22', lesson: 7, topic: 'grammatik', difficulty: 'A1', questionType: 'fill-in-blank',
    question: 'Ich habe eine Postkarte ___. (kaufen)', correctAnswer: 'gekauft',
    explanation: 'Regular verbs form the Partizip II with ge-...-t: kaufen → gekauft.', englishMeaning: 'I bought a postcard.'
  },
  {
    id: 'q23', lesson: 7, topic: 'grammatik', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Kennst du Anna? – Ja, ich kenne ___ gut.', options: ['sie', 'ihr', 'ihm', 'er'], correctAnswer: 'sie',
    explanation: 'The accusative form of "sie" (she) stays "sie".', englishMeaning: 'Do you know Anna? – Yes, I know her well.'
  },
  {
    id: 'q24', lesson: 7, topic: 'satzbildung', difficulty: 'A1', questionType: 'sentence-building',
    question: 'Berlin / wir / letztes Jahr / haben / besucht', correctAnswer: 'Wir haben letztes Jahr Berlin besucht.',
    explanation: 'The Perfekt forms a Verbklammer: "haben" in position 2, "besucht" at the end.', englishMeaning: 'We visited Berlin last year.'
  },

  // Lesson 8 (Alltagssituationen — Wiederholung / review of Lektion 5-7)
  {
    id: 'q25', lesson: 8, topic: 'lesen', difficulty: 'A1', questionType: 'multiple-choice',
    question: 'Lies: "Am Wochenende fahre ich mit dem Zug nach Berlin. Ich besuche meine Tante. Wir gehen zusammen ins Museum und kaufen Postkarten." – Wohin fährt die Person?',
    options: ['Nach Berlin', 'Nach München', 'Ans Meer', 'In die Schweiz'], correctAnswer: 'Nach Berlin',
    explanation: 'The text says "fahre ich ... nach Berlin".', englishMeaning: 'On the weekend I travel by train to Berlin. I visit my aunt. We go to the museum together and buy postcards.'
  },
  {
    id: 'q26', lesson: 8, topic: 'grammatik', difficulty: 'A1', questionType: 'true-false',
    question: 'Im Perfekt steht das Partizip II immer am Satzende.', options: ['True', 'False'], correctAnswer: 'True',
    explanation: 'The Perfekt forms a Verbklammer: the conjugated auxiliary is in position 2 and the Partizip II is at the very end.', englishMeaning: 'In the Perfekt, the past participle always goes at the end of the sentence.'
  },
  {
    id: 'q27', lesson: 8, topic: 'artikel', difficulty: 'A1', questionType: 'multiple-choice',
    question: '___ Handy ist kaputt. (mein)', options: ['mein', 'meine', 'meinen', 'meiner'], correctAnswer: 'mein',
    explanation: '"Handy" is neuter, so the nominative possessive article "mein" takes no ending.', englishMeaning: 'My phone is broken.'
  },
];
