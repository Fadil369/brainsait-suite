/**
 * Utility functions for GenAI services
 */

import type { GenAIError } from './types';

/**
 * Handle Gemini API errors
 */
export function handleGenAIError(error: unknown): GenAIError {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    // Check for rate limiting
    if (error.message.includes('429') || error.message.includes('quota')) {
      return {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'API rate limit exceeded. Please try again later.',
        details: error,
        timestamp,
        retryable: true,
      };
    }

    // Check for authentication errors
    if (error.message.includes('401') || error.message.includes('403')) {
      return {
        code: 'AUTHENTICATION_FAILED',
        message: 'Invalid API key or insufficient permissions.',
        details: error,
        timestamp,
        retryable: false,
      };
    }

    // Check for network errors
    if (
      error.message.includes('network') ||
      error.message.includes('ECONNREFUSED')
    ) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed. Please check your internet connection.',
        details: error,
        timestamp,
        retryable: true,
      };
    }

    // Generic error
    return {
      code: 'GEMINI_API_ERROR',
      message: error.message,
      details: error,
      timestamp,
      retryable: false,
    };
  }

  // Unknown error type
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    details: error,
    timestamp,
    retryable: false,
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: GenAIError | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = handleGenAIError(error);

      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Convert File to base64 data URL
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert File to Generative Part for Gemini API
 */
export async function fileToGenerativePart(file: File): Promise<{
  inlineData: { data: string; mimeType: string };
}> {
  const base64Data = await fileToBase64(file);
  const base64String = base64Data.split(',')[1]; // Remove data URL prefix

  return {
    inlineData: {
      data: base64String,
      mimeType: file.type,
    },
  };
}

/**
 * Encode Uint8Array to base64 string
 */
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decode base64 string to Uint8Array
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decode raw PCM audio data into an AudioBuffer for playback
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Validate API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.length > 20;
}

/**
 * Sanitize user input to prevent prompt injection
 */
export function sanitizeInput(input: string): string {
  // Remove potential prompt injection patterns
  return input
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();
}
