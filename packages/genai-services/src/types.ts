/**
 * Type definitions for BrainSAIT GenAI Services
 */

import type { GenerateContentResponse } from '@google/genai';

export type CustomGenerateContentResponse = GenerateContentResponse;

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type VideoAspectRatio = '9:16' | '16:9';

export type LanguageCode = 'ar' | 'en';
export type CulturalContext = 'saudi' | 'sudan' | 'gulf' | 'levant' | 'maghreb';

export interface GenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  language?: LanguageCode;
  culturalContext?: CulturalContext;
}

export interface RAGConfig {
  chunkSize?: number;
  chunkOverlap?: number;
  topK?: number;
  similarityThreshold?: number;
  enableCaching?: boolean;
}

export interface RAGResponse {
  answer: string;
  citations: Array<{
    chunk: string;
    score: number;
    source?: string;
  }>;
  confidence: number;
  language: LanguageCode;
}

export interface SpeechConfig {
  voiceName?: string;
  languageCode?: string;
  speakingRate?: number;
  pitch?: number;
}

export interface ImageGenerationConfig {
  aspectRatio?: AspectRatio;
  numberOfImages?: number;
  outputMimeType?: 'image/png' | 'image/jpeg';
}

export interface VideoGenerationConfig {
  aspectRatio?: VideoAspectRatio;
  resolution?: '720p' | '1080p';
  numberOfVideos?: number;
}

export interface GroundingConfig {
  type: 'search' | 'maps';
  enableCitations?: boolean;
}

export interface ThinkingConfig {
  thinkingBudget?: number;
  enableReflection?: boolean;
}

export enum ModelName {
  FLASH_LATEST = 'gemini-flash-latest',
  FLASH_2_5 = 'gemini-2.5-flash',
  PRO_2_5 = 'gemini-2.5-pro',
  IMAGEN_4 = 'imagen-4.0-generate-001',
  FLASH_IMAGE = 'gemini-2.5-flash-image',
  VEO_3_1 = 'veo-3.1-fast-generate-preview',
  TTS_FLASH = 'gemini-2.5-flash-preview-tts',
}

export interface ComplianceMetadata {
  isPHI?: boolean;
  pdplCompliant?: boolean;
  hipaaCompliant?: boolean;
  auditRequired?: boolean;
  userId?: string;
  sessionId?: string;
}

export interface GenAIError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  retryable: boolean;
}
