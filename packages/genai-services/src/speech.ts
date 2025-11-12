/**
 * Speech Synthesis Services
 * Text-to-Speech using Gemini 2.5 Flash TTS
 */

import { Modality } from '@google/genai';
import { getGenAIClient } from './client';
import { handleGenAIError } from './utils';
import type { SpeechConfig } from './types';

/**
 * Generate speech from text using Gemini TTS
 */
export async function generateSpeech(
  text: string,
  config?: SpeechConfig
): Promise<ArrayBuffer> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    const voiceConfig = config?.voiceName
      ? { voiceName: config.voiceName }
      : { voiceName: 'Kore' }; // Default voice

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: voiceConfig,
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]
      ?.inlineData?.data as string;

    if (!base64Audio) {
      throw new Error('No audio data generated');
    }

    // Convert base64 to ArrayBuffer
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Generate bilingual speech (Arabic + English)
 */
export async function generateBilingualSpeech(
  arabicText: string,
  englishText: string
): Promise<{ ar: ArrayBuffer; en: ArrayBuffer }> {
  try {
    const [arAudio, enAudio] = await Promise.all([
      generateSpeech(arabicText, { voiceName: 'Kore' }), // Arabic voice
      generateSpeech(englishText, { voiceName: 'Aoede' }), // English voice
    ]);

    return { ar: arAudio, en: enAudio };
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Available TTS voices
 */
export const TTS_VOICES = {
  // English voices
  AOEDE: 'Aoede', // Female, clear
  CHARON: 'Charon', // Male, professional
  FENRIR: 'Fenrir', // Male, warm
  PUCK: 'Puck', // Gender-neutral, young
  
  // Multilingual voices (support Arabic)
  KORE: 'Kore', // Female, neutral
} as const;

export type TTSVoiceName = (typeof TTS_VOICES)[keyof typeof TTS_VOICES];
