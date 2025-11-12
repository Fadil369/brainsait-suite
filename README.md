# BrainSAIT Suite

> **Unified Healthcare AI Platform** — Solutions, Automated, Integrated

BrainSAIT Suite consolidates AFHAM AI Studio and BrainSAIT Core into a single, production-ready platform for healthcare professionals in Saudi Arabia and Sudan, featuring bilingual support, compliance with PDPL/HIPAA/NPHIES, and powered by Google Gemini AI with File Search RAG.

## 🏗️ Architecture

```
brainsait-suite/
├── apps/
│   ├── web-portal/          # Next.js 15 web application
│   └── native/              # Expo React Native mobile app
├── packages/
│   ├── ui-components/       # Shared UI library (Tailwind + RTL)
│   ├── genai-services/      # Gemini AI & File Search integration
│   ├── data-access/         # API client & data hooks
│   └── compliance/          # PDPL/HIPAA audit & security
├── services/
│   └── efhm-api/            # FastAPI backend with RAG
├── infrastructure/          # Docker, IaC, CI/CD
└── docs/                    # Documentation & guides
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Python 3.11+
- Docker & Docker Compose
- Google Cloud account with Gemini API access

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/Fadil369/brainsait-suite.git
cd brainsait-suite
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development environment
pnpm dev
```

### Development

```bash
# Run all apps in development
pnpm dev

# Run specific app
pnpm --filter web-portal dev
pnpm --filter efhm-api dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format
```

## 📦 Packages

### Apps

- **web-portal**: Next.js 15 web application with App Router, SSR, bilingual UI
- **native**: Expo React Native mobile app for iOS/Android

### Packages

- **ui-components**: Shared design system with Tailwind CSS, RTL support, Arabic typography
- **genai-services**: Gemini AI integration with File Search RAG, multimodal capabilities
- **data-access**: GraphQL/REST client, TanStack Query hooks, caching layer
- **compliance**: PDPL/HIPAA utilities, audit logging, consent management

### Services

- **efhm-api**: FastAPI backend with PostgreSQL, Redis, workspace management, RAG pipeline

## 🌍 Localization

BrainSAIT Suite supports Arabic and English with full RTL layout support:

- **Arabic**: Default for user-facing content in Saudi Arabia & Sudan
- **English**: Technical content, API documentation, developer tools
- **RTL**: Automatic layout direction switching
- **Medical Terms**: Localized NPHIES-compliant terminology

## 🔒 Compliance

- **PDPL**: Saudi Personal Data Protection Law
- **HIPAA**: Health Insurance Portability and Accountability Act
- **NPHIES**: Saudi National Platform for Health Information Exchange
- **FHIR R4**: HL7 Fast Healthcare Interoperability Resources

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Development Guide](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)
- [Compliance Playbook](./docs/compliance.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and code of conduct.

## 📝 License

Proprietary - Copyright © 2025 BrainSAIT. All rights reserved.

## 🆘 Support

- Email: support@brainsait.com
- Documentation: https://docs.brainsait.com
- Issue Tracker: https://github.com/Fadil369/brainsait-suite/issues

---

**Built with ❤️ by the BrainSAIT Team**
