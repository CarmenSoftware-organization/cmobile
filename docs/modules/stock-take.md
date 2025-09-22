# Stock Take Module

## Overview
The Stock Take module serves as the central hub for inventory counting operations, providing users with access to both Physical Count and Spot Check functionalities. It acts as a routing and selection interface that directs users to the appropriate counting method based on their operational needs.

## Location
- **Primary Module**: `src/app/(mobile)/stock-take/page.tsx`
- **Related Modules**: 
  - Physical Count Module (`src/app/(mobile)/physical-count/`)
  - Spot Check Module (`src/app/(mobile)/spot-check/`)

## Key Features

### 1. Counting Method Selection
- Physical Count option for comprehensive inventory verification
- Spot Check option for targeted quality assurance
- Clear differentiation between counting methods
- Visual guidance for method selection

### 2. User-Friendly Interface
- Card-based selection interface
- Descriptive explanations for each method
- Touch-optimized design for mobile devices
- Consistent branding and styling

### 3. Navigation Hub
- Central access point for all counting operations
- Direct routing to specific counting modules
- Breadcrumb navigation support
- Quick access from dashboard

## Module Structure

### Stock Take Options Page (`/stock-take`)
The main interface provides two primary options:

#### Physical Count Option
- **Purpose**: Complete inventory verification
- **Description**: "Count all items in a location for a full inventory check"
- **Icon**: ClipboardList (blue theme)
- **Navigation**: Routes to `/physical-count`

#### Spot Check Option
- **Purpose**: Targeted quality assurance
- **Description**: "Quickly verify a subset of items for compliance and accuracy"
- **Icon**: SearchCheck (green theme)
- **Navigation**: Routes to `/spot-check`

## Design Principles

### Visual Hierarchy
- Large, prominent cards for easy selection
- Color-coded icons for quick identification
- Clear typography hierarchy
- Consistent spacing and alignment

### Mobile Optimization
- Touch-friendly card sizes (w-72 = 288px)
- Adequate padding for comfortable interaction
- Hover states for visual feedback
- Responsive design for various screen sizes

### Accessibility
- Semantic HTML structure
- Proper contrast ratios
- Touch target size compliance (minimum 44px)
- Screen reader friendly descriptions

## Component Structure

### Card Layout
```tsx
<div className="w-72 p-6 bg-white rounded-xl shadow cursor-pointer flex flex-col items-center hover:bg-blue-50 transition">
  <Icon className="w-10 h-10 text-color mb-2" />
  <div className="font-semibold text-lg mb-1">{title}</div>
  <div className="text-gray-500 text-center text-sm">{description}</div>
</div>
```

### Styling Features
- **Card Width**: 288px (w-72) for consistent sizing
- **Padding**: 24px (p-6) for comfortable spacing
- **Border Radius**: 12px (rounded-xl) for modern appearance
- **Shadow**: Subtle shadow for depth
- **Hover Effect**: Background color change with smooth transition

## User Experience Flow

### Selection Process
1. **Entry**: User navigates to Stock Take from dashboard
2. **Method Selection**: User views two counting options
3. **Decision Making**: User reads descriptions and selects appropriate method
4. **Navigation**: System routes to selected counting module
5. **Operation**: User performs counting in selected module

### Return Navigation
- Users can return to Stock Take hub from counting modules
- Dashboard navigation remains accessible
- Breadcrumb navigation shows current location

## Integration Points

### With Dashboard Module
- Featured as "Stock Take" in dashboard navigation
- Count indicators may aggregate from both counting methods
- Quick access through bottom navigation

### With Physical Count Module
- Direct navigation to physical count operations
- Seamless transition with proper context
- Return navigation support

### With Spot Check Module
- Direct navigation to spot check operations
- Consistent user experience
- Integrated workflow support

### With Mobile Navigation
- Integrated with bottom tab navigation
- App bar title updates appropriately
- Consistent navigation patterns

## Routing and Navigation

### Route Structure
```
/stock-take (main selection page)
├── /physical-count (comprehensive counting)
│   ├── /sessions (session management)
│   └── /session/[id] (specific session)
└── /spot-check (targeted checking)
    ├── /location (location selection)
    ├── /method (method selection)
    └── /session/[id] (specific session)
```

### Navigation Implementation
```tsx
const router = useRouter();

// Physical Count navigation
onClick={() => router.push("/physical-count")}

// Spot Check navigation
onClick={() => router.push("/spot-check")}
```

## Visual Design

### Color Scheme
- **Physical Count**: Blue theme (#1D4ED8)
  - Represents comprehensive, systematic approach
  - Professional and trustworthy appearance
- **Spot Check**: Green theme (#059669)
  - Represents quick, efficient verification
  - Fresh and action-oriented appearance

### Typography
- **Title**: Large, semibold (text-lg font-semibold)
- **Description**: Small, muted (text-sm text-gray-500)
- **Hierarchy**: Clear distinction between elements

### Layout
- **Centered Design**: Flex layout with center alignment
- **Vertical Spacing**: Consistent gap between elements
- **Card Spacing**: Adequate space between option cards

## Responsive Design

### Mobile First
- Optimized for mobile devices
- Touch-friendly interface
- Appropriate sizing for thumb navigation

### Screen Adaptation
- Flexible layout for different screen sizes
- Maintains usability across devices
- Consistent experience on tablets and phones

## Performance Considerations

### Loading Optimization
- Minimal component complexity
- Fast initial render
- Efficient navigation transitions

### User Experience
- Immediate visual feedback
- Smooth transitions
- No loading delays for navigation

## Usage Examples

### Basic Implementation
```tsx
export default function StockTakeOptionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        <OptionCard
          icon={ClipboardList}
          title="Physical Count"
          description="Count all items in a location for a full inventory check."
          onClick={() => router.push("/physical-count")}
          theme="blue"
        />
        <OptionCard
          icon={SearchCheck}
          title="Spot Check"
          description="Quickly verify a subset of items for compliance and accuracy."
          onClick={() => router.push("/spot-check")}
          theme="green"
        />
      </main>
    </div>
  );
}
```

### Navigation Handling
```tsx
const handlePhysicalCountSelect = () => {
  // Optional: Set context or preferences
  localStorage.setItem('lastCountingMethod', 'physical-count');
  router.push("/physical-count");
};

const handleSpotCheckSelect = () => {
  // Optional: Set context or preferences
  localStorage.setItem('lastCountingMethod', 'spot-check');
  router.push("/spot-check");
};
```

## Future Enhancements

### Additional Counting Methods
- **Cycle Count**: Regular, scheduled counting
- **ABC Analysis**: Value-based counting priorities
- **Perpetual Inventory**: Continuous counting system
- **Blind Count**: Count without system quantities

### Enhanced Features
- **Method Recommendations**: AI-powered suggestions
- **Quick Start**: Recent location shortcuts
- **Favorites**: Frequently used locations
- **Templates**: Pre-configured counting setups

### Analytics Integration
- **Usage Tracking**: Method selection analytics
- **Performance Metrics**: Counting efficiency data
- **User Preferences**: Personalized recommendations
- **Reporting**: Method comparison reports

## Accessibility Features

### Screen Reader Support
- Proper ARIA labels for interactive elements
- Descriptive text for counting methods
- Semantic HTML structure
- Focus management

### Keyboard Navigation
- Tab order optimization
- Enter key activation
- Escape key handling
- Focus indicators

### Visual Accessibility
- High contrast color schemes
- Scalable text and icons
- Clear visual hierarchy
- Consistent interaction patterns

## Testing Considerations

### User Interface Testing
- Card interaction testing
- Navigation flow validation
- Responsive design testing
- Accessibility compliance

### Integration Testing
- Navigation to counting modules
- Return navigation testing
- Context preservation
- State management

### Performance Testing
- Page load performance
- Navigation speed
- Memory usage
- Battery consumption

## Dependencies
- Next.js for routing (`useRouter`)
- Lucide React for icons (`ClipboardList`, `SearchCheck`)
- Tailwind CSS for styling
- React for component structure
- TypeScript for type safety

## Related Documentation
- [Physical Count Module](./physical-count.md) - Comprehensive inventory counting
- [Spot Check Module](./spot-check.md) - Targeted quality verification
- [Dashboard Module](./dashboard.md) - Main application hub
- [Mobile Navigation Module](./mobile-navigation.md) - Navigation system