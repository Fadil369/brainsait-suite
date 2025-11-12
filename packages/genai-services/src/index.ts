/**
 * @brainsait/genai-services
 * 
 * Unified Google Gemini AI service layer for BrainSAIT Suite
 * Consolidates AFHAM and BrainSAIT Core Gemini integrations
 * 
 * Features:
 * - Text generation & chat
 * - Image generation & editing (Imagen 4.0)
 * - Video generation (Veo 3.1)
 * - Speech synthesis & recognition
 * - File Search RAG
 * - Grounding with Google Search & Maps
 * - Extended thinking (Gemini 2.5 Pro)
 * - Error handling & retries
 * - Observability & logging
 */

export * from './client';
export * from './text';
export * from './image';
export * from './video';
export * from './speech';
export * from './rag';
export * from './types';
export * from './utils';
