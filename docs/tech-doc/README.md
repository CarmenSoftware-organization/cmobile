# Carmen Supply Chain Mobile App - Technical Documentation

## Overview
This directory contains comprehensive technical documentation for the Carmen Supply Chain Mobile App, a Next.js-based mobile-first application for hospitality supply chain management.

## Documentation Structure

### 📋 [Brownfield Architecture](./brownfield-architecture.md)
**Complete system architecture and current implementation state**
- High-level architecture overview
- Technology stack and dependencies
- Project structure and module organization
- Integration points and technical debt
- Development and deployment processes

### 📊 [Data Models Reference](./data-models-reference.md)
**Comprehensive guide to all data structures and interfaces**
- Core business entities (PO, GRN, PR)
- Authentication and user management
- Inventory management models
- Workflow and business logic types
- Multi-currency support implementation

### 📱 [Mobile UI Patterns](./mobile-ui-patterns.md)
**Mobile-first UI design system and component architecture**
- Design system foundation (themes, typography, colors)
- Mobile layout patterns and navigation
- Component library documentation
- Accessibility and responsive design
- Animation and interaction patterns

### ⚙️ [Workflow Implementation](./workflow-implementation.md)
**Business workflow engines and process management**
- Core workflow engine architecture
- Purchase requisition approval workflows
- Receiving and GRN processes
- Physical count and spot check workflows
- State persistence and error handling

### 🛠️ [Development Guide](./development-guide.md)
**Developer onboarding and coding standards**
- Quick start and setup instructions
- Project structure deep dive
- Coding standards and best practices
- Mobile development guidelines
- Testing and debugging approaches

## Quick Navigation

### For New Developers
1. Start with [Development Guide](./development-guide.md) for setup
2. Review [Brownfield Architecture](./brownfield-architecture.md) for system understanding
3. Study [Data Models Reference](./data-models-reference.md) for data structures
4. Explore [Mobile UI Patterns](./mobile-ui-patterns.md) for UI development

### For System Integration
1. [Brownfield Architecture](./brownfield-architecture.md) - Current state and integration points
2. [Data Models Reference](./data-models-reference.md) - API interface design
3. [Workflow Implementation](./workflow-implementation.md) - Business logic integration

### For UI/UX Development
1. [Mobile UI Patterns](./mobile-ui-patterns.md) - Design system and components
2. [Development Guide](./development-guide.md) - Implementation guidelines
3. [Brownfield Architecture](./brownfield-architecture.md) - Component organization

## Key Technologies

### Core Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Development**: Stagewise development tools

### Mobile-First Features
- **PWA Ready**: Manifest and service worker support
- **Touch Optimized**: 44px minimum touch targets
- **Responsive Design**: Mobile-first with adaptive layouts
- **Dark Mode**: Complete light/dark theme support
- **Accessibility**: WCAG compliant with screen reader support

## Application Architecture

### Route Structure
```
/ (landing)
├── /welcome (welcome screen)
├── /onboarding (user onboarding)
├── (auth)/ (authentication flow)
│   ├── /login
│   ├── /two-factor
│   ├── /business-unit-selection
│   └── /password-reset
└── (mobile)/ (main application)
    ├── /dashboard (priority actions)
    ├── /receiving (PO receiving workflows)
    ├── /pr-approval (PR approval workflows)
    ├── /store-requisition (SR management)
    ├── /physical-count (inventory counting)
    ├── /spot-check (quality control)
    └── /profile (user management)
```

### Core Workflows
1. **Purchase Requisition Approval**: Multi-stage approval with role-based access
2. **Receiving Process**: PO to GRN conversion with quality control
3. **Physical Count**: Session-based inventory counting with audit trails
4. **Spot Check**: Random quality control audits
5. **Store Requisition**: Internal inventory requests and approvals

## Current Implementation Status

### ✅ Completed Features
- Complete authentication flow with 2FA
- Mobile-responsive dashboard with priority actions
- Purchase requisition approval workflow
- Receiving module with GRN creation
- Physical count sessions with review process
- Spot check quality control workflows
- Store requisition management
- Multi-currency support (SGD, IDR, THB, USD)
- Dark/light theme system

### 🔄 Mock Data Implementation
- Comprehensive TypeScript interfaces
- Realistic hotel supply chain data
- Multi-business unit scenarios
- Complete workflow state simulation
- Currency conversion examples

### 🚧 Future Integration Points
- Real backend API integration
- Authentication service integration
- Database persistence layer
- Push notification service
- Offline synchronization
- Real-time collaboration features

## Development Environment

### Quick Start
```bash
# Install dependencies
npm install

# Start development server (port 3002)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Key Development Files
- **Entry Point**: `src/app/layout.tsx`
- **Mobile Layout**: `src/app/(mobile)/layout.tsx`
- **Configuration**: `next.config.ts`, `tsconfig.json`
- **Styling**: `src/app/globals.css`
- **Components**: `src/components/ui/`
- **Mock Data**: `src/data/`, `src/mock/`
- **Utilities**: `src/lib/`

## Business Context

### Target Industry
**Hotels and Hospitality** - Specifically designed for hotel supply chain operations including:
- Food & Beverage inventory management
- Housekeeping supply tracking
- Engineering and maintenance supplies
- Multi-property operations

### Key Value Propositions
- **90% increase** in supply chain transaction accuracy
- **75% reduction** in non-compliant inventory events
- **80% user adoption** target within 6 months
- **30% decrease** in monthly inventory reconciliation time
- Complete audit trail for all transactions
- Real-time inventory visibility and control

### Business Units
- **Grand Hotel Singapore** (SGD currency)
- **Business Hotel Jakarta** (IDR currency)
- **Boutique Hotel Bangkok** (THB currency)

## Support and Maintenance

### Code Quality
- TypeScript strict mode for type safety
- ESLint configuration for code consistency
- Component-based architecture for maintainability
- Comprehensive mock data for development testing

### Performance Considerations
- Next.js automatic code splitting
- Mobile-optimized bundle sizes
- Efficient state management patterns
- Progressive loading strategies

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast color schemes
- Touch-friendly interface design

---

This technical documentation serves as the comprehensive reference for all development, integration, and maintenance activities on the Carmen Supply Chain Mobile App. Each document provides detailed implementation guidance while maintaining focus on the mobile-first, hospitality-focused nature of the application.

For questions or clarifications, refer to the specific documentation sections or consult the source code with the file references provided throughout these documents.