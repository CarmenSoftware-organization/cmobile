# Carmen Supply Chain Mobile App - Brownfield Architecture Document

## Introduction
This document captures the CURRENT STATE of the Carmen Supply Chain Mobile App codebase, including technical patterns, implementation details, and real-world architecture. It serves as a reference for AI agents and developers working on enhancements to this mobile-first hospitality supply chain management system.

### Document Scope
Comprehensive documentation of the entire Next.js-based mobile application system, focused on the current implementation state as of June 2025.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| June 2025 | 1.0 | Initial brownfield analysis | BMad Master |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System
- **Main Entry**: `src/app/layout.tsx` - Root layout with theme provider and Stagewise toolbar
- **Mobile Layout**: `src/app/(mobile)/layout.tsx` - Mobile-specific layout with bottom navigation
- **Configuration**: `next.config.ts`, `tsconfig.json`, `package.json`
- **Core Business Logic**: `src/lib/` directory (auth, workflow, notifications, utils)
- **Data Models**: `src/data/` directory (mock data and interfaces)
- **UI Components**: `src/components/ui/` directory (Radix UI based components)
- **Mobile Pages**: `src/app/(mobile)/` directory (all main application screens)

### Key Application Entry Points
- **Root Page**: `src/app/page.tsx` - Landing page with welcome/dashboard options
- **Dashboard**: `src/app/(mobile)/dashboard/page.tsx` - Main mobile dashboard
- **Receiving**: `src/app/(mobile)/receiving/page.tsx` - Purchase order receiving workflow
- **PR Approval**: `src/app/(mobile)/pr-approval/page.tsx` - Purchase requisition approval workflow
- **Store Requisition**: `src/app/(mobile)/store-requisition/page.tsx` - Store requisition management
- **Physical Count**: `src/app/(mobile)/physical-count/page.tsx` - Inventory counting workflows
- **Spot Check**: `src/app/(mobile)/spot-check/page.tsx` - Quality control spot checks

## High Level Architecture

### Technical Summary
Well-structured Next.js 15 application using App Router with TypeScript. Implements mobile-first design patterns with route groups for organization. Uses mock data for development with comprehensive interfaces. Follows modern React patterns with client-side state management.

### Actual Tech Stack
| Category | Technology | Version | Notes |
|----------|------------|---------|--------|
| Runtime | Node.js | Latest | Development on port 3002 |
| Framework | Next.js | 15.3.3 | App Router, TypeScript |
| UI Framework | React | 19.0.0 | Latest React with concurrent features |
| Styling | Tailwind CSS | 4.x | Latest version with PostCSS |
| UI Components | Radix UI | Various | Accessible component primitives |
| Icons | Lucide React | 0.515.0 | Modern icon library |
| Date Handling | date-fns | 3.6.0 | Lightweight date utilities |
| Development Tools | Stagewise | 0.4.x | Development toolbar and plugins |
| Type System | TypeScript | 5.x | Strict mode enabled |

### Repository Structure Reality Check
- Type: Monorepo structure
- Package Manager: npm
- Notable: Uses Next.js App Router with route groups for organization

## Source Tree and Module Organization

### Project Structure (Actual)
```
carmen-mobile/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication route group
│   │   ├── (mobile)/          # Mobile app route group
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── forms/             # Form components
│   │   ├── screens/           # Screen-specific components
│   │   └── ui/                # Reusable UI components
│   ├── data/                  # Mock data and interfaces
│   ├── lib/                   # Utility libraries
│   └── mock/                  # Additional mock data
├── docs/                      # Documentation
├── public/                    # Static assets
├── web-bundles/              # BMAD agent bundles
└── .bmad-core/               # BMAD framework files
```

### Key Modules and Their Purpose
- **Authentication Module**: `src/lib/auth.ts` - User authentication and session management
- **Workflow Engine**: `src/lib/workflow.ts` - PR approval workflow logic
- **UI Components**: `src/components/ui/` - Radix UI based component library
- **Data Layer**: `src/data/` - Mock data with comprehensive TypeScript interfaces
- **Mobile Layout**: `src/app/(mobile)/layout.tsx` - Bottom navigation and mobile-specific layout
- **Theme System**: `src/components/ui/theme-provider.tsx` - Dark/light theme management

## Data Models and APIs

### Core Data Models
Instead of duplicating, reference actual model files:
- **GRN Models**: See `src/data/mockGRNData.ts` - Comprehensive goods receipt interfaces
- **Purchase Order Models**: See `src/data/mockPOData.ts` - PO and vendor data structures
- **User Models**: See `src/lib/auth.ts` - Authentication and user interfaces
- **Workflow Models**: See `src/lib/workflow.ts` - PR approval workflow types
- **Physical Count Models**: See `src/mock/physicalCountData.ts` - Inventory counting interfaces
- **Spot Check Models**: See `src/mock/spotCheckData.ts` - Quality control interfaces

### Key Interface Patterns
- **Multi-currency Support**: All financial models include currency, exchange rate, and base currency fields
- **Workflow States**: Comprehensive status tracking with stage-based progression
- **Mobile-First**: All interfaces designed for touch interaction and mobile constraints
- **Audit Trail**: Complete tracking of user actions and state changes

## Technical Implementation Details

### Next.js App Router Structure
- **Route Groups**: Uses `(auth)` and `(mobile)` for logical organization
- **Dynamic Routes**: Implements `[id]` and `[sessionId]` patterns for entity-specific pages
- **Nested Layouts**: Mobile layout wraps all mobile routes with bottom navigation
- **Client Components**: Most interactive components use "use client" directive

### State Management Patterns
- **Local State**: React useState for component-level state
- **Session Storage**: Browser storage for authentication and preferences
- **Mock Data**: Comprehensive mock data simulating real backend responses
- **No Global State**: Currently no Redux/Zustand - uses prop drilling and local state

### Mobile-First Design Patterns
- **Bottom Navigation**: Fixed bottom navigation for primary app functions
- **Touch Targets**: 44px minimum touch targets throughout
- **Responsive Grid**: CSS Grid with mobile-first breakpoints
- **Safe Areas**: Proper handling of mobile safe areas and notches

## Integration Points and External Dependencies

### External Services (Development)
| Service | Purpose | Integration Type | Key Files |
|---------|---------|------------------|-----------|
| Stagewise | Development Tools | React Plugin | `src/app/layout.tsx` |
| Radix UI | Component Library | React Components | `src/components/ui/` |
| Lucide | Icons | React Components | Throughout UI |

### Internal Integration Points
- **Theme System**: Dark/light mode with system preference detection
- **Authentication Flow**: Multi-step auth with business unit selection
- **Workflow Engine**: Role-based approval workflows with stage progression
- **Mock Data Layer**: Simulated backend responses for development

## Development and Deployment

### Local Development Setup
1. **Install Dependencies**: `npm install`
2. **Start Development**: `npm run dev` (runs on port 3000, or 3002 if 3000 is occupied)
3. **Environment**: No environment variables required for current mock data setup
4. **Development Tools**: Stagewise toolbar available in development mode

### Build and Deployment Process
- **Build Command**: `npm run build` (Next.js production build)
- **Start Command**: `npm start` (production server)
- **Lint Command**: `npm run lint` (ESLint with Next.js config)
- **Type Checking**: Automatic with TypeScript strict mode

### Development Environment
- **Port**: Development server runs on port 3002 (3000 in use)
- **Hot Reload**: Next.js fast refresh enabled
- **TypeScript**: Strict mode with path aliases (`@/*` → `./src/*`)

## Mobile Application Architecture

### Route Structure
```
/ (root)                       # Landing page
├── /welcome                   # Welcome screen
├── /onboarding               # User onboarding
├── (auth)/                   # Authentication route group
│   ├── /login                # Login page
│   ├── /two-factor           # 2FA verification
│   ├── /business-unit-selection # BU selection
│   ├── /password-reset       # Password reset
│   ├── /account-locked       # Account locked
│   └── /session-expired      # Session expired
└── (mobile)/                 # Mobile app route group
    ├── /dashboard            # Main dashboard
    ├── /notifications        # Notifications
    ├── /profile              # User profile
    ├── /receiving/           # Receiving workflows
    ├── /pr-approval/         # PR approval workflows
    ├── /store-requisition/   # Store requisition workflows
    ├── /physical-count/      # Physical count workflows
    ├── /spot-check/          # Spot check workflows
    └── /stock-take/          # Stock take workflows
```

### Bottom Navigation Structure
- **Home** (`/dashboard`) - Main dashboard with priority actions
- **Receiving** (`/receiving`) - Purchase order receiving
- **Approval** (`/pr-approval`) - Purchase requisition approval
- **Store Req.** (`/store-requisition`) - Store requisition management
- **Stock Take** (`/stock-take`) - Inventory stock take

### Mobile Layout Features
- **AppBar**: Fixed top bar with title, notifications, theme toggle, and profile
- **Bottom Navigation**: Fixed bottom navigation with 5 primary functions
- **Safe Areas**: Proper padding for mobile safe areas (pt-14, pb-16)
- **Theme Integration**: Dark/light mode with system preference

## Current Implementation State

### Completed Features
- **Authentication Flow**: Complete login, 2FA, business unit selection
- **Dashboard**: Priority actions and operations overview
- **Receiving Module**: PO listing, GRN creation, item management
- **PR Approval**: Multi-stage approval workflow with currency support
- **Physical Count**: Session-based counting with review workflow
- **Spot Check**: Location-based quality control checks
- **Store Requisition**: Request creation and approval workflow

### Mock Data Implementation
- **Comprehensive Interfaces**: All data models fully typed with TypeScript
- **Multi-Currency**: SGD, IDR, THB, USD with exchange rates
- **Multi-Business Unit**: Grand Hotel Singapore, Business Hotel Jakarta, Boutique Hotel Bangkok
- **Realistic Data**: Hotel-specific inventory items, vendors, and workflows

### UI/UX Implementation
- **Design System**: Consistent component library based on Radix UI
- **Mobile-First**: All interfaces optimized for mobile interaction
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Theme Support**: Dark/light mode with smooth transitions

## Technical Debt and Known Issues

### Current Technical Debt
1. **Mock Data Only**: No real backend integration - all data is mocked
2. **No Global State**: Uses local state and prop drilling - may need state management for complex features
3. **No Offline Support**: No service worker or offline data persistence
4. **No Real Authentication**: Mock authentication service - needs real auth integration
5. **No Error Boundaries**: Missing React error boundaries for production resilience

### Development Considerations
- **Port Conflict**: Development server uses port 3002 due to port 3000 being occupied
- **Mock Data Limitations**: All data resets on page refresh - no persistence
- **No API Layer**: Direct mock data usage - needs abstraction for real API integration
- **No Testing**: No test suite implemented yet

### Future Integration Points
- **Backend API**: Will need to replace mock data with real API calls
- **Authentication Service**: Integration with real auth provider
- **Database**: Real data persistence layer
- **Push Notifications**: Real notification service integration
- **Offline Sync**: Service worker for offline functionality

## Workflow Implementation Details

### PR Approval Workflow
- **Stages**: Draft (0) → HOD Review (1) → Finance Review (2) → Vendor Allocation (3) → Approved (4)
- **Role-Based**: Different users can act at different stages
- **Multi-Currency**: Full support for document and base currency display
- **Partial Approval**: Logic prevents submission with pending items

### Receiving Workflow
- **PO-Based**: Starts with purchase order selection
- **GRN Creation**: Goods Receipt Note creation with item-by-item processing
- **Unit Conversion**: Automatic conversion between order and inventory units
- **Quality Control**: Photo capture for damaged goods

### Physical Count Workflow
- **Session-Based**: Locked counting sessions for audit compliance
- **Location-Specific**: Count by specific storage locations
- **Review Process**: Mandatory review before submission
- **Audit Trail**: Complete tracking of count activities

## Component Architecture

### UI Component Structure
```
src/components/
├── forms/
│   └── GRNForm.tsx           # Goods Receipt Note form
├── screens/
│   └── welcome-screen.tsx    # Welcome screen component
└── ui/                       # Reusable UI components
    ├── appbar.tsx            # Top app bar
    ├── badge.tsx             # Status badges
    ├── button.tsx            # Button variants
    ├── card.tsx              # Card layouts
    ├── dialog.tsx            # Modal dialogs
    ├── feature-card.tsx      # Dashboard feature cards
    ├── input.tsx             # Form inputs
    ├── loading-indicator.tsx # Loading states
    └── theme-provider.tsx    # Theme context
```

### Component Patterns
- **Radix UI Base**: Most components extend Radix UI primitives
- **Variant System**: Uses class-variance-authority for component variants
- **Tailwind Integration**: Utility-first styling with consistent design tokens
- **Accessibility**: Built-in accessibility features from Radix UI

## Success Metrics and Performance

### Current Performance Characteristics
- **Build Time**: Fast Next.js builds with TypeScript
- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Mobile Performance**: Optimized for mobile devices with touch interactions
- **Development Experience**: Fast refresh and TypeScript integration

### Monitoring and Observability
- **Development Tools**: Stagewise toolbar for development insights
- **TypeScript**: Compile-time error detection
- **ESLint**: Code quality and consistency checking
- **Next.js Analytics**: Built-in performance monitoring capabilities

## Appendix - Useful Commands and Scripts

### Frequently Used Commands
```bash
npm run dev         # Start development server (port 3002)
npm run build       # Production build
npm start           # Start production server
npm run lint        # Run ESLint
```

### Development Workflow
```bash
# Start development
npm install
npm run dev

# Check for issues
npm run lint
npm run build  # Verify production build works
```

### File Structure Navigation
- **Pages**: All in `src/app/` with App Router structure
- **Components**: Reusable components in `src/components/`
- **Data**: Mock data and interfaces in `src/data/`
- **Utils**: Helper functions in `src/lib/`
- **Styles**: Global styles in `src/app/globals.css`

This document provides a comprehensive view of the current Carmen Supply Chain Mobile App implementation, serving as a foundation for future development and enhancement work.