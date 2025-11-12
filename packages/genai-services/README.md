# @brainsait/genai-services

Unified Google Gemini AI service layer for BrainSAIT Suite.

## Features

- **Text Generation**: Chat, grounding, extended thinking
- **Image Generation**: Imagen 4.0, image editing, analysis
- **Video Generation**: Veo 3.1 from text or image
- **Speech Synthesis**: TTS with multiple voices
- **RAG**: Document-based Q&A with citations
- **Bilingual Support**: Arabic + English
- **Error Handling**: Automatic retries with exponential backoff
- **Type Safety**: Full TypeScript support

## Installation

```bash
pnpm add @brainsait/genai-services
```

## Usage

### Initialize Client

```typescript
import { initializeGenAI } from '@brainsait/genai-services';

initializeGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  language: 'ar',
  culturalContext: 'saudi',
});
```

### Text Generation

```typescript
import { generateText, generateGroundedContent } from '@brainsait/genai-services';

// Simple text generation
const response = await generateText('ما هي أعراض السكري؟');

// With Google Search grounding
const grounded = await generateGroundedContent(
  'Latest healthcare regulations in Saudi Arabia',
  { type: 'search' }
);
```

### RAG (Document Q&A)

```typescript
import { generateRAGResponse, chunkDocument } from '@brainsait/genai-services';

const documentText = '...'; // Your document content
const chunks = chunkDocument(documentText);

const response = await generateRAGResponse(
  'What are the key findings?',
  chunks
);

console.log(response.answer);
console.log(response.citations);
console.log(response.confidence);
```

### Image Generation

```typescript
import { generateImage, editImage } from '@brainsait/genai-services';

// Generate image
const imageUrl = await generateImage('Modern hospital building', '16:9');

// Edit image
const editedUrl = await editImage(imageFile, 'Add more trees');
```

### Video Generation

```typescript
import { generateVideoFromPrompt } from '@brainsait/genai-services';

const videoUrl = await generateVideoFromPrompt(
  'A doctor explaining treatment options',
  '16:9'
);
```

### Speech Synthesis

```typescript
import { generateSpeech, TTS_VOICES } from '@brainsait/genai-services';

const audioBuffer = await generateSpeech('مرحباً بك في BrainSAIT', {
  voiceName: TTS_VOICES.KORE,
});
```

## API Reference

See [API Documentation](./docs/api.md) for full reference.

## License

Proprietary - Copyright © 2025 BrainSAIT
