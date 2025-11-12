/**
 * GenAI Client - Centralized Gemini API client
 */

import { GoogleGenAI } from '@google/genai';
import type { GenAIConfig } from './types';

export class GenAIClient {
  private ai: GoogleGenAI;
  private config: GenAIConfig;

  constructor(config: GenAIConfig) {
    if (!config.apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    this.config = {
      temperature: 0.7,
      maxTokens: 4096,
      language: 'en',
      culturalContext: 'saudi',
      ...config,
    };

    this.ai = new GoogleGenAI({ apiKey: this.config.apiKey });
  }

  getClient(): GoogleGenAI {
    return this.ai;
  }

  getConfig(): GenAIConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<GenAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

let clientInstance: GenAIClient | null = null;

export function initializeGenAI(config: GenAIConfig): GenAIClient {
  clientInstance = new GenAIClient(config);
  return clientInstance;
}

export function getGenAIClient(): GenAIClient {
  if (!clientInstance) {
    throw new Error('GenAI client not initialized. Call initializeGenAI() first.');
  }
  return clientInstance;
}
