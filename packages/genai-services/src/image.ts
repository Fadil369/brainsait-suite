/**
 * Image Generation & Editing Services
 * Using Imagen 4.0 and Gemini 2.5 Flash Image
 */

import { Modality } from '@google/genai';
import { getGenAIClient } from './client';
import { handleGenAIError, fileToGenerativePart } from './utils';
import type { AspectRatio, ImageGenerationConfig } from './types';

/**
 * Generate image from text prompt using Imagen 4.0
 */
export async function generateImage(
  prompt: string,
  aspectRatio: AspectRatio = '1:1'
): Promise<string> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio,
      },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Edit image using Gemini 2.5 Flash Image
 */
export async function editImage(
  imageFile: File,
  prompt: string
): Promise<string> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0].content.parts.find(
      (p) => p.inlineData
    );
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error('No image was generated.');
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Analyze image with text prompt
 */
export async function analyzeImage(
  imageFile: File,
  prompt: string
): Promise<string> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
    });

    return response.text;
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Batch generate multiple images
 */
export async function generateImageBatch(
  prompts: string[],
  aspectRatio: AspectRatio = '1:1'
): Promise<string[]> {
  const results = await Promise.allSettled(
    prompts.map((prompt) => generateImage(prompt, aspectRatio))
  );

  return results.map((result) =>
    result.status === 'fulfilled' ? result.value : ''
  );
}
