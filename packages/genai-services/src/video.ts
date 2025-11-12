/**
 * Video Generation Services
 * Using Veo 3.1 Fast Generate
 */

import { getGenAIClient } from './client';
import { handleGenAIError, fileToGenerativePart } from './utils';
import type { VideoAspectRatio } from './types';

/**
 * Generate video from text prompt using Veo 3.1
 */
export async function generateVideoFromPrompt(
  prompt: string,
  aspectRatio: VideoAspectRatio = '16:9'
): Promise<string> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();
    const config = client.getConfig();

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio,
      },
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error('Video generation failed to produce a download link.');
    }

    // Download video with API key
    const res = await fetch(`${downloadLink}&key=${config.apiKey}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Generate video from image with text prompt
 */
export async function generateVideoFromImage(
  imageFile: File,
  prompt: string,
  aspectRatio: VideoAspectRatio = '16:9'
): Promise<string> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();
    const config = client.getConfig();
    const imagePart = await fileToGenerativePart(imageFile);

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      image: {
        imageBytes: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio,
      },
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error('Video generation failed to produce a download link.');
    }

    // Download video with API key
    const res = await fetch(`${downloadLink}&key=${config.apiKey}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Check video generation status
 */
export async function getVideoOperationStatus(
  operationId: string
): Promise<{ done: boolean; progress?: number }> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    const operation = await ai.operations.getVideosOperation({
      operation: { name: operationId } as any,
    });

    return {
      done: operation.done || false,
      progress: operation.metadata?.progressPercentage as number | undefined,
    };
  } catch (error) {
    throw handleGenAIError(error);
  }
}
