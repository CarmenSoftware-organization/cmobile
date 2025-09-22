# Carmen Supply Chain Mobile App - Design System

## Overview
This document defines the comprehensive design system for the Carmen Supply Chain Mobile App, providing a unified visual language and interaction patterns optimized for mobile-first hospitality workflows.

## Design Tokens

### Color System

#### Primary Palette
```css
:root {
  /* Primary Brand Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #0F52BA; /* Carmen Blue */
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
}
```

#### Semantic Colors
```css
:root {
  /* Success */
  --color-success-50: #ecfdf5;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  
  /* Warning */
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  /* Error */
  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  
  /* Info */
  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;
}
```

#### Neutral Palette (Adaptive)
```css
:root {
  /* Light Mode */
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-surface-elevated: #ffffff;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
}

[data-theme="dark"] {
  /* Dark Mode */
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-surface-elevated: #374151;
  --color-border: #374151;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;
}
```

### Typography Scale

#### Font Families
```css
:root {
  --font-family-primary: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
}
```

#### Type Scale
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing System

#### Spacing Scale
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

#### Component Spacing
```css
:root {
  /* Touch Targets */
  --touch-target-min: 44px;
  --touch-target-comfortable: 48px;
  
  /* Component Padding */
  --padding-component-sm: var(--space-3);
  --padding-component-md: var(--space-4);
  --padding-component-lg: var(--space-6);
  
  /* Layout Margins */
  --margin-page: var(--space-4);
  --margin-section: var(--space-6);
  --margin-component: var(--space-4);
}
```

### Border Radius
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-full: 9999px;
}
```

### Shadows
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

## Component Library

### Button Component

#### Variants
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

#### Styles
```css
/* Base Button */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent;
  min-height: var(--touch-target-min);
}

/* Primary Variant */
.button--primary {
  background-color: var(--color-primary-600);
  color: white;
  border-color: var(--color-primary-600);
}

.button--primary:hover {
  background-color: var(--color-primary-700);
  border-color: var(--color-primary-700);
}

/* Secondary Variant */
.button--secondary {
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.button--secondary:hover {
  background-color: var(--color-primary-50);
}

/* Size Variants */
.button--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.button--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.button--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
}
```

### Input Component

#### Base Input
```css
.input {
  width: 100%;
  min-height: var(--touch-target-min);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  transition: border-color 0.2s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.input--error {
  border-color: var(--color-error-500);
}

.input--error:focus {
  border-color: var(--color-error-500);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}
```

### Card Component

#### Base Card
```css
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.card--interactive {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.card--interactive:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card--elevated {
  background-color: var(--color-surface-elevated);
  box-shadow: var(--shadow-md);
}
```

### Badge Component

#### Status Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge--success {
  background-color: var(--color-success-50);
  color: var(--color-success-600);
}

.badge--warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-600);
}

.badge--error {
  background-color: var(--color-error-50);
  color: var(--color-error-600);
}

.badge--info {
  background-color: var(--color-info-50);
  color: var(--color-info-600);
}
```

### Navigation Components

#### Bottom Navigation
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
}

.bottom-nav__item--active {
  color: var(--color-primary-600);
}

.bottom-nav__icon {
  width: 20px;
  height: 20px;
}
```

#### App Bar
```css
.app-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background-color: var(--color-surface);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--space-4);
  padding-top: env(safe-area-inset-top);
}

.app-bar__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.app-bar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

## Layout System

### Grid System
```css
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid--cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid--cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid--cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* Responsive Grid */
@media (min-width: 768px) {
  .grid--md-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid--md-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

### Container System
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.container--sm { max-width: 640px; }
.container--md { max-width: 768px; }
.container--lg { max-width: 1024px; }
.container--xl { max-width: 1280px; }
```

### Safe Areas
```css
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right);
}
```

## Animation System

### Transition Tokens
```css
:root {
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
  --transition-slow: 350ms ease-out;
  
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animation Classes
```css
.animate-fade-in {
  animation: fadeIn var(--transition-normal) var(--easing-ease-out);
}

.animate-slide-up {
  animation: slideUp var(--transition-normal) var(--easing-ease-out);
}

.animate-scale-in {
  animation: scaleIn var(--transition-fast) var(--easing-ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## Responsive Breakpoints

### Breakpoint System
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Mobile First Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Responsive Utilities
```css
/* Hide/Show at breakpoints */
.hidden-sm { display: none; }
@media (min-width: 640px) {
  .hidden-sm { display: block; }
  .visible-sm { display: none; }
}

/* Responsive text sizes */
.text-responsive {
  font-size: var(--text-base);
}

@media (min-width: 768px) {
  .text-responsive {
    font-size: var(--text-lg);
  }
}
```

## Accessibility Features

### Focus Management
```css
.focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### High Contrast Support
```css
@media (prefers-contrast: high) {
  :root {
    --color-border: #000000;
    --color-text-primary: #000000;
    --color-background: #ffffff;
  }
  
  [data-theme="dark"] {
    --color-border: #ffffff;
    --color-text-primary: #ffffff;
    --color-background: #000000;
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Dark Mode Implementation

### Theme Toggle
```css
/* Automatic theme detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-background: #111827;
    --color-surface: #1f2937;
    --color-text-primary: #f9fafb;
    /* ... other dark mode tokens */
  }
}

/* Manual theme override */
[data-theme="light"] {
  --color-background: #ffffff;
  --color-surface: #f9fafb;
  --color-text-primary: #111827;
  /* ... light mode tokens */
}

[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text-primary: #f9fafb;
  /* ... dark mode tokens */
}
```

## Performance Optimizations

### CSS Custom Properties
- Use CSS custom properties for consistent theming
- Minimize runtime style calculations
- Leverage browser caching for design tokens

### Component Optimization
- Use CSS-in-JS sparingly for better performance
- Prefer CSS classes over inline styles
- Implement critical CSS for above-the-fold content

### Animation Performance
- Use `transform` and `opacity` for animations
- Leverage `will-change` property judiciously
- Implement `prefers-reduced-motion` support

This design system provides a comprehensive foundation for building consistent, accessible, and performant user interfaces across the Carmen Supply Chain Mobile App, ensuring a cohesive experience for all users while maintaining flexibility for future enhancements.