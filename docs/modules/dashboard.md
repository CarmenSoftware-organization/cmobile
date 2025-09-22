# Dashboard Module

## Overview
The Dashboard module serves as the central hub for the Carmen Supply Chain Mobile Application, providing users with a comprehensive overview of their tasks, pending actions, and quick access to key operational features.

## Location
- **Primary Module**: `src/app/(mobile)/dashboard/page.tsx`
- **Related Components**: `src/components/ui/feature-card.tsx`

## Key Features

### 1. Priority Actions Section
- Purchase Request Approval tracking
- Store Requisition Approval monitoring
- Count-based notifications
- Quick navigation to approval workflows

### 2. Operations Section
- Receiving operations with pending PO count
- Physical Count session management
- Real-time status updates
- Direct access to operational modules

### 3. Quality Control Section
- Spot Check monitoring
- Active session tracking
- Quality assurance workflows
- Compliance tracking

### 4. Mobile-Optimized Design
- Touch-friendly interface
- Grid-based layout
- Pull-to-refresh capability
- Safe area handling

## Dashboard Structure

### Layout Organization
The dashboard is organized into three main sections:

1. **Priority Actions** - Urgent tasks requiring immediate attention
2. **Operations** - Core business operations
3. **Quality Control** - Quality assurance and compliance activities

### Grid Layout
- 2-column grid for optimal mobile viewing
- Consistent spacing and sizing
- Touch-optimized card design
- Responsive breakpoints

## Feature Cards

### Card Components
Each dashboard section uses `FeatureCard` components with:
- **Title**: Descriptive feature name
- **Count**: Numerical indicator for pending items
- **Navigation**: Direct routing to feature modules
- **Visual Design**: Consistent styling and branding

### Card Configuration
```typescript
interface FeatureCardProps {
  title: string;
  href: string;
  count?: number;
  className?: string;
}
```

## Data Integration

### Summary Data Structure
```typescript
const summaryData = {
  pendingReceipts: number;
  pendingApprovals: number;
  pendingSRs: number;
  physicalCount: number;
  activeSpotChecks: number;
};
```

### Real-Time Updates
- Dynamic count calculations
- Live data integration
- Automatic refresh capabilities
- Status synchronization

## Priority Actions Section

### Purchase Request Approval
- **Purpose**: Track pending PR approvals
- **Count Source**: Workflow management system
- **Navigation**: Routes to `/pr-approval`
- **Priority**: High - requires immediate attention

### Store Requisition Approval
- **Purpose**: Monitor pending store requisitions
- **Count Source**: Store requisition system
- **Navigation**: Routes to `/store-requisition`
- **Priority**: High - affects store operations

## Operations Section

### Receiving Operations
- **Purpose**: Manage incoming goods and POs
- **Count Calculation**: 
  ```typescript
  const pendingPOCount = mockPOs.filter(po => 
    po.status === "Open" || po.status === "Sent"
  ).length;
  ```
- **Navigation**: Routes to `/receiving`
- **Features**: PO management, GRN creation, barcode scanning

### Physical Count
- **Purpose**: Inventory counting sessions
- **Count Source**: Active counting sessions
- **Navigation**: Routes to `/physical-count`
- **Features**: Session management, count recording, variance reporting

## Quality Control Section

### Spot Check
- **Purpose**: Quality assurance spot checks
- **Count Source**: Active spot check sessions
- **Navigation**: Routes to `/spot-check`
- **Features**: Random sampling, quality verification, compliance tracking

## Mobile Design Principles

### Touch-Friendly Interface
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Visual feedback for touch interactions
- Gesture support for navigation

### Responsive Layout
- Mobile-first design approach
- Flexible grid system
- Optimized for various screen sizes
- Portrait and landscape orientation support

### Performance Optimization
- Efficient rendering
- Minimal re-renders
- Optimized data loading
- Smooth animations and transitions

## Navigation Integration

### Bottom Navigation
- Dashboard serves as the "Home" tab
- Central hub for all application features
- Quick return point from other modules
- Consistent navigation experience

### Deep Linking
- Direct navigation to specific features
- Proper route handling
- Back navigation support
- State preservation

## Data Sources

### Mock Data Integration
Currently integrates with:
- `mockPOs` for purchase order data
- Workflow system for approval counts
- Session management for counting operations
- Quality control systems for spot checks

### Future Data Integration
- Real-time API connections
- WebSocket for live updates
- Offline data synchronization
- Cloud-based data sources

## User Experience Features

### Visual Hierarchy
- Clear section headings
- Consistent typography
- Color-coded status indicators
- Intuitive information architecture

### Accessibility
- Screen reader support
- Keyboard navigation
- High contrast support
- Voice control compatibility

### Feedback Mechanisms
- Loading states
- Error handling
- Success confirmations
- Progress indicators

## State Management

### Local State
- Component-level state for UI interactions
- Temporary data storage
- Form state management
- Navigation state

### Global State
- User authentication context
- Business unit selection
- Theme preferences
- Notification state

## Error Handling

### Data Loading Errors
- Graceful error display
- Retry mechanisms
- Fallback content
- User-friendly error messages

### Navigation Errors
- Route validation
- Permission checking
- Redirect handling
- Error recovery

## Performance Considerations

### Loading Optimization
- Lazy loading for non-critical components
- Efficient data fetching
- Caching strategies
- Progressive loading

### Memory Management
- Component cleanup
- Event listener removal
- Memory leak prevention
- Efficient re-rendering

## Usage Examples

### Basic Dashboard Implementation
```tsx
export default function DashboardPage() {
  const summaryData = {
    pendingReceipts: 3,
    pendingApprovals: 2,
    pendingSRs: 4,
    physicalCount: 1,
    activeSpotChecks: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard 
            title="Purchase Request Approval" 
            href="/pr-approval" 
            count={summaryData.pendingApprovals}
          />
        </div>
      </main>
    </div>
  );
}
```

### Feature Card Usage
```tsx
<FeatureCard 
  title="Receiving" 
  href="/receiving" 
  count={pendingPOCount}
/>
```

## Integration Points

### With Authentication Module
- User context awareness
- Role-based feature visibility
- Business unit filtering
- Permission validation

### With Navigation Module
- Bottom tab integration
- Route management
- Title synchronization
- State preservation

### With Workflow Module
- Approval count integration
- Status tracking
- Workflow navigation
- Progress monitoring

## Future Enhancements

### Advanced Features
- Customizable dashboard layout
- Widget-based architecture
- Drag-and-drop organization
- Personalized views

### Analytics Integration
- Usage tracking
- Performance metrics
- User behavior analysis
- Business intelligence

### Real-Time Features
- Live data updates
- Push notifications
- Real-time collaboration
- Instant synchronization

### Personalization
- User preferences
- Custom shortcuts
- Favorite features
- Adaptive interface

## Dependencies
- Next.js for routing and navigation
- React for component structure
- TypeScript for type safety
- Tailwind CSS for styling
- Feature Card component
- Mock data sources
- Mobile layout system