/**
 * Speech synthesis utility for German pronunciation.
 * Uses browser Web Speech API with fallback voice detection.
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

let germanVoices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (!synth) return;
  const voices = synth.getVoices();
  germanVoices = voices.filter(v => v.lang.startsWith('de'));
}

if (synth) {
  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
}

export function speakGerman(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (!synth) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();

    // Clean text of punctuation or tags that may cause awkward pronunciation
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-DE';
    utterance.rate = rate; // 0.75 - 1.0 is ideal for language learning
    utterance.pitch = 1.0;

    if (germanVoices.length === 0) {
      loadVoices();
    }

    // Prefer native or high-quality German voice if available
    const preferredVoice = germanVoices.find(v => v.lang === 'de-DE' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))) 
      || germanVoices.find(v => v.lang.startsWith('de')) 
      || null;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    synth.speak(utterance);
  });
}

export function stopSpeaking() {
  if (synth) {
    synth.cancel();
  }
}
