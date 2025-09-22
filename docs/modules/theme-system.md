# Theme System Module

## Overview
The Theme System module provides comprehensive theming capabilities for the Carmen Supply Chain application. It manages brand colors, typography, animations, dark/light mode switching, and ensures consistent visual design across all components with accessibility support and user preferences.

## Location
- **Theme Configuration**: `src/lib/theme.ts`
- **Theme Provider**: `src/components/ui/theme-provider.tsx`
- **Theme Toggle**: `src/components/ui/theme-toggle.tsx`
- **Global Styles**: `src/app/globals.css`

## Key Features

### 1. Brand Color System
- **Primary Colors**: Carmen Blue brand colors with variants
- **Secondary Colors**: Carmen Amber accent colors
- **Status Colors**: Success, warning, danger, and info colors
- **Semantic Colors**: Contextual color assignments
- **Accessibility**: WCAG compliant color contrasts

### 2. Dark/Light Mode Support
- **Automatic Detection**: System preference detection
- **Manual Toggle**: User-controlled theme switching
- **Persistent Storage**: Remember user theme preference
- **Smooth Transitions**: Animated theme transitions
- **Component Adaptation**: All components support both modes

### 3. Typography System
- **Font Families**: Geist Sans and Geist Mono fonts
- **Font Scaling**: Responsive typography scaling
- **Line Heights**: Optimized line heights for readability
- **Font Weights**: Comprehensive font weight system
- **Text Hierarchy**: Clear typographic hierarchy

### 4. Animation System
- **Consistent Timing**: Standardized animation timing
- **Easing Functions**: Smooth easing curves
- **Performance**: Hardware-accelerated animations
- **Accessibility**: Respect reduced motion preferences
- **Customizable**: Configurable animation settings

### 5. CSS Variable System
- **Dynamic Colors**: CSS custom properties for colors
- **Theme Switching**: Instant theme switching via variables
- **Component Integration**: Seamless component integration
- **Runtime Updates**: Dynamic theme updates
- **Fallback Support**: Graceful fallbacks for older browsers

## Module Structure

### Theme Configuration (`/lib/theme.ts`)
Core theme definitions:
- Brand color palette
- Typography settings
- Animation configurations
- Utility functions

### Theme Provider (`/components/ui/theme-provider.tsx`)
Theme context management:
- Theme state management
- System preference detection
- Storage persistence
- Context provision

### Theme Toggle (`/components/ui/theme-toggle.tsx`)
User theme control:
- Theme switching interface
- Visual feedback
- Accessibility support
- Icon animations

## Brand Color System

### Primary Brand Colors
```typescript
const brandColors = {
  primary: {
    DEFAULT: "#0F52BA", // Carmen Blue
    light: "#EFF6FF",
    dark: "#0A3F8C",
  }
};
```

**Carmen Blue (#0F52BA)**:
- Professional and trustworthy
- High contrast for accessibility
- Consistent across all brand materials
- Optimized for digital displays

### Secondary Brand Colors
```typescript
secondary: {
  DEFAULT: "#F9A826", // Carmen Amber
  light: "#FEF5E7",
  dark: "#D48918",
}
```

**Carmen Amber (#F9A826)**:
- Warm and approachable accent color
- Used for highlights and call-to-action elements
- Complements primary blue effectively
- Maintains accessibility standards

### Status Color System
- **Success Green (#10B981)**: Positive actions and confirmations
- **Warning Amber (#F59E0B)**: Cautions and important notices
- **Danger Red (#EF4444)**: Errors and critical alerts
- **Info Blue (#3B82F6)**: Informational content and tips

### Color Usage Guidelines
- **Primary**: Main navigation, primary buttons, key branding
- **Secondary**: Accent elements, highlights, secondary actions
- **Success**: Confirmations, completed states, positive feedback
- **Warning**: Alerts, pending states, important notices
- **Danger**: Errors, destructive actions, critical alerts
- **Info**: Help text, informational messages, tips

## Typography System

### Font Families
```typescript
const typography = {
  fontFamily: {
    sans: ["var(--font-geist-sans)"],
    mono: ["var(--font-geist-mono)"],
  },
};
```

**Geist Sans**:
- Modern, clean sans-serif font
- Excellent readability on screens
- Comprehensive character set
- Optimized for digital interfaces

**Geist Mono**:
- Monospace font for code and data
- Clear character distinction
- Consistent character width
- Technical content display

### Typography Hierarchy
- **Headings**: Clear hierarchy from h1 to h6
- **Body Text**: Optimized for readability
- **Captions**: Smaller text for metadata
- **Code**: Monospace for technical content
- **Labels**: UI element labeling

### Responsive Typography
- **Mobile First**: Optimized for mobile devices
- **Scalable**: Responsive font sizing
- **Readable**: Maintained readability across sizes
- **Accessible**: Meets accessibility guidelines
- **Performance**: Optimized font loading

## Animation System

### Animation Timing
```typescript
const animations = {
  default: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  fast: "100ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
};
```

**Default (200ms)**:
- Standard UI transitions
- Button hover effects
- Modal appearances
- General interactions

**Fast (100ms)**:
- Quick feedback
- Micro-interactions
- Hover states
- Immediate responses

**Slow (300ms)**:
- Page transitions
- Complex animations
- Loading states
- Dramatic effects

### Easing Functions
- **Ease-Out**: Natural deceleration
- **Ease-In**: Gradual acceleration
- **Ease-In-Out**: Smooth acceleration and deceleration
- **Linear**: Constant speed (rarely used)
- **Custom**: Tailored easing for specific effects

## Theme Provider Implementation

### Context Management
```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "dark" | "light" | "system";
  storageKey?: string;
}
```

**Features**:
- System preference detection
- User preference storage
- Theme state management
- Context provision to all components
- Smooth theme transitions

### Storage Persistence
- **localStorage**: Persist user theme preference
- **Fallback**: Default to system preference
- **Sync**: Synchronize across tabs
- **Recovery**: Handle storage failures gracefully
- **Migration**: Handle preference migrations

### System Integration
- **Media Queries**: Detect system theme preference
- **Event Listeners**: Listen for system theme changes
- **Automatic Updates**: Update theme when system changes
- **Override**: Allow user override of system preference
- **Fallback**: Graceful fallback for unsupported browsers

## Theme Toggle Component

### User Interface
- **Icon-Based**: Clear visual indicators
- **Accessibility**: Screen reader support
- **Keyboard**: Full keyboard navigation
- **Touch**: Touch-friendly design
- **Feedback**: Visual feedback on interaction

### Toggle States
- **Light Mode**: Sun icon, light theme active
- **Dark Mode**: Moon icon, dark theme active
- **System**: Auto icon, follows system preference
- **Transition**: Smooth icon transitions
- **Loading**: Loading state during theme change

### Implementation
```typescript
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

## CSS Variable System

### Color Variables
```css
:root {
  --primary: 15 82 186; /* Carmen Blue */
  --primary-foreground: 255 255 255;
  --secondary: 249 168 38; /* Carmen Amber */
  --secondary-foreground: 0 0 0;
  /* ... additional variables */
}

[data-theme="dark"] {
  --primary: 15 82 186;
  --primary-foreground: 255 255 255;
  /* ... dark theme overrides */
}
```

### Variable Benefits
- **Dynamic**: Runtime theme switching
- **Consistent**: Consistent color usage
- **Maintainable**: Centralized color management
- **Performance**: No JavaScript required for colors
- **Flexible**: Easy theme customization

### Component Integration
```css
.button-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--primary));
}

.button-primary:hover {
  background-color: hsl(var(--primary) / 0.9);
}
```

## Accessibility Features

### Color Contrast
- **WCAG AA**: Minimum 4.5:1 contrast ratio
- **WCAG AAA**: Enhanced 7:1 contrast where possible
- **Testing**: Automated contrast testing
- **Validation**: Manual accessibility validation
- **Documentation**: Contrast ratio documentation

### Reduced Motion
- **Preference Detection**: Respect user motion preferences
- **Fallbacks**: Static alternatives for animations
- **Configuration**: Configurable animation settings
- **Testing**: Motion sensitivity testing
- **Documentation**: Motion reduction guidelines

### Screen Reader Support
- **Theme Announcements**: Announce theme changes
- **Semantic Markup**: Proper semantic structure
- **ARIA Labels**: Descriptive ARIA labels
- **Focus Management**: Proper focus handling
- **Testing**: Screen reader testing

## Performance Optimization

### Font Loading
- **Font Display**: Optimized font display strategy
- **Preloading**: Preload critical fonts
- **Fallbacks**: System font fallbacks
- **Subsetting**: Font subsetting for performance
- **Caching**: Efficient font caching

### CSS Optimization
- **Critical CSS**: Inline critical CSS
- **Minification**: Minified CSS output
- **Purging**: Remove unused CSS
- **Compression**: Gzip/Brotli compression
- **Caching**: Efficient CSS caching

### Runtime Performance
- **CSS Variables**: Efficient theme switching
- **Minimal JavaScript**: Minimal JS for theme logic
- **Event Optimization**: Optimized event handling
- **Memory Management**: Efficient memory usage
- **Battery Optimization**: Minimize battery impact

## Usage Examples

### Using Theme in Components
```typescript
import { useTheme } from 'next-themes';

export function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className={cn(
      "p-4 rounded-lg",
      "bg-background text-foreground",
      "border border-border"
    )}>
      <p>Current theme: {theme}</p>
      <Button onClick={() => setTheme('dark')}>
        Switch to Dark
      </Button>
    </div>
  );
}
```

### Custom Color Usage
```typescript
import { brandColors } from '@/lib/theme';

const customStyles = {
  backgroundColor: brandColors.primary.DEFAULT,
  color: brandColors.primary.light,
  borderColor: brandColors.secondary.DEFAULT,
};
```

### Animation Usage
```typescript
import { animations } from '@/lib/theme';

const animatedStyles = {
  transition: `all ${animations.default}`,
  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
};
```

## Integration Points

### With UI Components
- **Consistent Styling**: All components use theme system
- **Automatic Adaptation**: Components adapt to theme changes
- **Color Variables**: Components use CSS variables
- **Animation Integration**: Consistent animation timing
- **Accessibility**: Built-in accessibility features

### With Mobile Navigation
- **Theme Toggle**: Theme toggle in app bar
- **Consistent Colors**: Navigation uses theme colors
- **Smooth Transitions**: Animated theme changes
- **State Persistence**: Remember theme across sessions
- **System Integration**: Respect system preferences

### With Authentication
- **Brand Consistency**: Consistent branding in auth flows
- **Theme Persistence**: Maintain theme across auth states
- **Accessibility**: Accessible auth interfaces
- **Performance**: Optimized auth screen performance
- **Error States**: Consistent error styling

## Future Enhancements

### Advanced Theming
- **Custom Themes**: User-created custom themes
- **Theme Marketplace**: Downloadable theme packs
- **Dynamic Branding**: Business unit specific branding
- **Seasonal Themes**: Automatic seasonal theme changes
- **A/B Testing**: Theme A/B testing capabilities

### Accessibility Improvements
- **High Contrast**: Enhanced high contrast mode
- **Color Blind Support**: Color blind friendly themes
- **Motion Controls**: Granular motion controls
- **Font Options**: Additional font options
- **Voice Control**: Voice-controlled theme switching

### Performance Optimizations
- **CSS-in-JS**: Explore CSS-in-JS solutions
- **Runtime Optimization**: Further runtime optimizations
- **Bundle Splitting**: Theme-based bundle splitting
- **Lazy Loading**: Lazy load theme resources
- **Service Workers**: Service worker theme caching

## Dependencies
- React for component system
- Next.js for SSR support
- Tailwind CSS for utility classes
- CSS custom properties
- next-themes for theme management

## Testing Considerations

### Visual Testing
- **Theme Switching**: Test theme switching functionality
- **Color Contrast**: Automated contrast testing
- **Component Rendering**: Visual regression testing
- **Animation Testing**: Animation performance testing
- **Cross-Browser**: Cross-browser compatibility testing

### Accessibility Testing
- **Screen Reader**: Screen reader compatibility
- **Keyboard Navigation**: Keyboard accessibility
- **Color Blind**: Color blind user testing
- **Motion Sensitivity**: Motion sensitivity testing
- **Contrast Validation**: Automated contrast validation

### Performance Testing
- **Font Loading**: Font loading performance
- **Theme Switching**: Theme switch performance
- **Memory Usage**: Memory usage monitoring
- **Battery Impact**: Battery usage testing
- **Network Efficiency**: Network resource optimization

## Related Documentation
- [UI Components Module](./ui-components.md) - Component theming integration
- [Welcome & Onboarding Module](./welcome-onboarding.md) - Theme in onboarding
- [Mobile Navigation Module](./mobile-navigation.md) - Navigation theming
- [Authentication Module](./authentication.md) - Auth interface theming