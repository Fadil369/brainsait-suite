/**
 * RAG (Retrieval Augmented Generation) Services
 * File Search and document-based question answering
 */

import { getGenAIClient } from './client';
import { handleGenAIError } from './utils';
import type { RAGConfig, RAGResponse, LanguageCode } from './types';

/**
 * Simple keyword-based relevance scoring for chunks
 */
function findRelevantChunks(
  query: string,
  chunks: string[],
  topK: number = 3
): Array<{ chunk: string; score: number }> {
  const queryWords = new Set(
    query.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  );

  const scoredChunks = chunks.map((chunk) => {
    const chunkWords = new Set(chunk.toLowerCase().split(/\s+/));
    let score = 0;

    queryWords.forEach((word) => {
      if (chunkWords.has(word)) {
        score++;
      }
    });

    // Boost score for exact phrase matches
    if (chunk.toLowerCase().includes(query.toLowerCase())) {
      score += 10;
    }

    return { chunk, score };
  });

  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, topK).filter((c) => c.score > 0);
}

/**
 * Generate RAG response with citations
 */
export async function generateRAGResponse(
  prompt: string,
  chunks: string[],
  config?: RAGConfig
): Promise<RAGResponse> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();
    const clientConfig = client.getConfig();

    const ragConfig: Required<RAGConfig> = {
      chunkSize: 1000,
      chunkOverlap: 200,
      topK: 3,
      similarityThreshold: 0.1,
      enableCaching: true,
      ...config,
    };

    const relevantChunks = findRelevantChunks(
      prompt,
      chunks,
      ragConfig.topK
    );

    if (relevantChunks.length === 0) {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `The user asked: "${prompt}". I could not find any relevant information in the provided document. Please inform the user that their question cannot be answered based on the document's content.`,
      });

      return {
        answer: fallbackResponse.text,
        citations: [],
        confidence: 0,
        language: clientConfig.language || 'en',
      };
    }

    const context = relevantChunks.map((c) => c.chunk).join('\n\n---\n\n');
    const fullPrompt = `Based on the following document context, please answer the user's question.
If the context does not contain the answer, state that you cannot find the information in the provided document.

CONTEXT:
${context}

QUESTION:
${prompt}

ANSWER:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const avgScore =
      relevantChunks.reduce((sum, c) => sum + c.score, 0) /
      relevantChunks.length;
    const maxScore = Math.max(...relevantChunks.map((c) => c.score));
    const confidence = Math.min((avgScore / maxScore) * 100, 100);

    return {
      answer: response.text,
      citations: relevantChunks.map((c) => ({
        chunk: c.chunk,
        score: c.score,
      })),
      confidence,
      language: clientConfig.language || 'en',
    };
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Split document into chunks for RAG
 */
export function chunkDocument(
  text: string,
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);
    chunks.push(chunk);

    startIndex += chunkSize - chunkOverlap;
  }

  return chunks;
}

/**
 * Generate File Search query using Gemini API
 * Note: This is a placeholder for the actual Gemini File Search API
 * which requires corpus/document management setup
 */
export async function fileSearchQuery(
  query: string,
  corpusId: string
): Promise<RAGResponse> {
  try {
    // TODO: Implement actual File Search API integration
    // This requires setting up a corpus and uploading documents
    // For now, return a placeholder response
    
    throw new Error(
      'File Search API integration not yet implemented. Use generateRAGResponse() with pre-chunked documents.'
    );
  } catch (error) {
    throw handleGenAIError(error);
  }
}

/**
 * Extract medical terminology from Arabic text
 * Useful for NPHIES compliance and terminology validation
 */
export async function extractMedicalTerms(
  arabicText: string
): Promise<string[]> {
  try {
    const client = getGenAIClient();
    const ai = client.getClient();

    const prompt = `Extract all medical terminology from the following Arabic text.
Return only the medical terms as a comma-separated list.
Do not include any explanations or additional text.

Text:
${arabicText}

Medical Terms:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const terms = response.text
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    return terms;
  } catch (error) {
    throw handleGenAIError(error);
  }
}
