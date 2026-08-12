# Project Rules & Guidelines

## Core Development Rules
- **Backend & Database**: PostgreSQL with Prisma ORM. Modular 4-layer architecture (`controllers`, `services`, `repositories`, `dtos`). Strict multi-tenancy checking (`tenantId`/`empresaId`).
- **Frontend Architecture**: Atomic, modular component design in React/Vite. Generic reusable UI components in `src/components/ui/`. Premium HSL design system, micro-animations, zero code duplication.
- **Single Responsibility & File Limits**: Keep files under 250-300 lines. Decouple API service calls from UI components. No monolithic handlers or inline direct fetches in view components.
- **Modification Principles**: Minimal focused changes. No silent refactorings. Strict TypeScript typing (avoid `any`).
