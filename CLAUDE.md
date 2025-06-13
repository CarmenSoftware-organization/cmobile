# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Carmen Supply Chain Mobile App - A mobile-first Progressive Web App (PWA) for hospitality supply chain management built with Next.js 15, React 19, and Tailwind CSS 4. Features authentication, receiving (GRN), PR approval workflows, store requisitions, inventory management, and mobile-optimized interfaces.

## Build & Development Commands
- `npm run dev` - Run development server with Turbopack
- `npm run dev:webpack` - Run development server with webpack  
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Application Architecture

### Route Structure
- `(auth)` - Authentication pages with shared layout
- `(mobile)` - Main mobile app with bottom navigation
- Core modules: Dashboard, Receiving, PR Approval, Store Requisition, Stock Take, Spot Check

### Key Data Models
- **Purchase Orders**: `mockPOData.ts` - Centralized PO data with items, vendors, business units
- **Workflow System**: `workflow.ts` - PR approval stages, role permissions, status management
- **Mock Data**: Consistent test data across receiving, inventory, and approval flows

### Mobile Layout Pattern
- Fixed top AppBar with context-aware titles
- Bottom tab navigation (Dashboard, Receiving, Approval, Store Req., Stock Take)
- Mobile-first responsive design with dark/light theme support
- PWA capabilities with offline support

### Component Architecture
- UI components in `components/ui/` using Radix UI primitives
- Theme system with dark mode support via `ThemeProvider`
- Reusable form components and mobile-optimized inputs
- Stagewise development toolbar integration

## Code Style Guidelines
- **TypeScript**: Use strict type checking, avoid `any` type
- **Imports**: Use absolute imports with `@/` alias for src directory
- **Components**: Use named exports, PascalCase for component files
- **Functions**: Use function declarations for components
- **State Management**: Use React hooks appropriately
- **Styling**: Use Tailwind CSS with className prop
- **Error Handling**: Use try/catch for async operations
- **File Structure**: Follow Next.js app router conventions
- **Mobile First**: Design for mobile viewport first
- **Accessibility**: Ensure WCAG compliance with proper ARIA attributes
- **Dark Mode**: Support light/dark themes via Tailwind's dark: prefix