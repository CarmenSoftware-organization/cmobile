# TASK-REC-005: Implement Traditional PO Management (Fallback Flow)

## Overview
Implement traditional purchase order listing and management functionality as a fallback option for the receiving module. This supports edge cases where the scan-to-GRN workflow cannot be used, providing manual PO browsing, filtering, and selection capabilities.

## Priority
**Medium** - Fallback functionality for edge cases

## Estimated Effort
**6-8 hours**

## Dependencies
- TASK-REC-001: Scan-to-GRN Workflow (primary flow must be implemented first)
- TASK-UI-001: Core UI Components
- TASK-API-002: Receiving API Integration

## Requirements

### Functional Requirements
Based on [Enhanced GRN Flow](../enhanced-grn-flow.md) fallback scenarios:

1. **Minimal PO Listing**
   - Display paginated list of purchase orders for selected business unit
   - Show essential PO information (number, vendor, status, date)
   - Support basic filtering by status and vendor
   - Quick PO selection for GRN creation

2. **Business Unit Context**
   - Pre-filtered by selected business unit
   - Clear business unit context display
   - No cross-business unit browsing

3. **PO Selection for GRN**
   - Single or multi-PO selection
   - Direct navigation to GRN creation
   - Context preservation from scan flow
   - Integration with existing GRN workflow

4. **Edge Case Support**
   - Manual PO lookup when scan fails
   - Support for POs without barcodes
   - Backup option when camera unavailable
   - Accessibility for users who cannot scan

### Technical Requirements

1. **Minimal Implementation**
   - Simplified components focused on selection
   - No complex filtering or search
   - Basic responsive design
   - Integration with existing scan workflow

2. **Component Structure**
   ```
   src/app/(mobile)/receiving/
   ├── select-bu/page.tsx           # Business unit selection
   ├── new/page.tsx                 # Traditional PO selection
   └── components/
       ├── POListSimple.tsx         # Minimal PO list
       ├── POSelector.tsx           # PO selection component
       └── BusinessUnitSelector.tsx # BU selection
   ```

## Implementation Details

### Core Components

#### 1. Simple PO List Component
```typescript
// src/components/receiving/POListSimple.tsx
interface POListSimpleProps {
  businessUnitId: string;
  onPOSelect: (po: PurchaseOrder) => void;
  selectedPOs: string[];
  allowMultiple?: boolean;
}

export function POListSimple({ 
  businessUnitId, 
  onPOSelect, 
  selectedPOs, 
  allowMultiple = false 
}: POListSimpleProps) {
  const { pos, loading } = usePurchaseOrders({ businessUnit: businessUnitId });
  
  return (
    <div className="space-y-2">
      {pos.map(po => (
        <POCard
          key={po.id}
          po={po}
          isSelected={selectedPOs.includes(po.id)}
          onSelect={() => onPOSelect(po)}
          variant="simple"
        />
      ))}
    </div>
  );
}
```

#### 2. Business Unit Selector
```typescript
// src/components/receiving/BusinessUnitSelector.tsx
interface BusinessUnitSelectorProps {
  onBusinessUnitSelect: (bu: BusinessUnit) => void;
  scannedPO?: string; // Context from scan flow
}

export function BusinessUnitSelector({ 
  onBusinessUnitSelect, 
  scannedPO 
}: BusinessUnitSelectorProps) {
  const { businessUnits } = useBusinessUnits();
  
  return (
    <div className="space-y-4">
      {scannedPO && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            Scanned PO: <strong>{scannedPO}</strong>
          </p>
          <p className="text-xs text-blue-600">
            Select the business unit for this PO
          </p>
        </div>
      )}
      
      <div className="grid gap-3">
        {businessUnits.map(bu => (
          <Card 
            key={bu.id}
            className="p-4 cursor-pointer hover:bg-accent"
            onClick={() => onBusinessUnitSelect(bu)}
          >
            <h3 className="font-semibold">{bu.name}</h3>
            <p className="text-sm text-muted-foreground">{bu.location}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Page Implementations

#### 1. Business Unit Selection Page
```typescript
// src/app/(mobile)/receiving/select-bu/page.tsx
export default function SelectBusinessUnitPage({ searchParams }: { 
  searchParams: { scannedPO?: string } 
}) {
  const router = useRouter();
  const scannedPO = searchParams.scannedPO;
  
  const handleBusinessUnitSelect = (bu: BusinessUnit) => {
    if (scannedPO) {
      // Continue with scanned PO context
      router.push(`/receiving/new?scannedPO=${scannedPO}&bu=${bu.id}`);
    } else {
      // Manual flow
      router.push(`/receiving/new?bu=${bu.id}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Select Business Unit</h1>
        <p className="text-sm text-muted-foreground">
          Choose the business unit for receiving
        </p>
      </div>
      
      <BusinessUnitSelector 
        onBusinessUnitSelect={handleBusinessUnitSelect}
        scannedPO={scannedPO}
      />
    </div>
  );
}
```

#### 2. Traditional PO Selection Page
```typescript
// src/app/(mobile)/receiving/new/page.tsx
export default function TraditionalPOSelectionPage({ searchParams }: { 
  searchParams: { bu: string; scannedPO?: string } 
}) {
  const router = useRouter();
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);
  const businessUnitId = searchParams.bu;
  const scannedPO = searchParams.scannedPO;
  
  const handlePOSelect = (po: PurchaseOrder) => {
    setSelectedPOs([po.id]); // Single selection for simplicity
  };
  
  const handleContinue = () => {
    if (selectedPOs.length > 0) {
      const params = new URLSearchParams({
        pos: selectedPOs.join(','),
        bu: businessUnitId,
      });
      
      if (scannedPO) {
        params.set('scannedPO', scannedPO);
      }
      
      router.push(`/receiving/grn-detail?${params.toString()}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Select Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">
            Choose POs to create GRN
          </p>
        </div>
        
        <Button 
          onClick={handleContinue}
          disabled={selectedPOs.length === 0}
        >
          Continue
        </Button>
      </div>
      
      {scannedPO && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            Looking for PO: <strong>{scannedPO}</strong>
          </p>
          <p className="text-xs text-yellow-600">
            Select it from the list below or contact support if not found
          </p>
        </div>
      )}
      
      <POListSimple
        businessUnitId={businessUnitId}
        onPOSelect={handlePOSelect}
        selectedPOs={selectedPOs}
      />
    </div>
  );
}
```

### API Integration

#### 1. Simplified PO Service
```typescript
// src/lib/services/traditionalPOService.ts
export class TraditionalPOService {
  async getPOsByBusinessUnit(businessUnitId: string): Promise<PurchaseOrder[]> {
    // GET /api/v1/receiving/purchase-orders?businessUnit={businessUnitId}&status=pending
    // Simple list without complex filtering
  }
  
  async searchPOInBusinessUnit(
    businessUnitId: string, 
    poNumber: string
  ): Promise<PurchaseOrder | null> {
    // GET /api/v1/receiving/purchase-orders?businessUnit={businessUnitId}&poNumber={poNumber}
    // Find specific PO in business unit
  }
}
```

## Testing Requirements

### Unit Tests
```typescript
describe('Traditional PO Management', () => {
  describe('POListSimple Component', () => {
    test('should render PO list for business unit')
    test('should handle PO selection')
    test('should show loading state')
  })

  describe('BusinessUnitSelector Component', () => {
    test('should render business units')
    test('should show scanned PO context')
    test('should handle business unit selection')
  })
})
```

### Integration Tests
```typescript
describe('Traditional Flow Integration', () => {
  test('should navigate from scan failure to BU selection')
  test('should preserve scanned PO context')
  test('should create GRN from selected POs')
})
```

## Acceptance Criteria

### Core Functionality
- [ ] Display business units for selection
- [ ] Show PO list filtered by selected business unit
- [ ] Allow PO selection for GRN creation
- [ ] Preserve context from scan flow
- [ ] Navigate to GRN creation with selected POs

### Fallback Integration
- [ ] Seamlessly handle scan flow failures
- [ ] Preserve scanned PO context throughout flow
- [ ] Provide clear guidance for users
- [ ] Support accessibility requirements

### Performance
- [ ] Fast loading of business units and POs
- [ ] Efficient filtering by business unit
- [ ] Minimal UI for quick selection
- [ ] Responsive design for mobile devices

## Implementation Steps

1. **Create Business Unit Selection**
   - Implement BusinessUnitSelector component
   - Create select-bu page
   - Add context preservation from scan flow

2. **Implement Simple PO List**
   - Create POListSimple component
   - Add basic filtering by business unit
   - Implement PO selection functionality

3. **Create Traditional Flow Pages**
   - Implement new/page.tsx for PO selection
   - Add navigation between pages
   - Integrate with existing GRN workflow

4. **Add API Integration**
   - Implement simplified PO service
   - Add business unit filtering
   - Create data fetching hooks

5. **Testing and Integration**
   - Unit tests for components
   - Integration tests with scan flow
   - E2E tests for complete fallback workflow

## Related Tasks
- TASK-REC-001: Scan-to-GRN Workflow (primary flow)
- TASK-REC-002: GRN Creation and Management (integrates with this)
- TASK-API-002: Receiving API Integration (supports this)

## Notes
- This is a FALLBACK flow, not the primary receiving workflow
- Keep implementation minimal and focused on edge cases
- Prioritize integration with scan-to-GRN workflow
- Consider this lower priority than primary scan flow
- Focus on accessibility for users who cannot use scanning