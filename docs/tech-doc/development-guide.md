# Carmen Supply Chain Mobile App - Development Guide

## Overview
This guide provides comprehensive instructions for developers working on the Carmen Supply Chain Mobile App. It covers setup, development workflows, coding standards, and best practices specific to this Next.js mobile application.

## Quick Start

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE with TypeScript support

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd carmen-mobile

# Install dependencies
npm install

# Start development server
npm run dev
```

**Development Server**: Runs on port 3002 (port 3000 may be occupied)
**Access**: Open http://localhost:3002 in your browser

### Development Environment
- **Hot Reload**: Automatic page refresh on file changes
- **TypeScript**: Real-time type checking
- **ESLint**: Code quality checking
- **Stagewise Toolbar**: Development tools (visible in dev mode only)

## Project Structure Deep Dive

### Directory Organization
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (route group)
│   │   ├── login/
│   │   ├── two-factor/
│   │   ├── business-unit-selection/
│   │   ├── password-reset/
│   │   ├── account-locked/
│   │   └── session-expired/
│   ├── (mobile)/          # Main mobile app (route group)
│   │   ├── dashboard/
│   │   ├── receiving/
│   │   ├── pr-approval/
│   │   ├── store-requisition/
│   │   ├── physical-count/
│   │   ├── spot-check/
│   │   ├── stock-take/
│   │   ├── notifications/
│   │   └── profile/
│   ├── welcome/           # Welcome screen
│   ├── onboarding/        # User onboarding
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── forms/             # Form-specific components
│   ├── screens/           # Screen-level components
│   └── ui/                # Reusable UI components
├── data/                  # Mock data and interfaces
├── lib/                   # Utility libraries and services
└── mock/                  # Additional mock data
```

### Route Groups Explained
Next.js route groups `(folder)` organize routes without affecting URL structure:
- `(auth)`: Authentication-related pages
- `(mobile)`: Main mobile application pages

### File Naming Conventions
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `authService.ts`)
- **Types**: PascalCase with `.types.ts` suffix
- **Mock Data**: camelCase with `mock` prefix (e.g., `mockPOData.ts`)

## Development Workflows

### Creating New Pages
1. **Determine Route Group**: Choose `(auth)` or `(mobile)`
2. **Create Directory**: Create folder in appropriate route group
3. **Add page.tsx**: Create the page component
4. **Update Navigation**: Add to bottom navigation if needed

Example:
```bash
# Create new mobile page
mkdir src/app/\(mobile\)/new-feature
touch src/app/\(mobile\)/new-feature/page.tsx
```

```typescript
// src/app/(mobile)/new-feature/page.tsx
"use client";

export default function NewFeaturePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">New Feature</h1>
      {/* Page content */}
    </div>
  );
}
```

### Adding New Components
1. **Determine Component Type**:
   - UI components → `src/components/ui/`
   - Form components → `src/components/forms/`
   - Screen components → `src/components/screens/`

2. **Create Component File**:
```typescript
// src/components/ui/new-component.tsx
import { cn } from "@/lib/utils";

interface NewComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function NewComponent({ className, children }: NewComponentProps) {
  return (
    <div className={cn("default-styles", className)}>
      {children}
    </div>
  );
}
```

3. **Export from Index** (if applicable):
```typescript
// src/components/ui/index.ts
export { NewComponent } from "./new-component";
```

### Working with Mock Data
1. **Understand Current Structure**:
   - `src/data/mockPOData.ts`: Purchase orders and related data
   - `src/data/mockGRNData.ts`: Goods receipt notes and inventory
   - `src/mock/`: Additional specialized mock data

2. **Adding New Mock Data**:
```typescript
// src/data/mockNewData.ts
export interface NewDataItem {
  id: string;
  name: string;
  // ... other fields
}

export const mockNewData: NewDataItem[] = [
  {
    id: "1",
    name: "Sample Item",
    // ... sample data
  }
];
```

3. **Using Mock Data in Components**:
```typescript
import { mockNewData } from "@/data/mockNewData";

export default function NewPage() {
  const [data, setData] = useState(mockNewData);
  // Component logic
}
```

## Coding Standards

### TypeScript Guidelines
1. **Strict Mode**: Always use TypeScript strict mode
2. **Interface Definitions**: Define interfaces for all data structures
3. **Type Imports**: Use `import type` for type-only imports
4. **Prop Types**: Always define prop interfaces for components

```typescript
// Good: Proper interface definition
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  className?: string;
}

// Good: Type-only import
import type { User } from "@/lib/auth";

// Good: Proper component typing
export function UserProfile({ user, onUpdate, className }: UserProfileProps) {
  // Component implementation
}
```

### React Component Guidelines
1. **Client Components**: Use `"use client"` for interactive components
2. **Server Components**: Default for static content (no `"use client"`)
3. **Hook Usage**: Follow React hooks rules
4. **State Management**: Use local state unless global state is needed

```typescript
// Client component example
"use client";

import { useState, useEffect } from "react";

export default function InteractivePage() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Side effects here
  }, []);

  return <div>{/* Interactive content */}</div>;
}
```

### CSS and Styling Guidelines
1. **Tailwind First**: Use Tailwind utility classes
2. **Component Variants**: Use `class-variance-authority` for variants
3. **Responsive Design**: Mobile-first approach
4. **Dark Mode**: Support both light and dark themes

```typescript
// Good: Tailwind with responsive and dark mode
<div className="p-4 bg-white dark:bg-gray-800 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
    Title
  </h1>
</div>
```

### File Organization Guidelines
1. **Import Order**:
   - React imports
   - Third-party libraries
   - Internal components
   - Utilities and types
   - Relative imports

```typescript
// Good import order
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/auth";
import "./component.css";
```

2. **Export Patterns**:
```typescript
// Named exports for utilities
export { authService } from "./auth";
export type { User, AuthState } from "./auth";

// Default export for components
export default function Component() {
  return <div>Component</div>;
}
```

## Mobile Development Best Practices

### Touch Interface Guidelines
1. **Minimum Touch Targets**: 44px × 44px minimum
2. **Adequate Spacing**: 8px minimum between touch targets
3. **Visual Feedback**: Hover and active states for all interactive elements
4. **Gesture Support**: Consider swipe and long-press where appropriate

### Performance Optimization
1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Use Next.js Image component
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Lazy Loading**: Implement for non-critical components

```typescript
// Good: Dynamic import for large components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>Loading...</div>,
});
```

### Mobile-Specific Considerations
1. **Viewport Configuration**: Proper viewport meta tags
2. **PWA Features**: Manifest and service worker ready
3. **Offline Handling**: Graceful degradation for offline scenarios
4. **Battery Optimization**: Minimize background processing

## Testing Guidelines

### Component Testing (Future Implementation)
```typescript
// Example test structure
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

### Integration Testing Patterns
1. **Page Testing**: Test complete page functionality
2. **Workflow Testing**: Test multi-step processes
3. **Mobile Testing**: Test touch interactions
4. **Accessibility Testing**: Test screen reader compatibility

## Debugging and Development Tools

### Browser DevTools
1. **React DevTools**: Component inspection and profiling
2. **Network Tab**: Monitor API calls (when implemented)
3. **Application Tab**: Inspect localStorage and sessionStorage
4. **Console**: Debug logging and error tracking

### Stagewise Development Toolbar
The app includes Stagewise development tools:
- **Component Inspector**: Inspect React components
- **Performance Monitor**: Track rendering performance
- **State Inspector**: View component state
- **Accessibility Checker**: Validate accessibility

### Common Debugging Scenarios
1. **Route Issues**: Check file structure and naming
2. **Import Errors**: Verify path aliases and exports
3. **Type Errors**: Check TypeScript interfaces
4. **Style Issues**: Verify Tailwind classes and responsive design

## Build and Deployment

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Build Optimization
1. **Bundle Analysis**: Monitor bundle size
2. **Tree Shaking**: Remove unused code
3. **Code Splitting**: Automatic with Next.js
4. **Asset Optimization**: Images and fonts

### Environment Configuration
```typescript
// Environment variables (when needed)
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  environment: process.env.NODE_ENV,
  version: process.env.NEXT_PUBLIC_VERSION || "1.0.0"
};
```

## Common Patterns and Utilities

### Custom Hooks Pattern
```typescript
// src/lib/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Error Boundary Pattern
```typescript
// src/components/ErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
```

## Troubleshooting Guide

### Common Issues and Solutions

1. **Port Already in Use**:
   ```bash
   # Solution: Use different port
   npm run dev -- -p 3002
   ```

2. **TypeScript Errors**:
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

3. **Import Path Issues**:
   ```typescript
   // Use path aliases
   import { Component } from "@/components/ui/component";
   // Not relative paths
   import { Component } from "../../components/ui/component";
   ```

4. **Styling Issues**:
   ```bash
   # Rebuild Tailwind
   npm run build
   ```

### Performance Issues
1. **Slow Development Server**: Check for large files or infinite loops
2. **Large Bundle Size**: Use dynamic imports and code splitting
3. **Memory Leaks**: Check for uncleared intervals and event listeners

### Mobile-Specific Issues
1. **Touch Events**: Ensure proper touch event handling
2. **Viewport Issues**: Check viewport meta tag configuration
3. **Performance on Mobile**: Test on actual devices, not just browser dev tools

This development guide provides the foundation for consistent, maintainable development on the Carmen Supply Chain Mobile App. Follow these patterns and guidelines to ensure code quality and team productivity.