/**
 * Text Generation Services
 * Includes chat, grounding, and extended thinking
 */

import { getGenAIClient } from './client';
import { handleGenAIError } from './utils';
import type {
  CustomGenerateContentResponse,
  GroundingConfig,
  ThinkingConfig,
  ModelName,
} from './types';

/**
 * Generate text with fast response (Flash model)
 */
export async function generateFastResponse(
  prompt: string
): Promise<CustomGenerateContentResponse> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    return await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Generate text with standard Flash 2.5 model
 */
export async function generateText(
  prompt: string,
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro' = 'gemini-2.5-flash'
): Promise<string> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Generate content with grounding (Google Search or Maps)
 */
export async function generateGroundedContent(
  prompt: string,
  config: GroundingConfig
): Promise<CustomGenerateContentResponse> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    const tools =
      config.type === 'search'
        ? [{ googleSearch: {} }]
        : [{ googleMaps: {} }];

    return await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { tools },
    });
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Generate content with extended thinking (Gemini 2.5 Pro)
 */
export async function generateWithThinking(
  prompt: string,
  config?: ThinkingConfig
): Promise<CustomGenerateContentResponse> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    return await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: config?.thinkingBudget || 32768,
        },
      },
    });
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Stream text generation
 */
export async function* streamText(
  prompt: string,
  model: ModelName = 'gemini-2.5-flash' as ModelName
): AsyncGenerator<string, void, unknown> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // For now, yield the complete text since streaming API might differ
    if (response.text) {
      yield response.text;
    }
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Generate bilingual response (Arabic + English)
 */
export async function generateBilingualResponse(
  prompt: string,
  primaryLanguage: 'ar' | 'en' = 'ar'
): Promise<{ ar: string; en: string }> {
  try {
    const client = getGenAIClient();
    const config = client.getConfig();

    const systemPrompt = `You are a bilingual assistant for BrainSAIT healthcare platform.
Provide responses in both Arabic and English.
Cultural context: ${config.culturalContext}
Primary language: ${primaryLanguage}

Format your response as:
[ARABIC]
<arabic response>
[/ARABIC]

[ENGLISH]
<english response>
[/ENGLISH]`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;
    const response = await generateText(fullPrompt, 'gemini-2.5-flash');

    const arMatch = response.match(/\[ARABIC\]([\s\S]*?)\[\/ARABIC\]/);
    const enMatch = response.match(/\[ENGLISH\]([\s\S]*?)\[\/ENGLISH\]/);

    return {
      ar: arMatch ? arMatch[1].trim() : '',
      en: enMatch ? enMatch[1].trim() : response,
    };
  } catch (error) {
    throw handleGenAIError(error);
  }
}
