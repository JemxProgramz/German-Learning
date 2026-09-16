import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Endpoint: Generate dynamic original German vocabulary
app.post('/api/gemini/generate-vocab', async (req, res) => {
  try {
    const { topic = 'general', level = 'A1', count = 5 } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured; fallback to local generator',
        words: [],
      });
    }

    const prompt = `Generate ${count} completely original, high-quality German vocabulary items for CEFR level ${level} on the topic "${topic}".
Ensure these are realistic, standard everyday words suitable for German learners.
Do not reproduce any copyrighted textbook lists.
Each word MUST include:
- german: word in German (if noun, capitalized)
- article: 'der', 'die', or 'das' (null if not a noun)
- plural: plural form with article e.g. 'die Äpfel' (or null if verb/adjective)
- english: accurate English translation
- example: a natural, level-appropriate original example sentence in German
- exampleEnglish: accurate English translation of the example sentence
- difficulty: '${level}'
- topic: '${topic}'`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              german: { type: Type.STRING },
              article: { type: Type.STRING },
              plural: { type: Type.STRING },
              english: { type: Type.STRING },
              example: { type: Type.STRING },
              exampleEnglish: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ['german', 'english', 'example', 'exampleEnglish'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    const wordsWithIds = parsed.map((item: any, idx: number) => ({
      ...item,
      id: `ai-v-${Date.now()}-${idx}`,
      isCustom: true,
    }));

    res.json({ success: true, words: wordsWithIds });
  } catch (error: any) {
    console.error('Error generating vocab with Gemini:', error);
    res.status(200).json({
      fallback: true,
      error: error.message || 'Gemini generation error',
      words: [],
    });
  }
});

// Endpoint: Generate dynamic listening exercises (transcription, meaning, dialogue)
app.post('/api/gemini/generate-listening', async (req, res) => {
  try {
    const { topic = 'general', level = 'A1', count = 3 } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured; fallback to local generator',
        exercises: [],
      });
    }

    const prompt = `Generate ${count} original German listening comprehension exercises for CEFR level ${level} on topic "${topic}".
Include a mix of:
1. 'transcription': A natural spoken German sentence to transcribe (dictation).
2. 'meaning': A short spoken situation or announcement where the user chooses what was said or requested.
3. 'dialogue-comprehension': A realistic 2-3 line conversation between two German speakers (e.g. at bakery, train station, office) with a comprehension question and 4 multiple-choice options.

Return valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              level: { type: Type.STRING },
              topic: { type: Type.STRING },
              germanText: { type: Type.STRING },
              speakerRole: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
              englishTranslation: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['type', 'germanText', 'correctAnswer', 'englishTranslation', 'explanation'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    const exercisesWithIds = parsed.map((item: any, idx: number) => ({
      ...item,
      id: `ai-lis-${Date.now()}-${idx}`,
    }));

    res.json({ success: true, exercises: exercisesWithIds });
  } catch (error: any) {
    console.error('Error generating listening with Gemini:', error);
    res.status(200).json({
      fallback: true,
      error: error.message,
      exercises: [],
    });
  }
});

// Endpoint: Generate dynamic writing prompts
app.post('/api/gemini/generate-writing-prompts', async (req, res) => {
  try {
    const { topic = 'general', level = 'A1', count = 2 } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured; fallback to local generator',
        prompts: [],
      });
    }

    const prompt = `Generate ${count} original German writing prompts for level ${level} on topic "${topic}".
Each prompt must include:
- title: concise title in German and English
- level: '${level}'
- topic: '${topic}'
- prompt: instruction in German
- promptEnglish: instruction in English
- guidingPoints: array of 3-4 bullet points the user must include
- minWords: integer (e.g. 20 for A1, 35 for A2, 50 for B1)
- targetGrammar: specific grammar focus (e.g. 'Perfekt', 'Modalverben', 'Nebensätze mit weil')`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              level: { type: Type.STRING },
              topic: { type: Type.STRING },
              prompt: { type: Type.STRING },
              promptEnglish: { type: Type.STRING },
              guidingPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              minWords: { type: Type.INTEGER },
              targetGrammar: { type: Type.STRING },
            },
            required: ['title', 'prompt', 'promptEnglish', 'guidingPoints', 'minWords'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    const promptsWithIds = parsed.map((item: any, idx: number) => ({
      ...item,
      id: `ai-wp-${Date.now()}-${idx}`,
    }));

    res.json({ success: true, prompts: promptsWithIds });
  } catch (error: any) {
    console.error('Error generating writing prompts with Gemini:', error);
    res.status(200).json({
      fallback: true,
      error: error.message,
      prompts: [],
    });
  }
});

// Endpoint: Review, correct & evaluate user German writing
app.post('/api/gemini/correct-writing', async (req, res) => {
  try {
    const { userText, promptTitle, level = 'A1', guidingPoints = [] } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY configured; using local evaluator',
      });
    }

    const evaluationPrompt = `You are an encouraging, expert German language teacher.
Evaluate the following German student submission.
Target Level: ${level}
Task Title: "${promptTitle || 'Freies Schreiben'}"
Guiding Points: ${JSON.stringify(guidingPoints)}

Student's written text:
"""
${userText}
"""

Please analyze:
1. Overall CEFR score (0 to 100) and evaluated level (${level}).
2. Summary: 2-3 friendly, constructive sentences in German and English explaining what went well and what to improve.
3. Corrected text: Natural, grammatically correct German version of the user's text.
4. Specific corrections list: Each correction with:
   - original: the faulty segment
   - corrected: the fixed segment
   - explanation: plain, beginner-friendly explanation of why it was changed (e.g. why a noun must be capitalized, why the verb is in position 2, or accusative vs dative).
   - mistakeType: one of ['Noun Capitalization', 'Word Order', 'Verb Conjugation', 'Case (Akk/Dat)', 'Preposition', 'Spelling', 'Vocabulary']
5. Strengths: 2-3 specific things the student did well.
6. Mistake categories: list of error category tags identified (e.g. ['Noun Capitalization', 'Word Order']).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: evaluationPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            cefrRating: { type: Type.STRING },
            summary: { type: Type.STRING },
            correctedText: { type: Type.STRING },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  mistakeType: { type: Type.STRING },
                },
                required: ['original', 'corrected', 'explanation', 'mistakeType'],
              },
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            mistakeCategories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['score', 'cefrRating', 'summary', 'correctedText', 'corrections', 'strengths', 'mistakeCategories'],
        },
      },
    });

    const text = response.text || '{}';
    const feedback = JSON.parse(text);

    res.json({ success: true, feedback });
  } catch (error: any) {
    console.error('Error correcting writing with Gemini:', error);
    res.status(200).json({
      fallback: true,
      error: error.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
