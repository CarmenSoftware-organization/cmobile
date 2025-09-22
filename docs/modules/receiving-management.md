# Receiving Management Module

## Overview
The Receiving Management module handles the complete goods receiving process, including purchase order management, GRN (Goods Receipt Note) creation, barcode scanning, and inventory tracking for the Carmen Supply Chain application.

**Important:** GRN creation is ONLY possible via PO Scan (barcode/QR) or Manual PO Selection. There are no other entry points for creating a GRN.

## Location
- **Primary Module**: `src/app/(mobile)/receiving/`
- **Related Components**: 
  - `src/components/forms/GRNForm.tsx`
  - `src/data/mockGRNData.ts`
  - `src/data/mockPOData.ts`

## Key Features

### 1. Purchase Order Management
- PO listing and filtering
- PO status tracking
- Vendor-based organization
- Business unit filtering

### 2. GRN (Goods Receipt Note) Processing
- GRN creation and editing (initiated only via PO Scan or Manual PO Selection)
- When creating a GRN, the default Receiving Qty for each item is set to the PO's Approved Qty.
- All items from the selected PO are automatically added to the GRN.
- Users can add additional POs to the same GRN if needed (multi-PO GRN support).
- On the GRN item card, the following fields are editable: Receiving Qty, Unit, FOC, and FOC Unit.
- Each item card includes a 'Detail' button that opens the GRN item detail page for further review and editing.
- Multi-mode forms (create, view, edit)
- Invoice matching
- Currency and exchange rate handling

### GRN Item Detail Page

The GRN Item Detail Page (`/receiving/grn-detail/item/[sku]`) displays comprehensive information for each item in a GRN. The page is organized into the following sections:

**1. Header**
  - Back button (sticky)
  - Product name (large, bold)
  - Status badge (e.g., Received, Pending)
  - SKU

**2. Basic Info**
  - Store Location
  - Item Description
  - Department
  - Account Code
  - Expiry Date

**3. Business Dimensions**
  - Job Code
  - Event
  - Market Segment

**4. Quantities**
  - Ordered Qty
  - Received Qty
  - FOC Qty
  - Inventory Qty
  - Conversion Rate

**5. Financials**
  - Price
  - Extra Cost
  - Discount
  - Tax (name/type)
  - Tax Rate
  - Total Amount

**6. Inventory**
  - On Hand
  - On Order
  - Reorder Threshold
  - Restock Level

**7. Purchase Info**
  - PO Ref#
  - Last Price
  - Last Vendor

**8. Sticky Action Bar**
  - "Report Issue" button
  - "Done" button

All key item details, financials, and inventory data are shown in grouped, clearly labeled sections. The "Back" button is always visible at the top, and the sticky action bar at the bottom provides quick actions.

### 3. Barcode Scanning
- QR code scanning for POs
- Quick PO lookup
- Mobile camera integration
- Scan-to-receive workflow

### 4. Advanced Search and Filtering
- Multi-criteria search
- Date range filtering
- Vendor filtering
- Status-based filtering

## Module Structure

### Main Receiving Page (`/receiving`)
Central hub for receiving operations with:
- Quick action buttons
- PO search and filtering
- Recent activity display
- Navigation to sub-modules

#### GRN Management

GRN Management includes the ability to view, manage, and resume incomplete (draft) GRNs. On the main receiving page, users can see a list of all GRNs that were started but not yet completed, allowing them to continue the receiving process seamlessly at any time. This ensures that no in-progress work is lost and users can efficiently manage ongoing receiving activities.

### Sub-Modules

#### 1. GRN Management (`/receiving/grn-detail`)
- GRN editing
- Item-level receiving
- Invoice data entry


#### 2. PO Scanning (`/receiving/scan-po`)
- QR code scanning interface
- Camera integration
- Scan result processing
- Error handling

#### 3. Advanced Search (`/receiving/advanced-search`)
- Multi-field search form
- Filter combinations
- Search result display
- Export capabilities



## Data Models

### Purchase Order Interface
```typescript
interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  vendorId: string;
  businessUnit: string;
  status: "Open" | "Sent" | "Partially Received" | "Received" | "Cancelled";
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  currency: string;
  items: POItem[];
  description?: string;
}
```

### GRN Form Data Interface
```typescript
interface GRNFormData {
  refNumber: string;
  date: string;
  invoiceDate: string;
  invoiceNumber: string;
  description: string;
  receiver: string;
  vendorId: string;
  businessUnit: string;
  currency: string;
  exchangeRate: number;
}
```

### PO Item Interface
```typescript
interface POItem {
  id: string;
  sku: string;
  description: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  category: string;
  location?: string;
}
```

## Core Functionality

### 1. PO Search and Filtering
```typescript
// Filter POs by multiple criteria
const filteredPOs = mockPOs.filter(po => {
  const matchesSearch = searchQuery === "" || 
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.vendor.toLowerCase().includes(searchQuery.toLowerCase());
  
  const matchesVendor = selectedVendor === "" || po.vendorId === selectedVendor;
  const matchesStatus = selectedStatus === "" || po.status === selectedStatus;
  const matchesBusinessUnit = selectedBusinessUnit === "" || po.businessUnit === selectedBusinessUnit;
  
  return matchesSearch && matchesVendor && matchesStatus && matchesBusinessUnit;
});
```

### 2. GRN Form Management
The GRN form supports three modes:
- **Create**: New GRN creation
- **View**: Read-only GRN display
- **Edit**: Modify existing GRN

### 3. Barcode Scanning Integration
- QR code scanning for quick PO lookup
- Camera permission handling
- Scan result validation
- Error recovery mechanisms

### 4. Business Unit Context
- Multi-tenant support
- Business unit filtering
- Location-based receiving
- Unit-specific workflows

## Receiving Workflow

### Standard Receiving Process
1. **PO Selection** (multiple selection enabled)
2. **Item Receiving**
3. **GRN Completion**

**Note:** The current receiving process does not use a formal workflow process. All steps are performed in a linear, user-driven manner without a workflow engine or multi-step workflow system.

### Quick Receiving Process
1. **Scan PO**: Use barcode scanner
2. **Auto-populate**: System fills GRN data
3. **Verify Items**: Confirm received quantities
4. **Complete**: Finalize with minimal steps

## Status Management

### PO Status Tracking
- **Open**: Available for receiving
- **Sent**: Sent to vendor
- **Partially Received**: Some items received
- **Received**: Fully received
- **Cancelled**: Cancelled order

### GRN Status Tracking
- **Draft**: Being created
- **Pending**: Awaiting approval
- **Approved**: Approved for posting
- **Posted**: Posted to inventory
- **Rejected**: Rejected and returned

## Search and Filter Capabilities

### Quick Search
- PO number search
- Vendor name search
- Real-time filtering
- Case-insensitive matching

### Advanced Search
- Date range filtering
- Vendor selection
- Status filtering
- Business unit filtering
- Combined criteria search

### Filter Persistence
- Remember user preferences
- Session-based filter storage
- Quick filter reset
- Filter state management

## Integration Points

### With Inventory Management
- Real-time inventory updates
- Location-based stock allocation
- Quantity validation
- Stock movement tracking

### With Authentication
- User context for receiving
- Business unit access control
- Role-based feature access
- Session management

## Mobile Optimization

### Touch-Friendly Interface
- Large touch targets
- Swipe gestures
- Pull-to-refresh
- Optimized scrolling

### Camera Integration
- Native camera access
- Barcode scanning
- Image capture
- Permission handling

### Offline Capabilities
- Local data caching
- Offline form completion
- Sync when online
- Conflict resolution

## Error Handling

### Validation Errors
- Required field validation
- Data format validation
- Business rule validation
- User-friendly error messages

### Network Errors
- Connection timeout handling
- Retry mechanisms
- Offline mode fallback
- Error recovery options

### Scanning Errors
- Invalid barcode handling
- Camera permission errors
- Scan timeout handling
- Manual entry fallback

## Performance Considerations

### Data Loading
- Lazy loading for large PO lists
- Pagination for search results
- Efficient filtering algorithms
- Caching strategies

### Mobile Performance
- Optimized rendering
- Minimal re-renders
- Efficient state management
- Memory usage optimization

## Usage Examples

### Basic PO Search
```typescript
const [searchQuery, setSearchQuery] = useState("");
const [filteredPOs, setFilteredPOs] = useState(mockPOs);

useEffect(() => {
  const filtered = mockPOs.filter(po => 
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredPOs(filtered);
}, [searchQuery]);
```

### GRN Form Submission
```typescript
const handleSubmit = async (formData: GRNFormData) => {
  try {
    await submitGRN(formData);
    router.push('/receiving/confirmation');
  } catch (error) {
    setError('Failed to submit GRN');
  }
};
```

## Future Enhancements

### Advanced Features
- AI-powered item recognition
- Voice-to-text for descriptions
- Automated invoice matching
- Predictive receiving suggestions

### Integration Improvements
- ERP system integration
- Real-time vendor updates
- Automated PO creation
- Supply chain analytics

### Mobile Enhancements
- Augmented reality scanning
- Gesture-based navigation
- Voice commands
- Wearable device support

## Dependencies
- Next.js for routing and navigation
- React for UI components
- TypeScript for type safety
- Lucide React for icons
- Camera APIs for barcode scanning
- Local storage for data persistence

#### Mobile Version GRN Document Fields and Workflow Clarifications

- The GRN document includes a **GRN Date** field.
- The field for referencing the GRN is labeled as **GRN #** (not 'GRN Reference').
- **Supplier information is not required** in the mobile version and is omitted from the GRN form.
- **PO # is displayed at the item level** (each item shows its associated PO number), not as a document-level field.
- **Delivery Note and Invoice are treated as the same field** in the mobile workflow.
- **Business Unit is captured via QR code scan**. When using the advanced search option, a Business Unit must be selected first.
- Additional fields and features may be introduced in future versions as the workflow evolves.

## Main Receiving Page (Mobile UI)

The main Receiving page is structured as follows:

1. **Business Unit Selection**
   - The user must select a Business Unit from a dropdown before proceeding with any receiving actions.

2. **Scan PO** (Primary Method)
   - A prominent blue button allows the user to scan a Purchase Order (PO) barcode/QR code. This is the main and preferred entry point for starting a new GRN.

3. **Advanced Search** (Manual PO Selection)
   - If scanning is not possible, users can use Advanced Search to manually search for a PO by number, vendor, or product. This is an alternative to scanning.

4. **GRN Drafts**
   - Resume incomplete receipts. Users can view and continue any GRN that was started but not yet completed.

5. **Bottom Navigation**
   - Home, Receiving, Approval, Store Req., Stock Take.

**Note:** The process flow no longer includes a generic 'PO Selection' step. 'Scan PO' is the primary method, and 'Advanced Search' is only used if scanning is not possible.

### GRN Drafts – Resume Incomplete Receipts

- **Purpose:**
  - The "GRN Drafts" option allows users to view and resume any Goods Receipt Notes (GRNs) that were started but not yet completed. This ensures that users can pick up where they left off without losing any progress.

- **How it works:**
  - When tapped, it displays a list of all draft/incomplete GRNs for the selected Business Unit.
  - The user can select any draft to continue the receiving process, edit details, and eventually complete and submit the GRN.

- **User Flow:**
  1. Select Business Unit.
  2. Tap "GRN Drafts".
  3. Choose a draft from the list to resume.
  4. Continue the receiving process as needed.

- **Benefits:**
  - Prevents loss of work if a receiving session is interrupted.
  - Supports multi-session and multi-user environments.
  - Improves efficiency by allowing users to manage and complete outstanding receipts.

## GRN Tabs: Summary and Comment

### Summary Tab
- **Purpose:**
  - The Summary tab provides an overview of the current GRN, including all key details such as selected POs, items, quantities, and any adjustments made during the receiving process.
- **Typical Content:**
  - List of all items included in the GRN
  - Quantities received and any changes from the original PO
  - Financial totals (if applicable)
  - Status indicators (e.g., draft, completed)
- **User Interaction:**
  - Users can review all information before finalizing the GRN.
  - The Summary tab is typically accessed before submitting or completing the GRN to ensure accuracy.

### Comment Tab
- **Purpose:**
  - The Comment tab allows users to add notes, remarks, or explanations related to the GRN. It is also used for documenting issues, special instructions, or communication between team members.
- **Typical Content:**
  - Free-text comments entered by users
  - File attachments (e.g., PDFs, documents)
  - Photo attachments (e.g., images of received goods, delivery photos, discrepancy evidence)
  - System-generated notes (e.g., status changes, important events)
- **User Interaction:**
  - Users can add, edit, or review comments and attach files/photos at any stage of the GRN process.
  - Attachments help document discrepancies, provide visual evidence, or add supporting documents to the GRN record.
  - All comments and attachments are saved as part of the GRN record for future reference and audit purposes.