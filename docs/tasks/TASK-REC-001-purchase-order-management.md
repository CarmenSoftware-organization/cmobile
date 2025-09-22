# TASK-REC-001: Implement Scan-to-GRN Workflow

## Overview
Implement the enhanced scan-first receiving workflow that allows users to scan PO barcodes/QR codes and automatically generate GRNs, eliminating the need for manual PO browsing in most cases. This implements the primary receiving flow based on the Enhanced GRN Flow specification.

## Priority
**High** - Core receiving functionality (Primary workflow)

## Estimated Effort
**8-12 hours**

## Dependencies
- TASK-AUTH-001: Core Authentication Service
- TASK-UI-001: Core UI Components
- TASK-NAV-001: Mobile Navigation

## Requirements

### Functional Requirements
Based on [Enhanced GRN Flow](../enhanced-grn-flow.md), [Receiving Management Module](../modules/receiving-management.md) and [Receiving API](../api/receiving-api.md):

1. **PO Scanning Interface**
   - Camera-based barcode/QR code scanning
   - Manual PO entry fallback
   - Real-time scan validation
   - Visual feedback for scan results
   - Error handling for invalid/not found POs

2. **Smart Context Detection**
   - Automatic business unit detection from PO
   - Vendor information extraction
   - Currency and exchange rate detection
   - Smart routing based on available context
   - Progressive enhancement based on data completeness

3. **Auto-GRN Creation**
   - Instant GRN generation for complete context POs
   - Pre-populated GRN forms with scanned data
   - Smart defaults for delivery information
   - Automatic location suggestions
   - Seamless transition to GRN detail

4. **Fallback PO Management** (Traditional flow when needed)
   - Business unit selection when missing
   - PO listing and filtering (minimal implementation)
   - PO selection for GRN creation
   - Support for edge cases and scan failures

5. **Mobile-Optimized Scanning**
   - Touch-friendly camera interface
   - Responsive design for various screen sizes
   - Offline scanning capabilities
   - Quick retry and manual entry options

### Technical Requirements

1. **Component Structure**
   ```
   src/app/(mobile)/receiving/
   ├── page.tsx                    # Main receiving dashboard
   ├── scan-po/page.tsx           # Primary: PO scanning interface
   ├── select-bu/page.tsx         # Fallback: Business unit selection
   ├── new/page.tsx               # Fallback: Traditional PO selection
   ├── select-location/page.tsx   # Location selection after scan
   └── grn-detail/page.tsx        # GRN creation and editing
   ```

2. **Data Models**
   ```typescript
   interface ScannedPOResult {
     success: boolean;
     po?: PurchaseOrder;
     hasBusinessUnit: boolean;
     hasCompleteContext: boolean;
     error?: string;
     suggestedRoute: 'auto-grn' | 'select-bu' | 'select-pos' | 'manual-entry';
   }

   interface PurchaseOrder {
     id: string;
     poNumber: string;
     status: 'pending' | 'partial' | 'completed' | 'cancelled';
     vendor: Vendor;
     businessUnit?: BusinessUnit;
     orderDate: string;
     expectedDeliveryDate: string;
     totalValue: number;
     currency: string;
     items: POItem[];
     receivingStatus: string;
   }

   interface ScanContext {
     poNumber: string;
     businessUnit?: string;
     vendor?: string;
     currency?: string;
     location?: string;
     scannedAt: string;
   }
   ```

3. **State Management**
   - Local state for PO lists and filters
   - Caching for offline access
   - Real-time updates for status changes
   - Optimistic updates for user actions

## Implementation Details

### Core Components

#### 1. PO Scanner Component
```typescript
// src/components/receiving/POScanner.tsx
interface POScannerProps {
  onScanSuccess: (result: ScannedPOResult) => void;
  onScanError: (error: string) => void;
  onManualEntry: (poNumber: string) => void;
}

export function POScanner({ onScanSuccess, onScanError, onManualEntry }: POScannerProps) {
  // Camera-based scanning with manual fallback
}
```

#### 2. Scan Result Component
```typescript
// src/components/receiving/ScanResult.tsx
interface ScanResultProps {
  result: ScannedPOResult;
  onContinue: () => void;
  onRescan: () => void;
  onManualEntry: () => void;
}

export function ScanResult({ result, onContinue, onRescan, onManualEntry }: ScanResultProps) {
  // Display scan results with appropriate actions
}
```

#### 3. Context Router Component
```typescript
// src/components/receiving/ContextRouter.tsx
interface ContextRouterProps {
  scanContext: ScanContext;
  onRouteDecision: (route: string, params: any) => void;
}

export function ContextRouter({ scanContext, onRouteDecision }: ContextRouterProps) {
  // Smart routing based on scan context completeness
}
```

#### 4. PO Filter Component
```typescript
// src/components/receiving/POFilter.tsx
interface POFilterProps {
  filters: POFilters;
  onFiltersChange: (filters: POFilters) => void;
  businessUnits: BusinessUnit[];
  vendors: Vendor[];
}

export function POFilter({ filters, onFiltersChange, businessUnits, vendors }: POFilterProps) {
  // Advanced filtering interface
}
```

### Page Implementations

#### 1. Main Receiving Dashboard
```typescript
// src/app/(mobile)/receiving/page.tsx
export default function ReceivingDashboard() {
  return (
    <div className="space-y-6">
      <ReceivingStats />
      <QuickScanAction /> {/* Primary CTA: Scan PO */}
      <RecentGRNs />
      <DraftGRNs />
      <TraditionalFlowAccess /> {/* Fallback option */}
    </div>
  );
}
```

#### 2. PO Scanning Page (Primary Flow)
```typescript
// src/app/(mobile)/receiving/scan-po/page.tsx
export default function ScanPOPage() {
  const [scanResult, setScanResult] = useState<ScannedPOResult | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  
  const handleScanSuccess = (result: ScannedPOResult) => {
    setScanResult(result);
    setIsScanning(false);
    
    // Smart routing based on context
    if (result.suggestedRoute === 'auto-grn') {
      router.push(`/receiving/select-location?po=${result.po.poNumber}&bu=${result.po.businessUnit.name}`);
    } else if (result.suggestedRoute === 'select-bu') {
      router.push(`/receiving/select-bu?scannedPO=${result.po.poNumber}`);
    }
  };
  
  return (
    <div className="space-y-4">
      {isScanning ? (
        <POScanner 
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          onManualEntry={handleManualEntry}
        />
      ) : (
        <ScanResult 
          result={scanResult}
          onContinue={handleContinue}
          onRescan={() => setIsScanning(true)}
          onManualEntry={handleManualEntry}
        />
      )}
    </div>
  );
}
```

#### 3. PO Details Page
```typescript
// src/app/(mobile)/receiving/grn/[id]/page.tsx
export default function PODetailsPage({ params }: { params: { id: string } }) {
  const [po, setPO] = useState<PurchaseOrder | null>(null);
  
  return (
    <div className="space-y-6">
      <PODetail 
        purchaseOrder={po}
        onStartReceiving={handleStartReceiving}
        onViewHistory={handleViewHistory}
      />
      <POItemsList items={po.items} />
      <ReceivingHistory poId={po.id} />
    </div>
  );
}
```

### API Integration

#### 1. PO Scanning Service
```typescript
// src/lib/services/poScanService.ts
export class POScanService {
  async validatePONumber(poNumber: string): Promise<ScannedPOResult> {
    // GET /api/v1/receiving/purchase-orders?poNumber={poNumber}
    // Returns PO with context analysis
  }

  async createGRNFromPO(poId: string, context: ScanContext): Promise<GRN> {
    // POST /api/v1/receiving/grns
    // Auto-create GRN from scanned PO
  }

  async getBusinessUnitsForPO(poNumber: string): Promise<BusinessUnit[]> {
    // GET /api/v1/receiving/purchase-orders/{poNumber}/business-units
    // For fallback when BU is missing
  }

  async getPOsByBusinessUnit(businessUnitId: string): Promise<PurchaseOrder[]> {
    // GET /api/v1/receiving/purchase-orders?businessUnit={businessUnitId}
    // Fallback traditional flow
  }
}
```

#### 2. Data Fetching Hooks
```typescript
// src/hooks/usePurchaseOrders.ts
export function usePurchaseOrders(filters: POFilters) {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Implementation with caching and real-time updates
  return { pos, loading, error, refetch };
}

// src/hooks/usePurchaseOrder.ts
export function usePurchaseOrder(id: string) {
  // Single PO fetching with real-time updates
}
```

### Mobile Optimization

#### 1. Responsive Design
```css
/* Mobile-first responsive design */
.po-list {
  @apply grid gap-4;
  @apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
}

.po-card {
  @apply bg-white rounded-lg shadow-sm border;
  @apply p-4 space-y-3;
  @apply touch-manipulation;
}

.po-filters {
  @apply sticky top-0 bg-white z-10;
  @apply border-b border-gray-200;
  @apply p-4 space-y-4;
}
```

#### 2. Touch Interactions
```typescript
// Implement swipe gestures for quick actions
const handleSwipeLeft = (poId: string) => {
  // Quick action: Start receiving
};

const handleSwipeRight = (poId: string) => {
  // Quick action: View details
};
```

#### 3. Performance Optimization
```typescript
// Virtual scrolling for large PO lists
// Lazy loading for PO details
// Image optimization for vendor logos
// Caching strategy for offline access
```

## Testing Requirements

### Unit Tests
```typescript
describe('PO Management', () => {
  describe('POList Component', () => {
    test('should render PO list with correct data')
    test('should handle filtering correctly')
    test('should support pagination')
    test('should handle PO selection')
  })

  describe('POCard Component', () => {
    test('should display PO information correctly')
    test('should show correct status indicators')
    test('should handle quick actions')
  })

  describe('PO Service', () => {
    test('should fetch POs with filters')
    test('should handle API errors gracefully')
    test('should cache data appropriately')
  })
})
```

### Integration Tests
```typescript
describe('PO Management Integration', () => {
  test('should load and display POs from API')
  test('should filter POs correctly')
  test('should navigate to PO details')
  test('should handle offline scenarios')
  test('should sync data when online')
})
```

### E2E Tests
```typescript
describe('PO Management E2E', () => {
  test('user can view pending POs')
  test('user can filter POs by status')
  test('user can search for specific PO')
  test('user can view PO details')
  test('user can start receiving process')
})
```

## Acceptance Criteria

### Core Functionality
- [ ] Scan PO barcodes/QR codes using device camera
- [ ] Validate scanned PO numbers against API
- [ ] Auto-detect business unit context from PO data
- [ ] Smart routing based on context completeness
- [ ] Auto-create GRNs for complete context POs
- [ ] Fallback to traditional flow when needed

### Scanning Experience
- [ ] Camera interface works on all mobile devices
- [ ] Real-time scan feedback and validation
- [ ] Manual PO entry fallback option
- [ ] Clear error messages for invalid/not found POs
- [ ] Retry and rescan capabilities

### Smart Routing
- [ ] Instant GRN creation for POs with complete context
- [ ] Business unit selection for incomplete context
- [ ] Traditional PO selection for edge cases
- [ ] Seamless navigation between flows
- [ ] Context preservation across pages

### Performance
- [ ] Fast scan validation (< 2 seconds)
- [ ] Smooth camera interface
- [ ] Efficient context detection
- [ ] Proper offline scan caching
- [ ] Quick navigation between flows

### Integration
- [ ] Seamless integration with authentication
- [ ] Proper error handling and user feedback
- [ ] Integration with GRN creation workflow
- [ ] Context passing via URL parameters

## Implementation Steps

1. **Setup Scanning Infrastructure**
   - Create camera-based scanning component
   - Set up barcode/QR code detection
   - Implement manual entry fallback
   - Create scan result validation

2. **Implement Core Scanning Components**
   - POScanner component with camera interface
   - ScanResult component for feedback
   - ContextRouter for smart routing
   - Manual entry form component

3. **Add Smart Context Detection**
   - Implement PO validation service
   - Create context analysis logic
   - Add business unit detection
   - Implement routing decision engine

4. **Create Auto-GRN Workflow**
   - Implement instant GRN creation
   - Add location selection integration
   - Create context preservation
   - Add seamless navigation

5. **Add Fallback Flows**
   - Business unit selection for incomplete context
   - Traditional PO selection (minimal)
   - Error handling and recovery
   - Manual entry validation

6. **Testing Implementation**
   - Unit tests for scanning components
   - Integration tests for context detection
   - E2E tests for complete workflows
   - Camera and scanning testing

7. **Documentation and Polish**
   - Update workflow documentation
   - Add scanning usage examples
   - Performance optimization
   - Accessibility improvements

## Related Tasks
- TASK-REC-002: GRN Creation and Management (directly follows this task)
- TASK-REC-003: Barcode Scanning (core component of this task)
- TASK-API-002: Receiving API Integration (parallel task)
- TASK-UI-001: Core UI Components (supports this task)

## Notes
- This task implements the PRIMARY receiving workflow (scan-first)
- Traditional PO list/detail views are now FALLBACK functionality only
- Focus on camera interface and scanning user experience
- Implement smart routing based on Enhanced GRN Flow specification
- Context preservation is critical for seamless user experience
- Plan for offline scanning capabilities and sync when online