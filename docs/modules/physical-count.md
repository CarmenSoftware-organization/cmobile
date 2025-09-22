# Physical Count Module

## Overview
The Physical Count module provides comprehensive inventory counting capabilities for complete location-based stock verification. It supports full inventory counts with session management, item tracking, variance analysis, and approval workflows for accurate inventory management.

## Location
- **Primary Module**: `src/app/(mobile)/physical-count/`
- **Mock Data**: `src/mock/physicalCountData.ts`
- **Related Components**: File attachments, calculator, scanning interfaces

## Key Features

### 1. Session Management
- Multi-location counting sessions
- Period-based inventory cycles
- Session status tracking (In Progress, Review, Completed)
- Progress monitoring with real-time updates

### 2. Location-Based Counting
- Location type classification (Count, Not Count)
- Business unit filtering
- Location-specific item management
- Multi-location session support

### 3. Advanced Counting Interface
- Item-by-item counting with quantity entry
- Unit conversion support
- Built-in calculator for complex measurements
- Barcode scanning integration
- Photo evidence attachment

### 4. Variance Analysis
- Real-time variance calculation
- Positive and negative variance tracking
- Accuracy rate calculations
- Variance review and approval workflow

### 5. Mobile-Optimized Design
- Touch-friendly quantity input
- Swipe gestures for navigation
- Offline counting capabilities
- Auto-save functionality

## Module Structure

### Main Physical Count Page (`/physical-count`)
Central dashboard showing:
- Current counting period status
- Location listing with progress indicators
- Business unit filtering
- Quick access to active sessions

### Session Management (`/physical-count/sessions`)
- Session listing and filtering
- Session creation and management
- Progress tracking across multiple sessions
- Historical session access

### Counting Interface (`/physical-count/session/[sessionId]/count`)
- Item-by-item counting interface
- Quantity input with calculator
- Unit selection and conversion
- Photo attachment for evidence
- Notes and comments

### Review Interface (`/physical-count/session/[sessionId]/review`)
- Variance summary and analysis
- Accuracy metrics display
- Photo evidence review
- Final submission workflow

## Data Models

### Physical Count Session
```typescript
interface PhysicalCountSession {
  id: number;
  name: string;
  location: string;
  locationType: "Count" | "Not Count" | "System Default" | "Direct";
  businessUnit: string;
  status: "In Progress" | "Review" | "Completed" | "Draft";
  counted: number;
  total: number;
  startedAt: string;
  completedAt: string | null;
  period: string;
  progress: number;
  assignedUsers: string[];
}
```

### Physical Count Item
```typescript
interface PhysicalCountItem {
  sku: string;
  name: string;
  systemQty: number;
  actual: number | null;
  variance: number;
  unit: string;
  availableUnits?: string[];
  notes: string;
  attachments: FileAttachment[];
  counted: boolean;
  category?: string;
  subCategory?: string;
}
```

### Location Information
```typescript
interface CountLocation {
  id: number;
  name: string;
  type: "Count" | "Not Count";
  businessUnit: string;
  itemCount: number;
  startDate: string | null;
  status: "In-progress" | "Complete" | "Not Started";
  progress: number;
  countedItems: number;
}
```

## Core Functionality

### 1. Period Management
```typescript
interface CountPeriod {
  id: string;
  name: string;
  status: "Current" | "Closed";
  endDate: string;
  isOpen: boolean;
}
```

The system supports:
- Monthly counting periods
- Period status management
- Historical period access
- Period-based reporting

### 2. Location Classification
- **Count Locations**: Require full inventory counting
- **Not Count Locations**: Excluded from counting process
- **System Default**: Standard counting procedures
- **Direct**: Direct entry without system validation

### 3. Counting Workflow
1. **Session Creation**: Create counting session for location
2. **Item Loading**: Load items for the selected location
3. **Counting Process**: Count items with quantity entry
4. **Variance Calculation**: Automatic variance computation
5. **Review Process**: Review variances and accuracy
6. **Submission**: Final submission and approval

### 4. Advanced Features

#### Calculator Integration
```typescript
interface CalculatorItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

const UNIT_CONVERSIONS: Record<string, number> = {
  'g': 1,
  'kg': 1000,
  'mg': 0.001,
  'L': 1000,
  'mL': 1,
  'pcs': 1,
  'box': 100,
  'case': 1000,
  'bottle': 500,
  'pack': 50,
};
```

#### Barcode Scanning
- QR code scanning for item identification
- Quick item lookup and selection
- Scan-to-count workflow
- Error handling for invalid scans

#### Photo Evidence
- Camera integration for variance documentation
- Photo attachment to specific items
- Evidence review in approval process
- Compliance documentation

## Filtering and Search

### Advanced Filtering
- **Status Filter**: All, Counted, Uncounted
- **Category Filter**: Food, Beverages, Supplies, Equipment
- **Sub-Category Filter**: Dairy, Meat, Produce, etc.
- **Unit Filter**: Bottle, KG, Case, etc.
- **Item Group Filter**: Perishable, Non-perishable

### Search Capabilities
- Real-time item search
- SKU-based lookup
- Name-based search
- Category browsing

## Variance Analysis

### Variance Calculation
```typescript
const variance = actualQuantity - systemQuantity;
const accuracyRate = (accurateItems / totalCountedItems) * 100;
```

### Variance Categories
- **Positive Variance**: Over count (actual > system)
- **Negative Variance**: Under count (actual < system)
- **Zero Variance**: Accurate count (actual = system)

### Metrics Display
- Total items vs. counted items
- Accuracy rate percentage
- Variance distribution
- Progress indicators

## Session Status Management

### Status Transitions
1. **Draft** → **In Progress**: Start counting session
2. **In Progress** → **Review**: Complete counting, begin review
3. **Review** → **Completed**: Approve and finalize count
4. **In Progress** → **Paused**: Temporarily pause session

### Auto-Save Functionality
- Automatic saving of count entries
- Progress preservation
- Session recovery
- Conflict resolution

## Mobile Optimization

### Touch Interface
- Large touch targets for quantity entry
- Swipe gestures for item navigation
- Pull-to-refresh for data updates
- Haptic feedback for interactions

### Offline Capabilities
- Local data storage
- Offline counting support
- Sync when connection restored
- Conflict resolution

### Performance Features
- Lazy loading for large item lists
- Efficient rendering for smooth scrolling
- Memory optimization
- Battery usage optimization

## Integration Points

### With Authentication Module
- User context for session assignment
- Business unit access control
- Role-based counting permissions
- Session ownership tracking

### With Workflow Module
- Approval process integration
- Status transition management
- Role-based review permissions
- Audit trail maintenance

### With Inventory System
- Real-time inventory updates
- System quantity validation
- Stock movement recording
- Variance posting

## Error Handling

### Validation Errors
- Quantity format validation
- Unit conversion validation
- Required field checking
- Business rule enforcement

### Network Errors
- Offline mode activation
- Data synchronization
- Retry mechanisms
- Error recovery

### Data Integrity
- Duplicate entry prevention
- Concurrent access handling
- Data consistency checks
- Rollback capabilities

## Usage Examples

### Starting a Count Session
```typescript
const startCountSession = async (locationId: number) => {
  const session = await createCountSession({
    locationId,
    period: currentPeriod.id,
    userId: currentUser.id
  });
  
  router.push(`/physical-count/session/${session.id}/count`);
};
```

### Recording Item Count
```typescript
const updateItemCount = (sku: string, quantity: number, unit: string) => {
  setItems(prevItems => 
    prevItems.map(item => 
      item.sku === sku 
        ? { 
            ...item, 
            actual: quantity, 
            unit: unit,
            counted: true,
            variance: quantity - item.systemQty 
          }
        : item
    )
  );
  setHasUnsavedChanges(true);
};
```

### Calculating Accuracy
```typescript
const calculateAccuracy = (items: PhysicalCountItem[]) => {
  const countedItems = items.filter(item => item.counted);
  const accurateItems = countedItems.filter(item => item.variance === 0);
  return countedItems.length > 0 
    ? Math.round((accurateItems.length / countedItems.length) * 100)
    : 0;
};
```

## Performance Considerations

### Data Management
- Efficient item loading strategies
- Pagination for large inventories
- Memory usage optimization
- Background data synchronization

### UI Performance
- Virtual scrolling for item lists
- Optimized re-rendering
- Smooth animations
- Responsive interactions

## Future Enhancements

### Advanced Features
- AI-powered variance detection
- Predictive counting suggestions
- Voice-to-text for notes
- Automated photo analysis

### Integration Improvements
- ERP system integration
- Real-time inventory updates
- Advanced analytics
- Machine learning insights

### Mobile Enhancements
- Augmented reality scanning
- Gesture-based navigation
- Voice commands
- Wearable device support

## Dependencies
- Next.js for routing and navigation
- React for UI components
- TypeScript for type safety
- Camera APIs for photo capture
- Local storage for offline support
- File attachment components
- Calculator interface components

## Testing Considerations

### Unit Testing
- Count calculation accuracy
- Variance computation
- Unit conversion logic
- Data validation

### Integration Testing
- Session workflow testing
- Data synchronization
- Offline/online transitions
- Multi-user scenarios

### Performance Testing
- Large inventory handling
- Memory usage monitoring
- Battery consumption
- Network efficiency

## Security Considerations

### Data Protection
- Secure local storage
- Encrypted data transmission
- Access control validation
- Audit trail maintenance

### Business Logic Security
- Count validation rules
- Variance threshold alerts
- Approval workflow enforcement
- Data integrity checks